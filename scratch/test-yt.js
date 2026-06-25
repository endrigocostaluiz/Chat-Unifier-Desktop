// Teste da API Innertube do YouTube (usada internamente pelo próprio site)
fetch('https://www.youtube.com/youtubei/v1/updated_metadata?prettyPrint=false', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    videoId: '0G5A5XUoHhU',
    context: {
      client: {
        clientName: 'WEB',
        clientVersion: '2.20240101.00.00'
      }
    }
  })
}).then(r => r.json()).then(data => {
  // O viewer count vem no campo actions
  const actions = data.actions || [];
  actions.forEach(a => {
    if (a.updateViewershipAction) {
      const counts = a.updateViewershipAction.viewCount;
      console.log('viewCount object:', JSON.stringify(counts, null, 2));
    }
  });
  // Fallback: imprimir estrutura raiz
  console.log('Keys:', Object.keys(data));
}).catch(console.error);
