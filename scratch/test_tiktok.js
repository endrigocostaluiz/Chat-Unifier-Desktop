const { app, BrowserWindow } = require('electron');

app.whenReady().then(() => {
  const win = new BrowserWindow({
    show: true,
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadURL('https://www.tiktok.com/@claupromocoes/live');

  win.webContents.on('did-finish-load', () => {
    setTimeout(() => {
      win.webContents.executeJavaScript(`
        const el = document.querySelector('[data-e2e="live-viewer-count"]') || document.querySelector('span[class*="Count"]');
        let res = "NADA";
        if (el) res = "VIEWERS: " + el.innerText;
        res;
      `).then(console.log).then(() => app.quit());
    }, 6000);
  });
});
