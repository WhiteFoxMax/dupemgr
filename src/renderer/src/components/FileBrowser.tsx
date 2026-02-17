import React, { useState, useEffect } from 'react';
import { FileInfo } from '../App';

interface FileBrowserProps {
  folderPath: string;
  onBack: () => void;
  onScanComplete: (files: FileInfo[]) => void;
}

export default function FileBrowser({ folderPath, onBack, onScanComplete }: FileBrowserProps) {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [isScanning, setIsScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalFiles: 0, totalSize: 0 });

  useEffect(() => {
    const scanFolder = async () => {
      try {
        setIsScanning(true);
        const result = await window.electronAPI.scanDirectory(folderPath);

        if (result.success && result.data) {
          const fileList = result.data as FileInfo[];
          setFiles(fileList);
          onScanComplete(fileList);

          // Calculate stats
          const fileOnlyList = fileList.filter((f) => f.type === 'file');
          const totalSize = fileOnlyList.reduce((acc, f) => acc + f.size, 0);
          setStats({
            totalFiles: fileOnlyList.length,
            totalSize,
          });
        } else {
          setError(result.error || 'Failed to scan directory');
        }
      } catch (err) {
        setError(`Error: ${err}`);
      } finally {
        setIsScanning(false);
      }
    };

    scanFolder();
  }, [folderPath, onScanComplete]);

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-700 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-6 shadow-md">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">📂 {folderPath}</h2>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-6">
        {isScanning ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-400 mx-auto mb-4"></div>
              <p className="text-gray-300 text-xl">Scanning directory...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 p-6 rounded-lg text-lg">
            {error}
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 mb-8">
              <div className="p-6 bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold">Total Files</h3>
                <p className="text-4xl font-extrabold">{stats.totalFiles}</p>
              </div>
              <div className="p-6 bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold">Total Size</h3>
                <p className="text-4xl font-extrabold">{formatSize(stats.totalSize)}</p>
              </div>
            </div>

            {/* File List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {files.map((file) => (
                <div
                  key={file.path}
                  className="p-6 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 transition-all duration-200"
                >
                  <h4 className="text-2xl font-bold truncate">{file.name}</h4>
                  <p className="text-lg text-gray-400">{file.type}</p>
                  <p className="text-lg text-gray-400">{formatSize(file.size)}</p>
                  <p className="text-lg text-gray-400">{formatDate(file.modified)}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-center items-center h-full bg-blue-800 p-6">
        {/* Centered Select Button */}
        <div className="relative h-screen">
          <button
            onClick={onBack}
            className="select-button"
          >
            Select Folder
          </button>
        </div>
      </div>
    </div>
  );
}
