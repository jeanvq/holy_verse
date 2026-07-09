/* ============================================
   HolyVerse v2 — bot.js
   Bible Bot conectado al backend seguro
   ============================================ */

const BOT_API = 'https://holyverse-api-production.up.railway.app';

const BibleBot = {
  history: [],

  async ask(message) {
    this.history.push({ role: 'user', content: message });
    if (this.history.length > 20) this.history = this.history.slice(-20);

    try {
      const res  = await fetch(`${BOT_API}/api/bot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: this.history.slice(0, -1),
          lang: window.currentLang || 'es'
        })
      });

      const data  = await res.json();
      const reply = data.reply || 'No pude obtener respuesta.';
      this.history.push({ role: 'assistant', content: reply });
      return reply;

    } catch (err) {
      console.error('BibleBot error:', err);
      return window.currentLang === 'en'
        ? '⚠️ Could not connect to Bible Bot. Please try again.'
        : '⚠️ No se pudo conectar con Bible Bot. Intenta de nuevo.';
    }
  },

  clearHistory() {
    this.history = [];
  }
};