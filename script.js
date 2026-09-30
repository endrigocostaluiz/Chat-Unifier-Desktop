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

  // 2. FAQ Accordion
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

  // 4. Buscar dados da release no GitHub (Fallback gracioso caso rate limit)
  fetch('https://api.github.com/repos/endrigocostaluiz/Chat-Unifier-Desktop/releases/latest')
    .then(res => res.json())
    .then(data => {
      if (data && data.tag_name) {
        const versionBadges = document.querySelectorAll('.dynamic-version');
        versionBadges.forEach(el => {
          el.innerText = data.tag_name;
        });

        // Atualizar link direto do asset .exe se disponível
        if (data.assets && data.assets.length > 0) {
          const exeAsset = data.assets.find(a => a.name.endsWith('.exe'));
          if (exeAsset && exeAsset.browser_download_url) {
            const dlButtons = document.querySelectorAll('.direct-download-btn');
            dlButtons.forEach(btn => {
              btn.href = exeAsset.browser_download_url;
            });
          }
        }
      }
    })
    .catch(() => {
      // Ignora erro e mantém valores padrão do HTML
    });
});
