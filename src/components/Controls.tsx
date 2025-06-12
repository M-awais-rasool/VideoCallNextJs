import React from 'react';
import { 
  MicrophoneIcon, PhoneIcon, VideoCameraIcon, XMarkIcon 
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
    <div className="flex justify-center space-x-2 md:space-x-6 px-4">
      <button
        onClick={toggleAudio}
        className={`rounded-full p-3 md:p-4 ${
          isAudioEnabled ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-500 hover:bg-red-600'
        } text-white transition-all transform hover:scale-105 shadow-lg`}
        title={isAudioEnabled ? 'Turn off microphone' : 'Turn on microphone'}
      >
        {isAudioEnabled ? (
          <MicrophoneIcon className="h-5 w-5 md:h-6 md:w-6" />
        ) : (
          <div className="relative h-5 w-5 md:h-6 md:w-6">
            <MicrophoneIcon className="h-5 w-5 md:h-6 md:w-6" />
            <XMarkIcon className="h-5 w-5 md:h-6 md:w-6 absolute top-0 left-0 text-white opacity-80" />
          </div>
        )}
      </button>

      <button
        onClick={toggleVideo}
        className={`rounded-full p-3 md:p-4 ${
          isVideoEnabled ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-500 hover:bg-red-600'
        } text-white transition-all transform hover:scale-105 shadow-lg`}
        title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
      >
        {isVideoEnabled ? (
          <VideoCameraIcon className="h-5 w-5 md:h-6 md:w-6" />
        ) : (
          <div className="relative h-5 w-5 md:h-6 md:w-6">
            <VideoCameraIcon className="h-5 w-5 md:h-6 md:w-6" />
            <XMarkIcon className="h-5 w-5 md:h-6 md:w-6 absolute top-0 left-0 text-white opacity-80" />
          </div>
        )}
      </button>

      <button
        onClick={leaveRoom}
        className="rounded-full p-3 md:p-4 bg-red-600 hover:bg-red-700 text-white transition-all transform hover:scale-105 shadow-lg"
        title="Leave call"
      >
        <PhoneIcon className="h-5 w-5 md:h-6 md:w-6 transform rotate-225" />
      </button>
    </div>
  );
}
