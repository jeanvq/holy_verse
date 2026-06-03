/* ============================================
   HolyVerse v2 — bot.js
   Bible Bot con Claude (Anthropic)
   ============================================ */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

const BibleBot = {

  // Historial de conversación
  history: [],

  // System prompt
  systemPrompt: `Eres Bible Bot, un asistente bíblico experto y amable integrado en HolyVerse.
Tienes conocimiento profundo de:
- Todos los libros de la Biblia (AT y NT)
- Contexto histórico y cultural bíblico
- Idiomas originales (griego koiné y hebreo bíblico)
- Diccionario Strong's
- Teología cristiana

Responde siempre en el idioma en que te pregunten (español o inglés).
Sé conciso pero profundo. Cuando cites versículos, usa el formato: "texto" (Libro capítulo:versículo).
No des sermones ni presiones. Solo educa, explica y acompaña.`,

  async ask(message) {
    // Agregar mensaje al historial
    this.history.push({ role: 'user', content: message });

    // Mantener historial máximo de 10 mensajes
    if (this.history.length > 10) {
      this.history = this.history.slice(-10);
    }

    try {
      const response = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5',
          max_tokens: 1024,
          system: this.systemPrompt,
          messages: this.history
        })
      });

      if (!response.ok) {
        throw new Error('API error: ' + response.status);
      }

      const data = await response.json();
      const reply = data.content?.[0]?.text || 'No pude obtener respuesta.';

      // Agregar respuesta al historial
      this.history.push({ role: 'assistant', content: reply });

      return reply;

    } catch (error) {
      console.error('BibleBot error:', error);
      return currentLang === 'en'
        ? '⚠️ Could not connect to Bible Bot. Please try again.'
        : '⚠️ No se pudo conectar con Bible Bot. Intenta de nuevo.';
    }
  },

  clearHistory() {
    this.history = [];
  }
};