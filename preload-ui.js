const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getConfig: () => ipcRenderer.invoke('get-config'),
  saveConfig: (config) => ipcRenderer.invoke('save-config', config),
  startAll: () => ipcRenderer.send('start-all-scrapers'),
  startSingle: (platform) => ipcRenderer.send('start-single-scraper', platform),
  stopSingle: (id) => ipcRenderer.send('stop-single-scraper', id),
  stopAll: () => ipcRenderer.send('stop-all-scrapers'),
  updateOverlay: () => ipcRenderer.send('update-overlay-config'),
  onPreviewMessage: (callback) => ipcRenderer.on('preview-message', (event, value) => callback(value)),
  copyText: (text) => ipcRenderer.send('copy-to-clipboard', text),
  openExternal: (url) => ipcRenderer.send('open-external', url)
});
