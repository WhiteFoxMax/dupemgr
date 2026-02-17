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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-blue-900">
      <button
        onClick={handleSelectFolder}
        disabled={isLoading}
        className="px-8 py-4 text-lg font-bold text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 transition-all duration-300"
      >
        {isLoading ? 'Loading...' : 'OPEN FOLDER'}
      </button>
    </div>
  );
}
