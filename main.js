const { app, BrowserWindow, ipcMain } = require('electron');
const puppeteer = require('puppeteer');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Poprawiony parametr contextIsolation na true
      enableRemoteModule: true,
      worldSafeExecuteJavaScript: true,
    },
  });

  // Załaduj plik index.html
  mainWindow.loadFile('index.html');

  // Otwórz okno deweloperskie
  mainWindow.webContents.openDevTools();

  // Obsługa komunikacji między procesami
  ipcMain.on('start-parsing', async (event, loginGPRO, passwordGPRO, loginWRT, passwordWRT) => {
    try {
      const dataFromPuppeteer = await startPuppeteer(loginGPRO, passwordGPRO, loginWRT, passwordWRT);
      event.reply('parsing-complete', dataFromPuppeteer);
    } catch (error) {
      event.reply('parsing-error', error.message);
    }
  });

  // Pozostały kod tworzenia okna
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

async function startPuppeteer(loginGPRO, passwordGPRO, loginWRT, passwordWRT) {
  const browser = await puppeteer.launch({ headless: false });
  // Wstaw pozostały kod Puppeteera, podobny do tego z Twojego wcześniejszego renderer.js
  // ...
  return {
    dataFromPage1: 'Dane ze strony 1',
    dataFromPage2: 'Dane ze strony 2'
  };
}