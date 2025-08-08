import React from 'react';
import { Wind } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-2xl mx-auto animate-fade-in">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Wind className="w-12 h-12 text-blue-600 animate-spin-slow" />
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800">
            Aero<span className="text-blue-600">void</span>
          </h1>
        </div>
        
        {/* Tagline */}
        <h2 className="text-2xl md:text-4xl font-light text-gray-600 mb-8">
          The Breeze Without Breeze
        </h2>
        
        {/* Description */}
        <p className="text-lg text-gray-500 mb-12 max-w-md mx-auto">
          Experience the most realistic virtual fan sounds and controls. 
          Because sometimes you need that perfect white noise without the actual breeze.
        </p>
        
        {/* Start Button */}
        <button
          onClick={onStart}
          className="group relative px-12 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xl font-semibold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:from-blue-600 hover:to-blue-700"
        >
          <span className="relative z-10">Start Your Fan Experience</span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
        </button>
        
        {/* Footer */}
        <div className="mt-16 text-sm text-gray-400">
          Made by Aerovoid Team
        </div>
      </div>
    </div>
  );
}