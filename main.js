const { app, BrowserWindow, ipcMain  } = require("electron");

function createWindow() {
  let win = new BrowserWindow({
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    skipTaskbar: true,
    opacity: 0.8,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile("index.html");
  
  ipcMain.on('resize', function(e, targetSizeX, targetSizeY, anchorRight, anchorBottom) {
    if (anchorRight == true || anchorBottom == true) {
      var targetPosX;
      var targetPosY;
      var [originalPosX, originalPosY] = win.getPosition();
      var [originalSizeX, originalSizeY] = win.getSize();

      if (anchorRight == true) {
        targetPosX = originalPosX + (originalSizeX - targetSizeX);
      }
      else {
        targetPosX = originalPosX;
      }

      if (anchorBottom == true) {
        targetPosY = originalPosY + (originalSizeY - targetSizeY);
      }
      else {
        targetPosY = originalPosY;
      }
      win.setPosition(targetPosX, targetPosY);
    }

    win.setContentSize(targetSizeX, targetSizeY);
  })

  ipcMain.on('quit', function() {
    app.quit();
  })

  // Open dev tools in separate window.
  // win.webContents.openDevTools({mode:'undocked'});
}

app.on("ready", createWindow);
