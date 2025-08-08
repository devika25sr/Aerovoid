import React, { useState, useEffect } from 'react';
import { Power, PowerOff, Volume2 } from 'lucide-react';
import { FAN_TYPES, FanState } from '../types/fanTypes';
import { audioManager } from '../utils/audioManager';
import FanAnimation from './FanAnimation';

interface FanControlProps {
  onBack: () => void;
}

export default function FanControl({ onBack }: FanControlProps) {
  const [fanState, setFanState] = useState<FanState>({
    isOn: false,
    speed: 'medium',
    selectedFan: 'table',
    volume: 0.7
  });

  const selectedFanType = FAN_TYPES.find(fan => fan.id === fanState.selectedFan)!;

  useEffect(() => {
    // Initialize audio on first load
    audioManager.initialize();
    
    return () => {
      audioManager.cleanup();
    };
  }, []);

  useEffect(() => {
    if (fanState.isOn) {
      audioManager.startFanSound(
        selectedFanType.baseFrequency, 
        selectedFanType.noiseType,
        selectedFanType.id
      );
      audioManager.fadeIn(0.5);
      audioManager.updateSpeed(fanState.speed);
      audioManager.setVolume(fanState.volume);
    }
  }, [fanState.selectedFan]);

  const handlePowerToggle = async (newPowerState: boolean) => {
    if (newPowerState) {
      audioManager.speak("Turning fan on");
      setFanState(prev => ({ ...prev, isOn: true }));
      await audioManager.startFanSound(
        selectedFanType.baseFrequency, 
        selectedFanType.noiseType,
        selectedFanType.id
      );
      audioManager.fadeIn(0.8);
      audioManager.updateSpeed(fanState.speed);
      audioManager.setVolume(fanState.volume);
    } else {
      audioManager.speak("Turning fan off");
      await audioManager.fadeOut(0.8);
      setFanState(prev => ({ ...prev, isOn: false }));
    }
  };

  const handleSpeedChange = (newSpeed: 'slow' | 'medium' | 'high') => {
    setFanState(prev => ({ ...prev, speed: newSpeed }));
    if (fanState.isOn) {
      audioManager.updateSpeed(newSpeed);
    }
  };

  const handleFanTypeChange = (fanId: string) => {
    setFanState(prev => ({ ...prev, selectedFan: fanId }));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setFanState(prev => ({ ...prev, volume: newVolume }));
    if (fanState.isOn) {
      audioManager.setVolume(newVolume);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Back to Home
          </button>
          <h1 className="text-4xl font-bold text-gray-800">Aerovoid Control Center</h1>
          <p className="text-gray-600">Select your fan and enjoy the perfect ambient noise</p>
        </div>

        {/* Fan Selection */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Choose Your Fan</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FAN_TYPES.map((fan) => (
              <button
                key={fan.id}
                onClick={() => handleFanTypeChange(fan.id)}
                className={`p-4 rounded-xl transition-all duration-300 ${
                  fanState.selectedFan === fan.id
                    ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                    : 'bg-white/50 text-gray-700 hover:bg-white/80 hover:shadow-md'
                }`}
              >
                <div className="font-medium">{fan.name}</div>
                <div className="text-xs opacity-75 mt-1">{fan.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Fan Animation */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <FanAnimation 
            fanType={selectedFanType}
            isOn={fanState.isOn}
            speed={fanState.speed}
          />
        </div>

        {/* Controls */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Power Controls */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Power Control</h3>
            <div className="flex gap-4">
              <button
                onClick={() => handlePowerToggle(true)}
                disabled={fanState.isOn}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                  fanState.isOn
                    ? 'bg-green-400 text-white cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600 hover:shadow-lg transform hover:scale-105'
                }`}
              >
                <Power className="w-5 h-5" />
                ON
              </button>
              <button
                onClick={() => handlePowerToggle(false)}
                disabled={!fanState.isOn}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                  !fanState.isOn
                    ? 'bg-red-400 text-white cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600 hover:shadow-lg transform hover:scale-105'
                }`}
              >
                <PowerOff className="w-5 h-5" />
                OFF
              </button>
            </div>
          </div>

          {/* Speed Controls */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Speed Control</h3>
            <div className="flex gap-2">
              {['slow', 'medium', 'high'].map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed as any)}
                  className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 capitalize ${
                    fanState.speed === speed
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-white/50 text-gray-700 hover:bg-white/80 hover:shadow-md'
                  }`}
                >
                  {speed}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Volume Control */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Sound Tuner
          </h3>
          <div className="space-y-4">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={fanState.volume}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Whisper Quiet</span>
              <span>Industrial Strength</span>
            </div>
          </div>
        </div>

        {/* Status Display */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 shadow-lg">
          <div className="text-center space-y-2">
            <div className="text-lg font-medium text-gray-700">
              Current Status: <span className={fanState.isOn ? 'text-green-600' : 'text-red-600'}>
                {fanState.isOn ? 'Running' : 'Off'}
              </span>
            </div>
            {fanState.isOn && (
              <div className="text-sm text-gray-500">
                {selectedFanType.name} • Speed: {fanState.speed} • Volume: {Math.round(fanState.volume * 100)}%
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-400">
          Made by Aerovoid • The Breeze Without Breeze
        </div>
      </div>
    </div>
  );
}