require('@testing-library/jest-dom');

// Mock electron API
Object.defineProperty(window, 'electronAPI', {
  value: {
    selectFolder: jest.fn(),
    scanDirectory: jest.fn(),
    getDuplicates: jest.fn(),
  },
  writable: true,
});
