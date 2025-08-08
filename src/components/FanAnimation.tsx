import React from 'react';
import { FanType } from '../types/fanTypes';

interface FanAnimationProps {
  fanType: FanType;
  isOn: boolean;
  speed: 'slow' | 'medium' | 'high';
}

export default function FanAnimation({ fanType, isOn, speed }: FanAnimationProps) {
  const getAnimationSpeed = () => {
    if (!isOn) return 'animate-spin-very-slow';
    
    switch (speed) {
      case 'slow': return 'animate-spin-slow';
      case 'medium': return 'animate-spin';
      case 'high': return 'animate-spin-fast';
      default: return 'animate-spin';
    }
  };

  const getVibrationClass = () => {
    return fanType.hasVibration && isOn ? 'animate-vibrate' : '';
  };

  const renderFan = () => {
    switch (fanType.id) {
      case 'table':
        return (
          <div className={`relative ${getVibrationClass()}`}>
            {/* Base */}
            <div className="w-8 h-24 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full mx-auto mb-4"></div>
            {/* Fan blades container */}
            <div className={`relative w-48 h-48 ${getAnimationSpeed()}`}>
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Center hub */}
                <circle cx="100" cy="100" r="12" fill="#374151" />
                {/* Blades */}
                {[0, 72, 144, 216, 288].map((rotation, index) => (
                  <g key={index} transform={`rotate(${rotation} 100 100)`}>
                    <ellipse cx="100" cy="60" rx="8" ry="35" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
                  </g>
                ))}
              </svg>
            </div>
          </div>
        );

      case 'ceiling':
        return (
          <div className={`relative ${getVibrationClass()}`}>
            {/* Ceiling mount */}
            <div className="w-6 h-6 bg-gray-500 rounded-full mx-auto mb-2"></div>
            <div className="w-4 h-8 bg-gray-400 mx-auto mb-4"></div>
            {/* Fan blades container */}
            <div className={`relative w-64 h-64 ${getAnimationSpeed()}`}>
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Center motor */}
                <circle cx="100" cy="100" r="15" fill="#1f2937" />
                {/* Blades */}
                {[0, 90, 180, 270].map((rotation, index) => (
                  <g key={index} transform={`rotate(${rotation} 100 100)`}>
                    <path 
                      d="M 100 100 Q 100 40 120 30 Q 140 25 150 40 Q 145 60 120 65 Z" 
                      fill="#f3f4f6" 
                      stroke="#e5e7eb" 
                      strokeWidth="1"
                    />
                  </g>
                ))}
              </svg>
            </div>
          </div>
        );

      case 'rusty':
        return (
          <div className={`relative ${getVibrationClass()}`}>
            {/* Rusty base */}
            <div className="w-10 h-20 bg-gradient-to-b from-orange-300 to-red-400 rounded-full mx-auto mb-4 opacity-80"></div>
            {/* Fan blades container */}
            <div className={`relative w-44 h-44 ${getAnimationSpeed()}`}>
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Center hub (rusty) */}
                <circle cx="100" cy="100" r="14" fill="#92400e" />
                {/* Blades (irregular) */}
                {[0, 120, 240].map((rotation, index) => (
                  <g key={index} transform={`rotate(${rotation} 100 100)`}>
                    <ellipse 
                      cx="100" 
                      cy="50" 
                      rx="6" 
                      ry="32" 
                      fill="#d97706" 
                      stroke="#92400e" 
                      strokeWidth="1.5"
                      opacity="0.9"
                    />
                  </g>
                ))}
              </svg>
            </div>
          </div>
        );

      case 'modern':
        return (
          <div className={`relative ${getVibrationClass()}`}>
            {/* Modern base */}
            <div className="w-6 h-16 bg-gradient-to-b from-slate-300 to-slate-500 rounded-full mx-auto mb-6"></div>
            {/* Fan blades container */}
            <div className={`relative w-56 h-56 ${getAnimationSpeed()}`}>
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Center hub (modern) */}
                <circle cx="100" cy="100" r="10" fill="#64748b" />
                <circle cx="100" cy="100" r="6" fill="#94a3b8" />
                {/* Blades (sleek) */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((rotation, index) => (
                  <g key={index} transform={`rotate(${rotation} 100 100)`}>
                    <path 
                      d="M 100 100 Q 100 45 105 35 Q 110 30 115 35 Q 110 50 105 60 Z" 
                      fill="#e2e8f0" 
                      stroke="#cbd5e1" 
                      strokeWidth="0.5"
                    />
                  </g>
                ))}
              </svg>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center">
      {renderFan()}
    </div>
  );
}