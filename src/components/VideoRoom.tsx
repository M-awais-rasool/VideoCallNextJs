import React, { useState, useEffect, useCallback } from 'react';
import { connect, createLocalVideoTrack, LocalAudioTrack, LocalVideoTrack, Room } from 'twilio-video';
import Participant from './Participant';
import Controls from './Controls';

interface VideoRoomProps {
  roomName: string;
  token: string;
  onLeave: () => void;
}

export default function VideoRoom({ roomName, token, onLeave }: VideoRoomProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [localTracks, setLocalTracks] = useState<(LocalAudioTrack | LocalVideoTrack)[]>([]);

  const participantConnected = useCallback((participant: any) => {
    setParticipants((prevParticipants) => [...prevParticipants, participant]);
  }, []);

  const participantDisconnected = useCallback((participant: any) => {
    setParticipants((prevParticipants) =>
      prevParticipants.filter((p) => p !== participant)
    );
  }, []);

  // Initialize the room
  useEffect(() => {
    let localVideoTrack: LocalVideoTrack | null = null;
    let roomInstance: Room | null = null;

    async function startRoom() {
      try {
        // Create local audio and video tracks
        const videoTrack = await createLocalVideoTrack();
        localVideoTrack = videoTrack;
        const tracks = [videoTrack];

        // Connect to the room
        const room = await connect(token, {
          name: roomName,
          tracks,
          audio: true,
          video: { width: 640 }
        });
        roomInstance = room;

        // Save local tracks to state
        setLocalTracks(tracks);
        
        // Set the room in state
        setRoom(room);

        // Handle participants already in the room
        room.participants.forEach(participantConnected);

        // Handle participants joining the room
        room.on('participantConnected', participantConnected);

        // Handle participants leaving the room
        room.on('participantDisconnected', participantDisconnected);
      } catch (error) {
        console.error('Error connecting to the room:', error);
      }
    }

    startRoom();

    // Clean up when the component unmounts
    return () => {
      if (roomInstance) {
        roomInstance.off('participantConnected', participantConnected);
        roomInstance.off('participantDisconnected', participantDisconnected);
        roomInstance.disconnect();
      }
      
      // Explicitly stop any tracks
      if (localVideoTrack) {
        localVideoTrack.stop();
      }
      
      localTracks.forEach(track => {
        track.stop();
      });
    };
  }, [roomName, token, participantConnected, participantDisconnected]);

  const toggleAudio = useCallback(() => {
    if (room) {
      room.localParticipant.audioTracks.forEach(publication => {
        if (publication.track) {
          if (isAudioEnabled) {
            publication.track.disable();
          } else {
            publication.track.enable();
          }
        }
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  }, [room, isAudioEnabled]);

  const toggleVideo = useCallback(() => {
    if (room) {
      room.localParticipant.videoTracks.forEach(publication => {
        if (publication.track) {
          if (isVideoEnabled) {
            publication.track.disable();
          } else {
            publication.track.enable();
          }
        }
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  }, [room, isVideoEnabled]);

  const leaveRoom = useCallback(() => {
    console.log('Leaving room and stopping all tracks...');
    
    // Stop all local tracks
    if (room && room.localParticipant) {
      // Get all tracks from the local participant
      room.localParticipant.videoTracks.forEach(publication => {
        if (publication.track) {
          publication.track.stop();
          console.log('Stopped video track');
        }
      });
      
      room.localParticipant.audioTracks.forEach(publication => {
        if (publication.track) {
          publication.track.stop();
          console.log('Stopped audio track');
        }
      });
    }
    
    // Also stop tracks from localTracks state
    localTracks.forEach(track => {
      track.stop();
      console.log(`Stopped local ${track.kind} track`);
    });
    
    // Disconnect from the room
    if (room) {
      room.disconnect();
      console.log('Disconnected from room');
    }
    
    // Clear the tracks state
    setLocalTracks([]);
    
    // Delay navigation to ensure tracks are fully stopped
    setTimeout(() => {
      onLeave();
    }, 300); // Increased delay to ensure sufficient time for cleanup
  }, [room, localTracks, onLeave]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Room: {roomName}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {room && (
            <Participant
              key={room.localParticipant.sid}
              participant={room.localParticipant}
              isLocal={true}
            />
          )}
          {participants.map((participant) => (
            <Participant key={participant.sid} participant={participant} />
          ))}
        </div>
      </div>
      <div className="bg-white py-2 border-t">
        <Controls
          toggleAudio={toggleAudio}
          toggleVideo={toggleVideo}
          leaveRoom={leaveRoom}
          isAudioEnabled={isAudioEnabled}
          isVideoEnabled={isVideoEnabled}
        />
      </div>
    </div>
  );
}
