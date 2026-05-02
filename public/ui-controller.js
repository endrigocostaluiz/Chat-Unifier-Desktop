const api = window.electronAPI;

let appConfig = {
    platforms: [],
    overlay1: { layout: 'modern', animation: 'slide', showAvatars: true, cardColor: '#1e293b', cardOpacity: 85, bgColor: '#000000', bgOpacity: 0, slowMode: 1, customCSS: '' },
    overlay2: { layout: 'modern', animation: 'slide', showAvatars: true, cardColor: '#1e293b', cardOpacity: 85, bgColor: '#000000', bgOpacity: 85, slowMode: 1, customCSS: '' },
    overlay2Enabled: false,
    lang: 'pt'
};

const elements = {
    platformList: document.getElementById('platform-list'),
    preview: document.getElementById('preview-container'),
    layoutSelect: document.getElementById('select-layout'),
    obsUrl: document.getElementById('obs-url'),
    btnStart: document.getElementById('btn-start'),
    btnStop: document.getElementById('btn-stop'),
    btnCopy: document.getElementById('btn-copy'),
    btnAdd: document.getElementById('btn-add'),
    btnReset: document.getElementById('btn-reset'),
    statusBadge: document.getElementById('status-badge'),
    
    // Modal
    modalAdd: document.getElementById('modal-add'),
    modalCancel: document.getElementById('modal-cancel'),
    modalSave: document.getElementById('modal-save'),
    newType: document.getElementById('new-type'),
    newName: document.getElementById('new-name'),
    newUrl: document.getElementById('new-url'),

    // Search
    searchChannels: document.getElementById('search-channels'),

    // Settings Overlay 1
    customCss: document.getElementById('custom-css'),
    showAvatars: document.getElementById('show-avatars'),
    animationSelect: document.getElementById('select-animation'),
    cardColor: document.getElementById('card-color'),
    cardOpacity: document.getElementById('card-opacity'),
    slowMode: document.getElementById('slow-mode'),
    slowModeVal: document.getElementById('slow-mode-val'),
    bgColor: document.getElementById('bg-color'),
    bgOpacity: document.getElementById('bg-opacity'),
    messageSpacing: document.getElementById('message-spacing'),
    spacingVal: document.getElementById('spacing-val'),
    hideLeftBorder: document.getElementById('hide-left-border'),
    maxMessages: document.getElementById('max-messages'),
    maxMessagesVal: document.getElementById('max-messages-val'),
    hideMessages: document.getElementById('hide-messages'),
    hideTimeout: document.getElementById('hide-timeout'),
    hideTimeoutVal: document.getElementById('hide-timeout-val'),
    hideTimeoutPanel: document.getElementById('hide-timeout-panel'),

    // Monitor (Overlay 2)
    overlay2Enabled: document.getElementById('overlay2-enabled'),
    overlay2Panel: document.getElementById('overlay2-panel'),
    monitorUrl: document.getElementById('monitor-url'),
    btnCopyMonitor: document.getElementById('btn-copy-monitor'),
    m2Layout: document.getElementById('m2-layout'),
    m2Animation: document.getElementById('m2-animation'),
    m2BgColor: document.getElementById('m2-bg-color'),
    m2BgOpacity: document.getElementById('m2-bg-opacity'),
    m2CardColor: document.getElementById('m2-card-color'),
    m2CardOpacity: document.getElementById('m2-card-opacity'),
    m2SlowMode: document.getElementById('m2-slow-mode'),
    m2SlowModeVal: document.getElementById('m2-slow-mode-val'),
    m2ShowAvatars: document.getElementById('m2-show-avatars'),
    m2MessageSpacing: document.getElementById('m2-message-spacing'),
    m2SpacingVal: document.getElementById('m2-spacing-val'),
    m2HideLeftBorder: document.getElementById('m2-hide-left-border'),

    // Viewer Counter
    vBgColor: document.getElementById('v-bg-color'),
    vBgOpacity: document.getElementById('v-bg-opacity'),
    vBgOpacityVal: document.getElementById('v-bg-opacity-val'),
    vFontColor: document.getElementById('v-font-color'),
    vFontSize: document.getElementById('v-font-size'),
    vShowTotal: document.getElementById('v-show-total'),
    vObsUrl: document.getElementById('v-obs-url'),
    vBtnCopy: document.getElementById('v-btn-copy'),
    vPreview: document.getElementById('v-preview-container'),
    vLayoutSelect: document.getElementById('v-layout-select'),
    vIconStyle: document.getElementById('v-icon-style'),
    vInterval: document.getElementById('v-interval'),
    vIntervalVal: document.getElementById('v-interval-val'),
    vSpacing: document.getElementById('v-spacing'),
    vSpacingVal: document.getElementById('v-spacing-val'),
    vYtUrl: document.getElementById('v-yt-url'),
    vYtEnabled: document.getElementById('v-yt-enabled'),
    vShortsUrl: document.getElementById('v-shorts-url'),
    vShortsEnabled: document.getElementById('v-shorts-enabled'),
    vTwUrl: document.getElementById('v-tw-url'),
    vTwEnabled: document.getElementById('v-tw-enabled'),
    vKickUrl: document.getElementById('v-kick-url'),
    vKickEnabled: document.getElementById('v-kick-enabled'),
    vTtUrl: document.getElementById('v-tt-url'),
    vTtEnabled: document.getElementById('v-tt-enabled'),
    tabTitle: document.getElementById('tab-title'),
    // Grupos de botões do header
    chatCtrlBtns: document.getElementById('chat-ctrl-btns'),
    viewerCtrlBtns: document.getElementById('viewer-ctrl-btns'),
    btnStartViewers: document.getElementById('btn-start-viewers'),
    btnStopViewers: document.getElementById('btn-stop-viewers')
};

// Dicionário de Traduções
const i18n = {
    pt: {}, // HTML original já está em PT
    en: {
        "Pesquisar canais...": "Search channels...",
        "Canais do Contador": "Counter Channels",
        "Iniciar Captura": "Start Capture",
        "Parar Captura": "Stop Capture",
        "Canais Ativos": "Active Channels",
        "+ Adicionar": "+ Add",
        "Configurações de Overlay": "Overlay Settings",
        "Estilo Visual": "Visual Style",
        "Animação de Entrada": "Entry Animation",
        "Fundo do Overlay": "Overlay Background",
        "Cor do Fundo": "Color",
        "Opacidade": "Opacity",
        "Estilo das Mensagens": "Message Style",
        "Cor do Card": "Color",
        "Mostrar Fotos de Perfil": "Show Profile Pictures",
        "Ajustes de Layout": "Layout Adjustments",
        "Espaçamento": "Spacing",
        "Ocultar Borda Lateral": "Hide Side Border",
        "Modo Lento (Segundos)": "Slow Mode (Seconds)",
        "Modo Lento (s)": "Slow Mode (s)",
        "Define o intervalo mínimo entre a exibição de cada mensagem.": "Sets the minimum interval between messages.",
        "CSS Customizado": "Custom CSS",
        "URL do OBS (Overlay Principal)": "OBS URL (Main Overlay)",
        "Use esta URL na cena do OBS como Browser Source.": "Use this URL in OBS as a Browser Source.",
        "URL Monitor": "Monitor URL",
        "URL independente para acompanhar os chats no navegador ou como janela extra no OBS.": "Independent URL to monitor chats in browser or as extra OBS window.",
        "Ações de Sistema": "System Actions",
        "Resetar Tudo para o Padrão": "Reset All to Default",
        "Preview em Tempo Real": "Real-time Preview",
        "Intervalo de Verificação": "Polling Interval",
        "Estilo e Layout": "Style and Layout",
        "Layout do Contador": "Counter Layout",
        "Cor do Texto": "Text Color",
        "Cor dos Ícones": "Icon Color",
        "Cores Originais": "Original Colors",
        "Opacidade do Fundo": "Background Opacity",
        "URL do Browser Source (OBS)": "Browser Source URL (OBS)",
        "Padrão (Horizontal)": "Default (Horizontal)",
        "Lista Vertical": "Vertical List",
        "Grid 2x2": "Grid 2x2",
        "Minimalista (Apenas Números)": "Minimalist (Numbers Only)",
        "URL da Live ou Canal": "Live or Channel URL",
        "URL do Shorts": "Shorts URL",
        "Nome do Canal": "Channel Name",
        "Chat Unificado": "Unified Chat",
        "Contador de Views": "Viewer Counter",
        "Apoiar Projeto": "Support Project",
        "Apoie o Projeto (PIX)": "Support the Project",
        "Desenvolvido por": "Developed by",
        "Copiar": "Copy",
        "Moderno (Avatares)": "Modern (Avatars)",
        "Moderno": "Modern",
        "Bubble (Balões)": "Bubble",
        "Cyberpunk (Neon)": "Cyberpunk",
        "Glassmorphism (Vidro)": "Glassmorphism",
        "Card Float (Flutuante)": "Card Float",
        "Dark Slim (Compacto)": "Dark Slim",
        "Retro (8-Bit)": "Retro",
        "Deslizar (Slide)": "Slide",
        "Suave (Fade)": "Fade",
        "Pular (Bounce)": "Bounce",
        "Novo Canal": "New Channel",
        "Plataforma": "Platform",
        "Nome/Apelido": "Name/Nickname",
        "URL do Canal": "Channel URL",
        "Cancelar": "Cancel",
        "Salvar Canal": "Save Channel",
        "Apoie o Projeto": "Support the Project",
        "Chave PIX (E-mail)": "Donation Email",
        "Outras Formas": "Other Ways",
        "Toda ajuda é bem-vinda para manter o projeto ativo e com novas atualizações!": "Any help is welcome to keep the project active and with new updates!"
    }
};

// Guarda o texto original em PT de cada elemento processado
const originalTexts = new Map();

function translateUI(lang) {
    if (!lang) lang = appConfig.lang || 'pt';
    const dict = i18n[lang] || i18n.pt;
    
    document.querySelectorAll('[data-i18n], [data-i18n-placeholder], h2, h3, label, button, option, p, span, input[placeholder]').forEach(el => {
        if (el.closest('.message-item') || el.id === 'status-badge' || el.classList.contains('font-mono')) return;

        // 1. Tradução de Texto
        let textKey = el.getAttribute('data-i18n');
        if (!textKey) {
            textKey = el.textContent.trim();
            if (textKey && el.children.length === 0) {
                el.setAttribute('data-i18n', textKey);
            }
        }
        
        if (textKey && dict[textKey]) {
            if (el.children.length === 0) {
                el.textContent = dict[textKey];
            } else {
                for (let node of el.childNodes) {
                    if (node.nodeType === 3 && node.textContent.trim() === textKey) {
                        node.textContent = dict[textKey];
                        break;
                    }
                }
            }
        } else if (lang === 'pt' && textKey) {
            // Se for PT e não achar no dict, volta pro original guardado no data-i18n
            if (el.children.length === 0) el.textContent = textKey;
        }

        // 2. Tradução de Placeholders
        let placeholderKey = el.getAttribute('data-i18n-placeholder');
        if (!placeholderKey && el.placeholder) {
            placeholderKey = el.placeholder;
            el.setAttribute('data-i18n-placeholder', placeholderKey);
        }
        if (placeholderKey && dict[placeholderKey]) {
            el.placeholder = dict[placeholderKey];
        } else if (lang === 'pt' && placeholderKey) {
            el.placeholder = placeholderKey;
        }
    });

    // Atualiza visual dos botões de idioma na Sidebar
    const btnPt = document.getElementById('lang-pt');
    const btnEn = document.getElementById('lang-en');
    
    if (btnPt && btnEn) {
        if (lang === 'pt') {
            btnPt.classList.add('bg-emerald-500', 'text-black');
            btnPt.classList.remove('text-white/20', 'hover:bg-white/5', 'hover:text-white');
            btnEn.classList.remove('bg-emerald-500', 'text-black');
            btnEn.classList.add('text-white/20', 'hover:bg-white/5', 'hover:text-white');
        } else {
            btnEn.classList.add('bg-emerald-500', 'text-black');
            btnEn.classList.remove('text-white/20', 'hover:bg-white/5', 'hover:text-white');
            btnPt.classList.remove('bg-emerald-500', 'text-black');
            btnPt.classList.add('text-white/20', 'hover:bg-white/5', 'hover:text-white');
        }
    }
}

// Lógica de Fila para o Modo Lento
let messageQueue = [];
let isProcessingQueue = false;

async function processQueue() {
    if (messageQueue.length === 0) {
        isProcessingQueue = false;
        return;
    }

    isProcessingQueue = true;
    const msg = messageQueue.shift();
    renderMessage(msg);

    const config = appConfig.overlay1 || {};
    const delay = (config.slowMode || 0) * 1000;
    if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    processQueue();
}

function renderMessage(msg) {
    const config = appConfig.overlay1 || {};
    const animationClass = config.animation || 'slide';
    const showAvatar = config.showAvatars !== false;
    const maxMsgs = config.maxMessages || 5;
    
    const div = document.createElement('div');
    div.className = `message-item ${animationClass}-in ${msg.platform} preview-msg-fidelity`;
    
    const badges = {
        twitch: 'https://cdn-icons-png.flaticon.com/512/5968/5968819.png',
        youtube: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
        kick: 'https://kick.com/favicon.ico',
        tiktok: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png'
    };
    const badgeUrl = badges[msg.platform] || '';

    // Lógica de Fallback para Avatar
    const avatarHtml = showAvatar ? 
        (msg.avatar ? 
            `<img src="${msg.avatar}" class="avatar" onerror="this.style.display='none'; this.nextSibling.style.display='flex'">` : 
            ''
        ) + `<div class="avatar-placeholder" style="background: ${msg.color || '#444'}; display: ${msg.avatar ? 'none' : 'flex'}">${(msg.author || '?')[0].toUpperCase()}</div>`
        : '';

    div.innerHTML = `
        ${avatarHtml}
        <div class="message-content">
            <div class="author-row">
                <img src="${badgeUrl}" class="platform-badge" style="width:12px; height:12px;">
                <span class="author-name" style="color: ${msg.color || '#fff'}">${msg.author}</span>
            </div>
            <div class="text" style="font-size: 0.85rem; opacity: 0.9;">${msg.message}</div>
        </div>
    `;
    elements.preview.prepend(div);
    
    // Limitador de Mensagens no Preview
    const currentMax = parseInt(config.maxMessages) || 5;
    while (elements.preview.children.length > currentMax) {
        elements.preview.removeChild(elements.preview.lastChild);
    }

    // Auto-ocultar no Preview
    if (config.hideMessages) {
        const timeout = (config.hideTimeout || 15) * 1000;
        setTimeout(() => {
            div.classList.add('out-animation');
            setTimeout(() => {
                if (div.parentNode) div.remove();
            }, 600);
        }, timeout);
    }
}

function formatTime(seconds) {
    if (seconds == 0) return '0s';
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs === 0 ? `${mins}min` : `${mins}min ${secs}s`;
}

// Inicialização
async function init() {
    try {
        const savedConfig = await api.getConfig();
        if (savedConfig) {
            appConfig = {
                ...appConfig,
                ...savedConfig,
                overlay1: { ...appConfig.overlay1, ...(savedConfig.overlay1 || {}) },
                overlay2: { ...appConfig.overlay2, ...(savedConfig.overlay2 || {}) }
            };
        }

        // Aplica o idioma salvo ou padrão
        appConfig.lang = savedConfig?.lang || 'pt';
        translateUI(appConfig.lang);

        // Binda botões de idioma
        const btnPt = document.getElementById('lang-pt');
        const btnEn = document.getElementById('lang-en');
        if (btnPt) btnPt.onclick = () => { appConfig.lang = 'pt'; translateUI('pt'); api.saveConfig(appConfig); };
        if (btnEn) btnEn.onclick = () => { appConfig.lang = 'en'; translateUI('en'); api.saveConfig(appConfig); };

        renderPlatforms();

        const o1 = appConfig.overlay1 || {};
        // Sincronizar UI - Overlay 1
        if (elements.layoutSelect) elements.layoutSelect.value = o1.layout || 'modern';
        if (elements.customCss) elements.customCss.value = o1.customCSS || '';
        if (elements.showAvatars) elements.showAvatars.checked = o1.showAvatars !== false;
        if (elements.animationSelect) elements.animationSelect.value = o1.animation || 'slide';
        if (elements.cardColor) elements.cardColor.value = o1.cardColor || '#1e293b';
        if (elements.cardOpacity) elements.cardOpacity.value = o1.cardOpacity !== undefined ? o1.cardOpacity : 85;
        if (elements.slowMode) elements.slowMode.value = o1.slowMode !== undefined ? o1.slowMode : 1;
        if (elements.slowModeVal) elements.slowModeVal.innerText = `${o1.slowMode !== undefined ? o1.slowMode : 1}s`;
        if (elements.bgColor) elements.bgColor.value = o1.bgColor || '#000000';
        if (elements.bgOpacity) elements.bgOpacity.value = o1.bgOpacity !== undefined ? o1.bgOpacity : 0;
        if (elements.messageSpacing) elements.messageSpacing.value = o1.messageSpacing !== undefined ? o1.messageSpacing : 10;
        if (elements.spacingVal) elements.spacingVal.innerText = `${o1.messageSpacing !== undefined ? o1.messageSpacing : 10}px`;
        if (elements.hideLeftBorder) elements.hideLeftBorder.checked = o1.hideLeftBorder === true;
        if (elements.maxMessages) elements.maxMessages.value = o1.maxMessages !== undefined ? o1.maxMessages : 5;
        if (elements.maxMessagesVal) elements.maxMessagesVal.innerText = `${o1.maxMessages !== undefined ? o1.maxMessages : 5}`;
        if (elements.hideMessages) elements.hideMessages.checked = o1.hideMessages === true;
        if (elements.hideTimeout) elements.hideTimeout.value = o1.hideTimeout !== undefined ? o1.hideTimeout : 15;
        if (elements.hideTimeoutVal) elements.hideTimeoutVal.innerText = formatTime(o1.hideTimeout !== undefined ? o1.hideTimeout : 15);
        if (elements.hideTimeoutPanel) elements.hideTimeoutPanel.classList.toggle('hidden', !o1.hideMessages);

        // Sincronizar UI - Overlay 2
        const o2 = appConfig.overlay2 || {};
        const o2En = appConfig.overlay2Enabled || false;
        if (elements.overlay2Enabled) elements.overlay2Enabled.checked = o2En;
        if (elements.overlay2Panel) elements.overlay2Panel.classList.toggle('hidden', !o2En);
        if (elements.m2Layout) elements.m2Layout.value = o2.layout || 'modern';
        if (elements.m2Animation) elements.m2Animation.value = o2.animation || 'slide';
        if (elements.m2BgColor) elements.m2BgColor.value = o2.bgColor || '#000000';
        if (elements.m2BgOpacity) elements.m2BgOpacity.value = o2.bgOpacity !== undefined ? o2.bgOpacity : 85;
        if (elements.m2CardColor) elements.m2CardColor.value = o2.cardColor || '#1e293b';
        if (elements.m2CardOpacity) elements.m2CardOpacity.value = o2.cardOpacity !== undefined ? o2.cardOpacity : 85;
        if (elements.m2SlowMode) elements.m2SlowMode.value = o2.slowMode !== undefined ? o2.slowMode : 1;
        if (elements.m2SlowModeVal) elements.m2SlowModeVal.innerText = `${o2.slowMode !== undefined ? o2.slowMode : 1}s`;
        if (elements.m2ShowAvatars) elements.m2ShowAvatars.checked = o2.showAvatars !== false;
        if (elements.m2MessageSpacing) elements.m2MessageSpacing.value = o2.messageSpacing !== undefined ? o2.messageSpacing : 10;
        if (elements.m2SpacingVal) elements.m2SpacingVal.innerText = `${o2.messageSpacing !== undefined ? o2.messageSpacing : 10}px`;
        if (elements.m2HideLeftBorder) elements.m2HideLeftBorder.checked = o2.hideLeftBorder === true;

        // Sincronizar UI - Viewers
        const v = appConfig.viewersConfig || {};
        if (elements.vBgColor) elements.vBgColor.value = v.bgColor || '#000000';
        if (elements.vBgOpacity) {
            elements.vBgOpacity.value = v.bgOpacity !== undefined ? v.bgOpacity : 85;
            if (elements.vBgOpacityVal) elements.vBgOpacityVal.innerText = `${elements.vBgOpacity.value}%`;
        }
        if (elements.vFontColor) elements.vFontColor.value = v.fontColor || '#ffffff';
        if (elements.vFontSize) elements.vFontSize.value = v.fontSize || 18;
        if (elements.vShowTotal) elements.vShowTotal.checked = v.showTotal !== false;
        if (elements.vLayoutSelect) elements.vLayoutSelect.value = v.layout || 'default';
        if (elements.vIconStyle) elements.vIconStyle.value = v.iconStyle || 'original';
        
        if (elements.vInterval) {
            elements.vInterval.value = v.interval || 30;
            if (elements.vIntervalVal) elements.vIntervalVal.innerText = `${elements.vInterval.value}s`;
        }

        if (elements.vSpacing) {
            elements.vSpacing.value = v.spacing !== undefined ? v.spacing : 20;
            if (elements.vSpacingVal) elements.vSpacingVal.innerText = `${elements.vSpacing.value}px`;
        }

        // Canais do Contador
        const vc = v.channels || {};
        if (elements.vYtUrl) elements.vYtUrl.value = vc.youtube?.url || '';
        if (elements.vYtEnabled) elements.vYtEnabled.checked = vc.youtube?.enabled !== false;
        if (elements.vShortsUrl) elements.vShortsUrl.value = vc.shorts?.url || '';
        if (elements.vShortsEnabled) elements.vShortsEnabled.checked = vc.shorts?.enabled === true;
        if (elements.vTwUrl) elements.vTwUrl.value = vc.twitch?.url || '';
        if (elements.vTwEnabled) elements.vTwEnabled.checked = vc.twitch?.enabled !== false;
        if (elements.vKickUrl) elements.vKickUrl.value = vc.kick?.url || '';
        if (elements.vKickEnabled) elements.vKickEnabled.checked = vc.kick?.enabled !== false;
        if (elements.vTtUrl) elements.vTtUrl.value = vc.tiktok?.url || '';
        if (elements.vTtEnabled) elements.vTtEnabled.checked = vc.tiktok?.enabled !== false;

        updateObsUrl();
        updatePreviewLayout();
        updateViewersPreview();
    } catch (err) {
        console.error("Erro na inicialização:", err);
    }
}

function updatePreviewLayout() {
    if (!elements.preview) return;
    const layout = elements.layoutSelect.value || 'modern';
    // Removido 'space-y-4' para o 'gap' dinâmico funcionar
    elements.preview.className = `flex-1 flex flex-col card rounded-3xl p-6 min-h-[500px] overflow-y-auto layout-${layout}`;
    
    const bgColor = elements.bgColor.value;
    const bgOpacity = elements.bgOpacity.value / 100;
    const br = parseInt(bgColor.slice(1, 3), 16) || 0;
    const bg = parseInt(bgColor.slice(3, 5), 16) || 0;
    const bb = parseInt(bgColor.slice(5, 7), 16) || 0;
    elements.preview.style.backgroundColor = `rgba(${br}, ${bg}, ${bb}, ${bgOpacity})`;

    const color = elements.cardColor.value;
    const opacity = elements.cardOpacity.value / 100;
    const r = parseInt(color.slice(1, 3), 16) || 30;
    const g = parseInt(color.slice(3, 5), 16) || 41;
    const b = parseInt(color.slice(5, 7), 16) || 59;
    elements.preview.style.setProperty('--card-bg', `rgba(${r}, ${g}, ${b}, ${opacity})`);

    // Espaçamento e Borda no Preview
    const spacing = elements.messageSpacing ? elements.messageSpacing.value : 10;
    elements.preview.style.gap = spacing + 'px';
    
    const hideBorder = elements.hideLeftBorder ? elements.hideLeftBorder.checked : false;
    elements.preview.classList.toggle('hide-borders-preview', hideBorder);

    // Aplicar limite de mensagens imediatamente
    const maxMsgs = elements.maxMessages ? parseInt(elements.maxMessages.value) : 5;
    const currentMessages = Array.from(elements.preview.children);
    if (currentMessages.length > maxMsgs) {
        currentMessages.slice(maxMsgs).forEach(el => el.remove());
    }

    // Aplicar CSS Customizado ao Preview
    const customStyles = document.getElementById('preview-custom-css');
    if (customStyles) {
        customStyles.innerHTML = elements.customCss ? elements.customCss.value : '';
    }
}

function updateViewersPreview() {
    try {
        if (!elements.vPreview) return;
        const vPreviewContent = document.getElementById('v-preview-content');
        if (!vPreviewContent) return;

        const v = appConfig.viewersConfig || {};
        
        const bgColor = (elements.vBgColor && elements.vBgColor.value) ? elements.vBgColor.value : '#000000';
        const bgOpacity = (elements.vBgOpacity && elements.vBgOpacity.value) ? elements.vBgOpacity.value / 100 : 0.85;
        const br = parseInt(bgColor.slice(1, 3), 16) || 0;
        const bg = parseInt(bgColor.slice(3, 5), 16) || 0;
        const bb = parseInt(bgColor.slice(5, 7), 16) || 0;
        
        const fontColor = (elements.vFontColor && elements.vFontColor.value) ? elements.vFontColor.value : '#ffffff';
        const iconStyle = (elements.vIconStyle && elements.vIconStyle.value) ? elements.vIconStyle.value : 'original';
        const layout = (elements.vLayoutSelect && elements.vLayoutSelect.value) ? elements.vLayoutSelect.value : 'default';
        const showTotal = elements.vShowTotal ? elements.vShowTotal.checked : true;

        const getIconStyle = (key) => {
            let filter = '';
            if (iconStyle === 'white') filter = 'filter: brightness(0) invert(1);';
            else if (iconStyle === 'black') filter = 'filter: brightness(0);';
            
            let transform = (key === 'kick' || key === 'shorts') ? 'transform: scale(0.8);' : '';
            if (filter || transform) return `style="${filter} ${transform}"`;
            return '';
        };

        const spacing = elements.vSpacing ? elements.vSpacing.value : 20;
        let containerClass = "flex items-center p-4 rounded-xl transition-all";
        let containerStyle = `background: rgba(${br}, ${bg}, ${bb}, ${bgOpacity}); color: ${fontColor}; gap: ${spacing}px;`;
        
        if (layout === 'vertical') {
            containerClass = "flex flex-col p-6 rounded-2xl transition-all items-start";
        } else if (layout === 'grid') {
            containerClass = "grid grid-cols-2 p-6 rounded-2xl transition-all";
        } else if (layout === 'minimalist') {
            containerClass = "flex items-center p-2 rounded-lg transition-all";
        }

        const ch = v.channels || {};
        const platforms = [
            { key: 'youtube', icon: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png', count: '38K', enabled: ch.youtube?.enabled !== false },
            { key: 'shorts', icon: 'https://cdn.simpleicons.org/youtubeshorts/FF0000', count: '8K', enabled: ch.shorts?.enabled !== false },
            { key: 'twitch', icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968819.png', count: '5.2K', enabled: ch.twitch?.enabled !== false },
            { key: 'kick', icon: 'https://cdn.simpleicons.org/kick/53FC18', count: '1.4K', enabled: ch.kick?.enabled !== false },
            { key: 'tiktok', icon: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png', count: '12K', enabled: ch.tiktok?.enabled !== false }
        ];

        const activePlatforms = platforms.filter(p => p.enabled);

        let statsHtml = activePlatforms.map(p => `
            <div class="flex items-center gap-2">
                <img src="${p.icon}" class="w-6 h-6 object-contain" ${getIconStyle(p.key)}>
                <span class="font-black text-lg" style="color: ${fontColor}">${p.count}</span>
            </div>
        `).join('');

        vPreviewContent.innerHTML = `
            <div class="w-full flex flex-col items-center gap-3">
                <div class="${containerClass}" style="${containerStyle}">
                    ${statsHtml}
                    ${showTotal && layout !== 'minimalist' && activePlatforms.length > 1 ? `
                    <div class="${layout === 'vertical' || layout === 'grid' ? 'pt-2 border-t w-full' : 'pl-4 border-l'} border-white/10 flex items-center gap-2">
                        <span class="text-[9px] uppercase opacity-40 font-black tracking-widest">Total</span>
                        <span class="font-black text-lg">56.6K</span>
                    </div>
                    ` : ''}
                </div>
                <span class="text-[9px] text-white/30 uppercase tracking-widest font-bold bg-black/50 px-3 py-1 rounded-full border border-white/5" data-i18n="* Números Fictícios para Preview">* Números Fictícios para Preview</span>
            </div>
        `;
    } catch (err) {
        console.error("Erro ao atualizar o preview de viewers:", err);
    }
}

function renderPlatforms(filter = '') {
    if (!elements.platformList) return;
    elements.platformList.innerHTML = '';
    const query = filter.toLowerCase();

    appConfig.platforms.forEach((p, index) => {
        const name = p.name || p.type.charAt(0).toUpperCase() + p.type.slice(1);
        const url = p.url || '';
        if (filter && !name.toLowerCase().includes(query) && !url.toLowerCase().includes(query)) return;

        const div = document.createElement('div');
        div.className = 'card p-4 rounded-2xl flex items-center justify-between group';
        div.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="w-1.5 h-8 rounded-full" style="background: ${getPlatformColor(p.type)}"></div>
                <div class="overflow-hidden">
                    <p class="text-xs font-black truncate w-40 text-white">${name}</p>
                    <p class="text-[9px] opacity-30 truncate w-40 font-mono">${url}</p>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <button onclick="showScraper('${p.id}')" title="Debug: Mostrar Janela" class="opacity-0 group-hover:opacity-100 text-white/20 hover:text-blue-400 transition p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" ${p.enabled ? 'checked' : ''} onchange="togglePlatform(${index})" class="sr-only peer">
                    <div class="w-8 h-4 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
                <button onclick="removePlatform(${index})" class="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-500 transition p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
            </div>
        `;
        elements.platformList.appendChild(div);
    });
}

function getPlatformColor(type) {
    if (type === 'twitch') return '#9146ff';
    if (type === 'youtube') return '#ff0000';
    if (type === 'kick') return '#53fc18';
    if (type === 'tiktok') return '#ff0050';
    return '#ccc';
}

function updateObsUrl() {
    if (elements.obsUrl) elements.obsUrl.value = `http://localhost:3000/chat`;
}

// Eventos
if (elements.btnStart) {
    elements.btnStart.onclick = () => {
        api.startAll();
        elements.btnStart.classList.add('hidden');
        elements.btnStop.classList.remove('hidden');
        elements.statusBadge.innerText = 'CONECTADO';
        elements.statusBadge.classList.replace('bg-white/5', 'bg-emerald-500/10');
        elements.statusBadge.classList.replace('text-white/40', 'text-emerald-500');
    };
}

if (elements.btnStop) {
    elements.btnStop.onclick = () => {
        api.stopAll();
        elements.btnStop.classList.add('hidden');
        elements.btnStart.classList.remove('hidden');
        elements.statusBadge.innerText = 'DESCONECTADO';
        elements.statusBadge.classList.replace('bg-emerald-500/10', 'bg-white/5');
        elements.statusBadge.classList.replace('text-emerald-500', 'text-white/40');
    };
}

if (elements.btnAdd) elements.btnAdd.onclick = () => elements.modalAdd.classList.remove('hidden');
if (elements.modalCancel) elements.modalCancel.onclick = () => elements.modalAdd.classList.add('hidden');

if (elements.modalSave) {
    elements.modalSave.onclick = async () => {
        const type = elements.newType.value;
        let name = elements.newName.value.trim();
        const url = elements.newUrl.value.trim();
        if (!url) return;
        if (!name) name = type.charAt(0).toUpperCase() + type.slice(1);

        const platform = { id: Date.now().toString(), type, name, url, enabled: true, color: getPlatformColor(type) };
        appConfig.platforms.push(platform);
        await api.saveConfig(appConfig);
        renderPlatforms(elements.searchChannels.value);
        
        if (type === 'tiktok' && !appConfig.hasLoggedTikTok) {
            alert('Você adicionou o TikTok pela primeira vez!\n\nPara que o aplicativo consiga ler o chat, uma janela será aberta agora. Faça o seu login no TikTok e, depois de concluído, você pode fechar essa nova janela.');
            api.openLoginWindow('tiktok');
            appConfig.hasLoggedTikTok = true;
            await api.saveConfig(appConfig);
        }

        if (elements.statusBadge.innerText === 'CONECTADO') api.startSingle(platform);
        elements.modalAdd.classList.add('hidden');
        elements.newUrl.value = '';
        elements.newName.value = '';
    };
}

if (elements.searchChannels) elements.searchChannels.oninput = (e) => renderPlatforms(e.target.value);

window.togglePlatform = async (index) => {
    const platform = appConfig.platforms[index];
    platform.enabled = !platform.enabled;
    await api.saveConfig(appConfig);
    if (elements.statusBadge.innerText === 'CONECTADO') {
        if (platform.enabled) api.startSingle(platform); else api.stopSingle(platform.id);
    }
    renderPlatforms(elements.searchChannels.value);
    saveAndUpdate();
};

window.showScraper = (id) => {
    api.showScraper(id);
};

window.removePlatform = async (index) => {
    const platform = appConfig.platforms[index];
    api.stopSingle(platform.id);
    appConfig.platforms.splice(index, 1);
    await api.saveConfig(appConfig);
    renderPlatforms();
};

const saveAndUpdate = async () => {
    // Atualiza o preview IMEDIATAMENTE para feedback em tempo real
    updatePreviewLayout();

    appConfig.overlay1 = {
        layout: elements.layoutSelect ? elements.layoutSelect.value : 'modern',
        customCSS: elements.customCss ? elements.customCss.value : '',
        showAvatars: elements.showAvatars ? elements.showAvatars.checked : true,
        animation: elements.animationSelect ? elements.animationSelect.value : 'slide',
        cardColor: elements.cardColor ? elements.cardColor.value : '#1e293b',
        cardOpacity: elements.cardOpacity ? elements.cardOpacity.value : 85,
        slowMode: elements.slowMode ? parseFloat(elements.slowMode.value) : 1,
        bgColor: elements.bgColor ? elements.bgColor.value : '#000000',
        bgOpacity: elements.bgOpacity ? elements.bgOpacity.value : 0,
        messageSpacing: elements.messageSpacing ? parseInt(elements.messageSpacing.value) : 10,
        hideLeftBorder: elements.hideLeftBorder ? elements.hideLeftBorder.checked : false,
        maxMessages: elements.maxMessages ? parseInt(elements.maxMessages.value) : 5,
        hideMessages: elements.hideMessages ? elements.hideMessages.checked : false,
        hideTimeout: elements.hideTimeout ? parseInt(elements.hideTimeout.value) : 15
    };
    if (elements.maxMessagesVal) elements.maxMessagesVal.innerText = `${appConfig.overlay1.maxMessages}`;
    if (elements.hideTimeoutVal) elements.hideTimeoutVal.innerText = formatTime(appConfig.overlay1.hideTimeout);
    if (elements.hideTimeoutPanel) elements.hideTimeoutPanel.classList.toggle('hidden', !appConfig.overlay1.hideMessages);
    if (elements.slowModeVal) elements.slowModeVal.innerText = `${appConfig.overlay1.slowMode}s`;
    if (elements.spacingVal) elements.spacingVal.innerText = `${appConfig.overlay1.messageSpacing}px`;
    
    await api.saveConfig(appConfig);
};

const saveAndUpdateMonitor = async () => {
    appConfig.overlay2 = {
        layout: elements.m2Layout ? elements.m2Layout.value : 'modern',
        animation: elements.m2Animation ? elements.m2Animation.value : 'slide',
        bgColor: elements.m2BgColor ? elements.m2BgColor.value : '#000000',
        bgOpacity: elements.m2BgOpacity ? elements.m2BgOpacity.value : 85,
        cardColor: elements.m2CardColor ? elements.m2CardColor.value : '#1e293b',
        cardOpacity: elements.m2CardOpacity ? elements.m2CardOpacity.value : 85,
        slowMode: elements.m2SlowMode ? parseFloat(elements.m2SlowMode.value) : 1,
        showAvatars: elements.m2ShowAvatars ? elements.m2ShowAvatars.checked : true,
        messageSpacing: elements.m2MessageSpacing ? parseInt(elements.m2MessageSpacing.value) : 10,
        hideLeftBorder: elements.m2HideLeftBorder ? elements.m2HideLeftBorder.checked : false,
        customCSS: ''
    };
    if (elements.m2SlowModeVal) elements.m2SlowModeVal.innerText = `${appConfig.overlay2.slowMode}s`;
    if (elements.m2SpacingVal) elements.m2SpacingVal.innerText = `${appConfig.overlay2.messageSpacing}px`;
    await api.saveConfig(appConfig);
};

const saveAndUpdateViewers = async () => {
    appConfig.viewersConfig = {
        bgColor: elements.vBgColor ? elements.vBgColor.value : '#000000',
        bgOpacity: elements.vBgOpacity ? parseInt(elements.vBgOpacity.value) : 85,
        fontColor: elements.vFontColor ? elements.vFontColor.value : '#ffffff',
        fontSize: elements.vFontSize ? parseInt(elements.vFontSize.value) : 18,
        showTotal: elements.vShowTotal ? elements.vShowTotal.checked : true,
        layout: elements.vLayoutSelect ? elements.vLayoutSelect.value : 'default',
        iconStyle: elements.vIconStyle ? elements.vIconStyle.value : 'original',
        interval: elements.vInterval ? parseInt(elements.vInterval.value) : 30,
        spacing: elements.vSpacing ? parseInt(elements.vSpacing.value) : 20,
        channels: {
            youtube: { url: elements.vYtUrl?.value || '', enabled: elements.vYtEnabled?.checked === true },
            shorts: { url: elements.vShortsUrl?.value || '', enabled: elements.vShortsEnabled?.checked === true },
            twitch: { url: elements.vTwUrl?.value || '', enabled: elements.vTwEnabled?.checked === true },
            kick: { url: elements.vKickUrl?.value || '', enabled: elements.vKickEnabled?.checked === true },
            tiktok: { url: elements.vTtUrl?.value || '', enabled: elements.vTtEnabled?.checked === true }
        }
    };
    if (elements.vBgOpacityVal) elements.vBgOpacityVal.innerText = `${appConfig.viewersConfig.bgOpacity}%`;
    if (elements.vIntervalVal) elements.vIntervalVal.innerText = `${appConfig.viewersConfig.interval}s`;
    if (elements.vSpacingVal) elements.vSpacingVal.innerText = `${appConfig.viewersConfig.spacing}px`;
    
    updateViewersPreview();
    await api.saveConfig(appConfig);
};

// Bind Events - Overlay 1
if (elements.layoutSelect) elements.layoutSelect.onchange = saveAndUpdate;
if (elements.customCss) elements.customCss.oninput = saveAndUpdate;
if (elements.showAvatars) elements.showAvatars.onchange = saveAndUpdate;
if (elements.animationSelect) elements.animationSelect.onchange = saveAndUpdate;
if (elements.cardColor) elements.cardColor.oninput = saveAndUpdate;
if (elements.cardOpacity) elements.cardOpacity.oninput = saveAndUpdate;
if (elements.slowMode) elements.slowMode.oninput = saveAndUpdate;
if (elements.bgColor) elements.bgColor.oninput = saveAndUpdate;
if (elements.bgOpacity) elements.bgOpacity.oninput = saveAndUpdate;
if (elements.messageSpacing) elements.messageSpacing.oninput = saveAndUpdate;
if (elements.hideLeftBorder) elements.hideLeftBorder.onchange = saveAndUpdate;
if (elements.maxMessages) elements.maxMessages.oninput = saveAndUpdate;
if (elements.hideMessages) elements.hideMessages.onchange = saveAndUpdate;
if (elements.hideTimeout) elements.hideTimeout.oninput = saveAndUpdate;

// Bind Events - Monitor (Overlay 2)
if (elements.overlay2Enabled) {
    elements.overlay2Enabled.onchange = async () => {
        appConfig.overlay2Enabled = elements.overlay2Enabled.checked;
        elements.overlay2Panel.classList.toggle('hidden', !appConfig.overlay2Enabled);
        await api.saveConfig(appConfig);
    };
}
if (elements.m2Layout) elements.m2Layout.onchange = saveAndUpdateMonitor;
if (elements.m2Animation) elements.m2Animation.onchange = saveAndUpdateMonitor;
if (elements.m2BgColor) elements.m2BgColor.oninput = saveAndUpdateMonitor;
if (elements.m2BgOpacity) elements.m2BgOpacity.oninput = saveAndUpdateMonitor;
if (elements.m2CardColor) elements.m2CardColor.oninput = saveAndUpdateMonitor;
if (elements.m2CardOpacity) elements.m2CardOpacity.oninput = saveAndUpdateMonitor;
if (elements.m2SlowMode) elements.m2SlowMode.oninput = saveAndUpdateMonitor;
if (elements.m2ShowAvatars) elements.m2ShowAvatars.onchange = saveAndUpdateMonitor;
if (elements.m2MessageSpacing) elements.m2MessageSpacing.oninput = saveAndUpdateMonitor;
if (elements.m2HideLeftBorder) elements.m2HideLeftBorder.onchange = saveAndUpdateMonitor;

if (elements.btnCopy) {
    elements.btnCopy.onclick = () => {
        api.copyText(elements.obsUrl.value);
        const orig = elements.btnCopy.innerText;
        elements.btnCopy.innerText = 'Copiado!';
        setTimeout(() => elements.btnCopy.innerText = orig, 2000);
    };
}

if (elements.btnCopyMonitor) {
    elements.btnCopyMonitor.onclick = () => {
        api.copyText(elements.monitorUrl.value);
        const orig = elements.btnCopyMonitor.innerText;
        elements.btnCopyMonitor.innerText = 'Copiado!';
        setTimeout(() => elements.btnCopyMonitor.innerText = orig, 2000);
    };
}

if (elements.btnReset) {
    elements.btnReset.onclick = async () => {
        if (!confirm("Resetar todos os estilos para o padrão?")) return;
        appConfig.overlay1 = { layout: 'modern', animation: 'slide', showAvatars: true, cardColor: '#1e293b', cardOpacity: 85, bgColor: '#000000', bgOpacity: 0, slowMode: 1, customCSS: '' };
        appConfig.overlay2 = { layout: 'modern', animation: 'slide', showAvatars: true, cardColor: '#1e293b', cardOpacity: 85, bgColor: '#000000', bgOpacity: 85, slowMode: 1, customCSS: '' };
        appConfig.viewersConfig = { fontColor: '#ffffff', fontSize: 18, showTotal: true, showIcons: true, bgColor: '#000000', bgOpacity: 85, spacing: 20 };
        await api.saveConfig(appConfig);
        await init();
    };
}

// Lógica de Abas
document.querySelectorAll('.sidebar-item').forEach(item => {
    item.onclick = () => {
        const tab = item.getAttribute('data-tab');
        
        // UI Sidebar
        document.querySelectorAll('.sidebar-item').forEach(i => {
            i.classList.remove('active', 'opacity-100');
            i.classList.add('opacity-40', 'hover:bg-white/5');
        });
        item.classList.add('active', 'opacity-100');
        item.classList.remove('opacity-40', 'hover:bg-white/5');

        // UI Content
        document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
        document.getElementById('tab-' + tab).classList.remove('hidden');

        // Troca os botões do header conforme a aba ativa
        if (elements.chatCtrlBtns && elements.viewerCtrlBtns) {
            if (tab === 'viewers') {
                elements.chatCtrlBtns.classList.add('hidden');
                elements.viewerCtrlBtns.classList.remove('hidden');
            } else {
                elements.chatCtrlBtns.classList.remove('hidden');
                elements.viewerCtrlBtns.classList.add('hidden');
            }
        }

        // Title
        if (elements.tabTitle) {
            const tabName = item.querySelector('div').innerText;
            elements.tabTitle.setAttribute('data-i18n', tabName);
            elements.tabTitle.innerText = tabName;
            translateUI(appConfig.lang);
        }
    };
});

// Botões independentes do Contador de Views
if (elements.btnStartViewers) {
    elements.btnStartViewers.onclick = () => {
        api.startViewers();
        elements.btnStartViewers.classList.add('hidden');
        elements.btnStopViewers.classList.remove('hidden');
    };
}
if (elements.btnStopViewers) {
    elements.btnStopViewers.onclick = () => {
        api.stopViewers();
        elements.btnStopViewers.classList.add('hidden');
        elements.btnStartViewers.classList.remove('hidden');
    };
}

// Bind Events - Viewers
if (elements.vBgColor) elements.vBgColor.oninput = saveAndUpdateViewers;
if (elements.vBgOpacity) elements.vBgOpacity.oninput = saveAndUpdateViewers;
if (elements.vFontColor) elements.vFontColor.oninput = saveAndUpdateViewers;
if (elements.vFontSize) elements.vFontSize.oninput = saveAndUpdateViewers;
if (elements.vShowTotal) elements.vShowTotal.onchange = saveAndUpdateViewers;
if (elements.vLayoutSelect) elements.vLayoutSelect.onchange = saveAndUpdateViewers;
if (elements.vIconStyle) elements.vIconStyle.onchange = saveAndUpdateViewers;
if (elements.vInterval) elements.vInterval.oninput = saveAndUpdateViewers;
if (elements.vSpacing) elements.vSpacing.oninput = saveAndUpdateViewers;

// Canais do Contador - Events
[elements.vYtUrl, elements.vShortsUrl, elements.vTwUrl, elements.vKickUrl, elements.vTtUrl].forEach(el => {
    if (el) el.oninput = saveAndUpdateViewers;
});
[elements.vYtEnabled, elements.vShortsEnabled, elements.vTwEnabled, elements.vKickEnabled, elements.vTtEnabled].forEach(el => {
    if (el) el.onchange = saveAndUpdateViewers;
});
if (elements.vBtnCopy) {
    elements.vBtnCopy.onclick = () => {
        api.copyText(elements.vObsUrl.value);
        const orig = elements.vBtnCopy.innerHTML;
        elements.vBtnCopy.innerText = 'Copiado!';
        setTimeout(() => elements.vBtnCopy.innerHTML = orig, 2000);
    };
}

// Preview Listener
api.onPreviewMessage((msg) => {
    const slowMode = (appConfig.overlay1 || {}).slowMode || 0;
    if (slowMode > 0) {
        messageQueue.push(msg);
        if (!isProcessingQueue) processQueue();
    } else {
        renderMessage(msg);
    }
});

// Modal Doação (PIX)
const btnDonate = document.getElementById('btn-donate');
const modalPix = document.getElementById('modal-pix');
const modalPixClose = document.getElementById('modal-pix-close');
const btnCopyPix = document.getElementById('btn-copy-pix');
const pixKey = document.getElementById('pix-key');

if (btnDonate) btnDonate.onclick = () => modalPix.classList.remove('hidden');
if (modalPixClose) modalPixClose.onclick = () => modalPix.classList.add('hidden');
if (btnCopyPix) {
    btnCopyPix.onclick = () => {
        api.copyText(pixKey.value);
        const orig = btnCopyPix.innerText;
        btnCopyPix.innerText = 'Copiado!';
        setTimeout(() => btnCopyPix.innerText = orig, 2000);
    };
}


window.copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copiado para a área de transferência!');
    }).catch(err => {
        console.error('Erro ao copiar: ', err);
    });
};

init();
