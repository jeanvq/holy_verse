/* ============================================
   HolyVerse v2 — app.js
   Lógica principal de navegación y UI
   ============================================ */

   // ── VARIABLES GLOBALES ──
let currentLang    = localStorage.getItem('hv_lang') || 'es';
let strongsEnabled = false;
let currentBookName = 'Juan';
let currentChapter  = 3;


  // ── NAVEGACIÓN ──
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (name === 'characters') renderCharactersList();
  if (name === 'characters') renderCharactersList();
  if (name === 'maps') setTimeout(() => initBibleMap(), 100);

  const screen = document.getElementById('screen-' + name);
  if (screen) {
    screen.classList.add('active');
    screen.style.animation = 'fadeUp 0.2s ease both';
  }

  const navItem = document.querySelector(`.nav-item[data-screen="${name}"]`);
  if (navItem) navItem.classList.add('active');

  const content = document.querySelector('.page-content');
  if (content) content.scrollTop = 0;

  // Renderizar libros cuando se abre la pantalla Biblia
  if (name === 'bible') renderBooksGrid();
}


// ── TOAST ──
function showToast(msg, duration = 2500) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

// ── MOOD ──
document.addEventListener('click', function(e) {
  const chip = e.target.closest('.mood-chip');
  if (!chip) return;
  
  document.querySelectorAll('.mood-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  const mood = chip.dataset.mood;
  loadMoodVerse(mood);
});

function loadMoodVerse(mood) {
  showToast('Buscando versículo...');
  setTimeout(() => {
    if (window.BibleAPI) BibleAPI.getVerseByMood(mood);
  }, 100);
}

// ── VERSÍCULO DEL DÍA ──
function loadDailyVerse() {
  const textEl = document.getElementById('dailyVerseText');
  const refEl  = document.getElementById('dailyVerseRef');

  const fallback = {
    es: [
      { text: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.', reference: 'Juan 3:16 · RVR 1960' },
      { text: 'Todo lo puedo en Cristo que me fortalece.', reference: 'Filipenses 4:13 · RVR 1960' },
      { text: 'El Señor es mi pastor; nada me faltará.', reference: 'Salmos 23:1 · RVR 1960' },
      { text: 'Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia.', reference: 'Proverbios 3:5 · RVR 1960' },
      { text: 'Mas buscad primeramente el reino de Dios y su justicia, y todas estas cosas os serán añadidas.', reference: 'Mateo 6:33 · RVR 1960' },
      { text: 'No os afanéis por nada; sino sean conocidas vuestras peticiones delante de Dios en toda oración.', reference: 'Filipenses 4:6 · RVR 1960' },
      { text: 'Y conoceréis la verdad, y la verdad os hará libres.', reference: 'Juan 8:32 · RVR 1960' },
    ],
    en: [
      { text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.', reference: 'John 3:16 · KJV' },
      { text: 'I can do all things through Christ which strengtheneth me.', reference: 'Philippians 4:13 · KJV' },
      { text: 'The Lord is my shepherd; I shall not want.', reference: 'Psalms 23:1 · KJV' },
      { text: 'Trust in the Lord with all thine heart; and lean not unto thine own understanding.', reference: 'Proverbs 3:5 · KJV' },
      { text: 'But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.', reference: 'Matthew 6:33 · KJV' },
      { text: 'Be careful for nothing; but in every thing by prayer let your requests be made known unto God.', reference: 'Philippians 4:6 · KJV' },
      { text: 'And ye shall know the truth, and the truth shall make you free.', reference: 'John 8:32 · KJV' },
    ]
  };

  const day = new Date().getDate();

  window.updateDailyVerseByLang = function(lang) {
    const verse = fallback[lang][day % fallback[lang].length];
    if (textEl) textEl.textContent = verse.text;
    if (refEl)  refEl.textContent  = verse.reference;
  };

  window.updateDailyVerseByLang(currentLang);
}
  // Fallback verses mientras carga la API
  const fallback = {
    es: [
      { text: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.', reference: 'Juan 3:16 · RVR 1960' },
      { text: 'Todo lo puedo en Cristo que me fortalece.', reference: 'Filipenses 4:13 · RVR 1960' },
      { text: 'El Señor es mi pastor; nada me faltará.', reference: 'Salmos 23:1 · RVR 1960' },
      { text: 'Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia.', reference: 'Proverbios 3:5 · RVR 1960' },
      { text: 'Mas buscad primeramente el reino de Dios y su justicia, y todas estas cosas os serán añadidas.', reference: 'Mateo 6:33 · RVR 1960' },
      { text: 'No os afanéis por nada; sino sean conocidas vuestras peticiones delante de Dios en toda oración.', reference: 'Filipenses 4:6 · RVR 1960' },
      { text: 'Y conoceréis la verdad, y la verdad os hará libres.', reference: 'Juan 8:32 · RVR 1960' },
    ],
    en: [
      { text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.', reference: 'John 3:16 · KJV' },
      { text: 'I can do all things through Christ which strengtheneth me.', reference: 'Philippians 4:13 · KJV' },
      { text: 'The Lord is my shepherd; I shall not want.', reference: 'Psalms 23:1 · KJV' },
      { text: 'Trust in the Lord with all thine heart; and lean not unto thine own understanding.', reference: 'Proverbs 3:5 · KJV' },
      { text: 'But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.', reference: 'Matthew 6:33 · KJV' },
      { text: 'Be careful for nothing; but in every thing by prayer let your requests be made known unto God.', reference: 'Philippians 4:6 · KJV' },
      { text: 'And ye shall know the truth, and the truth shall make you free.', reference: 'John 8:32 · KJV' },
    ]
  };
// Renderizar en el idioma actual
loadDailyVerse();
// Botones del versículo del día
document.getElementById('btnSaveDaily').addEventListener('click', () => {
  const text = document.getElementById('dailyVerseText').textContent;
  const ref  = document.getElementById('dailyVerseRef').textContent;
  saveFavorite({ text, reference: ref });
});

document.getElementById('btnShareDaily').addEventListener('click', () => {
  const text = document.getElementById('dailyVerseText').textContent;
  const ref  = document.getElementById('dailyVerseRef').textContent;
  shareVerse(text, ref);
});

document.getElementById('btnReadDaily').addEventListener('click', () => {
  showScreen('bible');
  const ref = document.getElementById('dailyVerseRef').textContent;
  const match = ref.match(/^(.+?)\s+(\d+):(\d+)/);
  if (match) {
    const book    = match[1].trim();
    const chapter = parseInt(match[2]);
    const verse   = parseInt(match[3]);
    showChapterView();
    BibleAPI.loadChapter(book, chapter).then(() => {
      // Scroll al versículo específico
     setTimeout(() => {
  const verseEls = document.querySelectorAll('.verse-row');
  
  // Buscar el versículo exacto o el bloque que lo contiene
  let target = null;
  let closest = null;
  let closestNum = 0;

  verseEls.forEach(el => {
    const num = el.querySelector('.vr-num');
    if (!num) return;
    const n = parseInt(num.textContent);
    if (n === verse) {
      target = el; // exacto
    } else if (n < verse && n > closestNum) {
      closestNum = n;
      closest = el; // el bloque que lo contiene
    }
  });

  const finalTarget = target || closest;
  if (finalTarget) {
    // Quitar resaltados previos
    verseEls.forEach(el => {
      el.classList.remove('hl');
      el.style.borderLeft = '';
    });
    // Resaltar en dorado intenso
    finalTarget.classList.add('hl');
    finalTarget.style.borderLeft = '3px solid var(--gold)';
    finalTarget.style.background = 'rgba(212,168,67,0.15)';
    finalTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}, 1500);
    });
  }
});

// ── COMPARTIR ──
function shareVerse(text, reference) {
  const shareText = `"${text}" — ${reference}\n\nHolyVerse · holyverse.ca`;
  if (navigator.share) {
    navigator.share({ title: 'HolyVerse', text: shareText })
      .catch(() => copyToClipboard(shareText));
  } else {
    copyToClipboard(shareText);
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => showToast('📋 Copiado al portapapeles'))
    .catch(() => showToast('No se pudo copiar'));
}

// ── FAVORITOS ──
function saveFavorite(verse) {
  const favs = JSON.parse(localStorage.getItem('hv_favorites') || '[]');
  const exists = favs.some(f => f.reference === verse.reference);
  if (exists) {
    showToast('Ya está en tus favoritos');
    return;
  }
  favs.unshift({ ...verse, savedAt: new Date().toISOString() });
  localStorage.setItem('hv_favorites', JSON.stringify(favs));
  document.getElementById('statFavorites').textContent = favs.length;
  showToast('❤️ Guardado en favoritos');
}

function getFavorites() {
  return JSON.parse(localStorage.getItem('hv_favorites') || '[]');
}
function renderFavorites() {
  const favs = getFavorites();
  const menu = document.querySelector('.menu-list');
  
  // Remover lista previa si existe
  const existing = document.getElementById('favoritesList');
  if (existing) existing.remove();

  if (!favs.length) {
    showToast('No tienes favoritos aún');
    return;
  }

  // Crear lista de favoritos
  const list = document.createElement('div');
  list.id = 'favoritesList';
  list.style.cssText = 'padding: 0 20px; display: flex; flex-direction: column; gap: 10px; margin-top: 10px;';

  list.innerHTML = favs.map((v, i) => `
    <div class="result-card fade-up" style="position:relative">
      <div class="result-ref">${v.reference}</div>
      <div class="result-text">${v.text}</div>
      <button onclick="removeFavorite(${i})" style="position:absolute;top:10px;right:10px;background:none;border:none;color:var(--text3);font-size:16px;cursor:pointer">✕</button>
    </div>
  `).join('');

  // Insertar después del menu-list
  menu.after(list);
}

function removeFavorite(index) {
  const favs = getFavorites();
  favs.splice(index, 1);
  localStorage.setItem('hv_favorites', JSON.stringify(favs));
  document.getElementById('statFavorites').textContent = favs.length;
  renderFavorites();
  showToast('Eliminado de favoritos');
}

// ── STRONG'S TOGGLE ──
function toggleStrongs() {
  strongsEnabled = !strongsEnabled;
  const toggle = document.getElementById('strongsToggle');
  const panel  = document.getElementById('strongsPanel');
  const legend = document.getElementById('legendBar');

  toggle.classList.toggle('on', strongsEnabled);
  panel.classList.toggle('visible', strongsEnabled);
  legend.classList.toggle('hidden', !strongsEnabled);

  if (!strongsEnabled) {
    document.getElementById('strongsPlaceholder').classList.remove('hidden');
    document.getElementById('strongsContent').classList.add('hidden');

    // Quitar resaltado de palabras y volver al texto plano original
    document.querySelectorAll('.verse-row').forEach(v => {
      delete v.dataset.strongsLoaded;
    });
    BibleAPI.loadChapter(currentBookName, currentChapter);
  }
}

// Mostrar info de una palabra Strong's (desde datos hardcodeados viejos)
function showStrongs(el) {
  if (!strongsEnabled) return;

  const lang   = el.dataset.lang || 'greek';
  const isGreek = lang === 'greek';

  document.getElementById('strongsPlaceholder').classList.add('hidden');
  const content = document.getElementById('strongsContent');
  content.classList.remove('hidden');

  const badge = document.getElementById('sBadge');
  badge.textContent = isGreek ? 'GRIEGO' : 'HEBREO';
  badge.className = 's-badge ' + (isGreek ? 'greek' : 'hebrew');

  document.getElementById('sNum').textContent  = el.dataset.strong || '';
  const wordEl = document.getElementById('sWord');
  wordEl.textContent = el.dataset.word || '';
  wordEl.className   = 's-word ' + (isGreek ? 'greek' : 'hebrew');
  document.getElementById('sTrans').textContent = el.dataset.tr || '';
  document.getElementById('sDef').textContent   = el.dataset.def || '';

  document.querySelectorAll('.sw').forEach(w => w.style.outline = 'none');
  el.style.outline = '1.5px solid ' + (isGreek ? 'rgba(126,207,255,0.7)' : 'rgba(168,240,160,0.7)');
}

// Mostrar info de una palabra Strong's (desde datos REALES del backend)
async function showStrongsFromWord(el) {
  const strongNum = el.dataset.strong;
  if (!strongNum) return;

  document.getElementById('strongsPlaceholder').classList.add('hidden');
  const content = document.getElementById('strongsContent');
  content.classList.remove('hidden');

  const badge = document.getElementById('sBadge');
  badge.textContent = 'GRIEGO';
  badge.className = 's-badge greek';

  document.getElementById('sNum').textContent = strongNum;
  const wordEl = document.getElementById('sWord');
  wordEl.textContent = el.dataset.lemma || el.dataset.word;
  wordEl.className = 's-word greek';
  document.getElementById('sTrans').textContent = 'Cargando...';
  document.getElementById('sDef').textContent = '';

  document.querySelectorAll('.sw').forEach(w => w.style.outline = 'none');
  el.style.outline = '1.5px solid rgba(126,207,255,0.7)';

  try {
    const res = await fetch(`https://holyverse-api-production.up.railway.app/api/strongs-es/${strongNum}`);
    const data = await res.json();

    document.getElementById('sTrans').textContent = data.translit || '';
    document.getElementById('sDef').textContent   = data.definition || data.kjv_def || 'Sin definición disponible';
  } catch (err) {
    document.getElementById('sTrans').textContent = '';
    document.getElementById('sDef').textContent = 'Error al cargar definición';
  }
}

// ── BOOK PICKER ──
const BOOKS = {
  ot: [
    { name: 'Génesis', chapters: 50 }, { name: 'Éxodo', chapters: 40 },
    { name: 'Levítico', chapters: 27 }, { name: 'Números', chapters: 36 },
    { name: 'Deuteronomio', chapters: 34 }, { name: 'Josué', chapters: 24 },
    { name: 'Jueces', chapters: 21 }, { name: 'Rut', chapters: 4 },
    { name: '1 Samuel', chapters: 31 }, { name: '2 Samuel', chapters: 24 },
    { name: '1 Reyes', chapters: 22 }, { name: '2 Reyes', chapters: 25 },
    { name: '1 Crónicas', chapters: 29 }, { name: '2 Crónicas', chapters: 36 },
    { name: 'Esdras', chapters: 10 }, { name: 'Nehemías', chapters: 13 },
    { name: 'Ester', chapters: 10 }, { name: 'Job', chapters: 42 },
    { name: 'Salmos', chapters: 150 }, { name: 'Proverbios', chapters: 31 },
    { name: 'Eclesiastés', chapters: 12 }, { name: 'Cantares', chapters: 8 },
    { name: 'Isaías', chapters: 66 }, { name: 'Jeremías', chapters: 52 },
    { name: 'Lamentaciones', chapters: 5 }, { name: 'Ezequiel', chapters: 48 },
    { name: 'Daniel', chapters: 12 }, { name: 'Oseas', chapters: 14 },
    { name: 'Joel', chapters: 3 }, { name: 'Amós', chapters: 9 },
    { name: 'Abdías', chapters: 1 }, { name: 'Jonás', chapters: 4 },
    { name: 'Miqueas', chapters: 7 }, { name: 'Nahúm', chapters: 3 },
    { name: 'Habacuc', chapters: 3 }, { name: 'Sofonías', chapters: 3 },
    { name: 'Hageo', chapters: 2 }, { name: 'Zacarías', chapters: 14 },
    { name: 'Malaquías', chapters: 4 },
  ],
  nt: [
    { name: 'Mateo', chapters: 28 }, { name: 'Marcos', chapters: 16 },
    { name: 'Lucas', chapters: 24 }, { name: 'Juan', chapters: 21 },
    { name: 'Hechos', chapters: 28 }, { name: 'Romanos', chapters: 16 },
    { name: '1 Corintios', chapters: 16 }, { name: '2 Corintios', chapters: 13 },
    { name: 'Gálatas', chapters: 6 }, { name: 'Efesios', chapters: 6 },
    { name: 'Filipenses', chapters: 4 }, { name: 'Colosenses', chapters: 4 },
    { name: '1 Tesalonicenses', chapters: 5 }, { name: '2 Tesalonicenses', chapters: 3 },
    { name: '1 Timoteo', chapters: 6 }, { name: '2 Timoteo', chapters: 4 },
    { name: 'Tito', chapters: 3 }, { name: 'Filemón', chapters: 1 },
    { name: 'Hebreos', chapters: 13 }, { name: 'Santiago', chapters: 5 },
    { name: '1 Pedro', chapters: 5 }, { name: '2 Pedro', chapters: 3 },
    { name: '1 Juan', chapters: 5 }, { name: '2 Juan', chapters: 1 },
    { name: '3 Juan', chapters: 1 }, { name: 'Judas', chapters: 1 },
    { name: 'Apocalipsis', chapters: 22 },
  ]
};

function openBookPicker() {
  renderBookList('');
  document.getElementById('bookPickerModal').classList.remove('hidden');
  setTimeout(() => document.getElementById('bookSearchInput').focus(), 300);
}

function closeBookPicker(e) {
  if (!e || e.target === document.getElementById('bookPickerModal')) {
    document.getElementById('bookPickerModal').classList.add('hidden');
  }
}

function filterBooks(query) {
  renderBookList(query.toLowerCase());
}

function renderBookList(query) {
  const list = document.getElementById('bookPickerList');
  let html = '';

  ['ot', 'nt'].forEach(testament => {
    const label = testament === 'ot' ? 'Antiguo Testamento' : 'Nuevo Testamento';
    const filtered = BOOKS[testament].filter(b => b.name.toLowerCase().includes(query));
    if (!filtered.length) return;
    html += `<div class="book-section-label">${label}</div>`;
    filtered.forEach(book => {
      html += `<div class="book-item" onclick="selectBook('${book.name}', ${book.chapters})">
        ${book.name}
        <span class="book-ch-count">${book.chapters} cap</span>
      </div>`;
    });
  });

  list.innerHTML = html || '<div style="padding:20px;text-align:center;color:var(--text3)">Sin resultados</div>';
}

function selectBook(name, chapters) {
  currentBookName = name;
  currentChapter  = 1;
  closeBookPicker();
  updateBibleHeader();
  BibleAPI.loadChapter(name, 1);
}

function updateBibleHeader() {
  document.getElementById('currentBook').textContent = `${currentBookName} ${currentChapter}`;
  document.getElementById('chapterTitle').textContent = `${currentBookName} — Capítulo ${currentChapter} · RVR 1960`;
}

// ── AUTH SHEET ──
function openAuthSheet() {
  document.getElementById('authModal').classList.remove('hidden');
}
function closeAuthSheet(e) {
  if (!e || e.target === document.getElementById('authModal')) {
    document.getElementById('authModal').classList.add('hidden');
  }
}
function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach((t, i) => {
    t.classList.toggle('active', (i === 0 && tab === 'login') || (i === 1 && tab === 'signup'));
  });
  document.getElementById('loginForm').classList.toggle('hidden', tab !== 'login');
  document.getElementById('signupForm').classList.toggle('hidden', tab !== 'signup');
}
function loginWithEmail() {
  const email = document.getElementById('loginEmail').value;
  const pass  = document.getElementById('loginPassword').value;
  if (!email || !pass) { showToast('Completa todos los campos'); return; }
  if (window.AuthSystem) AuthSystem.loginWithEmail(email, pass);
  else showToast('Auth no disponible aún');
}
function signupWithEmail() {
  const name  = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const pass  = document.getElementById('signupPassword').value;
  if (!name || !email || !pass) { showToast('Completa todos los campos'); return; }
  if (window.AuthSystem) AuthSystem.signupWithEmail(name, email, pass);
  else showToast('Auth no disponible aún');
}
function logout() {
  if (window.AuthSystem) AuthSystem.logout();
}

// ── PROFILE ──
function updateProfileUI(user) {
  if (user) {
    document.getElementById('profileName').textContent  = user.displayName || 'Usuario';
    document.getElementById('profileEmail').textContent = user.email || '';
    document.getElementById('profileAvatar').textContent = (user.displayName || 'U')[0].toUpperCase();
    document.getElementById('btnLoginMenu').classList.add('hidden');
    document.getElementById('btnLogoutMenu').classList.remove('hidden');
  } else {
    document.getElementById('profileName').textContent  = 'Usuario';
    document.getElementById('profileEmail').textContent = 'Inicia sesión para guardar tu progreso';
    document.getElementById('profileAvatar').textContent = '👤';
    document.getElementById('btnLoginMenu').classList.remove('hidden');
    document.getElementById('btnLogoutMenu').classList.add('hidden');
  }
  // Stats
  const favs = getFavorites();
  document.getElementById('statFavorites').textContent = favs.length;
}

// ── STRONG'S INFO ──
function openStrongsInfo() {
  showScreen('bible');
  setTimeout(() => {
    if (!strongsEnabled) toggleStrongs();
    showToast('🔤 Strong\'s activado — toca palabras resaltadas');
  }, 300);
}

// ── SEARCH ──
document.getElementById('btnSearch').addEventListener('click', doSearch);
document.getElementById('searchInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') doSearch();
});

document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', function () {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    this.classList.add('active');
  });
});

function doSearch() {
  const query = document.getElementById('searchInput').value.trim();
  if (!query) { showToast('Escribe algo para buscar'); return; }
  if (window.BibleAPI) {
    BibleAPI.search(query);
  } else {
    showSearchResults(searchLocal(query));
  }
}

function searchLocal(query) {
  // Búsqueda básica en versículos de fallback
  const verses = [
    { text: 'Porque de tal manera amó Dios al mundo...', reference: 'Juan 3:16' },
    { text: 'Todo lo puedo en Cristo que me fortalece.', reference: 'Filipenses 4:13' },
    { text: 'El Señor es mi pastor; nada me faltará.', reference: 'Salmos 23:1' },
  ];
  return verses.filter(v =>
    v.text.toLowerCase().includes(query.toLowerCase()) ||
    v.reference.toLowerCase().includes(query.toLowerCase())
  );
}

function showSearchResults(results) {
  const container = document.getElementById('searchResults');
  if (!results.length) {
    container.innerHTML = '<div style="padding:40px 0;text-align:center;color:var(--text3);font-size:14px">Sin resultados</div>';
    return;
  }
  container.innerHTML = results.map(v => `
    <div class="result-card fade-up">
      <div class="result-ref">${v.reference}</div>
      <div class="result-text">${v.text}</div>
    </div>
  `).join('');
}

// ── BIBLE NAV ──
document.getElementById('btnPrevChapter').addEventListener('click', () => {
  if (currentChapter > 1) {
    currentChapter--;
    updateBibleHeader();
    BibleAPI.loadChapter(currentBookName, currentChapter);
  } else {
    showToast('Primer capítulo del libro');
  }
});
document.getElementById('btnNextChapter').addEventListener('click', () => {
  currentChapter++;
  updateBibleHeader();
  BibleAPI.loadChapter(currentBookName, currentChapter);
});
 
// ── CHAT BOT ──
function clearChat() {
  document.getElementById('chatArea').innerHTML = `
    <div class="bubble bot">
      Hola 👋 Soy tu guía del universo bíblico. ¿En qué te puedo ayudar?
    </div>`;
}

document.getElementById('btnSend').addEventListener('click', sendMessage);
document.getElementById('chatInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const input = document.getElementById('chatInput');
  const msg   = input.value.trim();
  if (!msg) return;
  input.value = '';

  const area = document.getElementById('chatArea');

  // Burbuja usuario
  area.innerHTML += `<div class="bubble user fade-up">${msg}</div>`;

  // Typing indicator
  const typingId = 'typing-' + Date.now();
  area.innerHTML += `
    <div class="bubble bot fade-up" id="${typingId}">
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>`;
  document.querySelector('.page-content').scrollTop = document.querySelector('.page-content').scrollHeight;

  // Llamar al bot
  if (window.BibleBot) {
    BibleBot.ask(msg).then(reply => {
      document.getElementById(typingId).outerHTML = `<div class="bubble bot fade-up">${formatBotReply(reply)}</div>`;
      document.querySelector('.page-content').scrollTop = document.querySelector('.page-content').scrollHeight;
    });
  } else {
    setTimeout(() => {
      document.getElementById(typingId).outerHTML = `
        <div class="bubble bot fade-up">
          El Bible Bot se está configurando. Por favor conecta tu API key de Anthropic en <code>js/bot.js</code>.
        </div>`;
      document.querySelector('.page-content').scrollTop = document.querySelector('.page-content').scrollHeight;
    }, 1000);
  }
}
// ── TEMA CLARO/OSCURO ──
const themeBtn = document.getElementById('btnTheme');
const savedTheme = localStorage.getItem('hv_theme') || 'dark';
if (savedTheme === 'light') {
  document.body.classList.add('light');
  themeBtn.textContent = '☀️';
}

themeBtn.addEventListener('click', () => {
  const isLight = document.body.classList.toggle('light');
  themeBtn.textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem('hv_theme', isLight ? 'light' : 'dark');
});

// ── IDIOMA ES/EN ──
const langBtn = document.getElementById('btnLang');
// currentLang declarado ariba
langBtn.textContent = currentLang.toUpperCase();

const translations = {
  es: {
    dailyTag:    'Versículo del día',
    moodLabel:   '¿Cómo te sientes hoy?',
    exploreLabel:'Explorar',
    planLabel:   'Tu plan de lectura',
    save:        '♡ Guardar',
    share:       '↗ Compartir',
    read:        '📖 Leer',
    moods:       ['🌅 Esperanzado','🌪️ Ansioso','🌧️ Dolido','✨ Alegre','🌀 Confundido','🌿 Tranquilo'],
    botGreeting: 'Hola 👋 Soy tu guía del universo bíblico. ¿En qué te puedo ayudar?',
    botPlaceholder: 'Pregunta sobre la Biblia...',
    searchPlaceholder: 'Juan 3:16 o \'amor\'...',
    // Quick grid
    bible: 'Biblia', bibleDesc: '66 libros',
    strongs: 'Strong\'s', strongsDesc: 'Griego · Hebreo', strongsBadge: 'Nuevo',
    characters: 'Personajes', charactersDesc: 'Perfiles de personajes bíblicos',
    maps: 'Mapas', mapsDesc: 'Tierra prometida, viajes de Pablo, etc.',
    // Plan
    planTitle: 'Nuevo Testamento en 90 días',
    planMeta: 'Día 31 de 90 · Juan 3',
    // Nav
    navHome: 'Inicio', navBible: 'Biblia', navSearch: 'Buscar', navBot: 'Bot', navProfile: 'Perfil',
    // Search filters
    filterAll: 'Todos', filterOT: 'Antiguo T.', filterNT: 'Nuevo T.', filterSaved: 'Guardados',
    // Profile
    profileGuest: 'Inicia sesión para guardar tu progreso',
    menuLogin: 'Iniciar sesión', menuFavs: 'Mis favoritos',
    menuNotes: 'Mis notas', menuPlan: 'Plan de lectura',
    menuLang: 'Idioma', menuLogout: 'Cerrar sesión',
    // Bible
    strLabel: 'Strong\'s', strHint: 'toca las palabras',
    prevChapter: '← Anterior', nextChapter: 'Siguiente →',
    // Bot
    clearChat: '🗑️',
  },
  en: {
    dailyTag:    'Verse of the day',
    moodLabel:   'How are you feeling today?',
    exploreLabel:'Explore',
    planLabel:   'Your reading plan',
    save:        '♡ Save',
    share:       '↗ Share',
    read:        '📖 Read',
    moods:       ['🌅 Hopeful','🌪️ Anxious','🌧️ Grieving','✨ Joyful','🌀 Confused','🌿 Peaceful'],
    botGreeting: 'Hi 👋 I\'m your biblical universe guide. How can I help you?',
    botPlaceholder: 'Ask about the Bible...',
    searchPlaceholder: 'John 3:16 or \'love\'...',
    // Quick grid
    bible: 'Bible', bibleDesc: '66 books',
    strongs: 'Strong\'s', strongsDesc: 'Greek · Hebrew', strongsBadge: 'New',
    characters: 'Characters', charactersDesc: 'Coming soon',
    maps: 'Maps', mapsDesc: 'Coming soon',
    // Plan
    planTitle: 'New Testament in 90 days',
    planMeta: 'Day 31 of 90 · John 3',
    // Nav
    navHome: 'Home', navBible: 'Bible', navSearch: 'Search', navBot: 'Bot', navProfile: 'Profile',
    // Search filters
    filterAll: 'All', filterOT: 'Old T.', filterNT: 'New T.', filterSaved: 'Saved',
    // Profile
    profileGuest: 'Sign in to save your progress',
    menuLogin: 'Sign in', menuFavs: 'My favorites',
    menuNotes: 'My notes', menuPlan: 'Reading plan',
    menuLang: 'Language', menuLogout: 'Sign out',
    // Bible
    strLabel: 'Strong\'s', strHint: 'tap highlighted words',
    prevChapter: '← Previous', nextChapter: 'Next →',
    // Bot
    clearChat: '🗑️',
  }
};

function applyLang(lang) {
  const t = translations[lang];
  // Actualizar versículo del día
  if (window.updateDailyVerseByLang) updateDailyVerseByLang(lang);

  // Verse hero
  const verseTag = document.querySelector('.verse-tag');
  if (verseTag) verseTag.textContent = t.dailyTag;

  // Section labels
  const sectionLabels = document.querySelectorAll('.section-label');
  if (sectionLabels[0]) sectionLabels[0].textContent = t.moodLabel;
  if (sectionLabels[1]) sectionLabels[1].textContent = t.exploreLabel;
  if (sectionLabels[2]) sectionLabels[2].textContent = t.planLabel;

  // Botones versículo
  const vBtns = document.querySelectorAll('.v-btn');
  if (vBtns[0]) vBtns[0].textContent = t.save;
  if (vBtns[1]) vBtns[1].textContent = t.share;
  if (vBtns[2]) vBtns[2].textContent = t.read;

 // Mood chips
  document.querySelectorAll('.mood-chip').forEach((c, i) => {
    if (t.moods[i]) {
      const mood = c.dataset.mood;
      c.textContent = t.moods[i];
      c.dataset.mood = mood;
    }
  });

  // Quick grid
  const qcLabels = document.querySelectorAll('.qc-label');
  const qcSubs   = document.querySelectorAll('.qc-sub');
  const qcBadge  = document.querySelector('.qc-badge');
  if (qcLabels[0]) qcLabels[0].textContent = t.bible;
  if (qcSubs[0])   qcSubs[0].textContent   = t.bibleDesc;
  if (qcBadge)     qcBadge.textContent      = t.strongsBadge;
  if (qcLabels[1]) qcLabels[1].textContent = t.strongs;
  if (qcSubs[1])   qcSubs[1].textContent   = t.strongsDesc;
  if (qcLabels[2]) qcLabels[2].textContent = t.characters;
  if (qcSubs[2])   qcSubs[2].textContent   = t.charactersDesc;
  if (qcLabels[3]) qcLabels[3].textContent = t.maps;
  if (qcSubs[3])   qcSubs[3].textContent   = t.mapsDesc;

  // Plan
  const planTitle = document.querySelector('.plan-title');
  const planMeta  = document.getElementById('planMeta');
  if (planTitle) planTitle.textContent = t.planTitle;
  if (planMeta)  planMeta.textContent  = t.planMeta;

  // Bottom nav
  const navLabels = document.querySelectorAll('.nav-label');
  const navKeys   = ['navHome','navBible','navSearch','navBot','navProfile'];
  navLabels.forEach((el, i) => { if (navKeys[i]) el.textContent = t[navKeys[i]]; });

  // Search filters
  const filterChips = document.querySelectorAll('.filter-chip');
  if (filterChips[0]) filterChips[0].textContent = t.filterAll;
  if (filterChips[1]) filterChips[1].textContent = t.filterOT;
  if (filterChips[2]) filterChips[2].textContent = t.filterNT;
  if (filterChips[3]) filterChips[3].textContent = t.filterSaved;

  // Profile
  const profileEmail = document.getElementById('profileEmail');
  if (profileEmail && profileEmail.textContent.includes('sesión') || profileEmail && profileEmail.textContent.includes('Sign')) {
    profileEmail.textContent = t.profileGuest;
  }
  const menuItems = document.querySelectorAll('.mi-label');
  if (menuItems[0]) menuItems[0].textContent = t.menuLogin;
  if (menuItems[1]) menuItems[1].textContent = t.menuFavs;
  if (menuItems[2]) menuItems[2].textContent = t.menuNotes;
  if (menuItems[3]) menuItems[3].textContent = t.menuPlan;
  if (menuItems[4]) menuItems[4].textContent = t.menuLang;
  if (menuItems[5]) menuItems[5].textContent = t.menuLogout;

  // Bible chapter nav
  const prevBtn = document.getElementById('btnPrevChapter');
  const nextBtn = document.getElementById('btnNextChapter');
  if (prevBtn) prevBtn.textContent = t.prevChapter;
  if (nextBtn) nextBtn.textContent = t.nextChapter;

  // Strong's hint
  const strHint = document.querySelector('.legend-bar span:last-child');
  if (strHint) strHint.textContent = t.strHint;

  // Bot
  const chatArea = document.getElementById('chatArea');
  if (chatArea) chatArea.innerHTML = `<div class="bubble bot">${t.botGreeting}</div>`;
  const chatInput = document.getElementById('chatInput');
  if (chatInput) chatInput.placeholder = t.botPlaceholder;
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.placeholder = t.searchPlaceholder;
}

langBtn.addEventListener('click', () => {
  currentLang = currentLang === 'es' ? 'en' : 'es';
  langBtn.textContent = currentLang.toUpperCase();
  localStorage.setItem('hv_lang', currentLang);
  applyLang(currentLang);
  showToast(currentLang === 'en' ? '🇺🇸 English' : '🇪🇸 Español');
});

// ── BOOKS GRID ──
function renderBooksGrid() {
  const otGrid = document.getElementById('otGrid');
  const ntGrid = document.getElementById('ntGrid');
  if (!otGrid || !ntGrid) return;

  otGrid.innerHTML = BOOKS.ot.map(b => `
    <div class="book-card" onclick="selectBookFromGrid('${b.name}', ${b.chapters})">
      <div class="book-card-name">${b.name}</div>
      <div class="book-card-ch">${b.chapters} cap</div>
    </div>
  `).join('');

  ntGrid.innerHTML = BOOKS.nt.map(b => `
    <div class="book-card" onclick="selectBookFromGrid('${b.name}', ${b.chapters})">
      <div class="book-card-name">${b.name}</div>
      <div class="book-card-ch">${b.chapters} cap</div>
    </div>
  `).join('');
}

function filterBooksGrid(query) {
  // Detectar si es referencia bíblica ej: "Juan 3:16" o "Juan 3"
  const refMatch = query.match(/^(.+?)\s+(\d+)(?::(\d+))?/);
  if (refMatch) {
    const book    = refMatch[1].trim();
    const chapter = parseInt(refMatch[2]);
    selectBookFromGrid(book, chapter);
    return;
  }

  // Filtrar por nombre
  const q = query.toLowerCase();
  const otGrid = document.getElementById('otGrid');
  const ntGrid = document.getElementById('ntGrid');

  ['ot','nt'].forEach(t => {
    const grid = document.getElementById(t + 'Grid');
    const filtered = BOOKS[t].filter(b => b.name.toLowerCase().includes(q));
    grid.innerHTML = filtered.map(b => `
      <div class="book-card" onclick="selectBookFromGrid('${b.name}', ${b.chapters})">
        <div class="book-card-name">${b.name}</div>
        <div class="book-card-ch">${b.chapters} cap</div>
      </div>
    `).join('');
  });
}

function selectBookFromGrid(name, totalChapters) {
  currentBookName = name;

  // Mostrar selector de capítulos
  const chapterModal = document.getElementById('bookPickerModal');
  const list = document.getElementById('bookPickerList');

  list.innerHTML = `
    <div style="padding:0 20px 12px">
      <div style="font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--gold);margin-bottom:12px">${name}</div>
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px">
        ${Array.from({length: totalChapters}, (_, i) => i + 1).map(ch => `
          <div onclick="goToChapter('${name}', ${ch})" style="
            background:var(--card);border:1px solid var(--border);
            border-radius:8px;padding:10px 0;text-align:center;
            font-size:14px;cursor:pointer;transition:all 0.15s;
          " onmouseover="this.style.borderColor='var(--gold)';this.style.color='var(--gold)'"
             onmouseout="this.style.borderColor='';this.style.color=''">
            ${ch}
          </div>
        `).join('')}
      </div>
    </div>
  `;

  chapterModal.classList.remove('hidden');
}

function goToChapter(book, chapter) {
  currentBookName = book;
  currentChapter  = chapter;
  document.getElementById('bookPickerModal').classList.add('hidden');
  showChapterView();
  BibleAPI.loadChapter(book, chapter);
}

function showBooksView() {
  const booksView   = document.getElementById('booksView');
  const chapterView = document.getElementById('chapterView');
  if (booksView)   booksView.classList.remove('hidden');
  if (chapterView) chapterView.classList.add('hidden');
}

function showChapterView() {
  const booksView   = document.getElementById('booksView');
  const chapterView = document.getElementById('chapterView');
  if (booksView)   booksView.classList.add('hidden');
  if (chapterView) chapterView.classList.remove('hidden');
}

// ── STRONG'S INLINE (palabras del versículo resaltadas directamente en el texto) ──
async function handleVerseClick(e, verseEl) {
  if (!strongsEnabled) return;
  if (e.target.closest('.sw-inline')) return;

  const book    = verseEl.dataset.book;
  const chapter = verseEl.dataset.chapter;
  const verse   = verseEl.dataset.verse;

  // Si ya está procesado, solo mostrar el panel
  if (verseEl.dataset.strongsLoaded === 'true') {
    document.querySelectorAll('.verse-row').forEach(v => v.classList.remove('selected-verse'));
    verseEl.classList.add('selected-verse');
    document.getElementById('strongsFloating').classList.remove('hidden');
    return;
  }

  document.querySelectorAll('.verse-row').forEach(v => v.classList.remove('selected-verse'));
  verseEl.classList.add('selected-verse');

  const floating = document.getElementById('strongsFloating');
  floating.classList.remove('hidden');
  const floatContent = floating.querySelector('.strongs-float-content');
  floatContent.innerHTML = '<div style="text-align:center;padding:16px;color:var(--text3)">Cargando...</div>';

  try {
    const NT_BOOKS = ['Mateo','Marcos','Lucas','Juan','Hechos','Romanos','1 Corintios','2 Corintios','Gálatas','Efesios','Filipenses','Colosenses','1 Tesalonicenses','2 Tesalonicenses','1 Timoteo','2 Timoteo','Tito','Filemón','Hebreos','Santiago','1 Pedro','2 Pedro','1 Juan','2 Juan','3 Juan','Judas','Apocalipsis'];
    const isNT     = NT_BOOKS.includes(book);
    const endpoint = isNT
      ? `https://holyverse-api-production.up.railway.app/api/strongswords/${encodeURIComponent(book)}/${chapter}/${verse}`
      : `https://holyverse-api-production.up.railway.app/api/at-strongswords/${encodeURIComponent(book)}/${chapter}/${verse}`;

    const res  = await fetch(endpoint);
    const data = await res.json();

    if (data.error || !data.words?.length) {
      floatContent.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:11px;color:var(--text3)">Strong's no disponible para este versículo</span>
          <button onclick="closeStrongsFloat()" style="background:none;border:none;color:var(--text3);font-size:18px;cursor:pointer">✕</button>
        </div>`;
      return;
    }

// 1. Obtener texto español
    const textSpan     = verseEl.querySelector('.vr-text');
    const originalText = textSpan.textContent.replace(/\[\d+\]/g, '').trim();
    const spanishWords = originalText.split(/\s+/);

    // 2. Filtrar palabras con contenido
    const SKIP_GREEK  = ['G3588','G1063','G2532','G1161','G3739','G1519','G0846'];
    const SKIP_HEBREW = ['H0853','H0834','H3588','H1961','H1886','H2050'];
    const contentWords = data.words.filter(w =>
      !SKIP_GREEK.includes(w.strong) && !SKIP_HEBREW.includes(w.strong) && w.gloss && w.gloss !== '-'
    );

    // 3. Calcular ratio y resaltar
    const ratio = contentWords.length / spanishWords.length;

    const highlightedText = spanishWords.map((word, i) => {
      const cleanWord = word.replace(/[.,;:«»"'¿?!¡()\[\]]/g, '');
      if (cleanWord.length <= 2) return word;

      const gwIndex = Math.min(contentWords.length - 1, Math.round(i * ratio));
      const gw = contentWords[gwIndex];
      if (!gw) return word;

      const isGreek = gw.strong.startsWith('G');
      const color   = isGreek ? 'var(--greek)' : 'var(--hebrew)';

      return `<span 
        class="sw-word" 
        style="color:${color};border-bottom:1px dotted ${color};cursor:pointer"
        title="${gw.gloss}"
        onclick="showWordFromText(event, '${gw.strong}', '${(gw.lemma || gw.word).replace(/'/g,"\\'")}', '${gw.word.replace(/'/g,"\\'")}', '${word.replace(/'/g,"\\'")}')"
        >${word}</span>`;
    }).join(' ');

    textSpan.innerHTML = highlightedText;
    verseEl.dataset.strongsLoaded = 'true';
   

    // Mostrar panel con resumen
    floatContent.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <span style="font-size:11px;color:var(--text3);text-transform:uppercase">${book} ${chapter}:${verse} · ${isNT ? 'Griego' : 'Hebreo'} original · Toca una palabra azul</span>
        <button onclick="closeStrongsFloat()" style="background:none;border:none;color:var(--text3);font-size:18px;cursor:pointer">✕</button>
      </div>
      <div id="wordDefBox" style="display:none;padding-top:8px">
        <div class="strongs-top">
          <span class="s-badge ${isNT ? 'greek' : 'hebrew'}" id="sfBadge">${isNT ? 'GRIEGO' : 'HEBREO'}</span>
          <span class="s-num" id="sfNum"></span>
        </div>
        <div class="s-word ${isNT ? 'greek' : 'hebrew'}" id="sfWord"></div>
        <div id="sfDef"></div>
      </div>
    `;

  } catch (err) {
    floatContent.innerHTML = '<div style="text-align:center;padding:20px;color:var(--danger)">Error de conexión</div>';
    console.error(err);
  }
}

async function showWordFromText(e, strongNum, lemma, originalWord, spanishWord) {
  e.stopPropagation();

  // Resaltar la palabra tocada
  document.querySelectorAll('.sw-word').forEach(w => {
    w.style.fontWeight = 'normal';
    w.style.textDecoration = 'none';
  });
  e.currentTarget.style.fontWeight = 'bold';
  e.currentTarget.style.textDecoration = 'underline';

  const box = document.getElementById('wordDefBox');
  if (!box) return;
  box.style.display = 'block';

  document.getElementById('sfNum').textContent = strongNum;
  document.getElementById('sfWord').textContent = originalWord;
  document.getElementById('sfDef').innerHTML = '<div style="color:var(--text3);font-size:12px">Cargando...</div>';

  try {
    const res  = await fetch(`https://holyverse-api-production.up.railway.app/api/strongs-es/${strongNum}`);
    const data = await res.json();
    document.getElementById('sfDef').innerHTML = `
      ${data.translit ? `<div style="font-size:12px;color:var(--text3);margin-bottom:4px;font-style:italic">📢 ${data.translit}</div>` : ''}
      ${data.short ? `<div style="font-size:17px;color:var(--gold);font-weight:600;margin-bottom:4px">= ${data.short}</div>` : ''}
      <div style="color:var(--text2);font-size:12px;line-height:1.5">${data.definition || 'Sin definición'}</div>
    `;
  } catch (err) {
    document.getElementById('sfDef').textContent = 'Error al cargar';
  }
}

async function showWordDefInline(e, strongNum, lemma, originalWord) {
  e.stopPropagation();

  // Pulso en el versículo seleccionado
  const selectedVerse = document.querySelector('.verse-row.selected-verse');
  if (selectedVerse) {
    selectedVerse.style.animation = 'none';
    setTimeout(() => {
      selectedVerse.style.animation = 'pulse-gold 0.5s ease';
    }, 10);
  }

  const box = document.getElementById('wordDefBox');
  box.style.display = 'block';

  document.getElementById('sfNum').textContent   = strongNum;
  document.getElementById('sfWord').textContent  = originalWord;
  document.getElementById('sfTrans').textContent = '';
  document.getElementById('sfDef').innerHTML     = '<div style="color:var(--text3)">Cargando...</div>';

  document.querySelectorAll('.strong-tag').forEach(t => t.classList.remove('active-tag'));
  e.currentTarget.classList.add('active-tag');

  try {
    const res  = await fetch(`https://holyverse-api-production.up.railway.app/api/strongs-es/${strongNum}`);
    const data = await res.json();
    document.getElementById('sfDef').innerHTML = `
      ${data.translit ? `<div style="font-size:13px;color:var(--text3);margin-bottom:6px;font-style:italic">📢 ${data.translit}</div>` : ''}
      ${data.short ? `<div style="font-size:18px;color:var(--gold);font-weight:600;margin-bottom:6px">= ${data.short}</div>` : ''}
      <div style="color:var(--text2);font-size:13px;line-height:1.5">${data.definition || 'Sin definición'}</div>
    `;
  } catch (err) {
    document.getElementById('sfDef').textContent = 'Error al cargar';
  }
}

// ── TAMAÑO DE LETRA ──
let fontSizeLevel = parseInt(localStorage.getItem('hv_font_size')) || 0;

function applyFontSize() {
  const sizes = ['15px', '17px', '19px', '21px', '23px'];
  const index = Math.max(0, Math.min(sizes.length - 1, 2 + fontSizeLevel));
  document.documentElement.style.setProperty('--verse-font-size', sizes[index]);
}

function increaseFontSize() {
  if (fontSizeLevel < 2) fontSizeLevel++;
  localStorage.setItem('hv_font_size', fontSizeLevel);
  applyFontSize();
}

function decreaseFontSize() {
  if (fontSizeLevel > -2) fontSizeLevel--;
  localStorage.setItem('hv_font_size', fontSizeLevel);
  applyFontSize();
}
function closeStrongsFloat() {
  document.getElementById('strongsFloating').classList.add('hidden');
  document.querySelectorAll('.strong-tag').forEach(t => t.classList.remove('active-tag'));
  document.querySelectorAll('.sw-word').forEach(w => {
    w.style.fontWeight = 'normal';
    w.style.textDecoration = 'none';
  });
}

// ── PERSONAJES BÍBLICOS ──
const API_CHARACTERS = 'https://holyverse-api-production.up.railway.app';

const CHARACTERS_LIST = [
  { name: 'Adán',              emoji: '🌱' },
  { name: 'Eva',               emoji: '🍎' },
  { name: 'Noé',               emoji: '🚢' },
  { name: 'Abraham',           emoji: '⭐' },
  { name: 'Sara',              emoji: '👸' },
  { name: 'Isaac',             emoji: '🕊️' },
  { name: 'Jacob',             emoji: '🪨' },
  { name: 'José',              emoji: '🎨' },
  { name: 'Moisés',            emoji: '📜' },
  { name: 'Josué',             emoji: '⚔️' },
  { name: 'Débora',            emoji: '🌴' },
  { name: 'Sansón',            emoji: '💪' },
  { name: 'Rut',               emoji: '🌾' },
  { name: 'Samuel',            emoji: '🕯️' },
  { name: 'David',             emoji: '👑' },
  { name: 'Salomón',           emoji: '💎' },
  { name: 'Elías',             emoji: '🔥' },
  { name: 'Isaías',            emoji: '📖' },
  { name: 'Jeremías',          emoji: '😢' },
  { name: 'Daniel',            emoji: '🦁' },
  { name: 'Ester',             emoji: '👑' },
  { name: 'Job',               emoji: '🙏' },
  { name: 'Jonás',             emoji: '🐋' },
  { name: 'María',             emoji: '💙' },
  { name: 'Juan el Bautista',  emoji: '💧' },
  { name: 'Jesús',             emoji: '✝️' },
  { name: 'Pedro',             emoji: '🪨' },
  { name: 'Juan',              emoji: '❤️' },
  { name: 'Pablo',             emoji: '✉️' },
  { name: 'María Magdalena',   emoji: '🌹' },
];

function renderCharactersList() {
  const list = document.getElementById('charactersList');
  if (!list) return;

  list.innerHTML = CHARACTERS_LIST.map(c => `
    <div onclick="loadCharacterProfile('${c.name}')" style="
      background:var(--card);border:1px solid var(--border);border-radius:12px;
      padding:14px 16px;display:flex;align-items:center;gap:14px;cursor:pointer;
      transition:all 0.15s;-webkit-tap-highlight-color:transparent">
      
      <div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--text)">${c.name}</div>
      </div>
      <div style="margin-left:auto;color:var(--text3)">›</div>
    </div>
  `).join('');
}

async function loadCharacterProfile(name) {
  document.getElementById('charactersListView').classList.add('hidden');
  document.getElementById('characterProfileView').classList.remove('hidden');
  document.getElementById('charProfileName').textContent = name;
  document.getElementById('charProfileContent').innerHTML = '<div style="text-align:center;padding:40px;color:var(--text3)">Cargando perfil...</div>';

  try {
    const res  = await fetch(`${API_CHARACTERS}/api/character/${encodeURIComponent(name)}`);
    const data = await res.json();

    document.getElementById('charProfileContent').innerHTML = `
      <div style="text-align:center;margin-bottom:20px">
        ${data.name === 'Jesús' ? `<div style="font-size:64px;margin-bottom:8px">${data.emoji}</div>` : ''}
        <div style="font-family:'Cormorant Garamond',serif;font-size:28px;color:var(--gold)">${data.name}</div>
        <div style="font-size:13px;color:var(--text3);margin-top:4px">${data.role} · ${data.period}</div>
        ${data.tribe ? `<div style="font-size:12px;color:var(--text3)">Tribu: ${data.tribe}</div>` : ''}
      </div>

      <div style="background:var(--card);border-radius:12px;padding:16px;margin-bottom:16px;border:1px solid var(--border)">
        <div style="font-size:13px;color:var(--text2);line-height:1.6">${data.summary}</div>
      </div>

      ${data.funFact ? `
      <div style="background:rgba(212,168,67,0.08);border:1px solid rgba(212,168,67,0.2);border-radius:12px;padding:16px;margin-bottom:16px">
        <div style="font-size:11px;color:var(--gold);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">💡 Dato curioso</div>
        <div style="font-size:13px;color:var(--text2);line-height:1.6">${data.funFact}</div>
      </div>` : ''}

      <div style="margin-bottom:16px">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px">📅 Línea de tiempo</div>
        ${data.timeline?.map(t => `
          <div style="display:flex;gap:12px;margin-bottom:12px">
            <div style="min-width:80px;font-size:11px;color:var(--gold);font-weight:600;padding-top:2px">${t.year}</div>
            <div style="flex:1;font-size:13px;color:var(--text2);line-height:1.5;border-left:2px solid var(--border);padding-left:12px">${t.event}</div>
          </div>
        `).join('') || ''}
      </div>

      <div style="margin-bottom:16px">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px">📖 Versículos clave</div>
        ${data.keyVerses?.map(v => `
          <div style="background:var(--card);border-radius:10px;padding:12px 14px;margin-bottom:8px;border:1px solid var(--border)">
            <div style="font-size:11px;color:var(--gold);margin-bottom:4px">${v.reference}</div>
            <div style="font-size:13px;color:var(--text2);line-height:1.5;font-style:italic">"${v.text}"</div>
          </div>
        `).join('') || ''}
      </div>

      <div>
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">📚 Aparece en</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${data.books?.map(b => `
            <span style="background:var(--card2);border:1px solid var(--border);border-radius:6px;padding:4px 10px;font-size:12px;color:var(--text2)">${b}</span>
          `).join('') || ''}
        </div>
      </div>
    `;

  } catch (err) {
    document.getElementById('charProfileContent').innerHTML = '<div style="text-align:center;padding:40px;color:var(--danger)">Error cargando perfil</div>';
  }
}

function showCharactersList() {
  document.getElementById('charactersListView').classList.remove('hidden');
  document.getElementById('characterProfileView').classList.add('hidden');
}

// ── MAPAS BÍBLICOS ──
let bibleMap = null;
let currentMapLayer = null;

const BIBLE_PLACES = {
  'holy-land': [
    { name: 'Jerusalén', lat: 31.7683, lng: 35.2137, desc: 'Capital de Israel, lugar de la crucifixión y resurrección de Jesús. Ciudad santa para judíos, cristianos y musulmanes.', verse: '"Jerusalén, la ciudad del gran Rey" (Salmos 48:2)' },
    { name: 'Belén', lat: 31.7054, lng: 35.2024, desc: 'Ciudad natal de David y lugar de nacimiento de Jesús. Ubicada al sur de Jerusalén en Judea.', verse: '"Pero tú, Belén Efrata... de ti me saldrá el que será Señor en Israel" (Miqueas 5:2)' },
    { name: 'Nazaret', lat: 32.7021, lng: 35.2978, desc: 'Ciudad donde Jesús creció y vivió hasta los 30 años. Ubicada en la región de Galilea.', verse: '"Y vino a Nazaret, donde se había criado" (Lucas 4:16)' },
    { name: 'Mar de Galilea', lat: 32.8208, lng: 35.5847, desc: 'Lago donde Jesús caminó sobre las aguas, calmó la tormenta y llamó a sus primeros discípulos.', verse: '"Venid en pos de mí, y os haré pescadores de hombres" (Mateo 4:19)' },
    { name: 'Río Jordán', lat: 31.8331, lng: 35.5508, desc: 'Río donde Jesús fue bautizado por Juan el Bautista. También donde los israelitas cruzaron para entrar a Canaán.', verse: '"Y Jesús, después que fue bautizado, subió luego del agua" (Mateo 3:16)' },
    { name: 'Mar Muerto', lat: 31.5590, lng: 35.4732, desc: 'El lago más salado del mundo, ubicado en el punto más bajo de la Tierra. Cerca de Sodoma y Gomorra.', verse: '"El mar Salado" (Génesis 14:3)' },
    { name: 'Monte Sinaí', lat: 28.5390, lng: 33.9750, desc: 'Montaña donde Dios entregó los Diez Mandamientos a Moisés. También llamado Horeb.', verse: '"Y dio a Moisés... las dos tablas del testimonio" (Éxodo 31:18)' },
    { name: 'Jericó', lat: 31.8567, lng: 35.4610, desc: 'Primera ciudad conquistada por Josué en Canaán. También donde Zaqueo conoció a Jesús.', verse: '"Y los muros de Jericó cayeron" (Josué 6:20)' },
    { name: 'Capernaum', lat: 32.8808, lng: 35.5754, desc: 'Ciudad orilla del Mar de Galilea donde Jesús estableció su base de ministerio y realizó muchos milagros.', verse: '"Y vino a Capernaum, ciudad de Galilea" (Lucas 4:31)' },
    { name: 'Hebrón', lat: 31.5326, lng: 35.0998, desc: 'Ciudad donde Abraham, Isaac y Jacob fueron enterrados. David fue coronado rey aquí antes de conquistar Jerusalén.', verse: '"Y moró Abraham en el encinar de Mamre, que está en Hebrón" (Génesis 13:18)' },
  ],
  'exodus': [
    { name: 'Egipto (Gosén)', lat: 30.8025, lng: 31.9602, desc: 'Región donde los israelitas vivieron en esclavitud durante 430 años.', verse: '"Y los egipcios hicieron servir a los hijos de Israel" (Éxodo 1:13)' },
    { name: 'Mar Rojo', lat: 29.8597, lng: 32.5500, desc: 'Lugar donde Dios partió las aguas para que los israelitas cruzaran huyendo del faraón.', verse: '"Y los hijos de Israel entraron por en medio del mar" (Éxodo 14:22)' },
    { name: 'Monte Sinaí', lat: 28.5390, lng: 33.9750, desc: 'Donde Moisés recibió los Diez Mandamientos y la Ley de Dios.', verse: '"Y dio a Moisés las dos tablas del testimonio" (Éxodo 31:18)' },
    { name: 'Cades-barnea', lat: 30.6833, lng: 34.4167, desc: 'Oasis donde Israel acampó 38 años durante el desierto por su desobediencia.', verse: '"Y morasteis en Cades por muchos días" (Deuteronomio 1:46)' },
    { name: 'Jericó', lat: 31.8567, lng: 35.4610, desc: 'Primera ciudad conquistada en la Tierra Prometida.', verse: '"Y los muros de Jericó cayeron" (Josué 6:20)' },
  ],
  'paul': [
    { name: 'Antioquía', lat: 36.2021, lng: 36.1608, desc: 'Base de operaciones de Pablo. Aquí los discípulos fueron llamados "cristianos" por primera vez.', verse: '"Y a los discípulos se les llamó cristianos por primera vez en Antioquía" (Hechos 11:26)' },
    { name: 'Éfeso', lat: 37.9395, lng: 27.3417, desc: 'Pablo ministró aquí 3 años. Importante ciudad con el templo de Artemisa.', verse: '"Y esto duró por espacio de dos años" (Hechos 19:10)' },
    { name: 'Corinto', lat: 37.9081, lng: 22.8784, desc: 'Importante ciudad griega donde Pablo fundó una iglesia y escribió dos epístolas.', verse: '"Y se detuvo allí un año y seis meses" (Hechos 18:11)' },
    { name: 'Filipos', lat: 41.0138, lng: 24.2864, desc: 'Primera ciudad europea donde Pablo predicó. Lugar de conversión de Lidia.', verse: '"Y el Señor abrió el corazón de Lidia" (Hechos 16:14)' },
    { name: 'Roma', lat: 41.9028, lng: 12.4964, desc: 'Capital del Imperio Romano donde Pablo llegó como prisionero y escribió varias epístolas.', verse: '"Así que llegamos a Roma" (Hechos 28:14)' },
    { name: 'Atenas', lat: 37.9838, lng: 23.7275, desc: 'Ciudad donde Pablo predicó en el Areópago sobre el "Dios no conocido".', verse: '"Varones atenienses, en todo observo que sois muy religiosos" (Hechos 17:22)' },
  ],
  'jesus': [
    { name: 'Belén', lat: 31.7054, lng: 35.2024, desc: 'Lugar de nacimiento de Jesús.', verse: '"Y dio a luz a su hijo primogénito" (Lucas 2:7)' },
    { name: 'Nazaret', lat: 32.7021, lng: 35.2978, desc: 'Donde Jesús creció.', verse: '"Y estaba sujeto a ellos" (Lucas 2:51)' },
    { name: 'Río Jordán', lat: 31.8331, lng: 35.5508, desc: 'Lugar del bautismo de Jesús.', verse: '"Y Jesús fue bautizado" (Mateo 3:16)' },
    { name: 'Monte de las Tentaciones', lat: 31.8614, lng: 35.4408, desc: 'Donde Jesús ayunó 40 días y fue tentado por Satanás.', verse: '"Y ayunó cuarenta días y cuarenta noches" (Mateo 4:2)' },
    { name: 'Capernaum', lat: 32.8808, lng: 35.5754, desc: 'Centro del ministerio de Jesús en Galilea.', verse: '"Venid en pos de mí" (Mateo 4:19)' },
    { name: 'Monte de las Bienaventuranzas', lat: 32.9056, lng: 35.5508, desc: 'Lugar del Sermón del Monte.', verse: '"Bienaventurados los pobres en espíritu" (Mateo 5:3)' },
    { name: 'Getsemaní', lat: 31.7794, lng: 35.2397, desc: 'Jardín donde Jesús oró antes de ser arrestado.', verse: '"No sea como yo quiero, sino como tú" (Mateo 26:39)' },
    { name: 'Gólgota', lat: 31.7784, lng: 35.2297, desc: 'Lugar de la crucifixión de Jesús.', verse: '"Y cuando llegaron al lugar llamado Gólgota... le crucificaron" (Mateo 27:33)' },
  ]
};

function initBibleMap() {
  if (bibleMap) return;

  bibleMap = L.map('bibleMap', {
    center: [31.7683, 35.2137],
    zoom: 7,
    zoomControl: true
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(bibleMap);

  loadMap('holy-land');
}

function loadMap(mapType) {
  if (!bibleMap) return;

  // Actualizar chips
  document.querySelectorAll('.map-chip').forEach(c => c.classList.remove('active'));
  if (typeof event !== 'undefined' && event && event.target) event.target.classList.add('active');

  // Limpiar marcadores anteriores
  if (currentMapLayer) bibleMap.removeLayer(currentMapLayer);

  const places = BIBLE_PLACES[mapType];
  if (!places) return;

  currentMapLayer = L.layerGroup();

  places.forEach(place => {
    const marker = L.marker([place.lat, place.lng], {
      icon: L.divIcon({
        className: '',
        html: `<div style="
          background:var(--gold);color:#000;
          border-radius:50%;width:32px;height:32px;
          display:flex;align-items:center;justify-content:center;
          font-size:11px;font-weight:700;border:2px solid #fff;
          box-shadow:0 2px 8px rgba(0,0,0,0.4);cursor:pointer;
          white-space:nowrap;
        ">📍</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      })
    });

    marker.on('click', () => showPlaceInfo(place));
    currentMapLayer.addLayer(marker);
  });

  currentMapLayer.addTo(bibleMap);

  // Ajustar vista
  const bounds = L.latLngBounds(places.map(p => [p.lat, p.lng]));
  bibleMap.fitBounds(bounds, { padding: [30, 30] });
}

function showPlaceInfo(place) {
  document.getElementById('placeName').textContent = place.name;
  document.getElementById('placeDescription').textContent = place.desc;
  document.getElementById('placeVerse').textContent = place.verse;
  document.getElementById('placeInfo').classList.remove('hidden');
}

function closePlaceInfo() {
  document.getElementById('placeInfo').classList.add('hidden');
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  loadDailyVerse();
  updateProfileUI(null);
  applyLang(currentLang);
  renderBooksGrid();
  renderCharactersList();

  // Agregar Strong's disabled por defecto (se activa con toggle)
  document.querySelectorAll('.sw').forEach(w => {
    w.style.pointerEvents = 'none';
    w.style.color = 'var(--text)';
    w.style.background = 'transparent';
    w.style.borderBottom = 'none';
  });
});

// ── DEVOCIONAL DIARIO ──
let devotionalData = null;

function formatBotReply(text) {
  return text
    .replace(/^### (.+)$/gm, '<div style="font-size:14px;font-weight:700;color:var(--gold);margin:8px 0 4px">$1</div>')
    .replace(/^## (.+)$/gm, '<div style="font-size:15px;font-weight:700;color:var(--gold);margin:10px 0 4px">$1</div>')
    .replace(/^# (.+)$/gm, '<div style="font-size:17px;font-weight:700;color:var(--gold);margin:10px 0 6px">$1</div>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<div style="padding-left:12px;margin:3px 0">• $1</div>')
    .replace(/^\d+\. (.+)$/gm, '<div style="padding-left:12px;margin:3px 0">$1</div>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

async function loadDailyDevotional() {
  // Si ya está cargado, abrir el modal
  if (devotionalData) {
    openDevotionalModal(devotionalData);
    return;
  }

  try {
    const lang = window.currentLang || 'es';
    const res  = await fetch(`https://holyverse-api-production.up.railway.app/api/devotional?lang=${lang}`);
    const data = await res.json();
    devotionalData = data;

    // Actualizar el strip
    document.getElementById('devotionalTheme').textContent = data.theme;
    document.getElementById('devotionalVerse').textContent = data.verse;

    openDevotionalModal(data);
  } catch (err) {
    console.error('Devotional error:', err);
  }
}

function openDevotionalModal(data) {
  document.getElementById('devotionalModalTheme').textContent     = data.theme;
  document.getElementById('devotionalModalVerse').textContent     = data.verse;
  document.getElementById('devotionalModalReflection').textContent = data.reflection;
  document.getElementById('devotionalModalPrayer').textContent    = data.prayer;
  document.getElementById('devotionalModal').classList.remove('hidden');
}

function closeDevotionalModal() {
  document.getElementById('devotionalModal').classList.add('hidden');
}

async function loadDailyDevotionalBackground() {
  try {
    const lang = window.currentLang || 'es';
    const res  = await fetch(`https://holyverse-api-production.up.railway.app/api/devotional?lang=${lang}`);
    const data = await res.json();
    devotionalData = data;
    if (document.getElementById('devotionalTheme')) {
      document.getElementById('devotionalTheme').textContent = data.theme;
      document.getElementById('devotionalVerse').textContent = data.verse;
    }
  } catch (err) {
    console.error('Devotional background error:', err);
  }
}

function saveDevotionalFavorite() {
  if (!devotionalData) return;
  saveFavorite({
    reference: `📖 ${devotionalData.theme}`,
    text: `${devotionalData.verse} — ${devotionalData.reflection}\n\n🙏 ${devotionalData.prayer}`
  });
}

// ── INIT ──
loadDailyDevotionalBackground();
