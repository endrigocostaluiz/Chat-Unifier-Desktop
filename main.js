const { app, BrowserWindow, ipcMain, session, clipboard, Tray, Menu } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

// Configurações e Persistência
const CONFIG_PATH = path.join(app.getPath('userData'), 'driftweb-stream-chat.json');

const defaultOverlay = (id) => ({
  layout: 'modern',
  animation: 'slide',
  showAvatars: true,
  cardColor: '#1e293b',
  cardOpacity: 85,
  bgColor: '#000000',
  bgOpacity: 0,
  slowMode: 1,
  messageSpacing: 10,
  hideLeftBorder: false,
  customCSS: ''
});

let config = {
  platforms: [],
  port: 3000,
  overlay1: defaultOverlay('overlay1'),   // URL principal /chat
  overlay2: defaultOverlay('overlay2'),   // URL monitor /monitor
  overlay2Enabled: false
};

// Servidor Express e Socket.io
const serverApp = express();
const server = http.createServer(serverApp);
const io = new Server(server, { cors: { origin: "*" } });

serverApp.use(express.static(path.join(__dirname, 'public/overlay')));

serverApp.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/overlay/index.html'));
});

serverApp.get('/monitor', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/overlay/index.html'));
});

io.on('connection', (socket) => {
  // O cliente informa qual overlay é ao se conectar
  socket.on('join-room', (room) => {
    socket.join(room);
    if (room === 'overlay1') socket.emit('config-update', config.overlay1);
    if (room === 'overlay2') socket.emit('config-update', config.overlay2);
  });
});

let mainWindow;
let tray;
let scrapers = {};

function createTray() {
  const iconPath = path.join(__dirname, 'public/icon.png'); // Novo ícone gerado
  
  tray = new Tray(iconPath);
  
  const restoreApp = () => {
    if (mainWindow) {
      mainWindow.show();
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  };

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Abrir Painel', click: restoreApp },
    { label: 'Sair Completamente', click: () => {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip('Chat Unifier');
  tray.setContextMenu(contextMenu);

  tray.on('double-click', restoreApp);
}

async function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const saved = fs.readJsonSync(CONFIG_PATH);
      // Merge preservando estrutura aninhada
      config = {
        ...config,
        ...saved,
        overlay1: { ...defaultOverlay('overlay1'), ...(saved.overlay1 || {}) },
        overlay2: { ...defaultOverlay('overlay2'), ...(saved.overlay2 || {}) },
        port: 3000
      };
    } else {
      fs.writeJsonSync(CONFIG_PATH, config);
    }
  } catch (err) {
    console.error("Erro ao carregar config:", err);
  }
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1024,
    backgroundColor: '#0a0a0a',
    icon: path.join(__dirname, 'public/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload-ui.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    title: "Chat Unifier"
  });
  mainWindow.setMenu(null);
  mainWindow.loadFile('public/index.html');

  // Ao fechar (X), apenas esconde a janela
  mainWindow.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });

  // Ao minimizar, também pode esconder (opcional, mas comum para tray)
  mainWindow.on('minimize', (event) => {
    event.preventDefault();
    mainWindow.hide();
  });
}

// Lógica de Scraping
function startScraper(platform) {
  if (scrapers[platform.id]) return;

  const win = new BrowserWindow({
    show: true, // Deve ser true para enganar o YouTube (Page Visibility API)
    x: -10000,  // Joga a janela para fora da tela
    y: -10000,
    width: 800,
    height: 800,
    skipTaskbar: true, // Esconde da barra de tarefas
    frame: false,
    focusable: false,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, 'scraper.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false,
      backgroundThrottling: false
    }
  });

  win.webContents.setAudioMuted(true);
  win.webContents.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");

  let url = platform.url;
  if (platform.type === 'twitch') {
    const channel = url.replace(/\/$/, "").split('/').pop();
    url = `https://www.twitch.tv/popout/${channel}/chat`;

  } else if (platform.type === 'youtube') {
    // Caso já seja uma URL live_chat direta
    if (url.includes('live_chat')) {
      // Usa direto
    }
    // Caso seja um vídeo direto
    else if (url.includes('watch?v=')) {
      const videoId = new URL(url).searchParams.get('v');
      if (videoId) url = `https://www.youtube.com/live_chat?v=${videoId}&is_popout=1`;
    }
    // Caso seja URL de canal → abre /live e extrai o videoId da página
    else {
      // Garante que tem /live no final
      if (!url.includes('/live')) url = url.replace(/\/$/, '') + '/live';

      // Quando a página /live terminar de carregar, extrai o videoId e redireciona
      win.webContents.once('did-finish-load', async () => {
        try {
          const videoId = await win.webContents.executeJavaScript(`
            new Promise((resolve) => {
              let attempts = 0;
              const maxAttempts = 20; // 10 segundos (500ms * 20)
              
              const checkId = setInterval(() => {
                attempts++;
                
                // 1. Tenta pegar da URL atual (caso o YT tenha feito redirecionamento nativo)
                let m = location.href.match(/[?&]v=([^&]+)/);
                if (m) { clearInterval(checkId); return resolve(m[1]); }
                
                // 2. Tenta pegar da meta tag itemprop
                const meta = document.querySelector('meta[itemprop="videoId"]');
                if (meta && meta.content) { clearInterval(checkId); return resolve(meta.content); }
                
                // 3. Tenta pegar do ytInitialPlayerResponse
                if (typeof ytInitialPlayerResponse !== 'undefined' && ytInitialPlayerResponse.videoDetails) {
                   clearInterval(checkId); return resolve(ytInitialPlayerResponse.videoDetails.videoId);
                }
                
                // 4. Tenta procurar em links canônicos
                const canonical = document.querySelector('link[rel="canonical"]');
                if (canonical) {
                  m = canonical.href.match(/[?&]v=([^&]+)/);
                  if (m) { clearInterval(checkId); return resolve(m[1]); }
                }

                if (attempts >= maxAttempts) {
                  clearInterval(checkId);
                  resolve(null);
                }
              }, 500);
            });
          `);

          if (videoId && !win.isDestroyed()) {
            console.log('[YouTube] ID da Live Encontrado:', videoId);
            win.loadURL('https://www.youtube.com/live_chat?v=' + videoId + '&is_popout=1');
          } else {
            console.log('[YouTube] Não foi possível extrair o ID da live.');
          }
        } catch(e) {
          console.error('[YouTube] Erro ao extrair videoId:', e.message);
        }
      });
    }

  } else if (platform.type === 'kick' && !url.includes('chatroom')) {
    const channel = url.replace(/\/$/, "").split('/').pop();
    url = `https://kick.com/${channel}/chatroom`;
  }

  win.loadURL(url);
  scrapers[platform.id] = win;

  // Para YouTube: após carregar a live_chat, força o modo "Live Chat" (todas as mensagens)
  if (platform.type === 'youtube') {
    const switchToLiveChat = () => {
      if (win.isDestroyed()) return;
      const currentUrl = win.webContents.getURL();
      if (!currentUrl.includes('live_chat')) return;

      // Aguarda o YouTube inicializar a UI e então troca para "Live Chat"
      setTimeout(() => {
        if (win.isDestroyed()) return;
        win.webContents.executeJavaScript(`
          (async function() {
            // Pequeno delay para garantir que o dropdown está renderizado
            await new Promise(r => setTimeout(r, 1500));
            
            // Tenta encontrar o botão do menu (Top chat / Principais mensagens)
            const buttons = Array.from(document.querySelectorAll('*'));
            const menuBtn = buttons.find(el => {
              if (el.tagName !== 'DIV' && el.tagName !== 'TP-YT-PAPER-BUTTON' && el.tagName !== 'BUTTON') return false;
              const text = (el.innerText || '').toLowerCase();
              return (text.includes('top chat') || text.includes('principais')) && el.clientHeight > 0;
            });

            if (menuBtn) {
              menuBtn.click();
              await new Promise(r => setTimeout(r, 800)); // Espera o menu abrir
            } else {
              // Fallback para seletores conhecidos
              const fallbackBtn = document.querySelector('#sort-menu, yt-sort-filter-sub-menu-renderer, #primary-content');
              if (fallbackBtn) fallbackBtn.click();
              await new Promise(r => setTimeout(r, 800));
            }

            // Agora procura a opção "Live chat" / "Chat ao vivo"
            const items = document.querySelectorAll('tp-yt-paper-item, yt-formatted-string, paper-item, a, div');
            for (const item of items) {
              const txt = (item.textContent || '').trim().toLowerCase();
              if ((txt === 'live chat' || txt === 'chat ao vivo') && item.clientHeight > 0) {
                item.click();
                console.log('[DriftChat] Forçado modo Live Chat');
                break;
              }
            }
          })()
        `).catch(() => {});
      }, 4000); // 4 segundos para garantir que a UI carregou completamente
    };

    win.webContents.on('did-finish-load', switchToLiveChat);
  }

  win.webContents.on('ipc-message', (event, channel, ...args) => {
    if (channel === 'new-message') {
      const msg = { ...args[0], platform: platform.type, color: platform.color };
      // Envia para AMBOS os overlays
      io.to('overlay1').emit('chat-message', msg);
      io.to('overlay2').emit('chat-message', msg);
      if (mainWindow) mainWindow.webContents.send('preview-message', msg);
    }
  });
}

// API IPC
ipcMain.handle('get-config', () => config);

ipcMain.handle('save-config', (e, newConfig) => {
  config = newConfig;
  config.port = 3000;
  try {
    fs.writeJsonSync(CONFIG_PATH, config);
    // Envia config certa para cada room
    io.to('overlay1').emit('config-update', config.overlay1);
    io.to('overlay2').emit('config-update', config.overlay2);
    return true;
  } catch (err) {
    console.error("Erro ao salvar:", err);
    return false;
  }
});

ipcMain.on('start-all-scrapers', () => {
  config.platforms.forEach(p => { if (p.enabled) startScraper(p); });
});

ipcMain.on('start-single-scraper', (e, platform) => startScraper(platform));
ipcMain.on('stop-single-scraper', (e, id) => {
  if (scrapers[id]) { scrapers[id].destroy(); delete scrapers[id]; }
});
ipcMain.on('stop-all-scrapers', () => {
  Object.keys(scrapers).forEach(id => { scrapers[id].destroy(); delete scrapers[id]; });
});

ipcMain.on('copy-to-clipboard', (e, text) => { clipboard.writeText(text); });
ipcMain.on('open-external', (e, url) => { require('electron').shell.openExternal(url); });

app.whenReady().then(async () => {
  await loadConfig();
  server.listen(config.port, () => {
    console.log(`Servidor rodando em http://localhost:${config.port}`);
  });
  createMainWindow();
  createTray();
});

app.on('window-all-closed', () => { 
  if (process.platform !== 'darwin' && app.isQuiting) app.quit(); 
});
