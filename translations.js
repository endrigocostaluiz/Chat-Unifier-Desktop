// ========================================================
// Chat Unifier Desktop - Internationalization (i18n)
// PT (Português - Padrão) & EN (English)
// ========================================================

const ChatUnifierI18n = (() => {
  const STORAGE_KEY = 'chat_unifier_lang';
  const DEFAULT_LANG = 'pt';

  const translations = {
    pt: {
      page: {
        title: "Chat Unifier Desktop | O Melhor Multichat & Multistream para OBS Studio",
        description: "Unifique mensagens e espectadores simultâneos de Twitch, YouTube (Lives e Shorts), Kick e TikTok no OBS Studio em tempo real. 100% gratuito, sem chaves de API, com sorteios e overlays profissionais."
      },
      nav: {
        recursos: "Recursos",
        telas: "Prints Reais",
        comparativo: "Comparativo",
        comoUsar: "Como Usar",
        faq: "FAQ",
        apoiar: "Apoiar",
        github: "GitHub",
        baixarGratis: "Baixar Grátis",
        comoUsarObs: "Como Usar no OBS",
        perguntasFrequentes: "Perguntas Frequentes",
        apoiarProjeto: "Apoiar o Projeto",
        baixarChatUnifier: 'Baixar Chat Unifier (<span class="dynamic-version">v1.5.3</span>)',
        acessarRepositorio: "Acessar Repositório no GitHub",
        languageLabel: "Idioma / Language:"
      },
      hero: {
        pill: 'Versão <strong class="dynamic-version">v1.5.3</strong> Estável • 100% Gratuito & Open Source',
        title: 'O <span class="gradient-text">Multichat Definitivo</span><br>Para Streamers no OBS Studio',
        subtitle: 'Centralize em tempo real as mensagens e espectadores de <strong>Twitch, YouTube (Lives & Shorts), Kick e TikTok</strong> em uma única tela e overlay transparente para sua transmissão, <strong>sem precisar de chaves de API</strong> ou cadastros burocráticos.',
        btnWindows: "Baixar para Windows (64-bit)",
        btnDemo: "Ver Demonstração Real",
        subtextPortable: "Executável Portátil (Sem instalação)",
        subtextSize: 'Tamanho: <span class="dynamic-size">~66 MB</span>',
        subtextWindows: "Compatível com Windows 10 e Windows 11",
        platformsLabel: "Plataformas e Softwares Integrados",
        windowTitle: "Chat Unifier Desktop - Painel de Controle (Captura Real)",
        windowStatus: "STATUS: CONECTADO",
        floatingOverlay: "Overlay no OBS Studio"
      },
      metrics: {
        m1Number: "4 em 1",
        m1Label: "Twitch, YouTube, Kick e TikTok simultâneos",
        m2Number: "0 Chaves",
        m2Label: "Sem cadastros de API ou bots complexos",
        m3Number: "< 10ms",
        m3Label: "Latência ultrabaixa via servidor local",
        m4Number: "100%",
        m4Label: "Gratuito, sem limites e de código aberto"
      },
      features: {
        tag: "Recursos Poderosos",
        title: "Tudo o que Você Precisa para Elevar sua Live",
        subtitle: "Criado por quem entende as dores reais de quem faz multistreaming diário. Mais controle, menos abas abertas e foco total no seu gameplay e audiência.",
        card1Title: "Multichat Unificado em Tempo Real",
        card1Desc: "Reúna comentários da Twitch, YouTube Live, YouTube Shorts, Kick e TikTok em um feed único ordenado cronologicamente, com identificação de cores e badges de cada rede.",
        card1Badge1: "Zero Delay",
        card1Badge2: "Fotos de Perfil",
        card1Badge3: "Emojis",
        card2Title: "Overlays Transparentes para OBS",
        card2Desc: "Adicione uma simples Fonte de Navegador (Browser Source) no OBS Studio ou Streamlabs. Escolha entre 8 temas premium: Glassmorphism, Cyberpunk Neon, Retro 8-bit, Dark Slim e mais.",
        card2Badge1: "8 Estilos Visuais",
        card2Badge2: "CSS Customizável",
        card2Badge3: "Animações de Entrada",
        card3Title: "Sorteios com Roleta Animada & Confetes",
        card3Desc: "Faça sorteios interativos entre espectadores de todas as plataformas simultaneamente por palavra-chave (ex: <code>!sorteio</code>). Possui detecção automática da resposta do ganhador ao vivo!",
        card3Badge1: "Roleta Efeito Slot",
        card3Badge2: "Anti-Spam (1 Entrada)",
        card3Badge3: "Reroll Instantâneo",
        card4Title: "Contador e Monitor de Viewers Multistream",
        card4Desc: "Acompanhe o total de espectadores ao vivo somando Twitch + YouTube + Kick + TikTok. Inclui widget personalizável para exibir a contagem na tela da live.",
        card4Badge1: "Soma Automática",
        card4Badge2: "Badges por Rede",
        card4Badge3: "Intervalo Ajustável",
        card5Title: "Sistema de Overlay Duplo Independente",
        card5Desc: "Tenha uma URL leve otimizada para o OBS Studio e outra URL em tela cheia com fontes maiores projetada para o seu segundo monitor, tablet ou celular.",
        card5Badge1: "URL de Live (OBS)",
        card5Badge2: "URL de Monitor (2ª Tela)",
        card5Badge3: "Modo Escuro Otimizado",
        card6Title: "Scraping Local Seguro & 100% Privado",
        card6Desc: "Nenhum dado, login ou histórico passa por servidores na nuvem. Todo o processamento ocorre exclusivamente no seu computador com baixo consumo de memória.",
        card6Badge1: "Sem Envio de Dados",
        card6Badge2: "Sem Queda de Conexão",
        card6Badge3: "App Portátil"
      },
      showcase: {
        tag: "Galeria Oficial",
        title: "Prints Reais do Aplicativo em Execução",
        subtitle: "Veja a interface nativa e os módulos reais funcionando no Windows com streamers reais.",
        card1Tag: "Painel Principal do Multichat",
        card1Title: "Controle Central de Todos os Seus Canais",
        card1Desc: 'Insira o nome de usuário da sua Twitch, canal do YouTube, Kick ou @ do TikTok. Com um clique em "Iniciar Chat", todos os feeds se conectam e são exibidos com badges e cores distintos.',
        card1Check1: "Barra de pesquisa rápida para filtrar comentários em tempo real.",
        card1Check2: "Controle individual para ligar/desligar qualquer canal a qualquer momento.",
        card1Check3: "Preview em tempo real na própria janela do aplicativo antes de abrir o OBS.",
        card1Caption: "Aba Chat Unificado • Conexão simultânea",
        card1StatusLive: "● Ao Vivo",
        card2Tag: "Módulo de Sorteios (Giveaways)",
        card2Title: "Sorteios Interativos com Roleta Animada e Confetes",
        card2Desc: "Engaje seu público premiando espectadores de qualquer plataforma conectada. Defina a palavra-chave (ex: <code>!sorteio</code>), ative filtros anti-duplicidade e gire a roleta estilo slot machine com desaceleração emocionante.",
        card2Check1: "<strong>Detecção em Tempo Real da Resposta do Ganhador:</strong> O aplicativo monitora o chat e avisa assim que o sorteado responder!",
        card2Check2: "Botão de <strong>Reroll Instantâneo</strong> caso o ganhador não responda dentro do prazo.",
        card2Check3: "Histórico completo de ganhadores salvo para auditoria.",
        card2Caption: "Módulo de Sorteio com Roleta de Prêmios e Filtros",
        card2TagExclusive: "Recurso Exclusivo",
        card3Tag: "Contador de Espectadores Multistream",
        card3Title: "Monitore sua Audiência Total em Tempo Real",
        card3Desc: "Saiba exatamente quantas pessoas estão assistindo você na Twitch, YouTube, Kick e TikTok simultaneamente, sem precisar abrir cada painel de criador no navegador.",
        card3Check1: "Widget leve para colocar diretamente na cena do OBS Studio.",
        card3Check2: "Vários layouts: Horizontal, Lista Vertical, Minimalista, Grid e Badges.",
        card3Check3: "Intervalo de atualização configurável para máxima precisão.",
        card3Caption: "Contador de Viewers Multistream • Twitch, YouTube, Kick e TikTok",
        card3TagUnified: "Total Unificado",
        card4Tag: "Customização Visual & Temas",
        card4Title: "Deixe o Chat com a Cara da sua Live",
        card4Desc: "Personalize cada detalhe visual: oculte fotos de perfil se quiser um visual minimalista, ative animações suaves de entrada (Bounce, Slide, Fade), configure o modo lento (slow mode) e injete seu próprio código CSS.",
        card4Check1: "8 temas pré-construídos para combinar com qualquer estilo de jogo.",
        card4Check2: "Ajuste fino de opacidade de fundo para transparência perfeita no OBS.",
        card4Check3: "Suporte a editor de CSS customizado em tempo real.",
        card4Caption: "Aba de Configuração de Temas e Overlays",
        card4TagControl: "Controle Total"
      },
      comp: {
        tag: "Análise Comparativa",
        title: "Por Que o Chat Unifier Supera os Concorrentes?",
        subtitle: "Veja como o Chat Unifier Desktop se compara com alternativas populares como Restream Chat, Social Stream Ninja, Botrix e Casterlabs.",
        thFeatures: "Recursos & Vantagens",
        row1Feature: "Preço e Acesso",
        row1Cu: "100% Gratuito / Open Source",
        row1Restream: "Planos pagos caros para canais extras",
        row1Ssn: "Gratuito",
        row1Botrix: "Versão básica com paywall",
        row2Feature: "Necessidade de Chaves de API / Bot",
        row2Cu: "Zero Chaves de API (Scraping Local)",
        row2Restream: "Exige login em nuvem",
        row2Ssn: "Requer extensões de navegador",
        row2Botrix: "Exige bot moderador",
        row3Feature: "Suporte Simultâneo (Twitch, YT, Kick, TikTok)",
        row3Cu: "Nativo & Imediato",
        row3Restream: "TikTok e Kick limitados",
        row3Ssn: "Suportado",
        row3Botrix: "Configuração complexa",
        row4Feature: "Sorteios com Roleta Animada & Confetes",
        row4Cu: "Integrado de Fábrica",
        row4Restream: "Não possui",
        row4Ssn: "Não possui",
        row4Botrix: "Básico / sem roleta animada",
        row5Feature: "Detecção de Resposta do Ganhador no Chat",
        row5Cu: "Exclusivo em Tempo Real",
        row5Restream: "Não possui",
        row5Ssn: "Não possui",
        row5Botrix: "Não possui",
        row6Feature: "Contador de Viewers Multistream",
        row6Cu: "Integrado com Overlay OBS",
        row6Restream: "Apenas no painel web",
        row6Ssn: "Requer script externo",
        row6Botrix: "Requer widget pago",
        row7Feature: "URL de Monitor em Tela Cheia (2ª Tela)",
        row7Cu: "Incluso (Overlay Duplo)",
        row7Restream: "Apenas na janela web",
        row7Ssn: "Disponível",
        row7Botrix: "Não possui",
        row8Feature: "Privacidade e Dados Locais",
        row8Cu: "100% no seu PC (Zero Nuvem)",
        row8Restream: "Tudo passa pelos servidores deles",
        row8Ssn: "Local",
        row8Botrix: "Servidores externos"
      },
      steps: {
        tag: "Passo a Passo",
        title: "Como Configurar no OBS Studio em 3 Passos",
        subtitle: "Leve menos de 2 minutos para colocar seu chat e contador de viewers funcionando na sua stream.",
        step1Title: "Baixe o Chat Unifier",
        step1Desc: 'Baixe o arquivo portátil <code class="dynamic-filename">Chat.Unifier.1.5.3.exe</code> e execute diretamente no seu computador. Não precisa instalar nada nem poluir o registro do Windows.',
        step1Btn: "Baixar Executável",
        step2Title: "Adicione seus Canais",
        step2Desc: 'Digite seus usernames da Twitch, Kick, TikTok ou link da live do YouTube. Clique no botão <strong>"Iniciar Chat"</strong> para começar a sincronização em tempo real.',
        step3Title: "Cole no OBS Studio",
        step3Desc: 'No OBS Studio, adicione uma nova fonte do tipo <strong>Navegador (Browser Source)</strong>, cole a URL local gerada e ajuste a largura e altura desejadas. Pronto!',
        copyBtnTitle: "Copiar URL"
      },
      faq: {
        tag: "Tire Suas Dúvidas",
        title: "Perguntas Frequentes (FAQ)",
        subtitle: "Tudo o que você precisa saber sobre funcionamento, requisitos e compatibilidade do aplicativo.",
        q1: "O Chat Unifier Desktop é realmente 100% gratuito?",
        a1: "Sim! O software é 100% gratuito e de código aberto sob licença MIT. Você pode usar livremente nas suas streams sem pagar nenhuma taxa, sem propagandas inseridas na tela e sem bloqueio artificial de recursos.",
        q2: "Preciso criar conta de desenvolvedor ou gerar chaves de API?",
        a2: "Não! O Chat Unifier Desktop foi desenvolvido para eliminar completamente a burocracia de APIs, tokens OAuth que expiram e cadastros em plataformas terceiras. A leitura dos chats é feita de forma local e inteligente, bastando inserir seu nome de usuário.",
        q3: "Funciona com YouTube Shorts e TikTok Live?",
        a3: "Sim! O aplicativo possui suporte específico para transmissões no formato vertical do YouTube Shorts e TikTok Live, além do formato horizontal tradicional de lives do YouTube, Twitch e Kick.",
        q4: "O aplicativo causa lag ou queda de FPS nos jogos durante a live?",
        a4: "Não. Todo o sistema do Chat Unifier é altamente otimizado: as mensagens são despachadas via WebSockets ultraleves locais na porta 3000 do seu computador, garantindo consumo insignificante de processador e memória RAM.",
        q5: "Como funciona a detecção de resposta do sorteado no giveaway?",
        a5: "Após a roleta parar e revelar o nome do ganhador, o modal de vitória passa a vigiar o chat ao vivo em tempo real. Assim que o vencedor enviar qualquer mensagem confirmando que está presente na live, o aplicativo destaca na hora o comentário e horário exato na tela!",
        q6: "Posso usar em um segundo monitor sem colocar na tela da live?",
        a6: 'Com certeza! O Chat Unifier possui o recurso de Overlay Duplo: você pode usar a <strong>URL de Monitor</strong> (<code>http://localhost:3000/monitor</code>) para abrir no seu navegador em tela cheia no segundo monitor com fontes ampliadas e alto contraste, ou até mesmo abrir no tablet ou celular conectado na mesma rede Wi-Fi!'
      },
      support: {
        tag: "Apoie o Desenvolvedor",
        title: "Gostou do Projeto?",
        subtitle: "O Chat Unifier Desktop é desenvolvido e mantido com carinho de forma independente. Se esta ferramenta ajuda suas lives, considere apoiar com um café ou PIX!",
        pixLabel: "Chave PIX (Brasil):",
        btnCopyPix: "Copiar Chave PIX",
        btnBuyCoffee: "Buy Me a Coffee (Internacional)"
      },
      cta: {
        title: 'Pronto para Transformar<br>o Chat da Sua Live?',
        subtitle: 'Baixe agora mesmo o <strong>Chat Unifier Desktop</strong> e tenha o multichat mais completo do mercado no seu OBS Studio em menos de 2 minutos.',
        btnDownload: 'Baixar Gratuitamente (<span class="dynamic-version">v1.5.3</span>)',
        btnGithub: "Ver no GitHub"
      },
      footer: {
        brandDesc: "O unificador de chat e multistream gratuito e de código aberto feito sob medida para streamers no OBS Studio e Streamlabs.",
        navTitle: "Navegação",
        navRecursos: "Recursos",
        navTelas: "Prints do App",
        navComparativo: "Comparativo",
        navComoUsar: "Como Usar no OBS",
        navFaq: "Perguntas Frequentes",
        commTitle: "Comunidade & Links",
        commRepo: "Repositório GitHub",
        commReleases: "Releases & Versões",
        commIssues: "Reportar Erro / Ideias",
        commAiSearch: "llms.txt (Busca IA)",
        platformsTitle: "Plataformas Suportadas",
        copy: '&copy; 2026 Chat Unifier Desktop • Licenciado sob a Licença MIT. Desenvolvido com dedicação por <strong>Endrigo Costa Luiz</strong> (@endrigocostaluiz).',
        officialGithub: "GitHub Oficial"
      },
      ui: {
        copied: "Copiado!"
      }
    },

    en: {
      page: {
        title: "Chat Unifier Desktop | The Ultimate Multichat & Multistream for OBS Studio",
        description: "Unify real-time chat messages and concurrent viewers from Twitch, YouTube (Lives & Shorts), Kick, and TikTok in OBS Studio. 100% free, zero API keys, with giveaways and pro overlays."
      },
      nav: {
        recursos: "Features",
        telas: "Screenshots",
        comparativo: "Comparison",
        comoUsar: "How to Use",
        faq: "FAQ",
        apoiar: "Support",
        github: "GitHub",
        baixarGratis: "Free Download",
        comoUsarObs: "How to Use in OBS",
        perguntasFrequentes: "Frequently Asked Questions",
        apoiarProjeto: "Support the Project",
        baixarChatUnifier: 'Download Chat Unifier (<span class="dynamic-version">v1.5.3</span>)',
        acessarRepositorio: "View GitHub Repository",
        languageLabel: "Language / Idioma:"
      },
      hero: {
        pill: 'Stable <strong class="dynamic-version">v1.5.3</strong> • 100% Free & Open Source',
        title: 'The <span class="gradient-text">Ultimate Multichat</span><br>For Streamers on OBS Studio',
        subtitle: 'Centralize real-time chat messages and viewers from <strong>Twitch, YouTube (Lives & Shorts), Kick, and TikTok</strong> into a single screen and transparent overlay for your stream, <strong>with zero API keys</strong> or tedious sign-ups.',
        btnWindows: "Download for Windows (64-bit)",
        btnDemo: "View Live Showcase",
        subtextPortable: "Portable Executable (No install required)",
        subtextSize: 'Size: <span class="dynamic-size">~66 MB</span>',
        subtextWindows: "Compatible with Windows 10 and Windows 11",
        platformsLabel: "Supported Platforms & Software",
        windowTitle: "Chat Unifier Desktop - Control Panel (Actual Capture)",
        windowStatus: "STATUS: CONNECTED",
        floatingOverlay: "Overlay in OBS Studio"
      },
      metrics: {
        m1Number: "4 in 1",
        m1Label: "Twitch, YouTube, Kick & TikTok simultaneously",
        m2Number: "0 Keys",
        m2Label: "Zero developer API keys or complex bot setups",
        m3Number: "< 10ms",
        m3Label: "Ultra-low latency via local server",
        m4Number: "100%",
        m4Label: "Free, unlimited and open source"
      },
      features: {
        tag: "Powerful Features",
        title: "Everything You Need to Elevate Your Stream",
        subtitle: "Built by multistreamers who know the daily grind. More control, fewer browser tabs open, and total focus on your gameplay and audience.",
        card1Title: "Real-Time Unified Multichat",
        card1Desc: "Gather comments from Twitch, YouTube Live, YouTube Shorts, Kick, and TikTok into a single chronological feed, with distinctive badges and colors for each platform.",
        card1Badge1: "Zero Delay",
        card1Badge2: "Profile Pictures",
        card1Badge3: "Emojis",
        card2Title: "Transparent OBS Overlays",
        card2Desc: "Add a simple Browser Source into OBS Studio or Streamlabs. Pick from 8 premium themes: Glassmorphism, Cyberpunk Neon, Retro 8-bit, Dark Slim, and more.",
        card2Badge1: "8 Visual Themes",
        card2Badge2: "Custom CSS",
        card2Badge3: "Entrance Animations",
        card3Title: "Giveaways with Animated Wheel & Confetti",
        card3Desc: "Run interactive giveaways across all connected platforms simultaneously via keyword (e.g. <code>!giveaway</code>). Includes live automatic detection when the winner responds in chat!",
        card3Badge1: "Slot Machine Wheel",
        card3Badge2: "Anti-Spam (1 Entry)",
        card3Badge3: "Instant Reroll",
        card4Title: "Multistream Viewers Counter & Monitor",
        card4Desc: "Track total live viewers summing Twitch + YouTube + Kick + TikTok. Includes a customizable on-screen widget to show viewer counts during your stream.",
        card4Badge1: "Automatic Sum",
        card4Badge2: "Platform Badges",
        card4Badge3: "Adjustable Interval",
        card5Title: "Dual Independent Overlay System",
        card5Desc: "Enjoy a lightweight URL optimized for OBS Studio and a separate fullscreen URL with large fonts designed for your second monitor, tablet, or phone.",
        card5Badge1: "Stream URL (OBS)",
        card5Badge2: "Monitor URL (2nd Screen)",
        card5Badge3: "Optimized Dark Mode",
        card6Title: "Secure Local Scraping & 100% Private",
        card6Desc: "No credentials, chat logs, or account data ever pass through cloud servers. All processing happens locally on your computer with minimal memory footprint.",
        card6Badge1: "Zero Cloud Logging",
        card6Badge2: "Rock-Solid Local",
        card6Badge3: "Portable App"
      },
      showcase: {
        tag: "Official Showcase",
        title: "Real Screenshots of the App Running",
        subtitle: "See the native desktop interface and live modules in action on Windows with real streamers.",
        card1Tag: "Main Multichat Panel",
        card1Title: "Central Command for All Your Channels",
        card1Desc: 'Enter your Twitch username, YouTube channel/URL, Kick, or TikTok @. Click "Start Chat" to connect all feeds instantly with distinct badges and theme colors.',
        card1Check1: "Quick search bar to filter incoming comments in real time.",
        card1Check2: "Individual toggles to enable or mute any channel anytime.",
        card1Check3: "Live preview inside the desktop app before opening OBS Studio.",
        card1Caption: "Unified Chat Tab • Simultaneous Connection",
        card1StatusLive: "● Live",
        card2Tag: "Giveaway Module",
        card2Title: "Interactive Giveaways with Slot Wheel & Confetti",
        card2Desc: "Engage your audience by rewarding viewers from any connected platform. Set your trigger keyword (e.g. <code>!giveaway</code>), enable anti-duplicate filters, and spin the slot-machine wheel with exciting deceleration.",
        card2Check1: "<strong>Live Winner Response Detection:</strong> The app monitors the live chat and alerts you immediately when the winner responds!",
        card2Check2: "Instant <strong>Reroll Button</strong> if the winner doesn't respond in time.",
        card2Check3: "Complete winners log stored for transparency and auditing.",
        card2Caption: "Giveaway Module with Prize Wheel & Filters",
        card2TagExclusive: "Exclusive Feature",
        card3Tag: "Multistream Viewers Counter",
        card3Title: "Monitor Your Total Audience in Real Time",
        card3Desc: "Know exactly how many people are watching you across Twitch, YouTube, Kick, and TikTok simultaneously, without opening each creator dashboard in a browser.",
        card3Check1: "Lightweight widget to place directly on your OBS Studio scene.",
        card3Check2: "Multiple layouts: Horizontal, Vertical List, Minimalist, Grid, and Badges.",
        card3Check3: "Configurable refresh interval for optimal accuracy.",
        card3Caption: "Multistream Viewers Counter • Twitch, YouTube, Kick & TikTok",
        card3TagUnified: "Unified Total",
        card4Tag: "Visual Customization & Themes",
        card4Title: "Make the Chat Match Your Stream Identity",
        card4Desc: "Customize every visual detail: toggle profile pictures, enable entrance animations (Bounce, Slide, Fade), configure slow mode, and inject custom CSS styling.",
        card4Check1: "8 pre-built themes to match any stream or game aesthetic.",
        card4Check2: "Fine-tune background opacity for crystal-clear transparency in OBS.",
        card4Check3: "Built-in live custom CSS editor for unlimited styling.",
        card4Caption: "Themes & Overlay Configuration Tab",
        card4TagControl: "Full Control"
      },
      comp: {
        tag: "Comparative Breakdown",
        title: "Why Chat Unifier Beats the Competition",
        subtitle: "See how Chat Unifier Desktop compares against popular tools like Restream Chat, Social Stream Ninja, Botrix, and Casterlabs.",
        thFeatures: "Features & Perks",
        row1Feature: "Pricing & Access",
        row1Cu: "100% Free / Open Source",
        row1Restream: "Costly paid tiers for extra channels",
        row1Ssn: "Free",
        row1Botrix: "Basic tier with paywalls",
        row2Feature: "API Keys / Bot Requirement",
        row2Cu: "Zero API Keys (Local Scraping)",
        row2Restream: "Requires cloud login",
        row2Ssn: "Requires browser extensions",
        row2Botrix: "Requires moderator bot",
        row3Feature: "Simultaneous Support (Twitch, YT, Kick, TikTok)",
        row3Cu: "Native & Out-of-the-Box",
        row3Restream: "Limited TikTok & Kick",
        row3Ssn: "Supported",
        row3Botrix: "Complex configuration",
        row4Feature: "Giveaways with Animated Wheel & Confetti",
        row4Cu: "Built-in Out of the Box",
        row4Restream: "Not available",
        row4Ssn: "Not available",
        row4Botrix: "Basic / no slot wheel",
        row5Feature: "Live Winner Chat Response Detection",
        row5Cu: "Exclusive Real-Time",
        row5Restream: "Not available",
        row5Ssn: "Not available",
        row5Botrix: "Not available",
        row6Feature: "Multistream Viewers Counter",
        row6Cu: "Built-in with OBS Overlay",
        row6Restream: "Web dashboard only",
        row6Ssn: "Requires external script",
        row6Botrix: "Requires paid widget",
        row7Feature: "Fullscreen Monitor URL (2nd Screen)",
        row7Cu: "Included (Dual Overlay)",
        row7Restream: "Web window only",
        row7Ssn: "Available",
        row7Botrix: "Not available",
        row8Feature: "Privacy & Local Data",
        row8Cu: "100% on your PC (Zero Cloud)",
        row8Restream: "All routed via cloud servers",
        row8Ssn: "Local",
        row8Botrix: "External cloud servers"
      },
      steps: {
        tag: "Step by Step",
        title: "How to Set Up in OBS Studio in 3 Steps",
        subtitle: "Take less than 2 minutes to get your chat and viewer counter running on stream.",
        step1Title: "Download Chat Unifier",
        step1Desc: 'Download the portable <code class="dynamic-filename">Chat.Unifier.1.5.3.exe</code> and run it directly on your computer. No installation or Windows registry clutter.',
        step1Btn: "Download Executable",
        step2Title: "Add Your Channels",
        step2Desc: 'Enter your Twitch, Kick, TikTok usernames or YouTube stream URL. Click <strong>"Start Chat"</strong> to begin real-time synchronization.',
        step3Title: "Paste into OBS Studio",
        step3Desc: 'In OBS Studio, add a new <strong>Browser Source</strong>, paste the generated local URL, set your width and height. You are ready to stream!',
        copyBtnTitle: "Copy URL"
      },
      faq: {
        tag: "Got Questions?",
        title: "Frequently Asked Questions (FAQ)",
        subtitle: "Everything you need to know about how the app works, requirements, and compatibility.",
        q1: "Is Chat Unifier Desktop really 100% free?",
        a1: "Yes! The software is 100% free and open-source under the MIT license. You can use it freely in your streams with no fees, no on-screen watermarks or ads, and no artificial paywalls.",
        q2: "Do I need developer accounts or API keys?",
        a2: "No! Chat Unifier Desktop was built to completely eliminate API hassles, expiring OAuth tokens, and third-party developer registrations. Chat feeds are captured locally and intelligently—just enter your username.",
        q3: "Does it support YouTube Shorts and TikTok Live?",
        a3: "Yes! The app provides dedicated support for vertical streams on YouTube Shorts and TikTok Live, as well as classic horizontal streams on YouTube, Twitch, and Kick.",
        q4: "Does the app cause lag or FPS drops in games while streaming?",
        a4: "No. Chat Unifier is highly optimized: messages are dispatched via ultra-lightweight local WebSockets on port 3000 of your PC, guaranteeing negligible CPU and RAM impact on your gameplay.",
        q5: "How does live winner response detection work in giveaways?",
        a5: "Once the wheel stops and reveals the winner, the victory modal starts monitoring the live chat in real time. The moment the winner sends any message confirming their presence, the app highlights their comment and timestamp on screen immediately!",
        q6: "Can I use it on a second monitor without showing it on stream?",
        a6: 'Absolutely! Chat Unifier features Dual Overlay: use the <strong>Monitor URL</strong> (<code>http://localhost:3000/monitor</code>) in full screen on a second monitor with large high-contrast fonts, or even open it on a tablet or smartphone connected to the same Wi-Fi network!'
      },
      support: {
        tag: "Support the Developer",
        title: "Enjoying the Project?",
        subtitle: "Chat Unifier Desktop is developed and maintained independently with passion. If this tool helps your streams, consider buying a coffee or donating!",
        pixLabel: "PIX Key (Brazil only):",
        btnCopyPix: "Copy PIX Key",
        btnBuyCoffee: "Buy Me a Coffee (Worldwide)"
      },
      cta: {
        title: 'Ready to Transform<br>Your Live Stream Chat?',
        subtitle: 'Download <strong>Chat Unifier Desktop</strong> right now and get the most comprehensive multichat for OBS Studio in under 2 minutes.',
        btnDownload: 'Download for Free (<span class="dynamic-version">v1.5.3</span>)',
        btnGithub: "View on GitHub"
      },
      footer: {
        brandDesc: "The free and open-source chat unifier and multistream solution tailored for streamers on OBS Studio and Streamlabs.",
        navTitle: "Navigation",
        navRecursos: "Features",
        navTelas: "App Screenshots",
        navComparativo: "Comparison",
        navComoUsar: "How to Use in OBS",
        navFaq: "Frequently Asked Questions",
        commTitle: "Community & Links",
        commRepo: "GitHub Repository",
        commReleases: "Releases & Versions",
        commIssues: "Report Bug / Feedback",
        commAiSearch: "llms.txt (AI Search)",
        platformsTitle: "Supported Platforms",
        copy: '&copy; 2026 Chat Unifier Desktop • Licensed under the MIT License. Crafted with passion by <strong>Endrigo Costa Luiz</strong> (@endrigocostaluiz).',
        officialGithub: "Official GitHub"
      },
      ui: {
        copied: "Copied!"
      }
    }
  };

  // Helper para resolver chave pontilhada como 'hero.title'
  function getNestedValue(obj, keyPath) {
    if (!obj || !keyPath) return null;
    const parts = keyPath.split('.');
    let curr = obj;
    for (const part of parts) {
      if (curr && typeof curr === 'object' && part in curr) {
        curr = curr[part];
      } else {
        return null;
      }
    }
    return curr;
  }

  let currentLang = DEFAULT_LANG;

  function detectInitialLanguage() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get('lang');
      if (urlLang && translations[urlLang.toLowerCase()]) {
        return urlLang.toLowerCase();
      }

      if (window.location.hash === '#en') return 'en';
      if (window.location.hash === '#pt') return 'pt';

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && translations[saved.toLowerCase()]) {
        return saved.toLowerCase();
      }
    } catch (e) {
      console.warn('Erro ao ler idioma salvo:', e);
    }
    return DEFAULT_LANG;
  }

  function applyLanguage(lang) {
    if (!translations[lang]) lang = DEFAULT_LANG;
    currentLang = lang;

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}

    // 1. Atualiza tag <html lang="...">
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';

    // 2. Atualiza Document Title & Description
    const pageData = translations[lang].page;
    if (pageData) {
      if (pageData.title) document.title = pageData.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && pageData.description) metaDesc.setAttribute('content', pageData.description);
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle && pageData.title) ogTitle.setAttribute('content', pageData.title);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc && pageData.description) ogDesc.setAttribute('content', pageData.description);
    }

    // 3. Atualiza todos os elementos com data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = getNestedValue(translations[lang], key);
      if (text !== null && text !== undefined) {
        el.innerHTML = text;
      }
    });

    // 4. Elementos com data-i18n-title
    const titleElements = document.querySelectorAll('[data-i18n-title]');
    titleElements.forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const val = getNestedValue(translations[lang], key);
      if (val) el.setAttribute('title', val);
    });

    // 5. Elementos com data-i18n-aria
    const ariaElements = document.querySelectorAll('[data-i18n-aria]');
    ariaElements.forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      const val = getNestedValue(translations[lang], key);
      if (val) el.setAttribute('aria-label', val);
    });

    // 6. Atualiza estado ativo dos botões seletores de idioma
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
      const target = btn.getAttribute('data-lang-target');
      if (target === lang) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    // 7. Notifica outros scripts (ex: GitHub releases updater para repopular tags dinâmicas)
    document.dispatchEvent(new CustomEvent('chatUnifierLanguageChanged', { detail: { lang } }));
  }

  function init() {
    const initial = detectInitialLanguage();
    applyLanguage(initial);

    // Event listeners para botões de idioma
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.lang-btn');
      if (btn) {
        e.preventDefault();
        const targetLang = btn.getAttribute('data-lang-target');
        if (targetLang && targetLang !== currentLang) {
          applyLanguage(targetLang);
        }
      }
    });
  }

  return {
    init,
    setLanguage: applyLanguage,
    getLanguage: () => currentLang,
    getText: (keyPath) => getNestedValue(translations[currentLang], keyPath) || ''
  };
})();

// Disponibiliza globalmente
if (typeof window !== 'undefined') {
  window.ChatUnifierI18n = ChatUnifierI18n;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChatUnifierI18n;
}

// Inicializa quando o DOM estiver pronto
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ChatUnifierI18n.init);
  } else {
    ChatUnifierI18n.init();
  }
}

