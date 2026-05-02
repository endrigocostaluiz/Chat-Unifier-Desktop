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

  win.loadURL('https://www.youtube.com/shorts/Shr6sBAKEBA');

  win.webContents.on('did-finish-load', () => {
    setTimeout(() => {
      win.webContents.executeJavaScript(`
        const sels = ['.viewers-count', '#view-count', 'span[dir="auto"]', 'yt-view-count-renderer'];
        let res = "NADA ENCONTRADO";
        for (const s of sels) {
          const el = document.querySelector(s);
          if (el) { res = "ENCONTRADO: " + s + " -> " + el.innerText; break; }
        }
        res;
      `).then(console.log).then(() => app.quit());
    }, 5000);
  });
});
