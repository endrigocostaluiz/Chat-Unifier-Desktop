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
    m2HideLeftBorder: document.getElementById('m2-hide-left-border')
};

// Dicionário de Traduções
const i18n = {
    pt: {}, // HTML original já está em PT
    en: {
        "Pesquisar canais...": "Search channels...",
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
    const dict = i18n[lang] || i18n.pt;
    const elementsToTranslate = document.querySelectorAll('h2, h3, label, button, option, p, span, input[placeholder]');
    
    elementsToTranslate.forEach(el => {
        // Ignora elementos que não devem ser traduzidos (mensagens de chat, badges, etc)
        if (el.closest('.message-item') || el.id === 'status-badge' || el.classList.contains('font-mono')) return;

        // Armazena o original na primeira vez
        if (!originalTexts.has(el)) {
            if (el.tagName === 'INPUT' && el.placeholder) {
                originalTexts.set(el, { type: 'placeholder', text: el.placeholder.trim() });
            } else if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
                originalTexts.set(el, { type: 'text', text: el.textContent.trim() });
            } else if (el.hasAttribute('data-i18n')) {
                originalTexts.set(el, { type: 'text', text: el.textContent.trim() });
            }
        }

        const original = originalTexts.get(el);
        if (original) {
            const translatedText = dict[original.text] || original.text;
            if (original.type === 'placeholder') {
                el.placeholder = translatedText;
            } else {
                el.textContent = translatedText;
            }
        }
    });

    // Atualiza visual dos botões de idioma
    const btnPt = document.getElementById('lang-pt');
    const btnEn = document.getElementById('lang-en');
    
    if (lang === 'pt') {
        btnPt.className = "text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-md transition-all bg-emerald-500/20 text-emerald-500";
        btnEn.className = "text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-md transition-all text-white/30 hover:bg-white/5 hover:text-white";
    } else {
        btnEn.className = "text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-md transition-all bg-blue-500/20 text-blue-400";
        btnPt.className = "text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-md transition-all text-white/30 hover:bg-white/5 hover:text-white";
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
    
    const div = document.createElement('div');
    div.className = `message-item ${animationClass}-in ${msg.platform} preview-msg-fidelity`;
    
    const badges = {
        twitch: 'https://cdn-icons-png.flaticon.com/512/5968/5968819.png',
        youtube: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
        kick: 'https://kick.com/favicon.ico'
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
    
    if (elements.preview.children.length > 20) {
        elements.preview.removeChild(elements.preview.lastChild);
    }
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
        translateUI(appConfig.lang || 'pt');

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

        updateObsUrl();
        updatePreviewLayout();
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

window.removePlatform = async (index) => {
    const platform = appConfig.platforms[index];
    api.stopSingle(platform.id);
    appConfig.platforms.splice(index, 1);
    await api.saveConfig(appConfig);
    renderPlatforms();
};

const saveAndUpdate = async () => {
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
        hideLeftBorder: elements.hideLeftBorder ? elements.hideLeftBorder.checked : false
    };
    if (elements.slowModeVal) elements.slowModeVal.innerText = `${appConfig.overlay1.slowMode}s`;
    if (elements.spacingVal) elements.spacingVal.innerText = `${appConfig.overlay1.messageSpacing}px`;
    await api.saveConfig(appConfig);
    updatePreviewLayout();
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
        await api.saveConfig(appConfig);
        await init();
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

init();
