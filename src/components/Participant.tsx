import React, { useEffect, useRef, useState } from 'react';
import { MicrophoneIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface ParticipantProps {
  participant: any;
  isLocal?: boolean;
}

// Add a type definition for the track publication
interface TrackPublication {
  track?: {
    isEnabled: boolean;
  };
  isTrackEnabled?: boolean;
}

export default function Participant({ participant, isLocal = false }: ParticipantProps) {
  const [videoTracks, setVideoTracks] = useState<any[]>([]);
  const [audioTracks, setAudioTracks] = useState<any[]>([]);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const trackpubsToTracks = (trackMap: Map<string, any>) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);

  useEffect(() => {
    setVideoTracks(trackpubsToTracks(participant.videoTracks));
    setAudioTracks(trackpubsToTracks(participant.audioTracks));

    const trackSubscribed = (track: any) => {
      if (track.kind === 'video') {
        setVideoTracks((videoTracks) => [...videoTracks, track]);
      } else if (track.kind === 'audio') {
        setAudioTracks((audioTracks) => [...audioTracks, track]);
      }
    };

    const trackUnsubscribed = (track: any) => {
      if (track.kind === 'video') {
        setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
      } else if (track.kind === 'audio') {
        setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
      }
    };

    participant.on('trackSubscribed', trackSubscribed);
    participant.on('trackUnsubscribed', trackUnsubscribed);

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant]);

  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack && videoRef.current) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack && audioRef.current) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);

  // Check if audio is enabled
  useEffect(() => {
    if (participant.audioTracks) {
      const trackPublications = Array.from(participant.audioTracks.values());
      const trackPublication = trackPublications[0] as TrackPublication;
      
      if (trackPublication) {
        // Check for isTrackEnabled first (older API) and fall back to track.isEnabled
        const isEnabled = typeof trackPublication.isTrackEnabled === 'boolean' 
          ? trackPublication.isTrackEnabled 
          : trackPublication.track?.isEnabled;
        
        if (typeof isEnabled === 'boolean') {
          setIsAudioMuted(!isEnabled);
        }

        const checkAudioEnabled = () => {
          const updatedIsEnabled = typeof trackPublication.isTrackEnabled === 'boolean'
            ? trackPublication.isTrackEnabled
            : trackPublication.track?.isEnabled;
            
          if (typeof updatedIsEnabled === 'boolean') {
            setIsAudioMuted(!updatedIsEnabled);
          }
        };

        participant.on('trackEnabled', checkAudioEnabled);
        participant.on('trackDisabled', checkAudioEnabled);

        return () => {
          participant.off('trackEnabled', checkAudioEnabled);
          participant.off('trackDisabled', checkAudioEnabled);
        };
      }
    }
  }, [participant]);

  return (
    <div className="relative rounded-xl overflow-hidden bg-gray-800 aspect-video shadow-lg border border-gray-700 transition-all hover:border-blue-400">
      <video ref={videoRef} autoPlay={true} muted={isLocal} className="w-full h-full object-cover" />
      <audio ref={audioRef} autoPlay={true} muted={isLocal} />

      {/* User info bar with name and audio status */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
        <div className="text-white text-sm font-medium truncate">
          {participant.identity} {isLocal ? '(You)' : ''}
        </div>
        <div className="flex items-center">
          {!isLocal && (
            <div className={`p-1 rounded-full ${isAudioMuted ? 'bg-red-500/60' : 'bg-green-500/60'}`}>
              {isAudioMuted ? (
                <div className="relative h-3 w-3">
                  <MicrophoneIcon className="h-3 w-3 text-white" />
                  <XMarkIcon className="h-3 w-3 absolute top-0 left-0 text-white" />
                </div>
              ) : (
                <MicrophoneIcon className="h-3 w-3 text-white" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Video overlay when no video */}
      {videoTracks.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
          <div className="h-20 w-20 rounded-full bg-gray-600 flex items-center justify-center">
            <span className="text-2xl font-semibold text-white">
              {participant.identity.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
