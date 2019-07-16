const { app, BrowserWindow, ipcMain  } = require("electron");

function createWindow() {
  let win = new BrowserWindow({
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    skipTaskbar: true,
    opacity: 0.8,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile("index.html");
  
  ipcMain.on('resize', function(e, x, y) {
    win.setSize(x, y);
  })

  ipcMain.on('quit', function() {
    app.quit();
  })
}

app.on("ready", createWindow);
