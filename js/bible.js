/* ============================================
   HolyVerse v2 — bible.js
   Conecta con holyverse-api en Railway
   ============================================ */

const API_BASE = 'https://holyverse-api-production.up.railway.app';

const BibleAPI = {

  currentTranslation: 'nbla',

  // ── Cargar capítulo ──
  async loadChapter(book, chapter) {
    const verseList = document.getElementById('verseList');
    verseList.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text3)">Cargando...</div>';

    try {
      const res  = await fetch(`${API_BASE}/api/bible/${encodeURIComponent(book)}/${chapter}?translation=${this.currentTranslation}`);
      const data = await res.json();

      if (data.error) {
        verseList.innerHTML = `<div style="padding:40px;text-align:center;color:var(--danger)">${data.error}</div>`;
        return;
      }

      // Actualizar header
      document.getElementById('currentBook').textContent = `${data.book} ${chapter}`;
      document.getElementById('chapterTitle').textContent = `${data.book} — Capítulo ${chapter} · ${this.currentTranslation.toUpperCase()}`;
      document.getElementById('currentTranslation').textContent = this.currentTranslation.toUpperCase();

      // Renderizar versículos
      verseList.innerHTML = data.verses.map(v => `
  <div class="verse-row" 
    oncontextmenu="showVerseMenu(event, '${v.reference.replace(/'/g,"\\'")}', \`${v.text.replace(/`/g,"\\`")}\`)"
    ontouchstart="startLongPress(event, '${v.reference.replace(/'/g,"\\'")}', \`${v.text.replace(/`/g,"\\`")}\`)"
    ontouchend="cancelLongPress()"
    ontouchmove="cancelLongPress()">
    <span class="vr-num">${v.number}</span>
    <span class="vr-text">${v.text}</span>
  </div>
`).join('');

      // Actualizar variables globales
      currentBookName = data.book;
      currentChapter  = chapter;

    } catch (err) {
      verseList.innerHTML = '<div style="padding:40px;text-align:center;color:var(--danger)">Error de conexión</div>';
      console.error(err);
    }
  },

  // ── Búsqueda ──
  async search(query) {
    const results = document.getElementById('searchResults');
    results.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text3)">Buscando...</div>';

    try {
      const res  = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}&translation=${this.currentTranslation}`);
      const data = await res.json();

      if (!data.verses?.length) {
        results.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text3)">Sin resultados</div>';
        return;
      }

      results.innerHTML = data.verses.map(v => `
        <div class="result-card fade-up">
          <div class="result-ref">${v.reference}</div>
          <div class="result-text">${v.text}</div>
        </div>
      `).join('');

    } catch (err) {
      results.innerHTML = '<div style="padding:40px;text-align:center;color:var(--danger)">Error de conexión</div>';
      console.error(err);
    }
  },

  // ── Versículo aleatorio ──
  async getRandomVerse(lang = 'es') {
    try {
      const res  = await fetch(`${API_BASE}/api/verse/random?lang=${lang}`);
      const data = await res.json();

      if (data.text) {
        document.getElementById('dailyVerseText').textContent = data.text;
        document.getElementById('dailyVerseRef').textContent  = `${data.reference} · ${data.translation.toUpperCase()}`;
      }
    } catch (err) {
      console.error('Error fetching random verse:', err);
    }
  },

  // ── Cambiar traducción ──
  setTranslation(translationId) {
    this.currentTranslation = translationId;
    this.loadChapter(currentBookName, currentChapter);
  },

  // ── Verso por mood ──
  getVerseByMood(mood) {
    const moodMap = {
      hopeful:  'Juan 3:16',
      anxious:  'Filipenses 4:6',
      grieving: 'Salmos 23:1',
      joyful:   'Salmos 100:1',
      confused: 'Proverbios 3:5',
      peaceful: 'Isaías 26:3',
    };
    const verse = moodMap[mood] || 'Juan 3:16';
    showToast(`📖 ${verse}`);
  }
};
// ── VERSE MENU ──
let activeVerse = null;
let longPressTimer = null;

function showVerseMenu(e, reference, text) {
  e.preventDefault();
  activeVerse = { reference, text };
  document.getElementById('verseMenuRef').textContent = reference;
  document.getElementById('verseMenuText').textContent = text.replace(/\[\d+\]/g, '');
  document.getElementById('verseMenuModal').classList.remove('hidden');
}

function closeVerseMenu() {
  document.getElementById('verseMenuModal').classList.add('hidden');
  activeVerse = null;
}

function startLongPress(e, reference, text) {
  longPressTimer = setTimeout(() => {
    showVerseMenu(e, reference, text);
  }, 600);
}

function cancelLongPress() {
  clearTimeout(longPressTimer);
}

function saveVerseFromMenu() {
  if (!activeVerse) return;
  saveFavorite(activeVerse);
  closeVerseMenu();
}

function copyVerseFromMenu() {
  if (!activeVerse) return;
  copyToClipboard(`"${activeVerse.text.replace(/\[\d+\]/g, '')}" — ${activeVerse.reference}`);
  closeVerseMenu();
}

function shareVerseFromMenu() {
  if (!activeVerse) return;
  shareVerse(activeVerse.text.replace(/\[\d+\]/g, ''), activeVerse.reference);
  closeVerseMenu();
}
