import React, { useState } from 'react';

interface LandingPageProps {
  onFolderSelected: (folderPath: string) => void;
}

export default function LandingPage({ onFolderSelected }: LandingPageProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectFolder = async () => {
    setIsLoading(true);
    try {
      const folderPath = await window.electronAPI.selectFolder();
      if (folderPath) {
        onFolderSelected(folderPath);
      }
    } catch (err) {
      console.error(`Failed to select folder: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] px-8">
      {/* App Header */}
      <div className="text-center mb-16 animate-fadeIn">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-[#0078f2] via-[#00a8ff] to-[#00d4ff] bg-clip-text text-transparent tracking-tight">
          Dupe Manager
        </h1>
        <p className="text-xl text-gray-400 font-light">
          Find and manage duplicate files with ease
        </p>
      </div>

      {/* Main Content */}
      <div className="text-center mb-12">
        <div className="text-7xl mb-8 opacity-80 animate-float">📁</div>
        
        {/* Big Blue Button */}
        <button
          onClick={handleSelectFolder}
          disabled={isLoading}
          className="group relative px-20 py-6 bg-gradient-to-r from-[#0078f2] to-[#0056d2] text-white text-2xl font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_40px_rgba(0,120,242,0.6)] active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          
          <span className="relative z-10">
            {isLoading ? 'Loading...' : 'Select Folder'}
          </span>
        </button>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mt-16">
        <div className="group bg-gradient-to-br from-[#2a2a2a]/80 to-[#1e1e1e]/80 backdrop-blur-sm p-6 rounded-lg border border-[#3a3a3a] hover:border-[#0078f2] hover:bg-[#2a2a2a] transition-all duration-300 hover:-translate-y-2">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-lg font-semibold mb-2 text-white">Fast Scanning</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Quick algorithm to find duplicates
          </p>
        </div>

        <div className="group bg-gradient-to-br from-[#2a2a2a]/80 to-[#1e1e1e]/80 backdrop-blur-sm p-6 rounded-lg border border-[#3a3a3a] hover:border-[#0078f2] hover:bg-[#2a2a2a] transition-all duration-300 hover:-translate-y-2">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-lg font-semibold mb-2 text-white">Safe Deletion</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Protected system file detection
          </p>
        </div>

        <div className="group bg-gradient-to-br from-[#2a2a2a]/80 to-[#1e1e1e]/80 backdrop-blur-sm p-6 rounded-lg border border-[#3a3a3a] hover:border-[#0078f2] hover:bg-[#2a2a2a] transition-all duration-300 hover:-translate-y-2">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold mb-2 text-white">Smart Analysis</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Content-based comparison
          </p>
        </div>
      </div>
    </div>
  );
}