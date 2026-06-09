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
document.querySelectorAll('.mood-chip').forEach(chip => {
  chip.addEventListener('click', function () {
    document.querySelectorAll('.mood-chip').forEach(c => c.classList.remove('active'));
    this.classList.add('active');
    const mood = this.dataset.mood;
    loadMoodVerse(mood);
  });
});

function loadMoodVerse(mood) {
  showToast('Buscando versículo para tu estado de ánimo...');
  // Bible.js se encarga de buscar por mood
  if (window.BibleAPI) BibleAPI.getVerseByMood(mood);
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
  // Parsear referencia del versículo del día ej: "Juan 3:16"
  const ref = document.getElementById('dailyVerseRef').textContent;
  const match = ref.match(/^(.+?)\s+(\d+):(\d+)/);
  if (match) {
    const book    = match[1].trim();
    const chapter = parseInt(match[2]);
    BibleAPI.loadChapter(book, chapter);
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

  // Mostrar/ocultar resaltado en palabras
  document.querySelectorAll('.sw').forEach(w => {
    w.style.pointerEvents = strongsEnabled ? 'auto' : 'none';
    w.style.opacity = strongsEnabled ? '1' : '0.7';
    w.style.borderBottom = strongsEnabled ? '' : 'none';
    w.style.background = strongsEnabled ? '' : 'transparent';
    w.style.color = strongsEnabled ? '' : 'var(--text)';
  });

  if (!strongsEnabled) {
    // Reset panel a placeholder
    document.getElementById('strongsPlaceholder').classList.remove('hidden');
    document.getElementById('strongsContent').classList.add('hidden');
  }
}

// Mostrar info de una palabra Strong's
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

  // Highlight palabra activa
  document.querySelectorAll('.sw').forEach(w => w.style.outline = 'none');
  el.style.outline = '1.5px solid ' + (isGreek ? 'rgba(126,207,255,0.7)' : 'rgba(168,240,160,0.7)');
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
    if (window.BibleAPI) BibleAPI.loadChapter(currentBookName, currentChapter);
    else loadSampleVerses();
  } else {
    showToast('Primer capítulo del libro');
  }
});
document.getElementById('btnNextChapter').addEventListener('click', () => {
  currentChapter++;
  updateBibleHeader();
  if (window.BibleAPI) BibleAPI.loadChapter(currentBookName, currentChapter);
  else BibleAPI.loadChapter(currentBookName, currentChapter);
});
 const list = document.getElementById('verseList');
  list.innerHTML = verses.map(v => `
    <div class="verse-row ${v.hl ? 'hl' : ''}">
      <span class="vr-num">${v.num}</span>
      <span class="vr-text">${v.text}</span>
    </div>
  `).join('');


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
  area.scrollTop = area.scrollHeight;

  // Llamar al bot
  if (window.BibleBot) {
    BibleBot.ask(msg).then(reply => {
      document.getElementById(typingId).outerHTML = `<div class="bubble bot fade-up">${reply}</div>`;
      area.scrollTop = area.scrollHeight;
    });
  } else {
    setTimeout(() => {
      document.getElementById(typingId).outerHTML = `
        <div class="bubble bot fade-up">
          El Bible Bot se está configurando. Por favor conecta tu API key de Anthropic en <code>js/bot.js</code>.
        </div>`;
      area.scrollTop = area.scrollHeight;
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
    characters: 'Personajes', charactersDesc: 'Próximamente',
    maps: 'Mapas', mapsDesc: 'Próximamente',
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
    if (t.moods[i]) c.textContent = t.moods[i];
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
  document.getElementById('booksView').classList.remove('hidden');
  document.getElementById('chapterView').classList.add('hidden');
}

function showChapterView() {
  document.getElementById('booksView').classList.add('hidden');
  document.getElementById('chapterView').classList.remove('hidden');
}
// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  loadDailyVerse();
  updateProfileUI(null);
  applyLang(currentLang);
  renderBooksGrid();

  // Agregar Strong's disabled por defecto (se activa con toggle)
  document.querySelectorAll('.sw').forEach(w => {
    w.style.pointerEvents = 'none';
    w.style.color = 'var(--text)';
    w.style.background = 'transparent';
    w.style.borderBottom = 'none';
  });
});