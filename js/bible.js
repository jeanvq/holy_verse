/* ============================================
   HolyVerse v2 — bible.js
   Conecta con holyverse-api en Railway
   ============================================ */

const API_BASE = 'https://holyverse-api-production.up.railway.app';

window.BibleAPI = {

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
  async getVerseByMood(mood) {
    const moodMap = {
      hopeful:  { book: 'Jeremías', bookEn: 'Jeremiah', chapter: 29, verse: 11 },
      anxious:  { book: 'Filipenses', bookEn: 'Philippians', chapter: 4, verse: 6 },
      grieving: { book: 'Salmo', bookEn: 'Psalm', chapter: 34, verse: 18 },
      joyful:   { book: 'Salmo', bookEn: 'Psalm', chapter: 118, verse: 24 },
      confused: { book: 'Proverbios', bookEn: 'Proverbs', chapter: 3, verse: 5 },
      peaceful: { book: 'Isaías', bookEn: 'Isaiah', chapter: 26, verse: 3 },
    };

    const entry = moodMap[mood];
    if (!entry) return;
    

    const lang = window.currentLang || localStorage.getItem('hv_lang') || 'es';
    const book        = lang === 'en' ? entry.bookEn : entry.book;
    const translation = lang === 'en' ? 'kjv' : 'nbla';

    console.log('mood:', mood, 'lang:', lang, 'book:', entry.book);

    try {
      console.log('Fetching mood verse for:', mood, book, entry.chapter, translation);
      const res  = await fetch(`${API_BASE}/api/bible/${encodeURIComponent(book)}/${entry.chapter}?translation=${translation}`);
      const data = await res.json();

      if (data.verses?.length) {
        // Buscar el versículo específico o el bloque que lo contiene
        const target = data.verses.find(v => v.number === entry.verse) || 
                       data.verses.reduce((prev, curr) => 
                         curr.number <= entry.verse && curr.number > (prev?.number || 0) ? curr : prev, null);

        if (target) {
          document.getElementById('dailyVerseText').textContent = target.text.replace(/\[\d+\]/g, '');
          document.getElementById('dailyVerseRef').textContent  = `${target.reference} · ${translation.toUpperCase()}`;
          document.querySelector('.page-content').scrollTo({ top: 0, behavior: 'smooth' });
          showToast('📖 ' + target.reference);
        }
      }
    } catch (err) {
      console.error(err);
    }
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
