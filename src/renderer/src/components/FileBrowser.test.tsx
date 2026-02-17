import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import FileBrowser from './FileBrowser';
import { FileInfo } from '../App';

describe('FileBrowser', () => {
  const mockOnBack = jest.fn();
  const mockOnScanComplete = jest.fn();
  const testPath = '/test/folder';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading state initially', () => {
    window.electronAPI.scanDirectory = jest.fn(
      () =>
        new Promise(() => {
          /* never resolves */
        }),
    );

    render(<FileBrowser folderPath={testPath} onBack={mockOnBack} onScanComplete={mockOnScanComplete} />);

    expect(screen.getByText('Scanning directory...')).toBeInTheDocument();
  });

  it('should display folder path in header', async () => {
    const mockFiles: FileInfo[] = [];
    window.electronAPI.scanDirectory = jest.fn().mockResolvedValue({
      success: true,
      data: mockFiles,
    });

    render(<FileBrowser folderPath={testPath} onBack={mockOnBack} onScanComplete={mockOnScanComplete} />);

    await waitFor(() => {
      expect(screen.getByText(testPath)).toBeInTheDocument();
    });
  });

  it('should display stats after scanning', async () => {
    const mockFiles: FileInfo[] = [
      {
        name: 'file1.txt',
        path: '/test/file1.txt',
        size: 1024,
        modified: new Date(),
        type: 'file',
      },
      {
        name: 'file2.txt',
        path: '/test/file2.txt',
        size: 2048,
        modified: new Date(),
        type: 'file',
      },
    ];

    window.electronAPI.scanDirectory = jest.fn().mockResolvedValue({
      success: true,
      data: mockFiles,
    });

    render(<FileBrowser folderPath={testPath} onBack={mockOnBack} onScanComplete={mockOnScanComplete} />);

    await waitFor(() => {
      expect(screen.getByText('TOTAL FILES')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  it('should display error message on scan failure', async () => {
    const errorMsg = 'Failed to scan';
    window.electronAPI.scanDirectory = jest.fn().mockResolvedValue({
      success: false,
      error: errorMsg,
    });

    render(<FileBrowser folderPath={testPath} onBack={mockOnBack} onScanComplete={mockOnScanComplete} />);

    await waitFor(() => {
      expect(screen.getByText(errorMsg)).toBeInTheDocument();
    });
  });

  it('should display file list in table', async () => {
    const mockFiles: FileInfo[] = [
      {
        name: 'file1.txt',
        path: '/test/file1.txt',
        size: 1024,
        modified: new Date('2024-01-15'),
        type: 'file',
      },
    ];

    window.electronAPI.scanDirectory = jest.fn().mockResolvedValue({
      success: true,
      data: mockFiles,
    });

    render(<FileBrowser folderPath={testPath} onBack={mockOnBack} onScanComplete={mockOnScanComplete} />);

    await waitFor(() => {
      expect(screen.getByText(/file1\.txt/)).toBeInTheDocument();
    });
  });

  it('should call onScanComplete with files', async () => {
    const mockFiles: FileInfo[] = [
      {
        name: 'file1.txt',
        path: '/test/file1.txt',
        size: 1024,
        modified: new Date(),
        type: 'file',
      },
    ];

    window.electronAPI.scanDirectory = jest.fn().mockResolvedValue({
      success: true,
      data: mockFiles,
    });

    render(<FileBrowser folderPath={testPath} onBack={mockOnBack} onScanComplete={mockOnScanComplete} />);

    await waitFor(() => {
      expect(mockOnScanComplete).toHaveBeenCalledWith(mockFiles);
    });
  });
});
