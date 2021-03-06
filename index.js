const { app, BrowserWindow, ipcMain } = require('electron')
const autoUpdater = require('electron-updater').autoUpdater;
// autoUpdater.checkForUpdatesAndNotify();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600 })

  // and load the index.html of the app.
  win.loadFile('index.html')

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

function sendStatusToWindow(text) {
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('message', text);
  })
}

autoUpdater.on('checking-for-update', () => {
  win.webContents.send('message','Checking for update...');
})

autoUpdater.on('update-available', (info) => {
  win.webContents.send('message','Update available.');
})

autoUpdater.on('update-not-available', (info) => {
  win.webContents.send('message','App has the latest version');
})

autoUpdater.on('download-progress', (progressObj) => {
  // let log_message = "Download speed: " + progressObj.bytesPerSecond;
  // log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  // log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  win.webContents.send('message', 'Downloading process...');
})

autoUpdater.on('update-downloaded', (info) => {
  win.webContents.send('message','Update downloaded. You can restart the application to see the update.');
});

autoUpdater.on('error', (err) => {
  win.webContents.send('message','Error in auto-updater. ' + err);
})

ipcMain.on('update', (event, arg) => {
  autoUpdater.checkForUpdates();
  // console.log(arg) // prints "ping"
})

// ipcMain.on('synchronous-message', (event, arg) => {
//   console.log(arg) // prints "ping"
//   event.returnValue = 'pong'
// })

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function(){
  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.