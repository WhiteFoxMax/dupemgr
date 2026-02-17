// @ts-ignore
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  scanDirectory: (folderPath: string) => ipcRenderer.invoke('scan-directory', folderPath),
  getDuplicates: (files: any[]) => ipcRenderer.invoke('get-duplicates', files),
});

export interface ElectronAPI {
  selectFolder: () => Promise<string | null>;
  scanDirectory: (folderPath: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  getDuplicates: (files: any[]) => Promise<{ success: boolean; data?: any; error?: string }>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
