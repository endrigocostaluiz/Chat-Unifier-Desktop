const { ipcRenderer } = require('electron');

// Força o site a achar que a aba está sempre visível e em foco (Bypass de background throttling)
Object.defineProperty(document, 'visibilityState', { get: () => 'visible' });
Object.defineProperty(document, 'hidden', { get: () => false });
Object.defineProperty(document, 'hasFocus', { get: () => true });
window.addEventListener('visibilitychange', (e) => e.stopImmediatePropagation(), true);

window.addEventListener('DOMContentLoaded', () => {
  console.log('DriftChat Scraper Ativo: ' + window.location.href);

  const kickAvatarCache = new Map();
  const processedIds = new Set();

  // Extrai texto e emotes de um elemento usando TreeWalker
  // O filtro de aceitação garante que não entramos dentro de <img>
  function parseMessageContent(msgEl) {
    if (!msgEl) return '';
    let content = '';

    const walker = document.createTreeWalker(msgEl, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
      acceptNode(node) {
        // Pula os filhos de IMG (não tem filhos úteis)
        if (node.parentNode && node.parentNode.tagName === 'IMG') {
          return NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    let cur = walker.nextNode();
    while (cur) {
      if (cur.nodeType === 3) { // TEXT_NODE
        content += cur.textContent;
      } else if (cur.nodeType === 1 && cur.tagName === 'IMG') {
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

  // Captura e envia uma mensagem do Kick
  function processKickEntry(kickEntry) {
    if (!kickEntry) return;

    // O autor fica em .chat-entry-username (com atributo data-chat-entry-user)
    const authorEl = kickEntry.querySelector('.chat-entry-username, [data-chat-entry-user]');
    const author = authorEl?.innerText?.trim() || authorEl?.textContent?.trim();
    if (!author) return;

    // O container interno com tudo (texto + emotes) é .chat-entry
    const chatEntry = kickEntry.querySelector('.chat-entry') || kickEntry;

    // ID único baseado no atributo data-chat-entry (UUID do Kick)
    const entryId = kickEntry.getAttribute('data-chat-entry') || kickEntry.getAttribute('data-index') || '';
    const rawId = `kick-${author}-${entryId}`;
    if (processedIds.has(rawId)) return;
    processedIds.add(rawId);
    setTimeout(() => processedIds.delete(rawId), 10000);

    // Percorre TODO o .chat-entry com TreeWalker, mas:
    // - REJEITA .chat-message-identity (autor) e seus filhos
    // - REJEITA o span ": " separador (.font-bold.text-white)
    // Assim captura tanto .chat-entry-content (texto) quanto .chat-emote-container (emotes)
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
      if (cur.nodeType === 3) {
        message += cur.textContent;
      } else if (cur.nodeType === 1 && cur.tagName === 'IMG') {
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

    ipcRenderer.send('new-message', { author, message, avatar, timestamp: Date.now(), platform: 'kick' });

    if (!avatar && !kickAvatarCache.has(author)) {
      kickAvatarCache.set(author, '');
      fetch(`https://kick.com/api/v1/channels/${author.toLowerCase()}`)
        .then(r => r.json())
        .then(json => {
          const pic = json?.user?.profile_pic || json?.profile_pic || null;
          if (pic) kickAvatarCache.set(author, pic);
        })
        .catch(() => {});
    }
  }

  function processNode(node) {
    if (!node || node.nodeType !== 1) return;

    // ─── TWITCH ───────────────────────────────────────────
    const twitchLine = node.classList?.contains('chat-line__message') ? node : node.closest?.('.chat-line__message');
    if (twitchLine) {
      const author = twitchLine.querySelector('.chat-author__display-name, .display-name')?.innerText;
      const avatarImg = twitchLine.querySelector('img.tw-image-avatar, img[alt*="avatar"]');
      let avatar = avatarImg?.src || null;
      if (!avatar && author) {
        const loginEl = twitchLine.querySelector('.chat-author__intl-login, .intl-login');
        const login = loginEl?.innerText?.replace(/[()]/g, '').trim() || author.toLowerCase();
        avatar = `https://unavatar.io/twitch/${login}`;
      }
      const msgBody = twitchLine.querySelector('[data-a-target="chat-line-message-body"]');
      const message = parseMessageContent(msgBody);
      if (author && message) {
        const rawId = `twitch-${author}-${message.substring(0, 40)}`;
        if (!processedIds.has(rawId)) {
          processedIds.add(rawId);
          setTimeout(() => processedIds.delete(rawId), 10000);
          ipcRenderer.send('new-message', { author, message, avatar, timestamp: Date.now(), platform: 'twitch' });
        }
      }
      return;
    }

    // ─── YOUTUBE ──────────────────────────────────────────
    const ytItem = (
      node.tagName === 'YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER' ? node :
      node.tagName === 'YT-LIVE-CHAT-PAID-MESSAGE-RENDERER' ? node :
      node.closest?.('yt-live-chat-text-message-renderer') ||
      node.closest?.('yt-live-chat-paid-message-renderer')
    );
    if (ytItem) {
      const author = ytItem.querySelector('#author-name')?.innerText?.trim();
      const msgEl = ytItem.querySelector('#message');
      const message = parseMessageContent(msgEl);
      if (author && message) {
        const rawId = 'yt-' + (ytItem.getAttribute('data-id') || `${author}-${message.substring(0, 40)}`);
        if (!processedIds.has(rawId)) {
          processedIds.add(rawId);
          setTimeout(() => processedIds.delete(rawId), 10000);
          ipcRenderer.send('new-message', {
            author, message,
            avatar: ytItem.querySelector('#img')?.src || null,
            timestamp: Date.now(), platform: 'youtube'
          });
        }
      }
      return;
    }

    // ─── KICK ─────────────────────────────────────────────
    // Na URL /chatroom: cada mensagem é um elemento com [data-chat-entry]
    if (node.hasAttribute?.('data-chat-entry')) {
      processKickEntry(node);
      return;
    }
    // Fallback: container com data-index (página normal do kick.com)
    if (node.hasAttribute?.('data-index')) {
      processKickEntry(node);
      return;
    }
    // Às vezes o MutationObserver pega um nó pai com vários filhos
    const kickEntries = node.querySelectorAll?.('[data-chat-entry], [data-index]');
    if (kickEntries && kickEntries.length > 0) {
      kickEntries.forEach(e => processKickEntry(e));
    }

    // ─── TIKTOK ───────────────────────────────────────────
    const tiktokMsg = (
      node.getAttribute?.('data-e2e') === 'chat-message' ? node : 
      node.closest?.('[data-e2e="chat-message"]') ||
      node.closest?.('div[class*="ChatMessage"]') ||
      node.closest?.('div[class*="ChatItem"]')
    );

    if (tiktokMsg) {
      const authorEl = tiktokMsg.querySelector('[data-e2e="message-owner-name"], [data-e2e="chat-message-user-name"], span[class*="Username"]');
      const author = authorEl?.innerText?.replace(':', '').trim();
      const msgEl = tiktokMsg.querySelector('.w-full.break-words.align-middle, [data-e2e="chat-message-text"], span[class*="MessageText"]');
      const message = parseMessageContent(msgEl);
      
      if (author && message) {
        const rawId = `tiktok-${author}-${message.substring(0, 40)}`;
        if (!processedIds.has(rawId)) {
          processedIds.add(rawId);
          setTimeout(() => processedIds.delete(rawId), 10000);
          
          // Tenta pegar o avatar (geralmente é a única imagem dentro do card de mensagem)
          const avatarImg = tiktokMsg.querySelector('img');
          const avatar = avatarImg?.src || null;
          
          ipcRenderer.send('new-message', { author, message, avatar, timestamp: Date.now(), platform: 'tiktok' });
        }
      }
      return;
    }
  }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== 1) continue;
        processNode(node);
        // "Raio-X": escaneia filhos para capturar mensagens dentro de containers
        node.querySelectorAll?.('.chat-line__message, yt-live-chat-text-message-renderer, yt-live-chat-paid-message-renderer, [data-chat-entry], .chat-entry, [data-index], [data-e2e="chat-message"], div[class*="ChatMessage"]')
          .forEach(child => processNode(child));
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // ─── RESILIÊNCIA TIKTOK ────────────────────────────────
  if (window.location.href.includes('tiktok.com')) {
    // Tenta remover banners de cookies e login que podem bloquear a renderização do chat
    setInterval(() => {
      const popups = document.querySelectorAll('div[class*="LoginPopup"], div[class*="ConsentBanner"], [data-e2e="login-popup"]');
      popups.forEach(p => p.remove());
      
      // Tenta clicar no botão de "Não agora" se aparecer
      const notNowBtn = document.querySelector('button[class*="NotNow"], div[class*="CloseButton"]');
      notNowBtn?.click();
    }, 5000);
  }

  // ─── RESILIÊNCIA YOUTUBE ────────────────────────────────
  if (window.location.href.includes('youtube.com/live_chat')) {
    let lastMessageTime = Date.now();

    // Monitora quando as mensagens chegam para resetar o watchdog
    const originalIpcSend = ipcRenderer.send;
    ipcRenderer.send = function(channel, ...args) {
      if (channel === 'new-message') lastMessageTime = Date.now();
      return originalIpcSend.apply(this, [channel, ...args]);
    };

    // 1. Força o modo "Chat ao vivo" (Live Chat) em vez de "Principais mensagens" (Top Chat)
    setInterval(() => {
      const label = document.querySelector('#label.yt-live-chat-header-renderer');
      if (label && label.innerText.includes('Principais')) {
        console.log('[YouTube] Trocando para Chat ao Vivo...');
        const menuBtn = document.querySelector('#trigger.yt-live-chat-header-renderer');
        menuBtn?.click();
        setTimeout(() => {
          const items = document.querySelectorAll('tp-yt-paper-item.yt-live-chat-text-filter-option-renderer');
          if (items.length > 1) items[1].click(); // O segundo item geralmente é "Chat ao vivo"
        }, 500);
      }
    }, 30000);

    // 2. Garante que o scroll esteja no fundo (evita que o YT pare de renderizar)
    setInterval(() => {
      const container = document.querySelector('#item-list.yt-live-chat-item-list-renderer #items');
      if (container) {
        container.scrollIntoView(false);
        // Tenta clicar no botão de "Novas Mensagens" se ele aparecer
        const skipBtn = document.querySelector('#show-more.yt-live-chat-item-list-renderer button');
        if (skipBtn && window.getComputedStyle(skipBtn).display !== 'none') {
          skipBtn.click();
        }
      }
    }, 10000);

    // 3. Watchdog: Se ficar 2 minutos sem NADA, recarrega a página (trava de segurança)
    setInterval(() => {
      const diff = (Date.now() - lastMessageTime) / 1000;
      if (diff > 120) { // 2 minutos de silêncio absoluto
        console.log('[YouTube] Chat parece travado. Recarregando...');
        window.location.reload();
      }
    }, 60000);
  }
});
