import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LandingPage from './LandingPage';

describe('LandingPage', () => {
  it('should render the landing page', () => {
    const mockOnFolderSelected = jest.fn();
    render(<LandingPage onFolderSelected={mockOnFolderSelected} />);

    expect(screen.getByRole('button', { name: /OPEN FOLDER/i })).toBeInTheDocument();
  });

  it('should have a open folder button', () => {
    const mockOnFolderSelected = jest.fn();
    render(<LandingPage onFolderSelected={mockOnFolderSelected} />);

    const button = screen.getByRole('button', { name: /OPEN FOLDER/i });
    expect(button).toBeInTheDocument();
  });

  it('should call selectFolder when button is clicked', async () => {
    const mockOnFolderSelected = jest.fn();
    window.electronAPI.selectFolder = jest.fn().mockResolvedValue('/test/path');

    render(<LandingPage onFolderSelected={mockOnFolderSelected} />);

    const button = screen.getByRole('button', { name: /OPEN FOLDER/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(window.electronAPI.selectFolder).toHaveBeenCalled();
    });
  });

  it('should call onFolderSelected with the selected path', async () => {
    const mockOnFolderSelected = jest.fn();
    window.electronAPI.selectFolder = jest.fn().mockResolvedValue('/test/path');

    render(<LandingPage onFolderSelected={mockOnFolderSelected} />);

    const button = screen.getByRole('button', { name: /OPEN FOLDER/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnFolderSelected).toHaveBeenCalledWith('/test/path');
    });
  });
});
