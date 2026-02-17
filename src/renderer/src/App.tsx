import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import FileBrowser from './components/FileBrowser';

export interface FileInfo {
  name: string;
  path: string;
  size: number;
  modified: Date;
  type: 'file' | 'directory';
}

export type AppState = 'landing' | 'browsing' | 'duplicates';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('landing');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [files, setFiles] = useState<FileInfo[]>([]);

  const handleFolderSelected = (folderPath: string) => {
    setSelectedFolder(folderPath);
    setCurrentState('browsing');
  };

  const handleBack = () => {
    setCurrentState('landing');
    setSelectedFolder(null);
    setFiles([]);
  };

  const handleScanComplete = (scannedFiles: FileInfo[]) => {
    setFiles(scannedFiles);
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-[#e0e0e0]">
      {currentState === 'landing' && <LandingPage onFolderSelected={handleFolderSelected} />}
      {currentState === 'browsing' && selectedFolder && (
        <FileBrowser folderPath={selectedFolder} onBack={handleBack} onScanComplete={handleScanComplete} />
      )}
    </div>
  );
}

export default App;
