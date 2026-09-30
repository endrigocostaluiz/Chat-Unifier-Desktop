// ========================================================
// Chat Unifier Desktop - Interactive Client Script
// ========================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle & Drawer
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

  function toggleMobileMenu(open) {
    const shouldOpen = open !== undefined ? open : !mobileDrawer?.classList.contains('open');
    if (shouldOpen) {
      mobileToggle?.classList.add('active');
      mobileDrawer?.classList.add('open');
      mobileToggle?.setAttribute('aria-expanded', 'true');
      mobileDrawer?.setAttribute('aria-hidden', 'false');
    } else {
      mobileToggle?.classList.remove('active');
      mobileDrawer?.classList.remove('open');
      mobileToggle?.setAttribute('aria-expanded', 'false');
      mobileDrawer?.setAttribute('aria-hidden', 'true');
    }
  }

  mobileToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMobileMenu();
  });

  mobileNavItems.forEach(item => {
    item.addEventListener('click', () => {
      toggleMobileMenu(false);
    });
  });

  document.addEventListener('click', (e) => {
    if (mobileDrawer?.classList.contains('open') && !mobileDrawer.contains(e.target) && !mobileToggle?.contains(e.target)) {
      toggleMobileMenu(false);
    }
  });

  // 3. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Fecha outros itens
      faqItems.forEach(other => other.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });


  // 3. Copiar texto utilitário
  window.copyText = function(text, btnElement) {
    if (!navigator.clipboard) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    } else {
      navigator.clipboard.writeText(text);
    }

    if (btnElement) {
      const originalText = btnElement.innerHTML;
      btnElement.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:#10b981;"><polyline points="20 6 9 17 4 12"/></svg>
        <span>Copiado!</span>
      `;
      btnElement.style.borderColor = '#10b981';
      btnElement.style.color = '#34d399';
      setTimeout(() => {
        btnElement.innerHTML = originalText;
        btnElement.style.borderColor = '';
        btnElement.style.color = '';
      }, 2000);
    }
  };

  // 4. Sistema Dinâmico de Captura Automática da Última Versão do GitHub
  function applyReleaseData(release) {
    if (!release) return;

    const tagName = release.tag_name || 'v1.5.3';

    // 1. Atualiza todos os badges e textos de versão
    const versionElements = document.querySelectorAll('.dynamic-version');
    versionElements.forEach(el => {
      el.textContent = tagName;
    });

    // 2. Busca o arquivo executável (.exe) da release
    let exeAsset = null;
    if (release.assets && Array.isArray(release.assets) && release.assets.length > 0) {
      exeAsset = release.assets.find(a => a.name && a.name.toLowerCase().endsWith('.exe')) || release.assets[0];
    }

    if (exeAsset) {
      // Atualiza os links de download direto
      const downloadButtons = document.querySelectorAll('.direct-download-btn');
      downloadButtons.forEach(btn => {
        if (exeAsset.browser_download_url) {
          btn.href = exeAsset.browser_download_url;
          btn.setAttribute('download', exeAsset.name);
          btn.setAttribute('title', `Baixar ${exeAsset.name}`);
        }
      });

      // Atualiza o tamanho em MB
      if (exeAsset.size) {
        const sizeMb = (exeAsset.size / (1024 * 1024)).toFixed(1) + ' MB';
        const sizeElements = document.querySelectorAll('.dynamic-size');
        sizeElements.forEach(el => {
          el.textContent = sizeMb;
        });
      }

      // Atualiza o nome do arquivo exibido
      if (exeAsset.name) {
        const filenameElements = document.querySelectorAll('.dynamic-filename');
        filenameElements.forEach(el => {
          el.textContent = exeAsset.name;
        });
      }
    }
  }

  // Carrega imediatamente do cache da sessão (se já consultado nesta sessão)
  try {
    const cached = sessionStorage.getItem('chat_unifier_release_cache');
    if (cached) {
      applyReleaseData(JSON.parse(cached));
    }
  } catch(e) {}

  // Consulta a API do GitHub Releases para obter sempre a última versão cadastrada
  fetch('https://api.github.com/repos/endrigocostaluiz/Chat-Unifier-Desktop/releases/latest', {
    headers: { 'Accept': 'application/vnd.github.v3+json' }
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      if (data && data.tag_name) {
        applyReleaseData(data);
        try {
          sessionStorage.setItem('chat_unifier_release_cache', JSON.stringify(data));
        } catch(e) {}
      }
    })
    .catch(err => {
      console.warn('Usando fallback para releases/latest:', err.message);
      // Fallback: garante que todos os botões de download apontem para /releases/latest caso haja erro de rede
      const downloadButtons = document.querySelectorAll('.direct-download-btn');
      downloadButtons.forEach(btn => {
        if (!btn.href || btn.href.endsWith('.html') || btn.href === '#') {
          btn.href = 'https://github.com/endrigocostaluiz/Chat-Unifier-Desktop/releases/latest';
        }
      });
    });
});

