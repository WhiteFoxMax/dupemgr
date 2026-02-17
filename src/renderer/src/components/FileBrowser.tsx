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
    <div className="flex flex-col h-screen bg-[#1e1e1e]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2d2d2d] to-[#1e1e1e] border-b border-[#3d3d3d] p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <button
              onClick={onBack}
              className="mb-4 px-4 py-2 bg-[#3d3d3d] hover:bg-[#4d4d4d] text-[#e0e0e0] rounded-lg hover:text-[#50e6e6] transition-all duration-200 font-semibold"
            >
              ← Back to Home
            </button>
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#50e6e6] to-[#0078d4]">
              📂 {folderPath.split('\\').pop()}
            </h2>
            <p className="text-sm text-[#a0a0a0] mt-1">{folderPath}</p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-6">
        {isScanning ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#50e6e6] mx-auto mb-4"></div>
              <p className="text-[#a0a0a0]">Scanning directory...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-[#f48771] bg-opacity-10 border border-[#f48771] text-[#f48771] p-4 rounded-lg">
            {error}
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-[#2d2d2d] to-[#1e1e1e] p-6 rounded-xl border border-[#3d3d3d] hover:border-[#50e6e6] transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📄</span>
                  <p className="text-[#a0a0a0] text-sm font-semibold">TOTAL FILES</p>
                </div>
                <p className="text-3xl font-black text-[#50e6e6]">{stats.totalFiles}</p>
              </div>
              <div className="bg-gradient-to-br from-[#2d2d2d] to-[#1e1e1e] p-6 rounded-xl border border-[#3d3d3d] hover:border-[#0078d4] transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">💾</span>
                  <p className="text-[#a0a0a0] text-sm font-semibold">TOTAL SIZE</p>
                </div>
                <p className="text-3xl font-black text-[#0078d4]">{formatSize(stats.totalSize)}</p>
              </div>
              <div className="bg-gradient-to-br from-[#2d2d2d] to-[#1e1e1e] p-6 rounded-xl border border-[#3d3d3d] hover:border-[#ce9178] transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">⚠️</span>
                  <p className="text-[#a0a0a0] text-sm font-semibold">DUPLICATES</p>
                </div>
                <p className="text-3xl font-black text-[#ce9178]">Coming Soon</p>
              </div>
            </div>

            {/* File List */}
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#e0e0e0] mb-4">🗂️ Directory Contents ({files.length})</h3>
              {files.length === 0 ? (
                <div className="bg-[#2d2d2d] p-8 rounded-xl border border-[#3d3d3d] text-center">
                  <p className="text-[#a0a0a0] text-lg">No files found in this directory</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                  {files.map((file, idx) => (
                    <div
                      key={idx}
                      className="bg-[#2d2d2d] p-4 rounded-lg border border-[#3d3d3d] hover:border-[#50e6e6] hover:bg-[#3d3d3d] transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl mt-1 group-hover:scale-125 transition-transform">
                          {file.type === 'directory' ? '📁' : '📄'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[#e0e0e0] font-semibold truncate text-sm">{file.name}</p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            {file.type === 'file' && (
                              <span className="text-xs bg-[#3d3d3d] px-2 py-1 rounded text-[#50e6e6]">
                                {formatSize(file.size)}
                              </span>
                            )}
                            <span className="text-xs bg-[#3d3d3d] px-2 py-1 rounded text-[#0078d4]">
                              {file.type}
                            </span>
                          </div>
                          <p className="text-xs text-[#a0a0a0] mt-2">{formatDate(file.modified)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Duplicates Stub Button */}
            <div className="mt-8 pt-6 border-t border-[#3d3d3d]">
              <button
                disabled
                className="w-full relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ce9178] to-[#f48771] rounded-lg blur opacity-30 group-hover:opacity-50"></div>
                <div className="relative py-4 px-6 bg-[#2d2d2d] rounded-lg flex items-center justify-center gap-2">
                  <span className="text-xl">⚡</span>
                  <span className="text-[#ce9178] font-black">ANALYZE FOR DUPLICATES</span>
                </div>
              </button>
              <p className="text-sm text-[#a0a0a0] mt-3 text-center">
                🔜 Hash-based duplicate detection coming soon!
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
