/* ============================================
   HolyVerse v2 — bible.js
   Conecta con holyverse-api en Railway
   ============================================ */

const API_BASE = 'https://holyverse-api-production.up.railway.app';
const STRONGS_API_BASE = 'https://holyverse-api-production.up.railway.app';

window.BibleAPI = {

  currentTranslation: 'nbla',

  // ── Cargar capítulo ──
  async loadChapter(book, chapter) {
    const verseList = document.getElementById('verseList');
    verseList.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text3)">Cargando...</div>';

    // Actualizar header de inmediato (así no se queda pegado en el libro anterior si algo falla)
    document.getElementById('currentBook').textContent = `${typeof displayBookName === 'function' ? displayBookName(book) : book} ${chapter}`;

    try {
      const isEnglishTranslation = this.currentTranslation === 'kjv' || this.currentTranslation === 'esv';
      const apiBook = isEnglishTranslation && typeof BOOK_NAMES_EN !== 'undefined'
        ? (BOOK_NAMES_EN[book] || book)
        : book;

      const res  = await fetch(`${API_BASE}/api/bible/${encodeURIComponent(apiBook)}/${chapter}?translation=${this.currentTranslation}`);
      const data = await res.json();

      if (data.error) {
        verseList.innerHTML = `<div style="padding:40px;text-align:center;color:var(--danger)">${data.error}</div>`;
        return;
      }

      const displayName = typeof displayBookName === 'function' ? displayBookName(book) : book;

      // Actualizar header
      document.getElementById('currentBook').textContent = `${displayName} ${chapter}`;
      document.getElementById('chapterTitle').textContent = `${displayName} — Capítulo ${chapter} · ${this.currentTranslation.toUpperCase()}`;
      document.getElementById('currentTranslation').textContent = this.currentTranslation.toUpperCase();

      // Renderizar versículos
     verseList.innerHTML = data.verses.map(v => `
  <div class="verse-row" 
    data-book="${data.book}"
    data-chapter="${chapter}"
    data-verse="${v.number}"
    onclick="handleVerseClick(event, this)"
    oncontextmenu="showVerseMenu(event, '${v.reference.replace(/'/g,"\\'")}', \`${v.text.replace(/`/g,"\\`")}\`)"
    ontouchstart="startLongPress(event, '${v.reference.replace(/'/g,"\\'")}', \`${v.text.replace(/`/g,"\\`")}\`)"
    ontouchend="cancelLongPress()"
    ontouchmove="cancelLongPress()">
    <span class="vr-num">${v.number}</span>
    <span class="vr-text">${v.text}</span>
  </div>
`).join('');

      // Actualizar variables globales (siempre en español — es el identificador interno canónico)
      currentBookName = book;
      currentChapter  = chapter;
      applyHighlightsToChapter();

    } catch (err) {
      verseList.innerHTML = '<div style="padding:40px;text-align:center;color:var(--danger)">Error de conexión</div>';
      console.error(err);
    }
  },

  // ── Cargar capítulo en modo Strong's (griego interlineal) ──
  async loadChapterStrongs(book, chapter) {
    const verseList = document.getElementById('verseList');
    verseList.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text3)">Cargando griego original...</div>';

    try {
      const res  = await fetch(`${STRONGS_API_BASE}/api/strongswords-chapter/${encodeURIComponent(book)}/${chapter}`);
      const data = await res.json();

      if (data.error) {
        verseList.innerHTML = `
          <div style="padding:40px 24px;text-align:center;color:var(--text3)">
            <div style="font-size:32px;margin-bottom:12px">📜</div>
            <div style="margin-bottom:8px">Strong's aún no disponible para este libro</div>
            <div style="font-size:12px">Por ahora cubrimos el Nuevo Testamento</div>
          </div>`;
        return;
      }

      document.getElementById('currentBook').textContent = `${book} ${chapter}`;
      document.getElementById('chapterTitle').textContent = `${book} — Capítulo ${chapter} · Griego Original`;
      document.getElementById('currentTranslation').textContent = 'STRONG\'S';

      const verseNumbers = Object.keys(data.verses).sort((a, b) => parseInt(a) - parseInt(b));

      verseList.innerHTML = verseNumbers.map(vNum => {
        const words = data.verses[vNum];
        const wordsHTML = words.map(w => `
          <span class="sw" 
            onclick="showStrongsFromWord(this)" 
            data-strong="${w.strong}" 
            data-word="${w.word}" 
            data-lemma="${w.lemma}">${w.word}</span>
        `).join(' ');

        return `
          <div class="verse-row">
            <span class="vr-num">${vNum}</span>
            <span class="vr-text" style="font-family:'Cormorant Garamond',serif;font-size:19px">${wordsHTML}</span>
          </div>
        `;
      }).join('');

      currentBookName = book;
      currentChapter  = chapter;

    } catch (err) {
      verseList.innerHTML = '<div style="padding:40px;text-align:center;color:var(--danger)">Error de conexión</div>';
      console.error(err);
    }
  },

  // ── Búsqueda ──

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
    try {
      const lang = window.currentLang || localStorage.getItem('hv_lang') || 'es';
      const res  = await fetch(`${API_BASE}/api/verse/mood`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, lang })
      });
      const data = await res.json();

      if (data.text) {
  document.getElementById('dailyVerseText').textContent = data.text;
  document.getElementById('dailyVerseRef').textContent  = `${data.reference} · ${data.translation}`;
  document.querySelector('.verse-tag').textContent = 'Versículo para tu momento';
  const btn = document.getElementById('btnSaveDaily');
  isFavorited(data.reference).then(saved => setSaveButtonState(btn, saved));
  document.querySelector('.page-content').scrollTo({ top: 0, behavior: 'smooth' });
  showToast('📖 ' + data.reference);
}
    } catch (err) {
      console.error('Mood verse error:', err);
      showToast('⚠️ Error obteniendo versículo');
    }
  }
};

// ── VERSE MENU ──
let activeVerse = null;
let longPressTimer = null;

function showVerseMenu(e, reference, text) {
  e.preventDefault();
  const row = e.currentTarget || e.target.closest('.verse-row');
  activeVerse = {
    reference,
    text,
    book: row ? row.dataset.book : null,
    chapter: row ? row.dataset.chapter : null,
    verse: row ? row.dataset.verse : null
  };
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

async function toggleHighlightFromMenu() {
  if (!activeVerse) return;
  try {
    const highlighted = await isHighlighted(activeVerse.reference);
    if (highlighted) {
      await removeHighlight(sanitizeFavId(activeVerse.reference));
      showToast('Subrayado quitado');
    } else {
      await saveHighlight(activeVerse);
      showToast('🖍️ Versículo subrayado');
    }
    applyHighlightsToChapter();
  } catch (err) {
    console.error('Highlight error:', err);
    showToast('⚠️ No se pudo subrayar');
  }
  closeVerseMenu();
}
