/// <reference lib="dom" />
import '@testing-library/jest-dom';

declare global {
  interface Window {
    electronAPI: {
      selectFolder: () => Promise<string | null>;
      scanDirectory: (folderPath: string) => Promise<{ success: boolean; data?: any; error?: string }>;
      getDuplicates: (files: any[]) => Promise<{ success: boolean; data?: any; error?: string }>;
    };
  }

  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
    }
  }
}

// Mock electron API
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'electronAPI', {
    value: {
      selectFolder: jest.fn(),
      scanDirectory: jest.fn(),
      getDuplicates: jest.fn(),
    },
    writable: true,
  });
}
