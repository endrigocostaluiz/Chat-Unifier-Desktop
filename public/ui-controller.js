const api = window.electronAPI;

let appConfig = {
    platforms: [],
    overlay1: { layout: 'modern', animation: 'slide', showAvatars: true, cardColor: '#1e293b', cardOpacity: 85, bgColor: '#000000', bgOpacity: 0, slowMode: 1, customCSS: '' },
    overlay2: { layout: 'modern', animation: 'slide', showAvatars: true, cardColor: '#1e293b', cardOpacity: 85, bgColor: '#000000', bgOpacity: 85, slowMode: 1, customCSS: '' },
    overlay2Enabled: false,
    lang: 'pt'
};

let editingPlatformIndex = -1;
let localBasePath = '';

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
    customCssEnabled: document.getElementById('custom-css-enabled'),
    showAvatars: document.getElementById('show-avatars'),
    showChannelName: document.getElementById('show-channel-name'),
    channelNameColor: document.getElementById('channel-name-color'),
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

    // Sticker Overlay 1
    stickerCustomPanel: document.getElementById('sticker-custom-panel'),
    stickerAuthorBg: document.getElementById('sticker-author-bg'),
    stickerAuthorColor: document.getElementById('sticker-author-color'),
    stickerTextBg: document.getElementById('sticker-text-bg'),
    stickerTextColor: document.getElementById('sticker-text-color'),

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
    m2ShowChannelName: document.getElementById('m2-show-channel-name'),
    m2ChannelNameColor: document.getElementById('m2-channel-name-color'),
    m2MessageSpacing: document.getElementById('m2-message-spacing'),
    m2SpacingVal: document.getElementById('m2-spacing-val'),
    m2HideLeftBorder: document.getElementById('m2-hide-left-border'),

    // Sticker Overlay 2
    m2StickerCustomPanel: document.getElementById('m2-sticker-custom-panel'),
    m2StickerAuthorBg: document.getElementById('m2-sticker-author-bg'),
    m2StickerAuthorColor: document.getElementById('m2-sticker-author-color'),
    m2StickerTextBg: document.getElementById('m2-sticker-text-bg'),
    m2StickerTextColor: document.getElementById('m2-sticker-text-color'),

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
    vIconColorContainer: document.getElementById('v-icon-color-container'),
    vIconColor: document.getElementById('v-icon-color'),
    vIconRadius: document.getElementById('v-icon-radius'),
    vIconRadiusVal: document.getElementById('v-icon-radius-val'),
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
    vMonitorEnabled: document.getElementById('v-monitor-enabled'),
    vMonitorPanel: document.getElementById('v-monitor-settings'),
    vMonitorBg: document.getElementById('v-monitor-bg'),
    vMonitorText: document.getElementById('v-monitor-text'),
    vMonitorSize: document.getElementById('v-monitor-size'),
    vMonitorSizeVal: document.getElementById('v-monitor-size-val'),
    vMonitorShowTotal: document.getElementById('v-monitor-show-total'),
    vMonitorUrl: document.getElementById('v-monitor-url'),
    vCustomCss: document.getElementById('v-custom-css'),
    vCustomCssEnabled: document.getElementById('v-custom-css-enabled'),
    tabTitle: document.getElementById('tab-title'),
    // Grupos de botões do header
    chatCtrlBtns: document.getElementById('chat-ctrl-btns'),
    viewerCtrlBtns: document.getElementById('viewer-ctrl-btns'),
    btnStartViewers: document.getElementById('btn-start-viewers'),
    btnStopViewers: document.getElementById('btn-stop-viewers'),
    // Update System
    btnUpdate: document.getElementById('btn-update'),
    modalUpdate: document.getElementById('modal-update'),
    modalUpdateClose: document.getElementById('modal-update-close'),
    btnUpdateNow: document.getElementById('btn-update-now'),
    btnUpdateLater: document.getElementById('btn-update-later'),
    updateVersionTag: document.getElementById('update-version-tag'),
    updateChangelog: document.getElementById('update-changelog'),
    updateProgressContainer: document.getElementById('update-progress-container'),
    updateProgressPercent: document.getElementById('update-progress-percent'),
    updateProgressBar: document.getElementById('update-progress-bar'),
    // OBS Notice Modal
    modalObsNotice: document.getElementById('modal-obs-notice'),
    btnObsOpen: document.getElementById('btn-modal-open-obs'),
    btnObsClose: document.getElementById('btn-modal-obs-close'),

    // Giveaway Elements
    giveawayChatAlert: document.getElementById('giveaway-chat-alert'),
    btnGiveawayStartChat: document.getElementById('btn-giveaway-start-chat'),
    giveawayActiveToggle: document.getElementById('giveaway-active-toggle'),
    giveawayStatusBadge: document.getElementById('giveaway-status-badge'),
    giveawayModeKeywordBtn: document.getElementById('giveaway-mode-keyword-btn'),
    giveawayModeAllBtn: document.getElementById('giveaway-mode-all-btn'),
    giveawayKeywordPanel: document.getElementById('giveaway-keyword-panel'),
    giveawayKeywordInput: document.getElementById('giveaway-keyword-input'),
    giveawayCaseInsensitive: document.getElementById('giveaway-case-insensitive'),
    giveawayUniqueUser: document.getElementById('giveaway-unique-user'),
    giveawayPlatTwitch: document.getElementById('giveaway-plat-twitch'),
    giveawayPlatYoutube: document.getElementById('giveaway-plat-youtube'),
    giveawayPlatKick: document.getElementById('giveaway-plat-kick'),
    giveawayPlatTiktok: document.getElementById('giveaway-plat-tiktok'),
    giveawayTypeManualBtn: document.getElementById('giveaway-type-manual-btn'),
    giveawayTypeTimerBtn: document.getElementById('giveaway-type-timer-btn'),
    giveawayTimerSettings: document.getElementById('giveaway-timer-settings'),
    giveawayTimerDisplayVal: document.getElementById('giveaway-timer-display-val'),
    giveawayTimerSlider: document.getElementById('giveaway-timer-slider'),
    btnGiveawayDraw: document.getElementById('btn-giveaway-draw'),
    btnGiveawayDrawLabel: document.getElementById('btn-giveaway-draw-label'),
    btnGiveawayCancelTimer: document.getElementById('btn-giveaway-cancel-timer'),
    btnGiveawayAddManual: document.getElementById('btn-giveaway-add-manual'),
    btnGiveawayClear: document.getElementById('btn-giveaway-clear'),
    stageStandby: document.getElementById('stage-standby'),
    stageTimer: document.getElementById('stage-timer'),
    stageTimerClock: document.getElementById('stage-timer-clock'),
    stageTimerBar: document.getElementById('stage-timer-bar'),
    stageSpinning: document.getElementById('stage-spinning'),
    rouletteDisplay: document.getElementById('roulette-display'),
    rouletteAvatar: document.getElementById('roulette-avatar'),
    rouletteName: document.getElementById('roulette-name'),
    roulettePlatform: document.getElementById('roulette-platform'),
    giveawayCountBadge: document.getElementById('giveaway-count-badge'),
    giveawaySearchInput: document.getElementById('giveaway-search-input'),
    giveawayParticipantsContainer: document.getElementById('giveaway-participants-container'),
    giveawayEmptyState: document.getElementById('giveaway-empty-state'),
    giveawayHistoryCard: document.getElementById('giveaway-history-card'),
    giveawayHistoryList: document.getElementById('giveaway-history-list'),
    btnGiveawayClearHistory: document.getElementById('btn-giveaway-clear-history'),

    // Giveaway Winner Modal
    modalGiveawayWinner: document.getElementById('modal-giveaway-winner'),
    modalGiveawayClose: document.getElementById('modal-giveaway-close'),
    winnerAvatarImg: document.getElementById('winner-avatar-img'),
    winnerAvatarPlaceholder: document.getElementById('winner-avatar-placeholder'),
    winnerPlatformIcon: document.getElementById('winner-platform-icon'),
    winnerPlatformName: document.getElementById('winner-platform-name'),
    winnerName: document.getElementById('winner-name'),
    winnerDrawTime: document.getElementById('winner-draw-time'),
    winnerEntryMsg: document.getElementById('winner-entry-msg'),
    winnerWaitingBox: document.getElementById('winner-waiting-box'),
    winnerResponseTimer: document.getElementById('winner-response-timer'),
    winnerRespondedBox: document.getElementById('winner-responded-box'),
    winnerResponseAuthor: document.getElementById('winner-response-author'),
    winnerResponseTime: document.getElementById('winner-response-time'),
    winnerResponseText: document.getElementById('winner-response-text'),
    btnWinnerReroll: document.getElementById('btn-winner-reroll'),
    btnWinnerConfirm: document.getElementById('btn-winner-confirm'),

    // Giveaway Manual Modal
    modalGiveawayAddManual: document.getElementById('modal-giveaway-add-manual'),
    modalManualClose: document.getElementById('modal-manual-close'),
    modalManualCancel: document.getElementById('modal-manual-cancel'),
    modalManualSave: document.getElementById('modal-manual-save'),
    manualParticipantName: document.getElementById('manual-participant-name'),
    manualParticipantPlatform: document.getElementById('manual-participant-platform')
};

// Dicionário de Traduções
const i18n = {
    pt: {
        "obsNoticeDesc": "Para que seus overlays e chats carreguem corretamente no OBS, lembre-se de abrir primeiro este aplicativo e somente depois abrir o OBS Studio.",
        "obsNoticeWhyTitle": "💡 Por que isso é necessário?",
        "obsNoticeWhyDesc": "Este aplicativo cria um servidor de chat local. Se o OBS for aberto antes dele, as fontes de navegador do OBS tentarão se conectar e podem falhar (tela em branco), exigindo que você atualize as fontes manualmente.",
        "giveawayChatAlertDesc": "A captura do chat está pausada. Inicie o chat para receber mensagens e coletar os participantes do sorteio.",
        "giveawayKeywordHelp": "Quem digitar esta palavra em qualquer chat ativo entra no sorteio.",
        "giveawayStandbyDesc": "Os espectadores que enviarem mensagens ou a palavra-chave entrarão na lista abaixo em tempo real.",
        "giveawayEmptyHelp": "As pessoas que digitarem no chat aparecerão aqui automaticamente.",
        "winnerWaitingHelp": "Assim que o vencedor comentar qualquer mensagem em qualquer chat ativo, ela aparecerá aqui automaticamente."
    },
    en: {
        "Sorteio": "Giveaway",
        "Chat Não Conectado": "Chat Not Connected",
        "giveawayChatAlertDesc": "Chat capture is paused. Start the chat to receive messages and collect giveaway entries.",
        "Iniciar Chat Agora": "Start Chat Now",
        "Regras do Sorteio": "Giveaway Rules",
        "Inscrições Abertas": "Entries Open",
        "Inscrições Pausadas": "Entries Paused",
        "Como Participar": "How to Enter",
        "Palavra-Chave": "Keyword",
        "Qualquer Mensagem": "Any Message",
        "Palavra ou Comando de Entrada": "Entry Keyword or Command",
        "giveawayKeywordHelp": "Anyone who types this keyword in any active chat enters the giveaway.",
        "Ignorar Maiúsculas/Minúsculas": "Ignore Case",
        "Apenas 1 Inscrição por Usuário": "Only 1 Entry per User",
        "Plataformas Permitidas": "Allowed Platforms",
        "Execução do Sorteio": "Giveaway Execution",
        "Tipo de Sorteio": "Giveaway Type",
        "Manual": "Manual",
        "Com Timer": "With Timer",
        "Duração do Timer": "Timer Duration",
        "Realizar Sorteio Agora": "Draw Winner Now",
        "Iniciar Contagem Regressiva": "Start Countdown",
        "Cancelar Timer": "Cancel Timer",
        "Adicionar Manual": "+ Participant",
        "Limpar": "Clear",
        "Módulo de Sorteio Ativo": "Giveaway Module Active",
        "giveawayStandbyDesc": "Viewers sending messages or the entry keyword will appear in the list below in real time.",
        "Sorteio em Andamento...": "Giveaway in Progress...",
        "As inscrições serão encerradas ao zerar o tempo.": "Entries will close when the countdown reaches zero.",
        "🎲 SORTEANDO O VENCEDOR...": "🎲 DRAWING WINNER...",
        "Participantes Inscritos": "Registered Participants",
        "Buscar participante...": "Search participant...",
        "Nenhum participante inscrito ainda.": "No participants registered yet.",
        "giveawayEmptyHelp": "People who type in chat will appear here automatically.",
        "Histórico de Ganhadores": "Winner History",
        "Limpar Histórico": "Clear History",
        "Temos um Vencedor!": "We Have a Winner!",
        "Mensagem de Inscrição": "Entry Message",
        "Aguardando Resposta no Chat...": "Waiting for Response in Chat...",
        "winnerWaitingHelp": "As soon as the winner comments any message in any active chat, it will appear here automatically.",
        "Ganhador Respondeu no Chat!": "Winner Responded in Chat!",
        "Sortear Novamente (Reroll)": "Reroll Winner",
        "Confirmar Vencedor": "Confirm Winner",
        "Adicionar Participante": "Add Participant",
        "Nome do Usuário": "User Name",
        "Adicionar": "Add",
        "Pesquisar canais...": "Search channels...",
        "Canais do Contador": "Counter Channels",
        "Iniciar Chat": "Start Chat",
        "Parar Chat": "Stop Chat",
        "Iniciar Contador": "Start Counter",
        "Parar Contador": "Stop Counter",
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
        "Mostrar Nome do Canal": "Show Channel Name",
        "Ajustes de Layout": "Layout Adjustments",
        "Espaçamento": "Spacing",
        "Ocultar Borda Lateral": "Hide Side Border",
        "Modo Lento": "Slow Mode",
        "Modo Lento (s)": "Slow Mode (s)",
        "Define o intervalo mínimo entre a exibição de cada mensagem.": "Sets the minimum interval between messages.",
        "CSS Customizado": "Custom CSS",
        "Habilitar CSS": "Enable CSS",
        "Habilitar Monitor Independente": "Enable Independent Monitor",
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
        "Monitor de Espectadores": "Viewer Monitor",
        "Monitoramento em tela cheia com cores customizadas": "Full-screen monitoring with custom colors",
        "Tamanho": "Size",
        "Mostrar Total": "Show Total",
        "URL do Monitor": "Monitor URL",
        "Ideal para monitorar em tela cheia com cores personalizadas.": "Ideal for full-screen monitoring with custom colors.",
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
        "copy": "Copy",
        "Copiado!": "Copied!",
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
        "Toda ajuda é bem-vinda para manter o projeto ativo e com novas atualizações!": "Any help is welcome to keep the project active and with new updates!",
        "Verificar Atualizações": "Check for Updates",
        "Atualização Disponível": "Update Available",
        "Baixar e Atualizar": "Download and Update",
        "Lembrar mais tarde": "Remind me later",
        "Versão": "Version",
        "Não foram encontradas atualizações.": "No updates found.",
        "Você já está na versão mais recente!": "You are already on the latest version!",
        "Badges + Total": "Badges + Total",
        "Aviso Importante": "Important Notice",
        "Recomendação do OBS": "OBS Recommendation",
        "obsNoticeDesc": "To ensure your overlays and chats load correctly in OBS, remember to open this app first and only then open OBS Studio.",
        "obsNoticeWhyTitle": "💡 Why is this necessary?",
        "obsNoticeWhyDesc": "This app creates a local chat server. If OBS is opened before it, the OBS Browser Sources will try to connect and might fail (showing a blank screen), requiring you to manually refresh them.",
        "Abrir OBS Studio": "Open OBS Studio",
        "Entendi e Vou Seguir a Ordem": "Got it, I will follow the order",
        "OBS Studio está sendo iniciado...": "OBS Studio is launching...",
        "OBS Studio já deve estar aberto ou não foi encontrado nos caminhos padrão.": "OBS Studio might already be open or wasn't found in default directories."
    }
};

// Guarda o texto original em PT de cada elemento processado
const originalTexts = new Map();

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-emerald-500' : (type === 'error' ? 'bg-red-500' : 'bg-blue-500');
    const icon = type === 'success' ? 
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' :
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';

    toast.className = `${bgColor} text-black px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10 fade-in duration-300 font-bold text-sm`;
    toast.innerHTML = `
        <div class="bg-black/20 p-1.5 rounded-lg">${icon}</div>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('animate-out', 'fade-out', 'slide-out-to-right-10');
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

function translateUI(lang) {
    if (!lang) lang = appConfig.lang || 'pt';
    const dict = i18n[lang] || {};
    
    document.querySelectorAll('[data-i18n], [data-i18n-placeholder], h2, h3, label, button, option, p, span, input[placeholder]').forEach(el => {
        if (el.closest('.message-item') || el.id === 'status-badge' || el.classList.contains('font-mono')) return;

        // 1. Tradução de Texto
        let textKey = el.getAttribute('data-i18n');
        
        // Se não tem a chave, tenta descobrir o texto original (PT)
        if (!textKey) {
            if (el.children.length === 0) {
                textKey = el.textContent.trim();
                if (textKey) el.setAttribute('data-i18n', textKey);
            } else {
                // Para botões com ícones, busca o nó de texto
                for (let node of el.childNodes) {
                    if (node.nodeType === 3 && node.textContent.trim()) {
                        textKey = node.textContent.trim();
                        el.setAttribute('data-i18n', textKey);
                        break;
                    }
                }
            }
        }

        if (textKey) {
            const translated = dict[textKey] || (lang === 'pt' ? textKey : null);
            if (translated) {
                if (el.children.length === 0) {
                    el.textContent = translated;
                } else {
                    // Substitui apenas o conteúdo do nó de texto que contém a chave
                    for (let node of el.childNodes) {
                        if (node.nodeType === 3 && node.textContent.trim()) {
                            node.textContent = node.textContent.replace(node.textContent.trim(), translated);
                            break;
                        }
                    }
                }
            }
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
                ${config.showChannelName ? `<span class="channel-name" style="font-size: 0.7rem; opacity: 0.7; margin-left: 4px; color: ${config.channelNameColor || '#fff'};">(${msg.channelName || msg.platform})</span>` : ''}
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
        const rawPath = await api.getAppPath();
        localBasePath = 'file:///' + rawPath.replace(/\\/g, '/');

        try {
            const appVersion = await api.getVersion();
            const versionEl = document.getElementById('app-version');
            if (versionEl && appVersion) {
                versionEl.innerText = `v${appVersion}`;
            }
            const footerVersionEl = document.getElementById('app-footer-version');
            if (footerVersionEl && appVersion) {
                footerVersionEl.innerText = `Chat Unifier v${appVersion}`;
            }
        } catch (err) {
            console.error("Erro ao carregar versão:", err);
        }

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
        if (elements.customCssEnabled) elements.customCssEnabled.checked = o1.customCssEnabled !== false;
        if (elements.showAvatars) elements.showAvatars.checked = o1.showAvatars !== false;
        if (elements.showChannelName) elements.showChannelName.checked = o1.showChannelName === true;
        if (elements.channelNameColor) elements.channelNameColor.value = o1.channelNameColor || '#ffffff';
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

        // Carregar configurações do Sticker - Overlay 1
        if (elements.stickerAuthorBg) elements.stickerAuthorBg.value = o1.stickerAuthorBg || '#ffd11e';
        if (elements.stickerAuthorColor) elements.stickerAuthorColor.value = o1.stickerAuthorColor || '#000000';
        if (elements.stickerTextBg) elements.stickerTextBg.value = o1.stickerTextBg || '#000000';
        if (elements.stickerTextColor) elements.stickerTextColor.value = o1.stickerTextColor || '#ffffff';
        if (elements.stickerCustomPanel) elements.stickerCustomPanel.classList.toggle('hidden', (o1.layout || 'modern') !== 'sticker');

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
        if (elements.m2ShowChannelName) elements.m2ShowChannelName.checked = o2.showChannelName === true;
        if (elements.m2ChannelNameColor) elements.m2ChannelNameColor.value = o2.channelNameColor || '#ffffff';
        if (elements.m2MessageSpacing) elements.m2MessageSpacing.value = o2.messageSpacing !== undefined ? o2.messageSpacing : 10;
        if (elements.m2SpacingVal) elements.m2SpacingVal.innerText = `${o2.messageSpacing !== undefined ? o2.messageSpacing : 10}px`;
        if (elements.m2HideLeftBorder) elements.m2HideLeftBorder.checked = o2.hideLeftBorder === true;

        // Carregar configurações do Sticker - Overlay 2
        if (elements.m2StickerAuthorBg) elements.m2StickerAuthorBg.value = o2.stickerAuthorBg || '#ffd11e';
        if (elements.m2StickerAuthorColor) elements.m2StickerAuthorColor.value = o2.stickerAuthorColor || '#000000';
        if (elements.m2StickerTextBg) elements.m2StickerTextBg.value = o2.stickerTextBg || '#000000';
        if (elements.m2StickerTextColor) elements.m2StickerTextColor.value = o2.stickerTextColor || '#ffffff';
        if (elements.m2StickerCustomPanel) elements.m2StickerCustomPanel.classList.toggle('hidden', (o2.layout || 'modern') !== 'sticker');

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
        if (elements.vIconColor) elements.vIconColor.value = v.iconColor || '#ffffff';
        if (elements.vIconRadius) {
            elements.vIconRadius.value = v.iconRadius !== undefined ? v.iconRadius : 30;
            if (elements.vIconRadiusVal) elements.vIconRadiusVal.innerText = `${elements.vIconRadius.value}%`;
        }
        const isCustomIcon = (v.iconStyle || 'original') === 'custom';
        if (elements.vIconColorContainer) elements.vIconColorContainer.classList.toggle('hidden', !isCustomIcon);
        
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

        // Monitor de Espectadores
        const vm = v.monitor || { enabled: false, bgColor: '#0f172a', textColor: '#f8fafc' };
        if (elements.vMonitorEnabled) elements.vMonitorEnabled.checked = vm.enabled === true;
        if (elements.vMonitorPanel) elements.vMonitorPanel.classList.toggle('hidden', vm.enabled !== true);
        if (elements.vMonitorBg) elements.vMonitorBg.value = vm.bgColor || '#0f172a';
        if (elements.vMonitorText) elements.vMonitorText.value = vm.textColor || '#f8fafc';
        if (elements.vMonitorSize) {
            elements.vMonitorSize.value = vm.fontSize || 4;
            if (elements.vMonitorSizeVal) elements.vMonitorSizeVal.innerText = `${elements.vMonitorSize.value}rem`;
        }
        if (elements.vMonitorShowTotal) elements.vMonitorShowTotal.checked = vm.showTotal !== false;
        if (elements.vCustomCss) elements.vCustomCss.value = v.customCSS || '';
        if (elements.vCustomCssEnabled) elements.vCustomCssEnabled.checked = v.customCssEnabled !== false;

        // Reordena os cards físicos do contador com base em channelsOrder
        const channelsOrder = v.channelsOrder || ['youtube', 'shorts', 'twitch', 'kick', 'tiktok'];
        const vList = document.getElementById('viewer-channels-list');
        if (vList) {
            channelsOrder.forEach(key => {
                const item = vList.querySelector(`[data-platform-key="${key}"]`);
                if (item) vList.appendChild(item);
            });
        }

        updateObsUrl();
        updatePreviewLayout();
        updateViewersPreview();

        setupChatDragAndDrop();
        setupViewerDragAndDrop();

        // Modal OBS Notice - Exibição inicial
        if (elements.modalObsNotice) {
            elements.modalObsNotice.classList.remove('hidden');
        }
    } catch (err) {
        console.error("Erro na inicialização:", err);
    }
}

    function updatePreviewLayout() {
    if (!elements.preview) return;
    const layout = elements.layoutSelect.value || 'modern';
    if (elements.stickerCustomPanel) {
        elements.stickerCustomPanel.classList.toggle('hidden', layout !== 'sticker');
    }
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

    // Aplicar variáveis do layout Sticker no Preview se necessário
    const stickerAuthorBg = elements.stickerAuthorBg ? elements.stickerAuthorBg.value : '#ffd11e';
    const stickerAuthorColor = elements.stickerAuthorColor ? elements.stickerAuthorColor.value : '#000000';
    const stickerTextBg = elements.stickerTextBg ? elements.stickerTextBg.value : '#000000';
    const stickerTextColor = elements.stickerTextColor ? elements.stickerTextColor.value : '#ffffff';

    elements.preview.style.setProperty('--sticker-author-bg', stickerAuthorBg);
    elements.preview.style.setProperty('--sticker-author-color', stickerAuthorColor);
    elements.preview.style.setProperty('--sticker-text-bg', stickerTextBg);
    elements.preview.style.setProperty('--sticker-text-color', stickerTextColor);

    // Aplicar limite de mensagens imediatamente
    const maxMsgs = elements.maxMessages ? parseInt(elements.maxMessages.value) : 5;
    const currentMessages = Array.from(elements.preview.children);
    if (currentMessages.length > maxMsgs) {
        currentMessages.slice(maxMsgs).forEach(el => el.remove());
    }

    // Aplicar CSS Customizado ao Preview
    const customStyles = document.getElementById('preview-custom-css');
    if (customStyles) {
        const isEnabled = elements.customCssEnabled ? elements.customCssEnabled.checked : true;
        customStyles.innerHTML = (isEnabled && elements.customCss) ? elements.customCss.value : '';
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
        const iconColorVal = (elements.vIconColor && elements.vIconColor.value) ? elements.vIconColor.value.replace('#', '') : 'ffffff';
        const iconRadius = (elements.vIconRadius) ? elements.vIconRadius.value : 30;
        const layout = (elements.vLayoutSelect && elements.vLayoutSelect.value) ? elements.vLayoutSelect.value : 'default';
        const showTotal = elements.vShowTotal ? elements.vShowTotal.checked : true;

        const getIconUrl = (key, style) => {
            if (style === 'original') {
                const originals = {
                    twitch: 'https://cdn-icons-png.flaticon.com/512/5968/5968819.png',
                    youtube: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
                    shorts: 'https://cdn.simpleicons.org/youtubeshorts/FF0000',
                    kick: 'https://cdn.simpleicons.org/kick/53FC18',
                    tiktok: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png'
                };
                return originals[key];
            }
            
            const color = style === 'custom' ? iconColorVal : (style === 'white' ? 'FFFFFF' : (style === 'black' ? '000000' : style.replace('#', '')));
            const slugs = {
                youtube: 'youtube',
                shorts: 'youtubeshorts',
                twitch: 'twitch',
                kick: 'kick',
                tiktok: 'tiktok'
            };
            return `https://cdn.simpleicons.org/${slugs[key]}/${color}`;
        };

        const getIconStyle = (key) => {
            let transform = (key === 'kick' || key === 'shorts') ? 'transform: scale(0.8);' : '';
            let styleStr = `border-radius: ${iconRadius}%;`;
            if (transform) styleStr += ` ${transform}`;
            return `style="${styleStr}"`;
        };

        const spacing = elements.vSpacing ? elements.vSpacing.value : 20;
        let containerClass = "flex items-center p-4 rounded-xl transition-all";
        let containerStyle = `background: rgba(${br}, ${bg}, ${bb}, ${bgOpacity}); color: ${fontColor}; gap: ${layout === 'stacked' ? Math.floor(spacing / 2) : layout === 'badges' ? 4 : spacing}px;`;
        
        if (layout === 'vertical') {
            containerClass = "flex flex-col p-6 rounded-2xl transition-all items-start";
        } else if (layout === 'grid') {
            containerClass = "grid grid-cols-2 p-6 rounded-2xl transition-all";
        } else if (layout === 'minimalist') {
            containerClass = "flex items-center p-2 rounded-lg transition-all";
        } else if (layout === 'stacked') {
            containerClass = "flex items-center p-3 rounded-2xl transition-all gap-3";
        } else if (layout === 'badges') {
            containerClass = "flex items-center p-2 rounded-xl transition-all gap-1";
        }

        const ch = v.channels || {};
        const channelsOrder = v.channelsOrder || ['youtube', 'shorts', 'twitch', 'kick', 'tiktok'];
        const platforms = [
            { key: 'youtube', icon: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png', count: '38K', enabled: ch.youtube?.enabled !== false },
            { key: 'shorts', icon: 'https://cdn.simpleicons.org/youtubeshorts/FF0000', count: '8K', enabled: ch.shorts?.enabled !== false },
            { key: 'twitch', icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968819.png', count: '5.2K', enabled: ch.twitch?.enabled !== false },
            { key: 'kick', icon: 'https://cdn.simpleicons.org/kick/53FC18', count: '1.4K', enabled: ch.kick?.enabled !== false },
            { key: 'tiktok', icon: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png', count: '12K', enabled: ch.tiktok?.enabled !== false }
        ];

        const activePlatforms = platforms.filter(p => p.enabled);
        activePlatforms.sort((a, b) => channelsOrder.indexOf(a.key) - channelsOrder.indexOf(b.key));

        // Cores dos badges por plataforma
        const badgeColors = { youtube: '#FF0000', shorts: '#CC0000', twitch: '#9146FF', kick: '#53FC18', tiktok: '#111111' };

        const getContrastColor = (hexColor) => {
            if (!hexColor) return 'white';
            const hex = hexColor.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16) || 0;
            const g = parseInt(hex.substring(2, 4), 16) || 0;
            const b = parseInt(hex.substring(4, 6), 16) || 0;
            const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
            return (yiq >= 128) ? 'black' : 'white';
        };

        const iconColor = elements.vIconColor ? elements.vIconColor.value : '#ffffff';
        const contrastColor = getContrastColor(iconColor);

        const renderIcon = (key, idx) => {
            const isCustom = iconStyle === 'custom';
            const extraStyle = (key === 'kick' || key === 'shorts') ? 'transform: scale(0.8);' : '';
            const size = (layout === 'stacked') ? 28 : 24; // size in px
            const padding = Math.round(size * 0.25);
            const innerSize = size - padding;
            
            if (isCustom) {
                return `
                    <div style="width: ${size}px; height: ${size}px; border-radius: ${iconRadius}% !important; background: ${iconColor} !important; display: flex; align-items: center; justify-content: center; flex-shrink: 0; position: relative; ${layout === 'stacked' && idx > 0 ? 'margin-left: -14px;' : ''} z-index: ${10 - idx};">
                        <img src="${getIconUrl(key, contrastColor)}" style="width: ${innerSize}px; height: ${innerSize}px; object-fit: contain; border-radius: ${iconRadius}% !important; ${extraStyle}">
                    </div>
                `;
            } else {
                return `
                    <div class="relative" style="${layout === 'stacked' && idx > 0 ? 'margin-left: -14px;' : ''} z-index: ${10 - idx};">
                        <img src="${getIconUrl(key, iconStyle)}" class="w-6 h-6 object-contain" style="border-radius: ${iconRadius}% !important; ${extraStyle}">
                    </div>
                `;
            }
        };

        let statsHtml = '';
        if (layout === 'stacked') {
            const iconsHtml = activePlatforms.map((p, idx) => renderIcon(p.key, idx)).join('');
            statsHtml = `<div class="flex items-center">${iconsHtml}</div>`;
        } else if (layout === 'badges') {
            const badgeSize = 30;
            const iconSize = 18;
            const iconsHtml = activePlatforms.map(p => {
                const isCustom = iconStyle === 'custom';
                const bgColor = isCustom ? iconColor : (badgeColors[p.key] || '#444');
                const isKick = p.key === 'kick';
                const iconColorName = isCustom ? contrastColor : (isKick ? 'black' : 'white');
                const extraStyle = (p.key === 'tiktok' || p.key === 'kick' || p.key === 'shorts') ? 'transform: scale(0.85);' : '';
                return `
                    <div style="width:${badgeSize}px;height:${badgeSize}px;border-radius:${iconRadius}%;background:${bgColor};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                        <img src="${getIconUrl(p.key, iconColorName)}" style="width:${iconSize}px;height:${iconSize}px;object-fit:contain;border-radius:${iconRadius}%;${extraStyle}">
                    </div>
                `;
            }).join('');
            statsHtml = iconsHtml;
        } else {
            statsHtml = activePlatforms.map((p, idx) => `
                <div class="flex items-center gap-1.5">
                    ${renderIcon(p.key, idx)}
                    <span class="font-black text-lg" style="color: ${fontColor}">${p.count}</span>
                </div>
            `).join('');
        }

        const showTotalInPreview = showTotal && (layout === 'stacked' || layout === 'badges' || (layout !== 'minimalist' && activePlatforms.length > 1));

        vPreviewContent.innerHTML = `
            <div class="w-full flex flex-col items-center gap-3">
                <div class="${containerClass}" style="${containerStyle}">
                    ${statsHtml}
                    ${showTotalInPreview ? `
                    <div class="${(layout === 'vertical' || layout === 'grid') ? 'pt-2 border-t w-full' : (layout === 'stacked' ? 'pl-2' : (layout === 'badges' ? 'pl-1.5' : 'pl-4 border-l'))} border-white/10 flex items-center gap-2">
                        ${(layout !== 'stacked' && layout !== 'badges') ? `<span class="text-[9px] uppercase opacity-40 font-black tracking-widest">Total</span>` : ''}
                        ${layout === 'badges' ? `<span class="text-white/50 text-lg">•</span>` : ''}
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
        div.className = 'card p-4 rounded-2xl flex items-center justify-between group cursor-grab active:cursor-grabbing chat-draggable-item';
        div.draggable = true;
        div.dataset.id = p.id;
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
                <button onclick="editPlatform(${index})" title="Editar Canal" class="opacity-0 group-hover:opacity-100 text-white/20 hover:text-emerald-400 transition p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
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
    const port = appConfig.port || 3000;
    const httpBasePath = `http://localhost:${port}`;
    if (elements.obsUrl) elements.obsUrl.value = `${httpBasePath}/chat`;
    if (elements.monitorUrl) elements.monitorUrl.value = `${httpBasePath}/monitor`;
    if (elements.vObsUrl) elements.vObsUrl.value = `${httpBasePath}/viewers`;
    if (elements.vMonitorUrl) elements.vMonitorUrl.value = `${httpBasePath}/viewers-monitor`;
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
        if (typeof updateGiveawayChatAlert === 'function') updateGiveawayChatAlert();
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
        if (typeof updateGiveawayChatAlert === 'function') updateGiveawayChatAlert();
    };
}

if (elements.btnAdd) {
    elements.btnAdd.onclick = () => {
        editingPlatformIndex = -1;
        elements.newUrl.value = '';
        elements.newName.value = '';
        elements.modalAdd.querySelector('h2').innerText = appConfig.lang === 'en' ? 'New Channel' : 'Novo Canal';
        elements.modalSave.innerText = appConfig.lang === 'en' ? 'Save Channel' : 'Salvar Canal';
        elements.modalAdd.classList.remove('hidden');
        if (elements.newType && typeof elements.newType.onchange === 'function') {
            elements.newType.onchange();
        }
    };
}
if (elements.modalCancel) elements.modalCancel.onclick = () => elements.modalAdd.classList.add('hidden');

if (elements.modalSave) {
    elements.modalSave.onclick = async () => {
        const type = elements.newType.value;
        let name = elements.newName.value.trim();
        let url = elements.newUrl.value.trim();
        if (!url) return;
        if (type === 'youtube') {
            if (url.startsWith('@')) {
                url = `https://www.youtube.com/${url}`;
            }
            if (!/^https?:\/\//i.test(url)) {
                url = 'https://' + url;
            }
            
            const isChannel = url.includes('youtube.com/@') || 
                              url.includes('youtube.com/channel/') || 
                              url.includes('youtube.com/c/') || 
                              url.includes('youtube.com/user/');
            
            if (isChannel && !url.includes('watch?v=') && !url.includes('live_chat')) {
                let cleanUrl = url.split('?')[0].replace(/\/$/, '');
                if (!cleanUrl.endsWith('/live')) {
                    url = cleanUrl + '/live';
                }
            }

            const isValidYoutube = url.includes('youtube.com') || url.includes('youtu.be');
            if (!isValidYoutube) {
                showToast(appConfig.lang === 'en' ? 'Please enter a valid YouTube URL (must contain youtube.com or youtu.be).' : 'Por favor, insira uma URL válida do YouTube (deve conter youtube.com ou youtu.be).', 'error');
                return;
            }
        }
        if (!name) name = type.charAt(0).toUpperCase() + type.slice(1);

        if (editingPlatformIndex === -1) {
            // Adicionar Novo
            const platform = { id: Date.now().toString(), type, name, url, enabled: true, color: getPlatformColor(type) };
            appConfig.platforms.push(platform);
            await api.saveConfig(appConfig);
            
            if (type === 'tiktok' && !appConfig.hasLoggedTikTok) {
                showToast(appConfig.lang === 'en' ? 'Opening TikTok login window...' : 'Abrindo janela de login do TikTok...', 'info');
                api.openLoginWindow('tiktok');
                appConfig.hasLoggedTikTok = true;
                await api.saveConfig(appConfig);
            }

            if (elements.statusBadge.innerText === 'CONECTADO') api.startSingle(platform);
        } else {
            // Editar Existente
            const platform = appConfig.platforms[editingPlatformIndex];
            const oldId = platform.id;
            const wasEnabled = platform.enabled;

            platform.type = type;
            platform.name = name;
            platform.url = url;
            platform.color = getPlatformColor(type);

            await api.saveConfig(appConfig);

            // Se o chat estiver conectado, reinicia o scraper
            if (elements.statusBadge.innerText === 'CONECTADO' && wasEnabled) {
                api.stopSingle(oldId);
                api.startSingle(platform);
            }
            
            editingPlatformIndex = -1;
        }

        renderPlatforms(elements.searchChannels.value);
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

window.editPlatform = (index) => {
    editingPlatformIndex = index;
    const p = appConfig.platforms[index];
    
    elements.newType.value = p.type;
    elements.newName.value = p.name || '';
    elements.newUrl.value = p.url || '';
    
    elements.modalAdd.querySelector('h2').innerText = appConfig.lang === 'en' ? 'Edit Channel' : 'Editar Canal';
    elements.modalSave.innerText = appConfig.lang === 'en' ? 'Update Channel' : 'Atualizar Canal';
    
    elements.modalAdd.classList.remove('hidden');
    if (elements.newType && typeof elements.newType.onchange === 'function') {
        elements.newType.onchange();
    }
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
        customCssEnabled: elements.customCssEnabled ? elements.customCssEnabled.checked : true,
        showAvatars: elements.showAvatars ? elements.showAvatars.checked : true,
        showChannelName: elements.showChannelName ? elements.showChannelName.checked : false,
        channelNameColor: elements.channelNameColor ? elements.channelNameColor.value : '#ffffff',
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
        hideTimeout: elements.hideTimeout ? parseInt(elements.hideTimeout.value) : 15,
        stickerAuthorBg: elements.stickerAuthorBg ? elements.stickerAuthorBg.value : '#ffd11e',
        stickerAuthorColor: elements.stickerAuthorColor ? elements.stickerAuthorColor.value : '#000000',
        stickerTextBg: elements.stickerTextBg ? elements.stickerTextBg.value : '#000000',
        stickerTextColor: elements.stickerTextColor ? elements.stickerTextColor.value : '#ffffff'
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
        showChannelName: elements.m2ShowChannelName ? elements.m2ShowChannelName.checked : false,
        channelNameColor: elements.m2ChannelNameColor ? elements.m2ChannelNameColor.value : '#ffffff',
        messageSpacing: elements.m2MessageSpacing ? parseInt(elements.m2MessageSpacing.value) : 10,
        hideLeftBorder: elements.m2HideLeftBorder ? elements.m2HideLeftBorder.checked : false,
        customCSS: '',
        stickerAuthorBg: elements.m2StickerAuthorBg ? elements.m2StickerAuthorBg.value : '#ffd11e',
        stickerAuthorColor: elements.m2StickerAuthorColor ? elements.m2StickerAuthorColor.value : '#000000',
        stickerTextBg: elements.m2StickerTextBg ? elements.m2StickerTextBg.value : '#000000',
        stickerTextColor: elements.m2StickerTextColor ? elements.m2StickerTextColor.value : '#ffffff'
    };
    if (elements.m2StickerCustomPanel) {
        elements.m2StickerCustomPanel.classList.toggle('hidden', appConfig.overlay2.layout !== 'sticker');
    }
    if (elements.m2SlowModeVal) elements.m2SlowModeVal.innerText = `${appConfig.overlay2.slowMode}s`;
    if (elements.m2SpacingVal) elements.m2SpacingVal.innerText = `${appConfig.overlay2.messageSpacing}px`;
    await api.saveConfig(appConfig);
};

const saveAndUpdateViewers = async () => {
    let ytUrl = elements.vYtUrl ? elements.vYtUrl.value.trim() : '';
    const ytEnabled = elements.vYtEnabled ? elements.vYtEnabled.checked : false;
    if (ytUrl && ytEnabled) {
        if (ytUrl.startsWith('@')) {
            ytUrl = `https://www.youtube.com/${ytUrl}`;
        }
        if (!/^https?:\/\//i.test(ytUrl)) {
            ytUrl = 'https://' + ytUrl;
        }
        
        const isChannel = ytUrl.includes('youtube.com/@') || 
                          ytUrl.includes('youtube.com/channel/') || 
                          ytUrl.includes('youtube.com/c/') || 
                          ytUrl.includes('youtube.com/user/');
                          
        if (isChannel && !ytUrl.includes('watch?v=') && !ytUrl.includes('live_chat')) {
            let cleanUrl = ytUrl.split('?')[0].replace(/\/$/, '');
            if (!cleanUrl.endsWith('/live')) {
                ytUrl = cleanUrl + '/live';
            }
        }
        
        if (elements.vYtUrl) {
            elements.vYtUrl.value = ytUrl;
        }

        const isValidYoutube = ytUrl.includes('youtube.com') || ytUrl.includes('youtu.be');
        if (!isValidYoutube) {
            showToast(appConfig.lang === 'en' ? 'Please enter a valid YouTube URL for the counter (must contain youtube.com or youtu.be).' : 'Por favor, insira uma URL válida do YouTube no contador (deve conter youtube.com ou youtu.be).', 'error');
            return;
        }
    }

    appConfig.viewersConfig = {
        channelsOrder: (appConfig.viewersConfig && appConfig.viewersConfig.channelsOrder) || ['youtube', 'shorts', 'twitch', 'kick', 'tiktok'],
        bgColor: elements.vBgColor ? elements.vBgColor.value : '#000000',
        bgOpacity: elements.vBgOpacity ? parseInt(elements.vBgOpacity.value) : 85,
        fontColor: elements.vFontColor ? elements.vFontColor.value : '#ffffff',
        fontSize: elements.vFontSize ? parseInt(elements.vFontSize.value) : 18,
        showTotal: elements.vShowTotal ? elements.vShowTotal.checked : true,
        layout: elements.vLayoutSelect ? elements.vLayoutSelect.value : 'default',
        iconStyle: elements.vIconStyle ? elements.vIconStyle.value : 'original',
        iconColor: elements.vIconColor ? elements.vIconColor.value : '#ffffff',
        iconRadius: elements.vIconRadius ? parseInt(elements.vIconRadius.value) : 30,
        interval: elements.vInterval ? parseInt(elements.vInterval.value) : 30,
        spacing: elements.vSpacing ? parseInt(elements.vSpacing.value) : 20,
        channels: {
            youtube: { url: elements.vYtUrl?.value || '', enabled: elements.vYtEnabled?.checked === true },
            shorts: { url: elements.vShortsUrl?.value || '', enabled: elements.vShortsEnabled?.checked === true },
            twitch: { url: elements.vTwUrl?.value || '', enabled: elements.vTwEnabled?.checked === true },
            kick: { url: elements.vKickUrl?.value || '', enabled: elements.vKickEnabled?.checked === true },
            tiktok: { url: elements.vTtUrl?.value || '', enabled: elements.vTtEnabled?.checked === true }
        },
        monitor: {
            enabled: elements.vMonitorEnabled ? elements.vMonitorEnabled.checked : false,
            bgColor: elements.vMonitorBg ? elements.vMonitorBg.value : '#0f172a',
            textColor: elements.vMonitorText ? elements.vMonitorText.value : '#f8fafc',
            fontSize: elements.vMonitorSize ? parseFloat(elements.vMonitorSize.value) : 4,
            showTotal: elements.vMonitorShowTotal ? elements.vMonitorShowTotal.checked : true
        },
        customCSS: elements.vCustomCss ? elements.vCustomCss.value : '',
        customCssEnabled: elements.vCustomCssEnabled ? elements.vCustomCssEnabled.checked : true
    };
    const isCustomIcon = (elements.vIconStyle ? elements.vIconStyle.value : 'original') === 'custom';
    if (elements.vIconColorContainer) elements.vIconColorContainer.classList.toggle('hidden', !isCustomIcon);
    if (elements.vIconRadiusVal && elements.vIconRadius) elements.vIconRadiusVal.innerText = `${elements.vIconRadius.value}%`;
    if (elements.vMonitorSizeVal) elements.vMonitorSizeVal.innerText = `${appConfig.viewersConfig.monitor.fontSize}rem`;
    if (elements.vBgOpacityVal) elements.vBgOpacityVal.innerText = `${appConfig.viewersConfig.bgOpacity}%`;
    if (elements.vIntervalVal) elements.vIntervalVal.innerText = `${appConfig.viewersConfig.interval}s`;
    if (elements.vSpacingVal) elements.vSpacingVal.innerText = `${appConfig.viewersConfig.spacing}px`;
    
    updateViewersPreview();
    await api.saveConfig(appConfig);
};

// Bind Events - YouTube input validation helpers in Add Channel modal
if (elements.newType) {
    elements.newType.onchange = () => {
        const type = elements.newType.value;
        const urlLabel = document.getElementById('new-url-label');
        const helpText = document.getElementById('new-url-help');
        
        if (type === 'youtube') {
            if (urlLabel) urlLabel.innerText = appConfig.lang === 'en' ? 'YouTube Live URL' : 'URL da Live do YouTube';
            if (elements.newUrl) elements.newUrl.placeholder = 'https://www.youtube.com/watch?v=... ou https://www.youtube.com/live/...';
            if (helpText) helpText.innerText = appConfig.lang === 'en' ? 'Enter the direct URL of the live stream.' : 'Insira a URL direta da transmissão ao vivo (não use o link do canal).';
        } else {
            if (urlLabel) urlLabel.innerText = appConfig.lang === 'en' ? 'Channel URL' : 'URL do Canal';
            if (elements.newUrl) elements.newUrl.placeholder = 'https://...';
            if (helpText) helpText.innerText = '';
        }
    };
}

// Bind Events - Overlay 1
if (elements.layoutSelect) elements.layoutSelect.onchange = saveAndUpdate;
if (elements.customCss) elements.customCss.oninput = saveAndUpdate;
if (elements.customCssEnabled) elements.customCssEnabled.onchange = saveAndUpdate;
if (elements.showAvatars) elements.showAvatars.onchange = saveAndUpdate;
if (elements.showChannelName) elements.showChannelName.onchange = saveAndUpdate;
if (elements.channelNameColor) elements.channelNameColor.oninput = saveAndUpdate;
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

// Bind Events - Sticker Overlay 1
if (elements.stickerAuthorBg) elements.stickerAuthorBg.oninput = saveAndUpdate;
if (elements.stickerAuthorColor) elements.stickerAuthorColor.oninput = saveAndUpdate;
if (elements.stickerTextBg) elements.stickerTextBg.oninput = saveAndUpdate;
if (elements.stickerTextColor) elements.stickerTextColor.oninput = saveAndUpdate;

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
if (elements.m2ShowChannelName) elements.m2ShowChannelName.onchange = saveAndUpdateMonitor;
if (elements.m2ChannelNameColor) elements.m2ChannelNameColor.oninput = saveAndUpdateMonitor;
if (elements.m2MessageSpacing) elements.m2MessageSpacing.oninput = saveAndUpdateMonitor;
if (elements.m2HideLeftBorder) elements.m2HideLeftBorder.onchange = saveAndUpdateMonitor;

// Bind Events - Sticker Overlay 2
if (elements.m2StickerAuthorBg) elements.m2StickerAuthorBg.oninput = saveAndUpdateMonitor;
if (elements.m2StickerAuthorColor) elements.m2StickerAuthorColor.oninput = saveAndUpdateMonitor;
if (elements.m2StickerTextBg) elements.m2StickerTextBg.oninput = saveAndUpdateMonitor;
if (elements.m2StickerTextColor) elements.m2StickerTextColor.oninput = saveAndUpdateMonitor;

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

        if (tab === 'giveaway' && typeof updateGiveawayChatAlert === 'function') {
            updateGiveawayChatAlert();
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

// Lógica de Update
if (elements.btnUpdate) {
    elements.btnUpdate.onclick = async () => {
        const icon = elements.btnUpdate.querySelector('svg');
        if (icon) icon.classList.add('animate-spin');
        await api.checkForUpdates();
        setTimeout(() => {
            if (icon) icon.classList.remove('animate-spin');
        }, 2000);
    };
}

api.onUpdateAvailable((info) => {
    if (elements.modalUpdate) {
        elements.updateVersionTag.innerText = `Versão v${info.version}`;
        elements.updateChangelog.innerText = info.body || (appConfig.lang === 'en' ? 'New version available!' : 'Nova versão disponível!');
        elements.modalUpdate.classList.remove('hidden');
        
        elements.btnUpdateNow.onclick = () => {
            if (info.downloadUrl) {
                api.downloadUpdate(info.downloadUrl);
            } else {
                api.openExternal(info.url);
                elements.modalUpdate.classList.add('hidden');
            }
        };
        
        elements.btnUpdateLater.onclick = () => {
            if (!info.manual) {
                api.ignoreVersion(info.version);
            }
            elements.modalUpdate.classList.add('hidden');
        };
        
        elements.modalUpdateClose.onclick = () => {
            elements.modalUpdate.classList.add('hidden');
            resetUpdateModalState();
        };
    }
});

api.onUpdateNotFound(() => {
    showToast(appConfig.lang === 'en' ? "You are already on the latest version!" : "Você já está na versão mais recente!", 'info');
});

// Listeners do download da atualização
api.onDownloadProgress((progressInfo) => {
    if (elements.updateProgressContainer) {
        elements.updateProgressContainer.classList.remove('hidden');
        if (elements.btnUpdateNow) elements.btnUpdateNow.classList.add('hidden');
        if (elements.btnUpdateLater) elements.btnUpdateLater.classList.add('hidden');
        
        elements.updateProgressPercent.innerText = `${progressInfo.percent}%`;
        elements.updateProgressBar.style.width = `${progressInfo.percent}%`;
    }
});

api.onDownloadCompleted((filePath) => {
    showToast(appConfig.lang === 'en' ? 'Update downloaded to your Downloads folder!' : 'Atualização baixada na sua pasta de Downloads!', 'success');
    if (elements.modalUpdate) {
        elements.modalUpdate.classList.add('hidden');
    }
    resetUpdateModalState();
});

api.onDownloadFailed((error) => {
    showToast(`${appConfig.lang === 'en' ? 'Download failed: ' : 'Falha no download: '}${error}`, 'error');
    resetUpdateModalState();
});

function resetUpdateModalState() {
    if (elements.updateProgressContainer) elements.updateProgressContainer.classList.add('hidden');
    if (elements.updateProgressBar) elements.updateProgressBar.style.width = '0%';
    if (elements.updateProgressPercent) elements.updateProgressPercent.innerText = '0%';
    if (elements.btnUpdateNow) elements.btnUpdateNow.classList.remove('hidden');
    if (elements.btnUpdateLater) elements.btnUpdateLater.classList.remove('hidden');
}


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
if (elements.vIconColor) elements.vIconColor.oninput = saveAndUpdateViewers;
if (elements.vIconRadius) elements.vIconRadius.oninput = saveAndUpdateViewers;
if (elements.vInterval) elements.vInterval.oninput = saveAndUpdateViewers;
if (elements.vSpacing) elements.vSpacing.oninput = saveAndUpdateViewers;

// Canais do Contador - Events
[elements.vShortsUrl, elements.vTwUrl, elements.vKickUrl, elements.vTtUrl].forEach(el => {
    if (el) el.oninput = saveAndUpdateViewers;
});
if (elements.vYtUrl) {
    elements.vYtUrl.onchange = saveAndUpdateViewers;
}
if (elements.vMonitorEnabled) {
    elements.vMonitorEnabled.onchange = async () => {
        const enabled = elements.vMonitorEnabled.checked;
        elements.vMonitorPanel.classList.toggle('hidden', !enabled);
        saveAndUpdateViewers();
    };
}
if (elements.vMonitorBg) elements.vMonitorBg.oninput = saveAndUpdateViewers;
if (elements.vMonitorText) elements.vMonitorText.oninput = saveAndUpdateViewers;
if (elements.vMonitorSize) elements.vMonitorSize.oninput = saveAndUpdateViewers;
if (elements.vMonitorShowTotal) elements.vMonitorShowTotal.onchange = saveAndUpdateViewers;
if (elements.vCustomCss) elements.vCustomCss.oninput = saveAndUpdateViewers;
if (elements.vCustomCssEnabled) elements.vCustomCssEnabled.onchange = saveAndUpdateViewers;

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

// Preview Listener & Sorteio
api.onPreviewMessage((msg) => {
    // Processa inscrições de sorteio e monitoramento de resposta do vencedor
    if (typeof processGiveawayMessage === 'function') {
        try { processGiveawayMessage(msg); } catch (e) { console.error('Erro no sorteio:', e); }
    }
    if (typeof checkWinnerResponse === 'function') {
        try { checkWinnerResponse(msg); } catch (e) { console.error('Erro ao verificar resposta do vencedor:', e); }
    }

    // Otimização: se a janela estiver minimizada/escondida, não processa o preview
    if (document.hidden) return;

    const slowMode = (appConfig.overlay1 || {}).slowMode || 0;
    if (slowMode > 0) {
        messageQueue.push(msg);
        if (!isProcessingQueue) processQueue();
    } else {
        renderMessage(msg);
    }
});

// Modal Doação (PIX)
const btnDonate = document.getElementById('btn-coffee');
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

// Modal Aviso OBS - Eventos
if (elements.btnObsClose) {
    elements.btnObsClose.onclick = () => {
        if (elements.modalObsNotice) {
            elements.modalObsNotice.classList.add('hidden');
        }
    };
}

if (elements.btnObsOpen) {
    elements.btnObsOpen.onclick = async () => {
        // Esconde o modal
        if (elements.modalObsNotice) {
            elements.modalObsNotice.classList.add('hidden');
        }
        
        try {
            const res = await api.openOBS();
            if (res && res.success) {
                showToast(appConfig.lang === 'en' ? 'OBS Studio is launching...' : 'OBS Studio está sendo iniciado...', 'success');
            } else {
                showToast(res?.error || (appConfig.lang === 'en' ? 'OBS Studio might already be open or wasn\'t found in default directories.' : 'OBS Studio já deve estar aberto ou não foi encontrado nos caminhos padrão.'), 'info');
            }
        } catch (err) {
            console.error('Erro ao abrir OBS:', err);
            showToast(appConfig.lang === 'en' ? 'Error launching OBS Studio.' : 'Erro ao iniciar o OBS Studio.', 'error');
        }
    };
}



window.copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
        showToast(appConfig.lang === 'en' ? 'Copied to clipboard!' : 'Copiado para a área de transferência!');
    }).catch(err => {
        console.error('Erro ao copiar: ', err);
    });
};

window.copyLink = (text, btnElement) => {
    navigator.clipboard.writeText(text).then(() => {
        const dict = i18n[appConfig.lang || 'pt'] || {};
        const originalHtml = btnElement.innerHTML;
        btnElement.innerText = dict["Copiado!"] || "Copiado!";
    }).catch(err => console.error('Erro ao copiar:', err));
};

init();

// Lógica de Painéis Expansíveis (Collapsible)
document.addEventListener('click', (e) => {
    const header = e.target.closest('.collapsible-header');
    if (!header) return;
    
    const parent = header.parentElement;
    const content = parent.querySelector('.collapsible-content');
    
    parent.classList.toggle('active');
    if (content) {
        content.classList.toggle('hidden');
    }
});

function setupChatDragAndDrop() {
    const list = elements.platformList;
    if (!list) return;

    list.addEventListener('dragstart', (e) => {
        const item = e.target.closest('.chat-draggable-item');
        if (item) item.classList.add('dragging');
    });

    list.addEventListener('dragend', async (e) => {
        const item = e.target.closest('.chat-draggable-item');
        if (item) {
            item.classList.remove('dragging');
            const newOrderIds = [...list.children].map(child => child.dataset.id).filter(Boolean);
            appConfig.platforms.sort((a, b) => newOrderIds.indexOf(a.id) - newOrderIds.indexOf(b.id));
            await api.saveConfig(appConfig);
            renderPlatforms(elements.searchChannels ? elements.searchChannels.value : '');
            saveAndUpdate();
        }
    });

    list.addEventListener('dragover', (e) => {
        e.preventDefault();
        const draggingItem = list.querySelector('.dragging');
        if (!draggingItem) return;

        const siblings = [...list.querySelectorAll('.chat-draggable-item:not(.dragging)')];
        const nextSibling = siblings.find(sibling => {
            const box = sibling.getBoundingClientRect();
            const offset = e.clientY - box.top - box.height / 2;
            return offset < 0;
        });

        if (nextSibling) {
            list.insertBefore(draggingItem, nextSibling);
        } else {
            list.appendChild(draggingItem);
        }
    });
}

function setupViewerDragAndDrop() {
    const list = document.getElementById('viewer-channels-list');
    if (!list) return;

    list.addEventListener('dragstart', (e) => {
        const item = e.target.closest('.v-draggable-item');
        if (item) item.classList.add('dragging');
    });

    list.addEventListener('dragend', async (e) => {
        const item = e.target.closest('.v-draggable-item');
        if (item) {
            item.classList.remove('dragging');
            const newOrderKeys = [...list.children].map(child => child.dataset.platformKey).filter(Boolean);
            if (!appConfig.viewersConfig) appConfig.viewersConfig = {};
            appConfig.viewersConfig.channelsOrder = newOrderKeys;
            await saveAndUpdateViewers();
        }
    });

    list.addEventListener('dragover', (e) => {
        e.preventDefault();
        const draggingItem = list.querySelector('.dragging');
        if (!draggingItem) return;

        const siblings = [...list.querySelectorAll('.v-draggable-item:not(.dragging)')];
        const nextSibling = siblings.find(sibling => {
            const box = sibling.getBoundingClientRect();
            const offset = e.clientY - box.top - box.height / 2;
            return offset < 0;
        });

        if (nextSibling) {
            list.insertBefore(draggingItem, nextSibling);
        } else {
            list.appendChild(draggingItem);
        }
    });
}

/* ==========================================================================
   MÓDULO DE SORTEIO (GIVEAWAYS)
   ========================================================================== */

let giveawayState = {
    isOpen: true,
    mode: 'keyword', // 'keyword' ou 'all'
    keyword: '!sorteio',
    caseInsensitive: true,
    uniqueUser: true,
    platforms: {
        twitch: true,
        youtube: true,
        kick: true,
        tiktok: true
    },
    type: 'manual', // 'manual' ou 'timer'
    timerDuration: 60, // em segundos
    timerRemaining: 60,
    timerInterval: null,
    participants: [],
    currentWinner: null,
    winnerToleranceSeconds: 60,
    winnerTimerInterval: null,
    history: [],
    isDrawing: false
};

// Sincroniza o alerta de chat ativo
function updateGiveawayChatAlert() {
    if (!elements.giveawayChatAlert) return;
    const isChatActive = elements.btnStop && !elements.btnStop.classList.contains('hidden');
    elements.giveawayChatAlert.classList.toggle('hidden', isChatActive);
}

if (elements.btnGiveawayStartChat) {
    elements.btnGiveawayStartChat.onclick = () => {
        if (elements.btnStart) elements.btnStart.click();
    };
}

// Alternância de Status de Inscrições
if (elements.giveawayActiveToggle) {
    elements.giveawayActiveToggle.onchange = () => {
        giveawayState.isOpen = elements.giveawayActiveToggle.checked;
        if (elements.giveawayStatusBadge) {
            if (giveawayState.isOpen) {
                elements.giveawayStatusBadge.innerText = appConfig.lang === 'en' ? 'Entries Open' : 'Inscrições Abertas';
                elements.giveawayStatusBadge.className = 'text-[9px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-black uppercase tracking-wider';
            } else {
                elements.giveawayStatusBadge.innerText = appConfig.lang === 'en' ? 'Entries Paused' : 'Inscrições Pausadas';
                elements.giveawayStatusBadge.className = 'text-[9px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-black uppercase tracking-wider';
            }
        }
    };
}

// Alternância de Modo (Palavra-chave vs Qualquer Mensagem)
function setGiveawayMode(mode) {
    giveawayState.mode = mode;
    if (mode === 'keyword') {
        elements.giveawayModeKeywordBtn.className = 'p-2.5 rounded-xl text-xs font-bold border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 transition flex items-center justify-center gap-2';
        elements.giveawayModeAllBtn.className = 'p-2.5 rounded-xl text-xs font-bold border border-white/5 bg-white/5 text-white/40 hover:text-white transition flex items-center justify-center gap-2';
        if (elements.giveawayKeywordPanel) elements.giveawayKeywordPanel.classList.remove('hidden');
    } else {
        elements.giveawayModeAllBtn.className = 'p-2.5 rounded-xl text-xs font-bold border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 transition flex items-center justify-center gap-2';
        elements.giveawayModeKeywordBtn.className = 'p-2.5 rounded-xl text-xs font-bold border border-white/5 bg-white/5 text-white/40 hover:text-white transition flex items-center justify-center gap-2';
        if (elements.giveawayKeywordPanel) elements.giveawayKeywordPanel.classList.add('hidden');
    }
}

if (elements.giveawayModeKeywordBtn) elements.giveawayModeKeywordBtn.onclick = () => setGiveawayMode('keyword');
if (elements.giveawayModeAllBtn) elements.giveawayModeAllBtn.onclick = () => setGiveawayMode('all');

if (elements.giveawayKeywordInput) {
    elements.giveawayKeywordInput.oninput = () => {
        giveawayState.keyword = elements.giveawayKeywordInput.value.trim();
    };
}

if (elements.giveawayCaseInsensitive) {
    elements.giveawayCaseInsensitive.onchange = () => {
        giveawayState.caseInsensitive = elements.giveawayCaseInsensitive.checked;
    };
}

if (elements.giveawayUniqueUser) {
    elements.giveawayUniqueUser.onchange = () => {
        giveawayState.uniqueUser = elements.giveawayUniqueUser.checked;
    };
}

// Filtros de Plataforma
const platCheckboxes = [
    { el: elements.giveawayPlatTwitch, key: 'twitch' },
    { el: elements.giveawayPlatYoutube, key: 'youtube' },
    { el: elements.giveawayPlatKick, key: 'kick' },
    { el: elements.giveawayPlatTiktok, key: 'tiktok' }
];

platCheckboxes.forEach(({ el, key }) => {
    if (el) {
        el.onchange = () => {
            giveawayState.platforms[key] = el.checked;
        };
    }
});

// Alternância de Tipo de Sorteio (Manual vs Timer)
function setGiveawayType(type) {
    giveawayState.type = type;
    if (type === 'manual') {
        elements.giveawayTypeManualBtn.className = 'p-2.5 rounded-xl text-xs font-bold border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 transition flex items-center justify-center gap-2';
        elements.giveawayTypeTimerBtn.className = 'p-2.5 rounded-xl text-xs font-bold border border-white/5 bg-white/5 text-white/40 hover:text-white transition flex items-center justify-center gap-2';
        if (elements.giveawayTimerSettings) elements.giveawayTimerSettings.classList.add('hidden');
        if (elements.btnGiveawayDrawLabel) elements.btnGiveawayDrawLabel.innerText = appConfig.lang === 'en' ? 'Draw Winner Now' : 'Realizar Sorteio Agora';
        stopGiveawayTimer();
    } else {
        elements.giveawayTypeTimerBtn.className = 'p-2.5 rounded-xl text-xs font-bold border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 transition flex items-center justify-center gap-2';
        elements.giveawayTypeManualBtn.className = 'p-2.5 rounded-xl text-xs font-bold border border-white/5 bg-white/5 text-white/40 hover:text-white transition flex items-center justify-center gap-2';
        if (elements.giveawayTimerSettings) elements.giveawayTimerSettings.classList.remove('hidden');
        if (elements.btnGiveawayDrawLabel) elements.btnGiveawayDrawLabel.innerText = appConfig.lang === 'en' ? 'Start Countdown' : 'Iniciar Contagem Regressiva';
    }
}

if (elements.giveawayTypeManualBtn) elements.giveawayTypeManualBtn.onclick = () => setGiveawayType('manual');
if (elements.giveawayTypeTimerBtn) elements.giveawayTypeTimerBtn.onclick = () => setGiveawayType('timer');

// Slider & Presets de Timer
function updateTimerDisplay(seconds) {
    giveawayState.timerDuration = seconds;
    giveawayState.timerRemaining = seconds;
    if (elements.giveawayTimerSlider) elements.giveawayTimerSlider.value = seconds;
    if (elements.giveawayTimerDisplayVal) {
        if (seconds >= 60) {
            const m = Math.floor(seconds / 60);
            const s = seconds % 60;
            elements.giveawayTimerDisplayVal.innerText = s > 0 ? `${m}m ${s}s` : `${m}m`;
        } else {
            elements.giveawayTimerDisplayVal.innerText = `${seconds}s`;
        }
    }
}

if (elements.giveawayTimerSlider) {
    elements.giveawayTimerSlider.oninput = () => {
        updateTimerDisplay(parseInt(elements.giveawayTimerSlider.value));
    };
}

document.querySelectorAll('.btn-timer-preset').forEach(btn => {
    btn.onclick = () => {
        const secs = parseInt(btn.getAttribute('data-seconds'));
        if (secs) updateTimerDisplay(secs);
    };
});

// Processamento de Mensagens Recebidas no Chat para o Sorteio
function processGiveawayMessage(msg) {
    if (!msg || !msg.author || !giveawayState.isOpen || giveawayState.isDrawing) return;

    // Checagem de plataforma
    const plat = (msg.platform || 'other').toLowerCase();
    if (giveawayState.platforms[plat] === false) return;

    // Checagem de critério (palavra-chave vs qualquer mensagem)
    if (giveawayState.mode === 'keyword') {
        const kw = giveawayState.keyword ? giveawayState.keyword.trim() : '';
        if (!kw) return;
        
        const rawText = msg.message || '';
        const hasKeyword = giveawayState.caseInsensitive ?
            rawText.toLowerCase().includes(kw.toLowerCase()) :
            rawText.includes(kw);

        if (!hasKeyword) return;
    }

    // Checagem de usuário único
    if (giveawayState.uniqueUser) {
        const alreadyIn = giveawayState.participants.some(p => 
            p.author.toLowerCase() === msg.author.toLowerCase() && p.platform === plat
        );
        if (alreadyIn) return;
    }

    // Adiciona participante
    const participant = {
        id: 'p_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        author: msg.author,
        platform: plat,
        avatar: msg.avatar || '',
        color: msg.color || '#ffffff',
        message: msg.message || '',
        timestamp: new Date().toLocaleTimeString()
    };

    giveawayState.participants.unshift(participant);
    renderGiveawayParticipants(elements.giveawaySearchInput ? elements.giveawaySearchInput.value : '');
}

// Renderização da Lista de Participantes
function renderGiveawayParticipants(filter = '') {
    if (!elements.giveawayParticipantsContainer) return;
    
    const count = giveawayState.participants.length;
    if (elements.giveawayCountBadge) {
        elements.giveawayCountBadge.innerText = `${count} ${count === 1 ? (appConfig.lang === 'en' ? 'Participant' : 'Participante') : (appConfig.lang === 'en' ? 'Participants' : 'Participantes')}`;
    }

    const query = (filter || '').toLowerCase().trim();
    const filtered = query ? 
        giveawayState.participants.filter(p => p.author.toLowerCase().includes(query) || (p.message && p.message.toLowerCase().includes(query))) : 
        giveawayState.participants;

    if (filtered.length === 0) {
        elements.giveawayParticipantsContainer.innerHTML = `
            <div class="h-48 flex flex-col items-center justify-center text-center space-y-2 text-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <p class="text-xs font-bold">${count === 0 ? (appConfig.lang === 'en' ? 'No participants registered yet.' : 'Nenhum participante inscrito ainda.') : (appConfig.lang === 'en' ? 'No participant found.' : 'Nenhum participante encontrado.')}</p>
                <p class="text-[10px]">${appConfig.lang === 'en' ? 'People who type in chat will appear here automatically.' : 'As pessoas que digitarem no chat aparecerão aqui automaticamente.'}</p>
            </div>
        `;
        return;
    }

    const platformIcons = {
        twitch: 'https://cdn-icons-png.flaticon.com/512/5968/5968819.png',
        youtube: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
        kick: 'https://cdn.simpleicons.org/kick/53FC18',
        tiktok: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png'
    };

    elements.giveawayParticipantsContainer.innerHTML = filtered.map(p => {
        const platIcon = platformIcons[p.platform] || '';
        const initial = (p.author || '?').charAt(0).toUpperCase();
        return `
            <div class="card p-3 rounded-2xl flex items-center justify-between group bg-white/[0.02] border border-white/5 hover:border-white/10 transition animate-in fade-in duration-200" data-id="${p.id}">
                <div class="flex items-center gap-3 min-w-0 flex-1">
                    <div class="relative flex-none">
                        ${p.avatar ? 
                            `<img src="${p.avatar}" class="w-9 h-9 rounded-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                             <div class="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs items-center justify-center hidden">${initial}</div>` : 
                            `<div class="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center">${initial}</div>`
                        }
                        ${platIcon ? `<img src="${platIcon}" class="w-3.5 h-3.5 absolute -bottom-0.5 -right-0.5 rounded-full bg-black/80 p-0.5 border border-white/20">` : ''}
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-bold truncate text-white" style="color: ${p.color || '#fff'}">${p.author}</span>
                            <span class="text-[9px] uppercase font-bold text-white/30 tracking-wider">${p.platform}</span>
                        </div>
                        <p class="text-[11px] text-white/50 truncate italic">${p.message ? `"${p.message}"` : ''}</p>
                    </div>
                </div>
                <div class="flex items-center gap-2 flex-none">
                    <span class="text-[9px] text-white/20 font-mono">${p.timestamp || ''}</span>
                    <button onclick="removeGiveawayParticipant('${p.id}')" class="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition p-1.5 rounded-lg hover:bg-white/5" title="Remover">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Busca de Participantes
if (elements.giveawaySearchInput) {
    elements.giveawaySearchInput.oninput = () => {
        renderGiveawayParticipants(elements.giveawaySearchInput.value);
    };
}

// Remover Participante
window.removeGiveawayParticipant = (id) => {
    giveawayState.participants = giveawayState.participants.filter(p => p.id !== id);
    renderGiveawayParticipants(elements.giveawaySearchInput ? elements.giveawaySearchInput.value : '');
};

// Limpar Lista
if (elements.btnGiveawayClear) {
    elements.btnGiveawayClear.onclick = () => {
        if (giveawayState.participants.length === 0) return;
        const msg = appConfig.lang === 'en' ? 'Do you really want to clear all participants?' : 'Deseja realmente limpar todos os participantes inscritos?';
        if (confirm(msg)) {
            giveawayState.participants = [];
            renderGiveawayParticipants();
            showToast(appConfig.lang === 'en' ? 'Participant list cleared.' : 'Lista de participantes limpa.', 'info');
        }
    };
}

// Adição Manual de Participante
if (elements.btnGiveawayAddManual) {
    elements.btnGiveawayAddManual.onclick = () => {
        if (elements.manualParticipantName) elements.manualParticipantName.value = '';
        if (elements.modalGiveawayAddManual) elements.modalGiveawayAddManual.classList.remove('hidden');
    };
}

if (elements.modalManualClose) elements.modalManualClose.onclick = () => elements.modalGiveawayAddManual.classList.add('hidden');
if (elements.modalManualCancel) elements.modalManualCancel.onclick = () => elements.modalGiveawayAddManual.classList.add('hidden');

if (elements.modalManualSave) {
    elements.modalManualSave.onclick = () => {
        const name = elements.manualParticipantName ? elements.manualParticipantName.value.trim() : '';
        const plat = elements.manualParticipantPlatform ? elements.manualParticipantPlatform.value : 'twitch';
        if (!name) {
            showToast(appConfig.lang === 'en' ? 'Please enter a username.' : 'Por favor, digite o nome do usuário.', 'error');
            return;
        }

        const participant = {
            id: 'manual_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            author: name,
            platform: plat,
            avatar: '',
            color: '#10b981',
            message: appConfig.lang === 'en' ? '[Manual Entry]' : '[Inscrição Manual]',
            timestamp: new Date().toLocaleTimeString()
        };

        giveawayState.participants.unshift(participant);
        renderGiveawayParticipants();
        elements.modalGiveawayAddManual.classList.add('hidden');
        showToast(appConfig.lang === 'en' ? 'Participant added!' : 'Participante adicionado com sucesso!', 'success');
    };
}

// Controle do Timer Regressivo
function startGiveawayTimer() {
    if (giveawayState.participants.length === 0) {
        showToast(appConfig.lang === 'en' ? 'No participants registered to start the giveaway.' : 'Nenhum participante inscrito para iniciar o sorteio.', 'error');
        return;
    }

    giveawayState.timerRemaining = giveawayState.timerDuration || 60;
    
    // UI dos estados
    if (elements.stageStandby) elements.stageStandby.classList.add('hidden');
    if (elements.stageSpinning) elements.stageSpinning.classList.add('hidden');
    if (elements.stageTimer) elements.stageTimer.classList.remove('hidden');
    if (elements.btnGiveawayCancelTimer) elements.btnGiveawayCancelTimer.classList.remove('hidden');
    if (elements.btnGiveawayDraw) elements.btnGiveawayDraw.classList.add('hidden');

    const updateTimerUI = () => {
        const total = giveawayState.timerDuration;
        const current = giveawayState.timerRemaining;
        const mins = Math.floor(current / 60).toString().padStart(2, '0');
        const secs = (current % 60).toString().padStart(2, '0');
        if (elements.stageTimerClock) elements.stageTimerClock.innerText = `${mins}:${secs}`;
        if (elements.stageTimerBar) {
            const pct = Math.max(0, Math.min(100, (current / total) * 100));
            elements.stageTimerBar.style.width = `${pct}%`;
        }
    };

    updateTimerUI();

    clearInterval(giveawayState.timerInterval);
    giveawayState.timerInterval = setInterval(() => {
        giveawayState.timerRemaining--;
        updateTimerUI();

        if (giveawayState.timerRemaining <= 0) {
            clearInterval(giveawayState.timerInterval);
            giveawayState.timerInterval = null;
            // Executa sorteio
            drawGiveawayWinner();
        }
    }, 1000);
}

function stopGiveawayTimer() {
    if (giveawayState.timerInterval) {
        clearInterval(giveawayState.timerInterval);
        giveawayState.timerInterval = null;
    }
    if (elements.stageTimer) elements.stageTimer.classList.add('hidden');
    if (elements.stageStandby) elements.stageStandby.classList.remove('hidden');
    if (elements.stageSpinning) elements.stageSpinning.classList.add('hidden');
    if (elements.btnGiveawayCancelTimer) elements.btnGiveawayCancelTimer.classList.add('hidden');
    if (elements.btnGiveawayDraw) elements.btnGiveawayDraw.classList.remove('hidden');
}

if (elements.btnGiveawayCancelTimer) {
    elements.btnGiveawayCancelTimer.onclick = () => {
        stopGiveawayTimer();
        showToast(appConfig.lang === 'en' ? 'Giveaway timer cancelled.' : 'Temporizador do sorteio cancelado.', 'info');
    };
}

// Botão Principal de Sortear
if (elements.btnGiveawayDraw) {
    elements.btnGiveawayDraw.onclick = () => {
        if (giveawayState.type === 'timer') {
            startGiveawayTimer();
        } else {
            drawGiveawayWinner();
        }
    };
}

// Execução do Sorteio & Roleta
function drawGiveawayWinner() {
    if (giveawayState.participants.length === 0) {
        showToast(appConfig.lang === 'en' ? 'No eligible participants to draw.' : 'Nenhum participante inscrito para sortear.', 'error');
        stopGiveawayTimer();
        return;
    }

    giveawayState.isDrawing = true;

    // Transição de UI para Roleta
    if (elements.stageStandby) elements.stageStandby.classList.add('hidden');
    if (elements.stageTimer) elements.stageTimer.classList.add('hidden');
    if (elements.btnGiveawayCancelTimer) elements.btnGiveawayCancelTimer.classList.add('hidden');
    if (elements.stageSpinning) elements.stageSpinning.classList.remove('hidden');

    const participants = [...giveawayState.participants];
    // Escolhe o vencedor aleatoriamente
    const winnerIndex = Math.floor(Math.random() * participants.length);
    const chosenWinner = participants[winnerIndex];

    spinRoulette(participants, chosenWinner, (winner) => {
        giveawayState.isDrawing = false;
        if (elements.stageSpinning) elements.stageSpinning.classList.add('hidden');
        if (elements.stageStandby) elements.stageStandby.classList.remove('hidden');
        if (elements.btnGiveawayDraw) elements.btnGiveawayDraw.classList.remove('hidden');

        openWinnerModal(winner);
    });
}

function spinRoulette(list, targetWinner, onComplete) {
    let speed = 50; // ms
    let iterations = 0;
    const maxIterations = 35;

    const platformIcons = {
        twitch: 'https://cdn-icons-png.flaticon.com/512/5968/5968819.png',
        youtube: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
        kick: 'https://cdn.simpleicons.org/kick/53FC18',
        tiktok: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png'
    };

    function step() {
        iterations++;
        const currentItem = (iterations >= maxIterations) ? targetWinner : list[Math.floor(Math.random() * list.length)];

        if (elements.rouletteName) elements.rouletteName.innerText = currentItem.author;
        if (elements.roulettePlatform) elements.roulettePlatform.innerText = currentItem.platform.toUpperCase();
        if (elements.rouletteAvatar) {
            const initial = (currentItem.author || '?').charAt(0).toUpperCase();
            if (currentItem.avatar) {
                elements.rouletteAvatar.innerHTML = `<img src="${currentItem.avatar}" class="w-full h-full rounded-full object-cover" onerror="this.outerHTML='${initial}'">`;
            } else {
                elements.rouletteAvatar.innerText = initial;
            }
        }

        if (iterations < maxIterations) {
            speed += 8; // Desacelera gradualmente
            setTimeout(step, speed);
        } else {
            setTimeout(() => {
                onComplete(targetWinner);
            }, 600);
        }
    }

    step();
}

// Modal do Vencedor & Monitoramento de Resposta
function openWinnerModal(winner) {
    giveawayState.currentWinner = {
        ...winner,
        drawTime: new Date().toLocaleTimeString(),
        hasResponded: false,
        responseMsg: '',
        responseTime: ''
    };

    const platformIcons = {
        twitch: 'https://cdn-icons-png.flaticon.com/512/5968/5968819.png',
        youtube: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
        kick: 'https://cdn.simpleicons.org/kick/53FC18',
        tiktok: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png'
    };

    if (elements.winnerName) elements.winnerName.innerText = winner.author;
    if (elements.winnerPlatformName) elements.winnerPlatformName.innerText = winner.platform.toUpperCase();
    if (elements.winnerDrawTime) elements.winnerDrawTime.innerText = giveawayState.currentWinner.drawTime;
    if (elements.winnerEntryMsg) elements.winnerEntryMsg.innerText = winner.message ? `"${winner.message}"` : (appConfig.lang === 'en' ? 'Entry via active chat' : 'Inscrição via chat ativo');
    
    if (elements.winnerPlatformIcon) {
        elements.winnerPlatformIcon.src = platformIcons[winner.platform] || '';
    }

    const initial = (winner.author || '?').charAt(0).toUpperCase();
    if (elements.winnerAvatarImg && elements.winnerAvatarPlaceholder) {
        if (winner.avatar) {
            elements.winnerAvatarImg.src = winner.avatar;
            elements.winnerAvatarImg.classList.remove('hidden');
            elements.winnerAvatarPlaceholder.classList.add('hidden');
            elements.winnerAvatarImg.onerror = () => {
                elements.winnerAvatarImg.classList.add('hidden');
                elements.winnerAvatarPlaceholder.classList.remove('hidden');
                elements.winnerAvatarPlaceholder.innerText = initial;
            };
        } else {
            elements.winnerAvatarImg.classList.add('hidden');
            elements.winnerAvatarPlaceholder.classList.remove('hidden');
            elements.winnerAvatarPlaceholder.innerText = initial;
        }
    }

    // Reseta estado de resposta no modal
    if (elements.winnerWaitingBox) elements.winnerWaitingBox.classList.remove('hidden');
    if (elements.winnerRespondedBox) elements.winnerRespondedBox.classList.add('hidden');
    
    // Inicia contagem regressiva de tolerância de resposta (60s)
    let remainingTolerance = giveawayState.winnerToleranceSeconds || 60;
    if (elements.winnerResponseTimer) elements.winnerResponseTimer.innerText = `${remainingTolerance}s`;

    clearInterval(giveawayState.winnerTimerInterval);
    giveawayState.winnerTimerInterval = setInterval(() => {
        remainingTolerance--;
        if (elements.winnerResponseTimer) {
            elements.winnerResponseTimer.innerText = `${Math.max(0, remainingTolerance)}s`;
        }
        if (remainingTolerance <= 0) {
            clearInterval(giveawayState.winnerTimerInterval);
            giveawayState.winnerTimerInterval = null;
            if (elements.winnerResponseTimer) {
                elements.winnerResponseTimer.innerText = appConfig.lang === 'en' ? 'Time is up' : 'Tempo esgotado';
            }
        }
    }, 1000);

    // Abre o modal
    if (elements.modalGiveawayWinner) {
        elements.modalGiveawayWinner.classList.remove('hidden');
    }

    // Dispara chuva de confetes comemorativa!
    launchConfetti();
}

// Verificação em Tempo Real da Resposta do Vencedor no Chat
function checkWinnerResponse(msg) {
    if (!msg || !msg.author || !giveawayState.currentWinner || giveawayState.currentWinner.hasResponded) return;
    if (elements.modalGiveawayWinner && elements.modalGiveawayWinner.classList.contains('hidden')) return;

    const winnerName = (giveawayState.currentWinner.author || '').toLowerCase().trim();
    const senderName = (msg.author || '').toLowerCase().trim();

    if (winnerName === senderName) {
        giveawayState.currentWinner.hasResponded = true;
        giveawayState.currentWinner.responseMsg = msg.message || '';
        giveawayState.currentWinner.responseTime = new Date().toLocaleTimeString();

        clearInterval(giveawayState.winnerTimerInterval);
        giveawayState.winnerTimerInterval = null;

        // Atualiza a UI do modal
        if (elements.winnerWaitingBox) elements.winnerWaitingBox.classList.add('hidden');
        if (elements.winnerRespondedBox) {
            elements.winnerRespondedBox.classList.remove('hidden');
            if (elements.winnerResponseAuthor) elements.winnerResponseAuthor.innerText = msg.author;
            if (elements.winnerResponseTime) elements.winnerResponseTime.innerText = giveawayState.currentWinner.responseTime;
            if (elements.winnerResponseText) elements.winnerResponseText.innerText = `"${msg.message || ''}"`;
        }

        // Lança confetes novamente
        launchConfetti();
        showToast(appConfig.lang === 'en' ? `🎉 Winner ${msg.author} responded in chat!` : `🎉 O ganhador ${msg.author} respondeu no chat!`, 'success');
    }
}

// Reroll (Sortear Novamente)
if (elements.btnWinnerReroll) {
    elements.btnWinnerReroll.onclick = () => {
        clearInterval(giveawayState.winnerTimerInterval);
        if (elements.modalGiveawayWinner) elements.modalGiveawayWinner.classList.add('hidden');
        drawGiveawayWinner();
    };
}

// Confirmar Vencedor
if (elements.btnWinnerConfirm) {
    elements.btnWinnerConfirm.onclick = () => {
        if (!giveawayState.currentWinner) return;
        clearInterval(giveawayState.winnerTimerInterval);
        
        giveawayState.history.unshift({ ...giveawayState.currentWinner });
        renderGiveawayHistory();

        if (elements.modalGiveawayWinner) elements.modalGiveawayWinner.classList.add('hidden');
        showToast(appConfig.lang === 'en' ? 'Winner confirmed and added to history!' : 'Vencedor confirmado e salvo no histórico!', 'success');
    };
}

if (elements.modalGiveawayClose) {
    elements.modalGiveawayClose.onclick = () => {
        clearInterval(giveawayState.winnerTimerInterval);
        if (elements.modalGiveawayWinner) elements.modalGiveawayWinner.classList.add('hidden');
    };
}

// Renderização do Histórico de Ganhadores
function renderGiveawayHistory() {
    if (!elements.giveawayHistoryList || !elements.giveawayHistoryCard) return;

    if (giveawayState.history.length === 0) {
        elements.giveawayHistoryCard.classList.add('hidden');
        return;
    }

    elements.giveawayHistoryCard.classList.remove('hidden');

    const platformIcons = {
        twitch: 'https://cdn-icons-png.flaticon.com/512/5968/5968819.png',
        youtube: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
        kick: 'https://cdn.simpleicons.org/kick/53FC18',
        tiktok: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png'
    };

    elements.giveawayHistoryList.innerHTML = giveawayState.history.map(w => {
        const initial = (w.author || '?').charAt(0).toUpperCase();
        return `
            <div class="bg-black/40 border border-white/5 rounded-2xl p-3 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="relative">
                        ${w.avatar ? 
                            `<img src="${w.avatar}" class="w-8 h-8 rounded-full object-cover" onerror="this.outerHTML='<div class=\'w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center\'>${initial}</div>'">` : 
                            `<div class="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">${initial}</div>`
                        }
                        <img src="${platformIcons[w.platform] || ''}" class="w-3 h-3 absolute -bottom-0.5 -right-0.5 rounded-full bg-black">
                    </div>
                    <div>
                        <p class="text-xs font-bold text-white">${w.author}</p>
                        <p class="text-[9px] text-white/40 font-mono">${w.drawTime} • ${w.hasResponded ? '🟢 Respondeu' : '⏳ Sem resposta'}</p>
                    </div>
                </div>
                <span class="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-full">🏆 Vencedor</span>
            </div>
        `;
    }).join('');
}

if (elements.btnGiveawayClearHistory) {
    elements.btnGiveawayClearHistory.onclick = () => {
        giveawayState.history = [];
        renderGiveawayHistory();
    };
}

// Efeito de Confetes em Canvas Nativo
function launchConfetti() {
    const canvas = document.getElementById('giveaway-confetti-canvas');
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.classList.remove('hidden');

    const ctx = canvas.getContext('2d');
    const pieces = [];
    const colors = ['#10b981', '#34d399', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6', '#ec4899', '#ffffff'];

    for (let i = 0; i < 150; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height * 0.5,
            w: Math.random() * 10 + 5,
            h: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 4,
            vy: Math.random() * 5 + 3,
            rot: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 10
        });
    }

    let animationFrame;
    let startTime = Date.now();

    function render() {
        const elapsed = Date.now() - startTime;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let active = 0;
        pieces.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.rot += p.rotSpeed;

            if (p.y < canvas.height + 20) {
                active++;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rot * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
            }
        });

        if (active > 0 && elapsed < 4000) {
            animationFrame = requestAnimationFrame(render);
        } else {
            cancelAnimationFrame(animationFrame);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.classList.add('hidden');
        }
    }

    render();
}
