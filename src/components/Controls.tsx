import React, { useState } from 'react';
import { 
  MicrophoneIcon, PhoneIcon, VideoCameraIcon, 
  XMarkIcon 
} from '@heroicons/react/24/solid';

interface ControlsProps {
  toggleAudio: () => void;
  toggleVideo: () => void;
  leaveRoom: () => void;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
}

export default function Controls({
  toggleAudio,
  toggleVideo,
  leaveRoom,
  isAudioEnabled,
  isVideoEnabled,
}: ControlsProps) {
  return (
    <div className="flex justify-center space-x-4 p-4">
      <button
        onClick={toggleAudio}
        className={`rounded-full p-3 ${
          isAudioEnabled ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'
        } text-white transition-colors`}
        title={isAudioEnabled ? 'Turn off microphone' : 'Turn on microphone'}
      >
        {isAudioEnabled ? (
          <MicrophoneIcon className="h-6 w-6" />
        ) : (
          <div className="relative h-6 w-6">
            <MicrophoneIcon className="h-6 w-6" />
            <XMarkIcon className="h-6 w-6 absolute top-0 left-0 text-white opacity-70" />
          </div>
        )}
      </button>

      <button
        onClick={toggleVideo}
        className={`rounded-full p-3 ${
          isVideoEnabled ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'
        } text-white transition-colors`}
        title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
      >
        {isVideoEnabled ? (
          <VideoCameraIcon className="h-6 w-6" />
        ) : (
          <div className="relative h-6 w-6">
            <VideoCameraIcon className="h-6 w-6" />
            <XMarkIcon className="h-6 w-6 absolute top-0 left-0 text-white opacity-70" />
          </div>
        )}
      </button>

      <button
        onClick={leaveRoom}
        className="rounded-full p-3 bg-red-500 hover:bg-red-600 text-white transition-colors"
        title="Leave call"
      >
        <PhoneIcon className="h-6 w-6 transform rotate-225" />
      </button>
    </div>
  );
}
