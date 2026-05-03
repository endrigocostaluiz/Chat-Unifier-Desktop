const { app, BrowserWindow, ipcMain, session, clipboard, Tray, Menu } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const http = require('http');
const https = require('https');
const express = require('express');
const { Server } = require('socket.io');

// Força o Chromium a não congelar as janelas que estão fora da tela
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows', 'true');
app.commandLine.appendSwitch('disable-renderer-backgrounding', 'true');
app.commandLine.appendSwitch('disable-background-timer-throttling', 'true');

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
  maxMessages: 5,
  hideMessages: false,
  hideTimeout: 15,
  showChannelName: false,
  channelNameColor: '#ffffff',
  customCSS: ''
});

const defaultViewersConfig = () => ({
  fontColor: '#ffffff',
  fontSize: 18,
  showTotal: true,
  showIcons: true,
  bgColor: '#000000',
  bgOpacity: 85,
  layout: 'default',
  iconColor: '#ffffff',
  iconOriginal: true,
  interval: 30,
  channels: {
    youtube: { url: '', enabled: true },
    shorts: { url: '', enabled: false },
    twitch: { url: '', enabled: true },
    kick: { url: '', enabled: true },
    tiktok: { url: '', enabled: true }
  }
});


let config = {
  platforms: [],
  port: 3000,
  overlay1: defaultOverlay('overlay1'),   // URL principal /chat
  overlay2: defaultOverlay('overlay2'),   // URL monitor /monitor
  overlay2Enabled: false,
  viewersConfig: defaultViewersConfig(),
  viewersEnabled: true,
  lastIgnoredVersion: ''
};

let viewerCounts = {}; // { platformType: count }
const scraperRegistry = new Map(); // webContents.id -> key (ex: 'shorts', 'youtube')
let viewerScrapers = {}; // { platformKey: BrowserWindow }
let viewerCounterStarted = false; // Flag mestre do contador
const chatScraperRegistry = new Map(); // webContents.id -> platformId

const globalProcessedIds = new Set();


// Servidor Express e Socket.io
const serverApp = express();
const server = http.createServer(serverApp);
const io = new Server(server, { cors: { origin: "*" } });

serverApp.use(express.static(path.join(__dirname, 'public/overlay')));

serverApp.get('/chat', (req, res) => res.sendFile(path.join(__dirname, 'public/overlay/index.html')));
serverApp.get('/monitor', (req, res) => res.sendFile(path.join(__dirname, 'public/overlay/index.html')));
serverApp.get('/viewers', (req, res) => res.sendFile(path.join(__dirname, 'public/viewers/index.html')));
serverApp.get('/viewers-monitor', (req, res) => res.sendFile(path.join(__dirname, 'public/viewers-monitor/index.html')));

io.on('connection', (socket) => {
  // O cliente informa qual overlay é ao se conectar
  socket.on('join-room', (room) => {
    socket.join(room);
    if (room === 'overlay1') socket.emit('config-update', config.overlay1);
    if (room === 'overlay2') socket.emit('config-update', config.overlay2);
    if (room === 'viewers') {
      socket.emit('config-update', config.viewersConfig);
      broadcastViewerCounts();
    }
  });

  socket.on('request-viewers-update', () => broadcastViewerCounts());
  socket.on('get-config', () => {
    socket.emit('config-update', config.viewersConfig);
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

async function checkNewVersion(manual = false) {
  const options = {
    hostname: 'api.github.com',
    path: '/repos/endrigocostaluiz/Chat-Unifier-Desktop/releases/latest',
    headers: {
      'User-Agent': 'Chat-Unifier-App'
    }
  };

  https.get(options, (res) => {
    if (res.statusCode !== 200) {
      console.error(`[Update] Erro na API do GitHub: ${res.statusCode}`);
      return;
    }

    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const release = JSON.parse(data);
        if (!release || !release.tag_name) return;

        const remoteVersion = release.tag_name.replace('v', '');
        const currentVersion = app.getVersion();
        
        console.log(`[Update] Versão Atual: ${currentVersion} | Remota: ${remoteVersion}`);

        if (remoteVersion !== currentVersion) {
          // Se for manual, sempre mostra. Se for auto, verifica se não foi ignorada.
          if (manual || config.lastIgnoredVersion !== remoteVersion) {
            if (mainWindow) {
              mainWindow.webContents.send('update-available', {
                version: remoteVersion,
                url: release.html_url,
                body: release.body,
                manual
              });
            }
          }
        } else if (manual) {
           if (mainWindow) mainWindow.webContents.send('update-not-found');
        }
      } catch (e) {
        console.error("[Update] Erro ao processar JSON:", e);
      }
    });
  }).on('error', (err) => {
    console.error("[Update] Erro na requisição:", err);
  });
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
    }
  } catch (err) {
    console.error("Erro ao carregar config:", err);
  }
}

function updateViewerScrapers() {
  if (!config.viewersConfig || !config.viewersConfig.channels) return;
  const vc = config.viewersConfig.channels;
  
  Object.entries(vc).forEach(([key, chan]) => {
    const currentInterval = config.viewersConfig.interval || 30;
    
    if (chan.enabled && chan.url && viewerCounterStarted) {
      // Reinicia apenas se a URL mudou
      if (viewerScrapers[key] && viewerScrapers[key]._url !== chan.url) {
        viewerScrapers[key].destroy();
        delete viewerScrapers[key];
      } else if (viewerScrapers[key] && viewerScrapers[key]._interval !== currentInterval) {
        // Se a URL é a mesma, mas o intervalo mudou, apenas atualiza a variável na página
        viewerScrapers[key]._interval = currentInterval;
        viewerScrapers[key].webContents.executeJavaScript(`window._viewerInterval = ${currentInterval};`).catch(() => {});
      }
      
      if (!viewerScrapers[key]) {
        console.log(`[Viewers] Iniciando scraper para ${key}: ${chan.url} (Intervalo: ${currentInterval}s)`);
        viewerCounts[key] = "..."; // Valor temporário para o ícone aparecer na hora
        startViewerScraper(key, chan.url);
      }
    } else {
      if (viewerScrapers[key]) {
        console.log(`[Viewers] Parando scraper para ${key}`);
        viewerScrapers[key].destroy();
        delete viewerScrapers[key];
      }
    }
  });
  
  // Atualiza imediatamente a UI (para refletir botões ativados/desativados na mesma hora)
  broadcastViewerCounts();
}

function startViewerScraper(key, url) {
  const win = new BrowserWindow({
    show: true,
    x: -10000,
    y: -10000,
    width: 800,
    height: 800,
    skipTaskbar: true,
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

  if (key === 'tiktok') {
    win.webContents.session.webRequest.onBeforeRequest(
      { urls: [
          '*://*.tiktok.com/*.mp4*', 
          '*://*.tiktokv.com/*.mp4*', 
          '*://*.tiktok.com/*.m3u8*',
          '*://*.tiktok.com/*wasm*',
          '*://*.tiktok.com/*worker*',
          '*://*.tiktok.com/*xgplayer*',
          '*://*.tiktok.com/*emscripten*',
          '*://*.byteoversea.com/*',
          '*://*.pstatp.com/*'
        ] 
      },
      (details, callback) => callback({ cancel: true })
    );
  }

  win.webContents.setAudioMuted(true);
  if (key === 'tiktok') {
    win.webContents.setUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1");
  }
  win._url = url;
  win._interval = config.viewersConfig.interval || 30;
  
  let targetUrl = url;
  if (key === 'twitch' && !targetUrl.includes('twitch.tv')) {
    targetUrl = `https://www.twitch.tv/${targetUrl}`;
  } else if (key === 'shorts') {
    if (!targetUrl.includes('youtube.com/shorts/')) {
        const vid = targetUrl.match(/[?&]v=([^&#]+)/) || targetUrl.match(/v\/([^&#]+)/);
        if (vid) targetUrl = `https://www.youtube.com/shorts/${vid[1]}`;
    }
  } else if (key === 'tiktok') {
    let cleanUrl = targetUrl.split('?')[0].replace(/\/$/, '');
    if (!cleanUrl.includes('tiktok.com')) {
      targetUrl = `https://www.tiktok.com/@${cleanUrl.replace('@', '')}/live`;
    } else {
      // Garante que é www e não m.
      targetUrl = cleanUrl.replace('m.tiktok.com', 'www.tiktok.com');
      if (!targetUrl.endsWith('/live')) {
        targetUrl += '/live';
      }
    }
  }
  else if (key === 'kick' && !targetUrl.includes('kick.com')) {
    targetUrl = `https://kick.com/${targetUrl}`;
  }

  // Adiciona a chave na URL para que o scraper saiba quem ele é sem depender de injeção assíncrona
  const separator = targetUrl.includes('?') ? '&' : '?';
  const urlWithKey = targetUrl + `${separator}unifier_platform=${key}&unifier_mode=viewer`;

  win.loadURL(urlWithKey);
  
  win.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[Scraper ${key}] ${message}`);
  });
  
  win.webContents.on('dom-ready', () => {
    win.webContents.executeJavaScript(`window._platformKey = "${key}"; window._viewerInterval = ${win._interval};`).catch(e => console.log(`[Scraper ${key}] Erro ao injetar vars:`, e));
  });

  scraperRegistry.set(win.webContents.id, key);
  viewerScrapers[key] = win;

  const webContentsId = win.webContents.id;
  win.on('closed', () => {
    scraperRegistry.delete(webContentsId);
    delete viewerScrapers[key];
    delete viewerCounts[key];
    broadcastViewerCounts();
  });
}

function broadcastViewerCounts() {
    if (!io) return;
    function parseViewerCount(str) {
      if (!str) return 0;
      let s = String(str).toUpperCase().trim();
      
      // Se tiver K ou M, trata como decimal (ponto ou vírgula vira ponto)
      if (s.includes('K') || s.includes('M')) {
          let multiplier = s.endsWith('K') ? 1000 : (s.endsWith('M') ? 1000000 : 1);
          let numPart = s.replace(/[KM]/g, '').replace(',', '.');
          return Math.floor((parseFloat(numPart) || 0) * multiplier);
      }
      
      // Se não tiver K/M, trata pontos/vírgulas como separadores de milhar
      // Ex: 1.100 -> 1100
      const cleaned = s.replace(/[.,]/g, '').replace(/[^0-9]/g, '');
      return parseInt(cleaned) || 0;
    }

    const counts = {};
    let total = 0;
    const vChannels = (config.viewersConfig && config.viewersConfig.channels) || {};
    const isActive = Object.keys(viewerScrapers).length > 0;

    Object.entries(viewerCounts).forEach(([key, count]) => {
      // Verifica se o canal está habilitado no config usando a chave original (youtube ou shorts)
      if (vChannels[key]?.enabled) {
        const numericCount = parseViewerCount(count);
        if (numericCount > 0 || count === "...") {
            counts[key] = count === "..." ? "..." : numericCount;
            total += numericCount;
        }
      }
    });

    io.to('viewers').emit('viewers-update', { 
      counts, 
      total,
      active: isActive
    });
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
  } else if (platform.type === 'tiktok') {
    // Garante que a URL do TikTok termine em /live para carregar o chat
    if (!url.includes('/live')) {
      url = url.replace(/\/$/, '') + '/live';
    }
    // Caso o usuário tenha colocado apenas @usuario ou algo similar
    if (!url.startsWith('http')) {
      url = 'https://www.tiktok.com/' + (url.startsWith('@') ? url : '@' + url) + '/live';
    }
  }

  const wcId = win.webContents.id;
  chatScraperRegistry.set(wcId, platform.id);

  win.on('closed', () => {
    chatScraperRegistry.delete(wcId);
  });

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

  // O tratamento de mensagens agora é global via ipcMain.on('new-message')
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
    io.to('viewers').emit('config-update', config.viewersConfig);
    // Aplica mudanças nos scrapers de viewers em tempo real
    updateViewerScrapers();
    return true;
  } catch (err) {
    console.error("Erro ao salvar:", err);
    return false;
  }
});

ipcMain.handle('check-for-updates', () => {
  checkNewVersion(true);
  return true;
});

ipcMain.on('ignore-version', (e, version) => {
  config.lastIgnoredVersion = version;
  try {
    fs.writeJsonSync(CONFIG_PATH, config);
  } catch (err) {
    console.error("Erro ao salvar versão ignorada:", err);
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

// Controle INDEPENDENTE do contador de viewers
ipcMain.on('start-viewer-scrapers', () => {
  viewerCounterStarted = true;
  updateViewerScrapers();
});
ipcMain.on('stop-viewer-scrapers', () => {
  viewerCounterStarted = false;
  Object.keys(viewerScrapers).forEach(key => {
    const win = viewerScrapers[key];
    if (win && !win.isDestroyed()) {
      win.destroy();
    }
    delete viewerScrapers[key];
  });
  scraperRegistry.clear();
  viewerCounts = {};
  broadcastViewerCounts();
});

ipcMain.on('viewer-count', (event, data) => {
  // Tenta pegar a chave pelo ID da janela que enviou, senão usa a data enviada
  const senderId = event.sender.id;
  const key = scraperRegistry.get(senderId) || data.key || data.platform;
  
  if (key) {
    viewerCounts[key] = data.count;
    console.log(`[IPC] Viewer Count recebido de ${key}: ${data.count}`);
    broadcastViewerCounts();
  }
});

// Responde a pedidos imediatos de atualização (quando o overlay faz F5)
ipcMain.on('request-viewers-update', () => {
    broadcastViewerCounts();
});


ipcMain.on('copy-to-clipboard', (e, text) => { clipboard.writeText(text); });
ipcMain.on('open-external', (e, url) => { require('electron').shell.openExternal(url); });

// Listener Global para Mensagens (captura de qualquer janela, inclusive viewer scrapers)
ipcMain.on('new-message', (event, msg) => {
  if (msg.rawId) {
    if (globalProcessedIds.has(msg.rawId)) return;
    globalProcessedIds.add(msg.rawId);
    const timeout = msg.isFallback ? 60 * 1000 : 30 * 60 * 1000;
    setTimeout(() => globalProcessedIds.delete(msg.rawId), timeout);
  }
  
  const senderId = event.sender.id;
  const platformId = chatScraperRegistry.get(senderId);
  const platform = config.platforms.find(p => p.id === platformId) || config.platforms.find(p => p.type === msg.platform) || { color: '#666', name: '' };
  
  const finalMsg = {
    ...msg,
    color: platform.color || msg.color || '#fff',
    channelName: platform.name || '',
    timestamp: Date.now()
  };
  
  // Remove campos internos antes de enviar
  delete finalMsg.rawId;
  delete finalMsg.isFallback;
  
  // Envia para overlays e preview
  io.to('overlay1').emit('chat-message', finalMsg);
  io.to('overlay2').emit('chat-message', finalMsg);
  if (mainWindow) mainWindow.webContents.send('preview-message', finalMsg);
});

// Detecção de login do TikTok
ipcMain.on('tiktok-login-required', (event) => {
    // Abre a janela de login se já não houver uma aberta
    const windows = BrowserWindow.getAllWindows();
    const hasLoginWin = windows.some(w => w.getTitle().includes('Login TikTok'));
    if (!hasLoginWin) {
        console.log('[TikTok] Login necessário detectado. Abrindo janela...');
        const win = new BrowserWindow({
            width: 1000,
            height: 800,
            title: "Login TikTok - Chat Unifier",
            autoHideMenuBar: true
        });
        win.loadURL('https://www.tiktok.com/login');
    }
});

ipcMain.on('show-scraper-window', (e, id) => {
  if (scrapers[id] && !scrapers[id].isDestroyed()) {
    scrapers[id].setPosition(100, 100);
    scrapers[id].show();
    scrapers[id].setSkipTaskbar(false);
    scrapers[id].setFocusable(true);
  }
});

ipcMain.on('open-login-window', (e, platform) => {
  if (platform === 'tiktok') {
    const win = new BrowserWindow({
      width: 1000,
      height: 800,
      title: "Login TikTok - Chat Unifier",
      autoHideMenuBar: true
    });
    win.loadURL('https://www.tiktok.com/login');
  }
});

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Quando uma segunda instância tentar abrir, foca na janela principal já existente
    if (mainWindow) {
      if (!mainWindow.isVisible()) mainWindow.show();
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(async () => {
    await loadConfig();
    server.listen(config.port, () => {
      console.log(`Servidor rodando em http://localhost:${config.port}`);
    });
    createMainWindow();
    createTray();
    
    // Verifica atualizações ao iniciar (aguarda 5s para não sobrecarregar o boot)
    setTimeout(() => checkNewVersion(false), 5000);
  });

  app.on('window-all-closed', () => { 
    if (process.platform !== 'darwin' && app.isQuiting) app.quit(); 
  });
}
