const { ipcRenderer } = require('electron');

// Força o site a achar que a aba está sempre visível
Object.defineProperty(document, 'visibilityState', { get: () => 'visible' });
Object.defineProperty(document, 'hidden', { get: () => false });
Object.defineProperty(document, 'hasFocus', { get: () => true });
window.addEventListener('visibilitychange', (e) => e.stopImmediatePropagation(), true);

console.log('DriftChat Scraper Ativo: ' + window.location.href);

// Limpeza de Banners e Popups do TikTok (evita que o chat pare de rolar/atualizar)
if (window.location.href.includes('tiktok.com')) {
    setInterval(() => {
        // Tenta remover banners de cookies e login
        const popups = document.querySelectorAll('div[class*="LoginPopup"], div[class*="ConsentBanner"], [data-e2e="login-popup"], div[class*="Toast"]');
        popups.forEach(p => p.remove());
        
        // Tenta clicar no botão de "Não agora" se aparecer
        const notNowBtn = document.querySelector('button[class*="NotNow"], div[class*="CloseButton"], [class*="close-icon"]');
        notNowBtn?.click();
        
        // Detecção de Login
        if (document.body.innerText.includes('Faça login') || document.body.innerText.includes('Entrar para ver') || window.location.href.includes('/login')) {
            ipcRenderer.send('tiktok-login-required');
        }
    }, 5000);
}

const kickAvatarCache = new Map();
const processedIds = new Set();

function isNewMessage(id, isFallback = false) {
  if (!id || processedIds.has(id)) return false;
  processedIds.add(id);
  const timeout = isFallback ? 60 * 1000 : 30 * 60 * 1000;
  setTimeout(() => processedIds.delete(id), timeout);
  return true;
}

function parseMessageContent(msgEl) {
  if (!msgEl) return '';
  let content = '';
  const walker = document.createTreeWalker(msgEl, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      if (node.parentNode && node.parentNode.tagName === 'IMG') return NodeFilter.FILTER_SKIP;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  let cur = walker.nextNode();
  while (cur) {
    if (cur.nodeType === 3) content += cur.textContent;
    else if (cur.nodeType === 1 && cur.tagName === 'IMG') {
      const src = cur.getAttribute('src') || cur.src || '';
      if (src) {
        const alt = cur.getAttribute('alt') || '';
        content += `<img src="${src}" alt="${alt}" title="${alt}" class="chat-emote">`;
      }
    }
    cur = walker.nextNode();
  }
  return content;
}

function processKickEntry(kickEntry) {
  if (!kickEntry) return;
  const authorEl = kickEntry.querySelector('.chat-entry-username, [data-chat-entry-user]');
  const author = authorEl?.innerText?.trim() || authorEl?.textContent?.trim();
  if (!author) return;
  const chatEntry = kickEntry.querySelector('.chat-entry') || kickEntry;
  const entryId = kickEntry.getAttribute('data-chat-entry') || kickEntry.getAttribute('data-index') || '';
  const rawId = `kick-${author}-${entryId}`;
  if (!isNewMessage(rawId, !entryId)) return;
  let message = '';
  const walker = document.createTreeWalker(chatEntry, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      if (node.nodeType === 1) {
        if (node.classList.contains('chat-message-identity')) return NodeFilter.FILTER_REJECT;
        if (node.classList.contains('font-bold') && node.classList.contains('text-white')) return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  let cur = walker.nextNode();
  while (cur) {
    if (cur.nodeType === 3) message += cur.textContent;
    else if (cur.nodeType === 1 && cur.tagName === 'IMG') {
      const src = cur.getAttribute('src') || '';
      if (src) {
        const alt = cur.getAttribute('alt') || cur.getAttribute('data-emote-name') || '';
        message += `<img src="${src}" alt="${alt}" title="${alt}" class="chat-emote">`;
      }
    }
    cur = walker.nextNode();
  }
  message = message.trim();
  if (!message) return;
  const avatarImg = kickEntry.querySelector('img.avatar, img[class*="avatar"]');
  let avatar = avatarImg?.src || kickAvatarCache.get(author) || null;
  ipcRenderer.send('new-message', { author, message, avatar, timestamp: Date.now(), platform: 'kick', rawId, isFallback: !entryId });
}

function processNode(node) {
  if (!node || node.nodeType !== 1) return;
  
  // Se estiver em modo apenas contador, não processa mensagens de chat para evitar mistura de canais
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('unifier_mode') === 'viewer') return;

  const twitchLine = node.classList?.contains('chat-line__message') ? node : node.closest?.('.chat-line__message');
  if (twitchLine) {
    const author = twitchLine.querySelector('.chat-author__display-name, .display-name')?.innerText;
    const msgBody = twitchLine.querySelector('[data-a-target="chat-line-message-body"]');
    const message = parseMessageContent(msgBody);
    if (author && message) {
      const twitchId = twitchLine.getAttribute('data-id') || twitchLine.id;
      const rawId = `twitch-${twitchId || `${author}-${message.substring(0, 40)}`}`;
      if (isNewMessage(rawId, !twitchId)) ipcRenderer.send('new-message', { author, message, avatar: null, timestamp: Date.now(), platform: 'twitch', rawId, isFallback: !twitchId });
    }
    return;
  }
  const ytItem = node.tagName?.startsWith('YT-LIVE-CHAT') ? (node.closest?.('yt-live-chat-text-message-renderer, yt-live-chat-paid-message-renderer') || node) : null;
  if (ytItem && (ytItem.tagName === 'YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER' || ytItem.tagName === 'YT-LIVE-CHAT-PAID-MESSAGE-RENDERER')) {
    const author = ytItem.querySelector('#author-name')?.innerText?.trim();
    const msgEl = ytItem.querySelector('#message');
    const message = parseMessageContent(msgEl);
    if (author && message) {
      const ytId = ytItem.getAttribute('data-id') || ytItem.id;
      const rawId = 'yt-' + (ytId || `${author}-${message.substring(0, 40)}`);
      if (isNewMessage(rawId, !ytId)) ipcRenderer.send('new-message', { author, message, avatar: ytItem.querySelector('#img')?.src || null, timestamp: Date.now(), platform: 'youtube', rawId, isFallback: !ytId });
    }
    return;
  }
  if (node.hasAttribute?.('data-chat-entry') || node.hasAttribute?.('data-index')) { processKickEntry(node); return; }

  const tiktokMsg = node.getAttribute?.('data-e2e') === 'chat-message' ? node : 
                  node.closest?.('[data-e2e="chat-message"]') ||
                  node.closest?.('div[class*="ChatMessage"]') ||
                  node.closest?.('div[class*="ChatItem"]') ||
                  node.closest?.('div[class*="ChatLine"]');

  if (tiktokMsg) {
    const authorEl = tiktokMsg.querySelector('[data-e2e="message-owner-name"], [data-e2e="chat-message-user-name"], span[class*="Username"], span[class*="Nickname"]');
    const msgEl = tiktokMsg.querySelector('.w-full.break-words.align-middle, [data-e2e="chat-message-text"], span[class*="MessageText"], span[class*="ChatContent"]');
    const author = authorEl?.innerText?.replace(':', '').trim();
    const message = parseMessageContent(msgEl);
    if (author && message) {
      const rawId = `tiktok-${author}-${message.substring(0, 40)}`;
      if (isNewMessage(rawId, true)) ipcRenderer.send('new-message', { author, message, avatar: tiktokMsg.querySelector('img')?.src || null, timestamp: Date.now(), platform: 'tiktok', rawId, isFallback: true });
    }
  }
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType !== 1) continue;
      processNode(node);
      
      // "Raio-X": Captura mensagens que venham dentro de containers (essencial para Twitch/YT/TikTok)
      node.querySelectorAll?.('.chat-line__message, yt-live-chat-text-message-renderer, yt-live-chat-paid-message-renderer, [data-chat-entry], .chat-entry, [data-index], [data-e2e="chat-message"], div[class*="ChatMessage"], div[class*="ChatItem"]')
          .forEach(child => processNode(child));
    }
  }
});

function initChatObserver() {
    if (!document.body) { setTimeout(initChatObserver, 500); return; }
    observer.observe(document.body, { childList: true, subtree: true });
}
initChatObserver();

// ─── MONITOR DE ESPECTADORES ───────────────────────────
// ─── MONITOR DE ESPECTADORES ───────────────────────────
const fetchViewers = async () => {
  let count = '0';
  let platform = '';
  try {
    if (window.location.href.includes('tiktok.com')) {
        console.log("[Scraper tiktok] Iniciando ciclo de atualização...");
    }
    const urlParams = new URLSearchParams(window.location.search);
    const unifierKey = urlParams.get('unifier_platform');
    
    // Função auxiliar para extrair apenas o número e sufixos K/M
    const extractCount = (text) => {
        if (!text) return null;
        // Regex para capturar padrões como "1.2K", "500", "1,5M", "10.000"
        const match = text.match(/(\d+[.,]?\d*[KkMm]?)/);
        return match ? match[1] : null;
    };

    if (window.location.href.includes('twitch.tv')) {
      platform = 'twitch';
      const m = window.location.pathname.match(/\/popout\/([^/]+)\/chat/) || window.location.pathname.match(/^\/([^/]+)/);
      if (m && m[1] && !['directory', 'search', 'p', 'settings', 'moderator'].includes(m[1].toLowerCase())) {
        try {
          const res = await fetch('https://gql.twitch.tv/gql', {
            method: 'POST',
            headers: { 'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko' },
            body: JSON.stringify({ query: `query { user(login: "${m[1]}") { stream { viewersCount } } }` })
          });
          const json = await res.json();
          if (json?.data?.user?.stream) count = String(json.data.user.stream.viewersCount);
        } catch(e) {}
      }
      // Fallback apenas se o GQL falhar e não for popout (onde o DOM não tem o contador)
      if ((!count || count === '0') && !window.location.href.includes('/popout/')) {
        const viewerEl = document.querySelector('p[data-a-target*="count"], strong[data-a-target="viewer-count"], .channel-viewers-count');
        if (viewerEl) count = extractCount(viewerEl.innerText);
      }
    } else if (window.location.href.includes('youtube.com')) {
      // Se a URL contém /shorts/ ou a chave é 'shorts', define como shorts
      const isShortsPage = window.location.href.includes('/shorts/');
      platform = (isShortsPage || unifierKey === 'shorts') ? 'shorts' : 'youtube';
      
      let v = urlParams.get('v');
      if (!v) { const pathMatch = window.location.pathname.match(/\/(live|shorts)\/([^/]+)/); if (pathMatch) v = pathMatch[2]; }
      
      if (v && !isShortsPage) {
        try {
          const res = await fetch('https://www.youtube.com/youtubei/v1/updated_metadata?prettyPrint=false', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ videoId: v, context: { client: { clientName: 'WEB', clientVersion: '2.20240101.00.00' } } })
          });
          const json = await res.json();
          const actions = json.actions || [];
          actions.forEach(a => {
            const renderer = a.updateViewershipAction?.viewCount?.videoViewCountRenderer;
            if (renderer?.originalViewCount) count = renderer.originalViewCount;
            else if (renderer?.viewCount?.simpleText) count = extractCount(renderer.viewCount.simpleText);
          });
        } catch(e) {}
      }
      
      if (!count || count === '0') {
        const el = document.querySelector('.viewers-count, #view-count, span[dir="auto"], .ytd-video-view-count-renderer, yt-formatted-string.ytd-video-view-count-renderer, [aria-label*="viewers"], [aria-label*="espectadores"]');
        if (el) count = extractCount(el.innerText || el.getAttribute('aria-label'));
      }
    } else if (window.location.href.includes('kick.com')) {
      platform = 'kick';
      const m = window.location.pathname.match(/^\/([^/]+)/);
      if (m && m[1] && !['categories', 'video', 'search'].includes(m[1].toLowerCase())) {
        const el = document.querySelector('[class*="viewer-count"], [data-testid="viewer-count"], .viewers-count, [class*="viewerCount"], [class*="channel-viewer-count"]');
        if (el) count = extractCount(el.innerText);
        
        if (!count || count === '0') {
          try {
            const res = await fetch(`https://kick.com/api/v2/channels/${m[1].split('?')[0]}`);
            if (res.ok) { const json = await res.json(); count = String(json?.livestream?.viewer_count || '0'); }
          } catch(e) {}
        }
      }
    } else if (window.location.href.includes('tiktok.com')) {
      platform = 'tiktok';
      
      const jaRecarregou = sessionStorage.getItem('_tt_reloaded') === '1';
      
      if (!jaRecarregou) {
        // PASSO 1: Recarrega a página para garantir dados frescos do servidor
        console.log('[Scraper tiktok] Recarregando para dados atualizados...');
        sessionStorage.setItem('_tt_reloaded', '1');
        location.reload();
        await new Promise(r => setTimeout(r, 999999)); // Aguarda o reload acontecer
      }
      
      // PASSO 2: Página fresca carregada — captura o contador
      sessionStorage.removeItem('_tt_reloaded'); // Reseta para o próximo ciclo recarregar
      console.log('[Scraper tiktok] Página fresca. Capturando viewers...');
      
      count = await new Promise((resolve) => {
        let attempts = 0;
        const poll = setInterval(() => {
          attempts++;
          try {
            let el = document.querySelector('[data-e2e="live-people-count"]');
            if (!el) el = document.querySelector('.P4-Regular.text-UIText3');

            let found = null;
            if (el) {
              const spans = el.querySelectorAll('span.inline-flex, span[class*="w-"]');
              if (spans.length > 0) {
                const digits = Array.from(spans).map(s => s.innerText.trim()).filter(t => /^\d+$/.test(t)).join('');
                if (digits) found = digits;
              }
              if (!found) {
                const val = (el.innerText || '').trim().toUpperCase().replace(/[^\d.KM]/g, '');
                if (val.includes('K')) found = String(Math.floor(parseFloat(val) * 1000));
                else if (val.includes('M')) found = String(Math.floor(parseFloat(val) * 1000000));
                else found = val.replace(/\D/g, '');
              }
            }

            if (found && found !== '0' && found.length > 0) {
              console.log(`[Scraper tiktok] ✓ Viewers: ${found} (tentativa ${attempts})`);
              clearInterval(poll);
              resolve(found);
            }
          } catch(e) { /* silencioso */ }

          if (attempts >= 20) {
            console.log('[Scraper tiktok] Timeout. Próximo ciclo tentará novamente...');
            clearInterval(poll);
            resolve(null);
          }
        }, 1000);
      });
    }

    const key = unifierKey || window._platformKey || platform;
    // Força a plataforma a ser igual à chave para respeitar o ícone do campo de cadastro
    platform = key;
    
    // Proteção Anti-Flicker: Se o valor for 0 mas já tivemos um valor alto antes, ignora o 0 por 3 ciclos
    if ((!count || count === '0')) {
        window._zeroCountAttempts = (window._zeroCountAttempts || 0) + 1;
        if (window._zeroCountAttempts < 3 && window._lastValidCount) {
            count = window._lastValidCount;
        }
    } else {
        window._zeroCountAttempts = 0;
        window._lastValidCount = count;
    }

    if (platform && count && count !== '0') {
      ipcRenderer.send('viewer-count', { platform, key, count });
    }
  } catch(e) {
    console.error(`[Scraper ${window._platformKey || 'unknown'}] Erro na captura:`, e);
  }
};

const runLoop = () => { fetchViewers(); setTimeout(runLoop, (window._viewerInterval || 30) * 1000); };
// Tenta iniciar no milésimo zero assim que o corpo da página estiver disponível
const checkBody = setInterval(() => {
    if (document.body) {
        clearInterval(checkBody);
        setTimeout(runLoop, 500);
    }
}, 100);
