# Chat Unifier v1.0.0

Unificador de chats de live streaming (YouTube, Twitch e Kick) para OBS, com foco em design premium e facilidade de uso. Funciona via scraping local em janelas ocultas.

## 🚀 Como instalar e rodar

1. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.
2. Clone este projeto.
3. No terminal, execute:
   ```bash
   npm install
   ```
4. Para iniciar:
   ```bash
   npm start
   ```

## 🎥 Configuração no OBS

1. Adicione seus canais no **Chat Unifier**.
2. Clique em **"Iniciar Captura"**.
3. Copie a **URL do OBS**.
4. No OBS Studio, adicione uma fonte de **Navegador**, cole a URL e defina o tamanho desejado (ex: 400x600).

## 🛠️ Tecnologias

- **Electron.js**: Core desktop.
- **Express & Socket.io**: Servidor de overlay em tempo real.
- **Tailwind CSS**: Interface inspirada no Remind.hub.
- **Scraping**: Captura via DOM sem necessidade de APIs oficiais.

---
Desenvolvido com foco em performance e estética.
