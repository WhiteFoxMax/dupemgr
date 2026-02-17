// @ts-ignore
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
// @ts-ignore
const path = require('path');
// @ts-ignore
const { scanDirectory } = require('./services/fileService');

// Disable GPU acceleration to avoid issues in some environments
app.disableHardwareAcceleration();

let mainWindow: any = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  const isDev = process.env.NODE_ENV === 'development';
  const startUrl = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../renderer/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC Handlers
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

ipcMain.handle('scan-directory', async (_event: any, folderPath: string) => {
  try {
    const files = await scanDirectory(folderPath);
    return { success: true, data: files };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('get-duplicates', async (_event: any, files: any[]) => {
  try {
    // Stub: Return empty for now
    return { success: true, data: [], stats: { total: files.length, duplicates: 0, savings: 0 } };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});
