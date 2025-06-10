'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [username, setUsername] = useState('');
  const [roomName, setRoomName] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const router = useRouter();

  const handleJoinRoom = async (e: FormEvent) => {
    e.preventDefault();
    if (username && roomName) {
      router.push(`/room/${roomName}?username=${username}`);
    }
  };

  const createNewRoom = () => {
    setIsCreatingRoom(true);
    const newRoomId = uuidv4().substring(0, 8);
    setRoomName(newRoomId);
    setTimeout(() => setIsCreatingRoom(false), 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <h1 className="text-3xl font-bold text-center">Video Connect</h1>
          <p className="text-center mt-2 opacity-90">Connect with anyone, anywhere, anytime</p>
        </div>
        
        <form onSubmit={handleJoinRoom} className="p-6 space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="roomName" className="block text-sm font-medium text-gray-700">
                Room ID
              </label>
              <button
                type="button"
                className={`text-xs text-blue-600 hover:text-blue-800 font-medium transition ${
                  isCreatingRoom ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={createNewRoom}
                disabled={isCreatingRoom}
              >
                {isCreatingRoom ? 'Creating...' : 'Generate Room ID'}
              </button>
            </div>
            <input
              type="text"
              id="roomName"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-900"
              placeholder="Enter room ID"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium shadow hover:opacity-90 transition"
          >
            Join Room
          </button>

          <p className="text-xs text-center text-gray-500 mt-4">
            Start a video call by entering your name and creating or joining a room
          </p>
        </form>
      </div>
    </div>
  );
}
