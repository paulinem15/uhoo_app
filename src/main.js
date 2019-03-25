const {ipcMain, app, BrowserWindow} = require('electron');
const path = require('path')
const url = require('url')
// const autoUpdater = require('./auto-updater')
const {autoUpdater} = require("electron-updater");
// if (require('electron-squirrel-startup')) electron.app.quit()

// const app = electron.app
// const BrowserWindow = electron.BrowserWindow

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 600})

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    app.quit()
  })

}

app.on('ready', function(){
  createWindow()
  autoUpdater.checkForUpdates();
})

autoUpdater.on('update-downloaded', (info) => {
    win.webContents.send('updateReady')
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
