// Main Application Logic

// Cache manager for verses
const verseCache = {
    getDaily() {
        const cached = localStorage.getItem('holyverse-daily-verse');
        const cachedDate = localStorage.getItem('holyverse-daily-verse-date');
        const today = new Date().toDateString();
        
        if (cached && cachedDate === today) {
            return JSON.parse(cached);
        }
        return null;
    },
    setDaily(verse) {
        localStorage.setItem('holyverse-daily-verse', JSON.stringify(verse));
        localStorage.setItem('holyverse-daily-verse-date', new Date().toDateString());
    },
    clearCache() {
        localStorage.removeItem('holyverse-daily-verse');
        localStorage.removeItem('holyverse-daily-verse-date');
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    initializeApp();
});

async function initializeApp() {
    setupThemeToggle();
    setupLanguageSwitcher();
    await setupVerseOfTheDay();
    setupHero();
    setupMoodSelector();
    setupExplorationCards();
    setupSearch();
    setupFavoritesUI();
    setupMap();
    
    // Check available bibles
    checkAvailableBibles();
}

async function checkAvailableBibles() {
    try {
        const bibles = await API.getAvailableBibles();
        const spanishBibles = bibles.filter(b => 
            b.language?.id === 'spa' || 
            b.language?.name?.toLowerCase().includes('spanish') ||
            b.name?.toLowerCase().includes('spanish') ||
            b.name?.toLowerCase().includes('español')
        );
        
        if (spanishBibles.length > 0) {
            console.log('✅ Biblias en español disponibles:', spanishBibles.length);
        } else {
            console.warn('⚠️ No se encontraron Biblias en español');
        }
    } catch (err) {
        console.warn('No se pudieron verificar las Biblias disponibles:', err);
    }
}

// Theme Toggle
function setupThemeToggle() {
    const themeBtn = document.getElementById('themeToggle');
    if (!themeBtn) return;
    
    const savedTheme = localStorage.getItem('holyverse-theme') || 'dark';
    applyTheme(savedTheme);
    
    themeBtn.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('holyverse-theme', newTheme);
    });
}

function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-theme');
        document.getElementById('themeToggle').textContent = '☀️';
    } else {
        document.body.classList.remove('light-theme');
        document.getElementById('themeToggle').textContent = '🌙';
    }
}

// Language Switcher
function setupLanguageSwitcher() {
    const langES = document.getElementById('langES');
    const langEN = document.getElementById('langEN');
    
    langES.addEventListener('click', () => {
        i18n.setLanguage('es');
        updateActiveLang(langES, langEN);
        reloadDynamicContent('es');
    });
    
    langEN.addEventListener('click', () => {
        i18n.setLanguage('en');
        updateActiveLang(langEN, langES);
        reloadDynamicContent('en');
    });
    
    function updateActiveLang(active, inactive) {
        active.classList.add('active');
        inactive.classList.remove('active');
    }
}

// Hero interactions and streak
function setupHero() {
    const exploreBtn = document.getElementById('heroExplore');
    const surpriseBtn = document.getElementById('heroSurprise');
    const stats = document.getElementById('heroStats');

    updateHeroStats(stats);

    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            const section = document.querySelector('.exploration-section');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (surpriseBtn) {
        // Touch and click support for mobile
        const handleSurprise = (e) => {
            if (e) {
                e.preventDefault?.();
                e.stopPropagation?.();
            }
            openSurpriseVerseModal();
        };
        
        surpriseBtn.addEventListener('click', handleSurprise);
        surpriseBtn.addEventListener('touchend', handleSurprise, { passive: false });
        surpriseBtn.addEventListener('pointerdown', handleSurprise);
    }
}

// Surprise Verse Modal
function openSurpriseVerseModal() {
    const modal = document.getElementById('surpriseVerseModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('closeModal');
    const modalContent = document.querySelector('.modal-content');
    
    // Prevent scroll on mobile when modal opens
    document.documentElement.classList.add('modal-open');
    document.body.classList.add('modal-open');
    
    // Get a random verse
    const randomIndex = Math.floor(Math.random() * API.fallbackVerses.length);
    const verse = API.fallbackVerses[randomIndex];
    const currentLang = i18n.currentLang;
    
    // Display verse
    document.getElementById('surpriseVerseText').textContent = verse[currentLang].text;
    document.getElementById('surpriseVerseReference').textContent = verse[currentLang].reference;
    
    // Store current verse for actions
    modalContent.dataset.verse = JSON.stringify(verse[currentLang]);
    
    // Show modal
    modal.classList.remove('hidden');
    
    // Close modal handlers
    const closeModal = () => {
        modal.classList.add('hidden');
        document.documentElement.classList.remove('modal-open');
        document.body.classList.remove('modal-open');
    };
    
    closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    // Favorite button
    const favBtn = document.getElementById('surpriseFavorite');
    favBtn.onclick = (e) => {
        e.stopPropagation();
        const verse = JSON.parse(modalContent.dataset.verse);
        const saved = toggleFavorite(verse);
        syncFavoriteButton(favBtn, verse);
        renderFavorites();
        showNotification(saved ? (currentLang === 'es' ? 'Guardado ♡' : 'Saved ♡') : (currentLang === 'es' ? 'Eliminado' : 'Removed'));
    };
    
    // Share button
    const shareBtn = document.getElementById('surpriseShare');
    const shareMenu = document.getElementById('surpriseShareMenu');
    shareBtn.onclick = (e) => {
        e.stopPropagation();
        shareMenu.classList.toggle('hidden');
    };
    
    // Share options
    const getVerseText = () => {
        const v = JSON.parse(modalContent.dataset.verse);
        return `${v.text}\n\n— ${v.reference}`;
    };
    
    document.getElementById('surpriseShareTwitter').onclick = (e) => {
        e.stopPropagation();
        const text = getVerseText();
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.origin + window.location.pathname)}`;
        window.open(url, '_blank', 'width=600,height=400');
        shareMenu.classList.add('hidden');
    };
    
    document.getElementById('surpriseShareWhatsApp').onclick = (e) => {
        e.stopPropagation();
        const text = getVerseText();
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
        shareMenu.classList.add('hidden');
    };
    
    document.getElementById('surpriseShareFacebook').onclick = (e) => {
        e.stopPropagation();
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + window.location.pathname)}`;
        window.open(url, '_blank', 'width=600,height=400');
        shareMenu.classList.add('hidden');
    };
    
    document.getElementById('surpriseShareCopy').onclick = (e) => {
        e.stopPropagation();
        const text = getVerseText();
        navigator.clipboard.writeText(text).then(() => {
            showNotification(currentLang === 'es' ? 'Copiado al portapapeles' : 'Copied to clipboard');
            shareMenu.classList.add('hidden');
        });
    };
    
    // New verse button
    const newVerseBtn = document.getElementById('newSurpriseVerse');
    newVerseBtn.onclick = (e) => {
        e.stopPropagation();
        openSurpriseVerseModal();
    };
}

function updateHeroStats(targetEl) {
    if (!targetEl) return;
    const today = new Date();
    const todayKey = today.toDateString();
    const lastDate = localStorage.getItem('holyverse-streak-date');
    let count = parseInt(localStorage.getItem('holyverse-streak-count') || '0', 10);

    if (lastDate !== todayKey) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastDate === yesterday.toDateString()) {
            count += 1;
        } else {
            count = 1;
        }
        localStorage.setItem('holyverse-streak-date', todayKey);
        localStorage.setItem('holyverse-streak-count', count.toString());
    }

    // Obtener estadísticas
    const favorites = getFavorites();
    const history = JSON.parse(localStorage.getItem('holyverse-search-history') || '[]');
    const favCount = favorites.length;
    const searchCount = history.length;

    const streakLabel = i18n.currentLang === 'es' ? 'Racha' : 'Streak';
    const daysLabel = i18n.currentLang === 'es' ? 'días' : 'days';
    const savedLabel = i18n.currentLang === 'es' ? 'Guardados' : 'Saved';
    const searchLabel = i18n.currentLang === 'es' ? 'Búsquedas' : 'Searches';
    
    targetEl.innerHTML = `
        <div class="stats-grid">
            <div class="stat-item">
                <span class="stat-icon">🔥</span>
                <span class="stat-value">${count}</span>
                <span class="stat-label">${streakLabel}</span>
            </div>
            <div class="stat-item">
                <span class="stat-icon">⭐</span>
                <span class="stat-value">${favCount}</span>
                <span class="stat-label">${savedLabel}</span>
            </div>
            <div class="stat-item">
                <span class="stat-icon">🔍</span>
                <span class="stat-value">${searchCount}</span>
                <span class="stat-label">${searchLabel}</span>
            </div>
        </div>
    `;
}

// Verse of the Day
async function setupVerseOfTheDay() {
    const verseText = document.getElementById('verseText');
    const verseReference = document.getElementById('verseReference');
    const refreshBtn = document.getElementById('refreshVerse');
    const shareBtn = document.getElementById('shareVerse');
    const favoriteBtn = document.getElementById('favoriteVerse');
    
    let currentFullVerse = null; // Store full verse with both languages
    
    // Load verse
    async function loadVerse() {
        // Check if we already have today's verse cached
        let fullVerse = verseCache.getDaily();
        
        if (!fullVerse) {
            // Get random verse index to fetch the full object
            const randomIndex = Math.floor(Math.random() * API.fallbackVerses.length);
            fullVerse = API.fallbackVerses[randomIndex];
            verseCache.setDaily(fullVerse);
        }
        
        currentFullVerse = fullVerse;
        // Ensure fullVerse has both languages
        if (fullVerse && fullVerse.es && fullVerse.en) {
            displayVerse(fullVerse[i18n.currentLang]);
        } else {
            // Fallback if data is corrupted
            const randomIndex = Math.floor(Math.random() * API.fallbackVerses.length);
            currentFullVerse = API.fallbackVerses[randomIndex];
            verseCache.setDaily(currentFullVerse);
            displayVerse(currentFullVerse[i18n.currentLang]);
        }

        updateHeroStats(document.getElementById('heroStats'));
        syncFavoriteButton(favoriteBtn, currentFullVerse[i18n.currentLang]);
    }
    
    function displayVerse(verse) {
        verseText.textContent = verse.text;
        verseReference.textContent = verse.reference;
        verseText.parentElement.dataset.verse = JSON.stringify(verse);
        
        // Add animation
        verseText.style.animation = 'none';
        setTimeout(() => {
            verseText.style.animation = 'fadeIn 0.6s ease';
        }, 10);
    }
    
    // Initial load
    await loadVerse();
    
    // Function to update verse display when language changes
    window.updateVerseDisplay = function(lang) {
        if (currentFullVerse && currentFullVerse[lang]) {
            displayVerse(currentFullVerse[lang]);
        }
    };
    
    // Refresh button
    refreshBtn.addEventListener('click', async () => {
        refreshBtn.style.transform = 'rotate(180deg)';
        verseCache.clearCache();
        const randomIndex = Math.floor(Math.random() * API.fallbackVerses.length);
        const newFullVerse = API.fallbackVerses[randomIndex];
        verseCache.setDaily(newFullVerse);
        currentFullVerse = newFullVerse;
        displayVerse(newFullVerse[i18n.currentLang]);
        updateHeroStats(document.getElementById('heroStats'));
        syncFavoriteButton(favoriteBtn, newFullVerse[i18n.currentLang]);
        
        setTimeout(() => {
            refreshBtn.style.transform = 'rotate(0deg)';
        }, 300);
    });
    
    // Share button - toggle menu
    shareBtn.addEventListener('click', () => {
        const menu = document.getElementById('shareMenu');
        menu.classList.toggle('hidden');
    });
    
    // Share menu options
    const shareMenu = document.getElementById('shareMenu');
    const getVerseShareText = () => {
        const verse = JSON.parse(verseText.parentElement.dataset.verse);
        return `${verse.text}\n\n— ${verse.reference}`;
    };
    const getVerseShareURL = () => {
        return window.location.origin + window.location.pathname;
    };
    
    document.getElementById('shareTwitter')?.addEventListener('click', () => {
        const text = getVerseShareText();
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(getVerseShareURL())}`;
        window.open(url, '_blank', 'width=600,height=400');
        shareMenu.classList.add('hidden');
    });
    
    document.getElementById('shareWhatsApp')?.addEventListener('click', () => {
        const text = getVerseShareText();
        const url = `https://wa.me/?text=${encodeURIComponent(text + ' ' + getVerseShareURL())}`;
        window.open(url, '_blank');
        shareMenu.classList.add('hidden');
    });
    
    document.getElementById('shareFacebook')?.addEventListener('click', () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getVerseShareURL())}`;
        window.open(url, '_blank', 'width=600,height=400');
        shareMenu.classList.add('hidden');
    });
    
    document.getElementById('shareCopy')?.addEventListener('click', () => {
        const text = getVerseShareText();
        navigator.clipboard.writeText(text).then(() => {
            showNotification(i18n.currentLang === 'es' ? 'Copiado al portapapeles' : 'Copied to clipboard');
            shareMenu.classList.add('hidden');
        });
    });
    
    // Favorite button
    favoriteBtn.addEventListener('click', () => {
        const verse = JSON.parse(verseText.parentElement.dataset.verse);
        const saved = toggleFavorite(verse);
        syncFavoriteButton(favoriteBtn, verse);
        renderFavorites();
        showNotification(saved ? (i18n.currentLang === 'es' ? 'Guardado' : 'Saved') : (i18n.currentLang === 'es' ? 'Eliminado' : 'Removed'));
    });
}

// Mood Selector
async function setupMoodSelector() {
    const moodBtns = document.querySelectorAll('.mood-btn');
    
    moodBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const mood = btn.dataset.mood;
            const verse = await API.getVersesByMood(mood);
            
            // Show verse in a highlight
            showMoodVerse(verse, mood);
            
            // Highlight selected mood
            moodBtns.forEach(b => b.style.borderColor = 'var(--border)');
            btn.style.borderColor = 'var(--highlight)';
        });
    });
}

function showMoodVerse(verse, mood) {
    const existingModal = document.querySelector('.mood-modal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.className = 'mood-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1500;
        animation: fadeIn 0.3s ease;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: linear-gradient(135deg, rgba(26, 26, 46, 0.95), rgba(22, 33, 62, 0.95));
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 3rem;
        max-width: 600px;
        width: 90%;
        text-align: center;
        color: white;
        position: relative;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: transparent;
        border: none;
        color: var(--text-secondary);
        font-size: 1.5rem;
        cursor: pointer;
    `;
    closeBtn.addEventListener('click', () => modal.remove());
    
    const emoji = document.createElement('div');
    emoji.style.cssText = 'font-size: 3rem; margin-bottom: 1rem;';
    const moodEmojis = {
        hopeful: '🌅',
        anxious: '🌪️',
        grieving: '🌧️',
        joyful: '✨',
        confused: '🌀',
        peaceful: '🌿'
    };
    emoji.textContent = moodEmojis[mood];
    
    const text = document.createElement('p');
    text.textContent = verse.text;
    text.style.cssText = 'font-size: 1.3rem; line-height: 1.8; margin-bottom: 1.5rem; font-style: italic;';
    
    const ref = document.createElement('p');
    ref.textContent = verse.reference;
    ref.style.cssText = 'color: var(--gold); font-size: 1rem;';
    
    content.appendChild(closeBtn);
    content.appendChild(emoji);
    content.appendChild(text);
    content.appendChild(ref);
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Exploration data (bilingual)
const explorationData = {
    books: {
        es: {
            otTitle: 'Antiguo Testamento (39 libros)',
            ntTitle: 'Nuevo Testamento (27 libros)',
            ot: [
                'Génesis', 'Éxodo', 'Levítico', 'Números', 'Deuteronomio',
                'Josué', 'Jueces', 'Rut', '1 Samuel', '2 Samuel',
                '1 Reyes', '2 Reyes', '1 Crónicas', '2 Crónicas', 'Esdras',
                'Nehemías', 'Ester', 'Job', 'Salmos', 'Proverbios',
                'Eclesiastés', 'Cantares', 'Isaías', 'Jeremías', 'Lamentaciones',
                'Ezequiel', 'Daniel', 'Oseas', 'Joel', 'Amós',
                'Abdías', 'Jonás', 'Miqueas', 'Nahúm', 'Habacuc',
                'Sofonías', 'Hageo', 'Zacarías', 'Malaquías'
            ],
            nt: [
                'Mateo', 'Marcos', 'Lucas', 'Juan', 'Hechos',
                'Romanos', '1 Corintios', '2 Corintios', 'Gálatas', 'Efesios',
                'Filipenses', 'Colosenses', '1 Tesalonicenses', '2 Tesalonicenses', '1 Timoteo',
                '2 Timoteo', 'Tito', 'Filemón', 'Hebreos', 'Santiago',
                '1 Pedro', '2 Pedro', '1 Juan', '2 Juan', '3 Juan',
                'Judas', 'Apocalipsis'
            ]
        },
        en: {
            otTitle: 'Old Testament (39 books)',
            ntTitle: 'New Testament (27 books)',
            ot: [
                'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
                'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
                '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
                'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
                'Ecclesiastes', 'Song of Songs', 'Isaiah', 'Jeremiah', 'Lamentations',
                'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
                'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
                'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'
            ],
            nt: [
                'Matthew', 'Mark', 'Luke', 'John', 'Acts',
                'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
                'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy',
                '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James',
                '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
                'Jude', 'Revelation'
            ]
        }
    },
    characters: [
        {
            id: 'jesus',
            es: { name: 'Jesús', period: '4 AC - 30 DC', desc: 'El Salvador, figura central del cristianismo' },
            en: { name: 'Jesus', period: '4 BC - AD 30', desc: 'The Savior, central figure of Christianity' }
        },
        {
            id: 'moses',
            es: { name: 'Moisés', period: '1450 AC aprox', desc: 'Liberador de Israel, recibidor de la Ley' },
            en: { name: 'Moses', period: 'c. 1450 BC', desc: 'Liberator of Israel, receiver of the Law' }
        },
        {
            id: 'abraham',
            es: { name: 'Abraham', period: '2100 AC aprox', desc: 'Padre de la fe, patriarca fundamental' },
            en: { name: 'Abraham', period: 'c. 2100 BC', desc: 'Father of faith, foundational patriarch' }
        },
        {
            id: 'david',
            es: { name: 'David', period: '1040-970 AC', desc: 'Rey de Israel, poeta y músico' },
            en: { name: 'David', period: '1040-970 BC', desc: 'King of Israel, poet and musician' }
        },
        {
            id: 'solomon',
            es: { name: 'Salomón', period: '990-931 AC', desc: 'Rey sabio, constructor del templo' },
            en: { name: 'Solomon', period: '990-931 BC', desc: 'Wise king, temple builder' }
        },
        {
            id: 'mary',
            es: { name: 'María', period: '50 AC - 48 DC aprox', desc: 'Madre de Jesús, figura central en el cristianismo' },
            en: { name: 'Mary', period: '50 BC - AD 48', desc: 'Mother of Jesus, central Christian figure' }
        },
        {
            id: 'peter',
            es: { name: 'Pedro', period: '10 DC - 67 DC', desc: 'Apóstol, líder de la iglesia primitiva' },
            en: { name: 'Peter', period: 'AD 10 - 67', desc: 'Apostle, early church leader' }
        },
        {
            id: 'paul',
            es: { name: 'Pablo', period: '10 DC - 67 DC', desc: 'Apóstol de los gentiles, escribió epístolas' },
            en: { name: 'Paul', period: 'AD 10 - 67', desc: 'Apostle to the Gentiles, epistle author' }
        }
    ],
    timeline: [
        { year: '-2100', es: 'Nacimiento de Abraham', en: 'Birth of Abraham' },
        { year: '-1300', es: 'Moisés y el Éxodo', en: 'Moses and the Exodus' },
        { year: '-1000', es: 'Reino de David', en: 'Reign of David' },
        { year: '-516', es: 'Reconstrucción del Templo', en: 'Rebuilding of the Temple' },
        { year: '4 AC', es: 'Nacimiento de Jesús', en: 'Birth of Jesus' },
        { year: '30 DC', es: 'Crucifixión y Resurrección', en: 'Crucifixion and Resurrection' },
        { year: '50 DC', es: 'Epístolas de Pablo', en: "Paul's Epistles" },
        { year: '70 DC', es: 'Caída de Jerusalén', en: 'Fall of Jerusalem' }
    ],
    mapPlaceholder: {
        es: 'Próximamente: Mapa interactivo de Tierra Santa 🗺️',
        en: 'Coming soon: Interactive Holy Land map 🗺️'
    }
};

// Exploration Cards
function setupExplorationCards() {
    const cards = document.querySelectorAll('.explore-card');
    loadExplorationData();
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const section = card.dataset.section;
            showExplorationSection(section);
        });
    });
}

function loadExplorationData() {
    renderExplorationContent(i18n.currentLang);
}

function renderExplorationContent(lang) {
    // Back buttons text
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.innerHTML = `← <span class="back-label">${i18n.get('explore.back')}</span>`;
    });
    
    // Books
    const otBooks = document.getElementById('otBooks');
    const ntBooks = document.getElementById('ntBooks');
    const otTitle = document.getElementById('otTitle');
    const ntTitle = document.getElementById('ntTitle');
    const books = explorationData.books[lang] || explorationData.books.es;
    
    otTitle.textContent = books.otTitle;
    ntTitle.textContent = books.ntTitle;
    otBooks.innerHTML = '';
    ntBooks.innerHTML = '';
    
    books.ot.forEach(book => {
        const item = document.createElement('div');
        item.className = 'book-item';
        item.dataset.book = book;
        item.dataset.testament = 'OT';
        item.innerHTML = `
            <span class="book-icon">📖</span>
            <span class="book-title">${book}</span>
            <span class="pill pill-ot">OT</span>
        `;
        otBooks.appendChild(item);
    });
    
    books.nt.forEach(book => {
        const item = document.createElement('div');
        item.className = 'book-item';
        item.dataset.book = book;
        item.dataset.testament = 'NT';
        item.innerHTML = `
            <span class="book-icon">📖</span>
            <span class="book-title">${book}</span>
            <span class="pill pill-nt">NT</span>
        `;
        ntBooks.appendChild(item);
    });
    
    // Characters
    const charactersList = document.getElementById('charactersList');
    charactersList.innerHTML = '';
    explorationData.characters.forEach(char => {
        const data = char[lang] || char.es;
        const card = document.createElement('div');
        card.className = 'character-card';
        card.innerHTML = `
            <div class="character-name">${data.name}</div>
            <div class="character-period">${data.period}</div>
            <div class="character-desc">${data.desc}</div>
            <div class="character-tags">
                <span class="tag-chip">${lang === 'en' ? 'Key figure' : 'Figura clave'}</span>
                <span class="tag-chip">${lang === 'en' ? 'Story' : 'Historia'}</span>
            </div>
        `;
        charactersList.appendChild(card);
    });

    // Book click handlers (show detail modal)
    const allBookItems = document.querySelectorAll('.book-item');
    allBookItems.forEach(item => {
        item.addEventListener('click', () => {
            showBookDetail(item.dataset.book, item.dataset.testament, lang);
        });
    });
    
    // Timeline
    const timelineContainer = document.getElementById('timelineContainer');
    timelineContainer.innerHTML = '';
    explorationData.timeline.forEach(event => {
        const text = lang === 'en' ? event.en : event.es;
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
            <div class="timeline-content">
                <div class="timeline-year">${event.year}</div>
                <div class="timeline-event">${text}</div>
            </div>
        `;
        timelineContainer.appendChild(item);
    });
    
    // Map placeholder
    const mapPlaceholder = document.getElementById('mapPlaceholder');
    if (mapPlaceholder) {
        mapPlaceholder.textContent = explorationData.mapPlaceholder[lang] || explorationData.mapPlaceholder.es;
    }
}

function showExplorationSection(section) {
    // Hide grid and details
    document.querySelector('.exploration-section').classList.add('hidden');
    document.querySelectorAll('.exploration-detail').forEach(s => s.classList.add('hidden'));
    
    const sectionMap = {
        'books': 'booksSection',
        'characters': 'charactersSection',
        'maps': 'mapsSection',
        'timeline': 'timelineSection'
    };
    const targetId = sectionMap[section];
    if (targetId) {
        const targetEl = document.getElementById(targetId);
        targetEl.classList.remove('hidden');
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function closeExploration() {
    document.querySelectorAll('.exploration-detail').forEach(s => s.classList.add('hidden'));
    const gridSection = document.querySelector('.exploration-section');
    gridSection.classList.remove('hidden');
    gridSection.scrollIntoView({ behavior: 'smooth' });
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Global search
function setupSearch() {
    const input = document.getElementById('searchInput');
    const button = document.getElementById('searchBtn');
    const results = document.getElementById('searchResults');
    const statusEl = document.getElementById('searchStatus');
    const historyContainer = document.getElementById('searchHistory');
    const historyList = document.getElementById('historyList');
    const advancedToggle = document.getElementById('advancedToggle');
    const advancedFilters = document.getElementById('advancedFilters');
    const pagination = document.getElementById('searchPagination');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    
    if (!input || !button || !results) {
        console.warn('Search elements not found');
        return;
    }

    let currentPage = 1;
    let currentTotal = 0;
    let currentLimit = 20;

    try {
        updateSearchStatus(statusEl);
    } catch (err) {
        console.warn('Error updating search status:', err);
    }
    
    loadSearchHistory(historyList, historyContainer, input);
    populateBookFilter();

    // Inicializar vacío
    results.innerHTML = '';

    // Toggle advanced filters
    if (advancedToggle) {
        advancedToggle.addEventListener('click', () => {
            advancedFilters.classList.toggle('hidden');
        });
    }

    // Update limit when changed
    const limitFilter = document.getElementById('limitFilter');
    if (limitFilter) {
        limitFilter.addEventListener('change', () => {
            currentLimit = parseInt(limitFilter.value);
            currentPage = 1;
        });
    }

    async function runSearch(page = 1) {
        const term = input.value.trim();
        
        if (!term) {
            results.innerHTML = `<p class="empty-state">${i18n.currentLang === 'es' ? 'Escribe una referencia o palabra clave' : 'Type a reference or keyword'}</p>`;
            pagination.classList.add('hidden');
            return;
        }
        
        // Guardar en historial
        if (page === 1) {
            saveSearchHistory(term);
            loadSearchHistory(historyList, historyContainer, input);
        }
        
        // Detectar si es una referencia (ej: "Juan 3:16", "Genesis 1", "Galatas 2:20")
        const referencePattern = /^[a-záéíóúñ]+\s+\d+(?::\d+)?(?:-\d+)?$/i;
        const isReference = referencePattern.test(term);
        
        // Get filter options
        const testament = document.getElementById('testamentFilter')?.value || 'all';
        const bookId = document.getElementById('bookFilter')?.value || 'all';
        const compareTranslations = document.getElementById('compareTranslations')?.checked || false;
        const limit = currentLimit;
        const offset = (page - 1) * limit;
        
        results.innerHTML = `<div class="spinner" aria-label="${i18n.currentLang === 'es' ? 'Buscando' : 'Searching'}"></div>`;
        pagination.classList.add('hidden');
        
        try {
            // Si es una referencia específica, usar getVerseByReference
            if (isReference && page === 1) {
                const verse = await API.getVerseByReference(term, i18n.currentLang);
                
                if (verse) {
                    const verses = [verse];
                    renderSearchResults(results, verses, false);
                    return;
                }
            }
            
            // Búsqueda normal por contenido
            const response = await API.searchVerses(term, i18n.currentLang, {
                limit,
                offset,
                testament,
                bookId,
                compareTranslations
            });
            
            const verses = response.results || response;
            currentTotal = response.total || verses.length;
            currentPage = page;
            
            renderSearchResults(results, verses, compareTranslations);
            updatePagination(page, limit, currentTotal, response.hasMore);
        } catch (err) {
            console.error('Search error:', err);
            results.innerHTML = `<p class="empty-state error">Error: ${err.message}</p>`;
        }
    }

    function updatePagination(page, limit, total, hasMore) {
        if (total <= limit && !hasMore) {
            pagination.classList.add('hidden');
            return;
        }
        
        pagination.classList.remove('hidden');
        const totalPages = Math.ceil(total / limit);
        pageInfo.textContent = `Página ${page} de ${totalPages}`;
        
        prevPageBtn.disabled = page === 1;
        nextPageBtn.disabled = !hasMore && page >= totalPages;
    }

    prevPageBtn?.addEventListener('click', () => {
        if (currentPage > 1) {
            runSearch(currentPage - 1);
        }
    });

    nextPageBtn?.addEventListener('click', () => {
        runSearch(currentPage + 1);
    });

    button.addEventListener('click', () => runSearch(1));
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') runSearch(1);
    });
}

// Populate book filter dropdown
function populateBookFilter() {
    const bookFilter = document.getElementById('bookFilter');
    if (!bookFilter) return;
    
    const books = [
        // Old Testament
        { id: 'GEN', name: 'Génesis / Genesis' },
        { id: 'EXO', name: 'Éxodo / Exodus' },
        { id: 'LEV', name: 'Levítico / Leviticus' },
        { id: 'NUM', name: 'Números / Numbers' },
        { id: 'DEU', name: 'Deuteronomio / Deuteronomy' },
        { id: 'JOS', name: 'Josué / Joshua' },
        { id: 'JDG', name: 'Jueces / Judges' },
        { id: 'RUT', name: 'Rut / Ruth' },
        { id: 'PSA', name: 'Salmos / Psalms' },
        { id: 'PRO', name: 'Proverbios / Proverbs' },
        { id: 'ISA', name: 'Isaías / Isaiah' },
        { id: 'JER', name: 'Jeremías / Jeremiah' },
        { id: 'MAT', name: 'Mateo / Matthew' },
        { id: 'MRK', name: 'Marcos / Mark' },
        { id: 'LUK', name: 'Lucas / Luke' },
        { id: 'JHN', name: 'Juan / John' },
        { id: 'ACT', name: 'Hechos / Acts' },
        { id: 'ROM', name: 'Romanos / Romans' },
        { id: '1CO', name: '1 Corintios / 1 Corinthians' },
        { id: '2CO', name: '2 Corintios / 2 Corinthians' },
        { id: 'GAL', name: 'Gálatas / Galatians' },
        { id: 'EPH', name: 'Efesios / Ephesians' },
        { id: 'PHP', name: 'Filipenses / Philippians' },
        { id: 'COL', name: 'Colosenses / Colossians' },
        { id: '1TH', name: '1 Tesalonicenses / 1 Thessalonians' },
        { id: '2TH', name: '2 Tesalonicenses / 2 Thessalonians' },
        { id: '1TI', name: '1 Timoteo / 1 Timothy' },
        { id: '2TI', name: '2 Timoteo / 2 Timothy' },
        { id: 'TIT', name: 'Tito / Titus' },
        { id: 'PHM', name: 'Filemón / Philemon' },
        { id: 'HEB', name: 'Hebreos / Hebrews' },
        { id: 'JAS', name: 'Santiago / James' },
        { id: '1PE', name: '1 Pedro / 1 Peter' },
        { id: '2PE', name: '2 Pedro / 2 Peter' },
        { id: '1JN', name: '1 Juan / 1 John' },
        { id: '2JN', name: '2 Juan / 2 John' },
        { id: '3JN', name: '3 Juan / 3 John' },
        { id: 'JUD', name: 'Judas / Jude' },
        { id: 'REV', name: 'Apocalipsis / Revelation' }
    ];
    
    books.forEach(book => {
        const option = document.createElement('option');
        option.value = book.id;
        option.textContent = book.name;
        bookFilter.appendChild(option);
    });
}

// Historial de búsquedas
function saveSearchHistory(term) {
    let history = JSON.parse(localStorage.getItem('holyverse-search-history') || '[]');
    // Eliminar duplicado si existe
    history = history.filter(t => t !== term);
    // Agregar al principio
    history.unshift(term);
    // Mantener solo últimas 10
    history = history.slice(0, 10);
    localStorage.setItem('holyverse-search-history', JSON.stringify(history));
}

function loadSearchHistory(listEl, containerEl, inputEl) {
    const history = JSON.parse(localStorage.getItem('holyverse-search-history') || '[]');
    
    if (history.length === 0) {
        containerEl.classList.add('hidden');
        return;
    }
    
    containerEl.classList.remove('hidden');
    listEl.innerHTML = '';
    
    history.forEach(term => {
        const chip = document.createElement('div');
        chip.className = 'history-item';
        chip.innerHTML = `
            <span>${term}</span>
            <span class="history-remove">✕</span>
        `;
        
        chip.addEventListener('click', (e) => {
            if (e.target.classList.contains('history-remove')) {
                e.stopPropagation();
                removeSearchHistory(term);
                loadSearchHistory(listEl, containerEl, inputEl);
            } else {
                inputEl.value = term;
                inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
            }
        });
        
        listEl.appendChild(chip);
    });
}

function renderSearchResults(container, verses, showTranslation = false) {
    container.innerHTML = '';
    if (!verses || verses.length === 0) {
        container.innerHTML = `<p class="empty-state">${i18n.currentLang === 'es' ? 'Sin resultados. Prueba otra referencia.' : 'No results. Try another reference.'}</p>`;
        return;
    }

    verses.forEach(v => {
        const card = document.createElement('div');
        card.className = 'search-card';
        
        let translationHtml = '';
        if (showTranslation && v.translation) {
            const langLabel = v.translation.lang === 'es' ? 'Español' : 'English';
            translationHtml = `
                <div class="search-translation">
                    <div class="translation-label">📖 ${langLabel}:</div>
                    <div class="translation-text">${v.translation.text}</div>
                </div>
            `;
        }
        
        card.innerHTML = `
            <div class="search-ref">${v.reference || '—'}</div>
            <div class="search-text">${v.text || ''}</div>
            ${translationHtml}
            <div class="search-actions">
                <button class="ghost-btn search-open">${i18n.currentLang === 'es' ? 'Abrir' : 'Open'}</button>
                <button class="ghost-btn search-favorite" title="${i18n.currentLang === 'es' ? 'Guardar' : 'Save'}">♡</button>
            </div>
        `;
        
        card.querySelector('.search-open').addEventListener('click', () => openVerseModal(v));
        card.querySelector('.search-favorite').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(v);
            showNotification(i18n.currentLang === 'es' ? 'Guardado ♡' : 'Saved ♡');
        });
        
        container.appendChild(card);
    });
}

function removeSearchHistory(term) {
    let history = JSON.parse(localStorage.getItem('holyverse-search-history') || '[]');
    history = history.filter(t => t !== term);
    localStorage.setItem('holyverse-search-history', JSON.stringify(history));
}

// Verse modal + deep links
async function openVerseFromReference(reference) {
    if (!reference) return;
    let verse = await API.getVerseByReference(reference, i18n.currentLang);
    if (!verse) {
        verse = findFallbackVerse(reference, i18n.currentLang);
    }
    if (!verse) {
        showNotification(i18n.currentLang === 'es' ? 'No se pudo abrir el versículo' : 'Could not open verse');
        return;
    }
    openVerseModal(verse);
}

function findFallbackVerse(reference, lang) {
    const match = API.fallbackVerses.find(v => (v[lang]?.reference || v.es.reference).toLowerCase().includes(reference.toLowerCase()));
    if (match) return match[lang] || match.es;
    return null;
}

function openVerseModal(verse) {
    if (!verse) return;
    const existing = document.querySelector('.verse-modal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'verse-modal';
    overlay.innerHTML = `
        <div class="verse-modal__content">
            <button class="verse-modal__close" aria-label="close">✕</button>
            <div class="verse-modal__ref">${verse.reference || ''}</div>
            <div class="verse-modal__text">${verse.text || ''}</div>
            <div class="verse-modal__actions">
                <button class="ghost-btn verse-save">${i18n.currentLang === 'es' ? 'Guardar' : 'Save'}</button>
                <button class="primary-btn verse-share">${i18n.currentLang === 'es' ? 'Compartir' : 'Share'}</button>
            </div>
        </div>
    `;

    overlay.querySelector('.verse-modal__close').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

    const saveBtn = overlay.querySelector('.verse-save');
    saveBtn.addEventListener('click', () => {
        const saved = toggleFavorite(verse);
        renderFavorites();
        showNotification(saved ? (i18n.currentLang === 'es' ? 'Guardado' : 'Saved') : (i18n.currentLang === 'es' ? 'Eliminado' : 'Removed'));
    });

    const shareBtn = overlay.querySelector('.verse-share');
    shareBtn.addEventListener('click', () => {
        const text = `${verse.text}\n\n— ${verse.reference}\n\n✦ HolyVerse`;
        if (navigator.share) {
            navigator.share({ title: 'HolyVerse', text });
        } else {
            navigator.clipboard.writeText(text);
            showNotification(i18n.currentLang === 'es' ? 'Copiado' : 'Copied');
        }
    });

    document.body.appendChild(overlay);
}

// Favorites UI
function setupFavoritesUI() {
    const toggleBtn = document.getElementById('favoritesToggle');
    const list = document.getElementById('favoritesList');
    if (!toggleBtn || !list) return;

    toggleBtn.addEventListener('click', () => {
        list.classList.toggle('hidden');
        if (!list.classList.contains('hidden')) {
            renderFavorites();
        }
    });
}

function renderFavorites() {
    const list = document.getElementById('favoritesList');
    if (!list) return;
    const favorites = getFavorites();
    const notes = getFavoriteNotes();
    list.innerHTML = '';

    if (!favorites.length) {
        list.innerHTML = `<p class="empty-state">${i18n.currentLang === 'es' ? 'Sin guardados aún' : 'No favorites yet'}</p>`;
        return;
    }

    favorites.slice(-5).reverse().forEach(fav => {
        const row = document.createElement('div');
        row.className = 'favorite-row';
        const note = notes[fav.reference];
        const hasNote = note && note.trim().length > 0;
        
        row.innerHTML = `
            <div style="flex: 1;">
                <div class="favorite-ref">${fav.reference}</div>
                <div class="favorite-text">${fav.text}</div>
                ${hasNote ? `<div class="favorite-note">"${note.substring(0, 50)}${note.length > 50 ? '...' : ''}"</div>` : ''}
                <button class="favorite-note-btn" data-ref="${fav.reference}">📝 ${i18n.currentLang === 'es' ? 'Nota' : 'Note'}</button>
            </div>
            <div class="favorite-actions">
                <button class="ghost-btn open">${i18n.currentLang === 'es' ? 'Abrir' : 'Open'}</button>
                <button class="ghost-btn remove">${i18n.currentLang === 'es' ? 'Quitar' : 'Remove'}</button>
            </div>
        `;
        row.querySelector('.open').addEventListener('click', () => openVerseModal(fav));
        row.querySelector('.remove').addEventListener('click', () => {
            removeFavorite(fav.reference);
            deleteNote(fav.reference);
            renderFavorites();
        });
        row.querySelector('.favorite-note-btn').addEventListener('click', () => {
            openNoteModal(fav.reference, fav.text);
        });
        list.appendChild(row);
    });
}

function getFavorites() {
    // If user is logged in, get from auth system
    if (typeof AuthSystem !== 'undefined' && AuthSystem.getCurrentUser()) {
        return AuthSystem.getFavorites();
    }
    // Otherwise, use local storage
    return JSON.parse(localStorage.getItem('holyverse-favorites') || '[]');
}

function toggleFavorite(verse) {
    // If user is logged in, save to auth system
    if (typeof AuthSystem !== 'undefined' && AuthSystem.getCurrentUser()) {
        const favorites = AuthSystem.getFavorites();
        const exists = favorites.some(v => v.reference === verse.reference);
        if (exists) {
            AuthSystem.removeFavorite(verse.reference);
        } else {
            AuthSystem.saveFavorite(verse);
        }
        return !exists;
    }
    
    // Otherwise, use local storage
    const favorites = getFavorites();
    const exists = favorites.some(v => v.reference === verse.reference);
    const updated = exists
        ? favorites.filter(v => v.reference !== verse.reference)
        : [...favorites, verse];
    localStorage.setItem('holyverse-favorites', JSON.stringify(updated));
    return !exists; // true si se guardó, false si se eliminó
}

function removeFavorite(reference) {
    // If user is logged in, remove from auth system
    if (typeof AuthSystem !== 'undefined' && AuthSystem.getCurrentUser()) {
        AuthSystem.removeFavorite(reference);
        return;
    }
    
    // Otherwise, use local storage
    const updated = getFavorites().filter(v => v.reference !== reference);
    localStorage.setItem('holyverse-favorites', JSON.stringify(updated));
}

function syncFavoriteButton(btn, verse) {
    if (!btn || !verse) return;
    const favorites = getFavorites();
    const exists = favorites.some(v => v.reference === verse.reference);
    btn.style.color = exists ? 'var(--highlight)' : 'var(--text-secondary)';
}

// Funciones de notas
function getFavoriteNotes() {
    return JSON.parse(localStorage.getItem('holyverse-favorite-notes') || '{}');
}

function saveNote(reference, note) {
    const notes = getFavoriteNotes();
    if (note.trim().length > 0) {
        notes[reference] = note;
    } else {
        delete notes[reference];
    }
    localStorage.setItem('holyverse-favorite-notes', JSON.stringify(notes));
}

function deleteNote(reference) {
    const notes = getFavoriteNotes();
    delete notes[reference];
    localStorage.setItem('holyverse-favorite-notes', JSON.stringify(notes));
}

function openNoteModal(reference, verseText) {
    const notes = getFavoriteNotes();
    const currentNote = notes[reference] || '';
    
    const modal = document.createElement('div');
    modal.className = 'note-modal';
    modal.innerHTML = `
        <div class="note-modal__content">
            <button class="note-modal__close">✕</button>
            <h3 class="note-modal__title">${i18n.currentLang === 'es' ? 'Añade una nota' : 'Add a note'}</h3>
            <p class="note-modal__ref">${reference}</p>
            <textarea class="note-modal__textarea" placeholder="${i18n.currentLang === 'es' ? 'Escribe tus pensamientos, reflexiones...' : 'Write your thoughts, reflections...'}">${currentNote}</textarea>
            <div class="note-modal__actions">
                <button class="note-save">${i18n.currentLang === 'es' ? 'Guardar' : 'Save'}</button>
                <button class="note-cancel">${i18n.currentLang === 'es' ? 'Cancelar' : 'Cancel'}</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const textarea = modal.querySelector('.note-modal__textarea');
    const saveBtn = modal.querySelector('.note-save');
    const cancelBtn = modal.querySelector('.note-cancel');
    const closeBtn = modal.querySelector('.note-modal__close');
    
    textarea.focus();
    
    const closeModal = () => {
        modal.remove();
    };
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    saveBtn.addEventListener('click', () => {
        saveNote(reference, textarea.value);
        renderFavorites();
        closeModal();
        showNotification(i18n.currentLang === 'es' ? 'Nota guardada' : 'Note saved');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// Reference extraction for bot deep links
function extractReferenceFromText(text) {
    if (!text) return null;
    const refRegex = /([1-3]?\s?[A-Za-zÁÉÍÓÚÑáéíóú]+\s?\d{1,3}:\d{1,3})/;
    const match = text.match(refRegex);
    return match ? match[1] : null;
}

function isApiActive() {
    return !!(API.BIBLE_API_KEY && API.BIBLE_API_KEY !== 'YOUR_API_KEY_HERE');
}

function updateSearchStatus(el) {
    if (!el) return;
    const online = isApiActive();
    el.textContent = online ? (i18n.currentLang === 'es' ? 'API activa' : 'API online') : (i18n.currentLang === 'es' ? 'Modo offline/fallback' : 'Offline/fallback');
    el.className = `status-pill ${online ? 'status-on' : 'status-off'}`;
}

// Map setup with Leaflet + fallback
function setupMap() {
    const mapEl = document.getElementById('map');
    const fallbackEl = document.getElementById('mapFallback');
    const placeholder = document.getElementById('mapPlaceholder');
    if (!mapEl) return;

    const locations = [
        { name: 'Jerusalén', desc: 'Templo y vida de Jesús', coords: [31.7784, 35.2066] },
        { name: 'Belén', desc: 'Lugar de nacimiento de Jesús', coords: [31.7054, 35.2024] },
        { name: 'Nazaret', desc: 'Infancia de Jesús', coords: [32.6996, 35.3035] },
        { name: 'Damasco', desc: 'Conversión de Pablo', coords: [33.5138, 36.2765] }
    ];

    if (typeof L === 'undefined') {
        renderMapFallback(fallbackEl, locations);
        return;
    }

    if (placeholder) placeholder.classList.add('hidden');

    const map = L.map(mapEl).setView([31.8, 35.2], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    locations.forEach(loc => {
        const marker = L.circleMarker(loc.coords, {
            radius: 8,
            fillColor: '#e94560',
            color: '#e94560',
            weight: 2,
            opacity: 0.9,
            fillOpacity: 0.7
        }).addTo(map);
        marker.bindPopup(`<strong>${loc.name}</strong><br>${loc.desc}`);
    });
}

function renderMapFallback(target, locations) {
    const placeholder = document.getElementById('mapPlaceholder');
    if (placeholder) placeholder.classList.add('hidden');
    if (!target) return;
    target.classList.remove('hidden');
    target.innerHTML = '';
    locations.forEach(loc => {
        const card = document.createElement('div');
        card.className = 'map-card';
        card.innerHTML = `
            <div class="map-card__title">${loc.name}</div>
            <div class="map-card__desc">${loc.desc}</div>
            <div class="map-card__coords">${loc.coords[0].toFixed(2)}, ${loc.coords[1].toFixed(2)}</div>
            <a class="map-card__link" href="https://www.openstreetmap.org/?mlat=${loc.coords[0]}&mlon=${loc.coords[1]}#map=12/${loc.coords[0]}/${loc.coords[1]}" target="_blank" rel="noopener">${i18n.currentLang === 'es' ? 'Ver en mapa' : 'Open map'}</a>
        `;
        target.appendChild(card);
    });
}

// Book detail modal with API hook
async function showBookDetail(book, testament, lang) {
    const existing = document.querySelector('.book-modal');
    if (existing) existing.remove();
    
    const overlay = document.createElement('div');
    overlay.className = 'book-modal';
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1700;
        animation: fadeIn 0.25s ease;
        padding: 1rem;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: linear-gradient(135deg, rgba(26,26,46,0.96), rgba(22,33,62,0.96));
        border: 1px solid var(--border);
        border-radius: 14px;
        padding: 2rem;
        max-width: 540px;
        width: 100%;
        box-shadow: 0 18px 48px rgba(0,0,0,0.35);
        position: relative;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: transparent;
        border: none;
        color: var(--text-secondary);
        font-size: 1.3rem;
        cursor: pointer;
    `;
    closeBtn.addEventListener('click', () => overlay.remove());
    
    const title = document.createElement('h3');
    title.textContent = `${i18n.get('explore.book.detailTitle')} ${book}`;
    title.style.cssText = 'margin-bottom: 0.5rem; color: var(--gold);';
    
    const refLabel = document.createElement('p');
    refLabel.textContent = i18n.get('explore.book.cta');
    refLabel.style.cssText = 'color: var(--text-secondary); margin-bottom: 0.5rem;';
    
    const refText = `${book} 1:1`;
    const refValue = document.createElement('p');
    refValue.textContent = refText;
    refValue.style.cssText = 'font-weight: 600; margin-bottom: 1rem;';
    
    const verseBlock = document.createElement('div');
    verseBlock.style.cssText = 'background: rgba(15,52,96,0.25); border:1px solid var(--border); padding: 1rem; border-radius: 10px; min-height: 80px; margin-bottom: 1rem; color: var(--text-secondary);';
    verseBlock.textContent = i18n.get('explore.book.placeholder');
    
    const apiHint = document.createElement('p');
    apiHint.textContent = i18n.get('explore.book.apiHint');
    apiHint.style.cssText = 'color: var(--text-secondary); font-size: 0.9rem;';
    
    content.appendChild(closeBtn);
    content.appendChild(title);
    content.appendChild(refLabel);
    content.appendChild(refValue);
    content.appendChild(verseBlock);
    content.appendChild(apiHint);
    overlay.appendChild(content);
    document.body.appendChild(overlay);
    
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    
    // Try API if configured, else fallback to a sample from current language
    const apiVerse = await API.getVerseByReference(refText, lang);
    if (apiVerse) {
        verseBlock.textContent = `${apiVerse.text}\n— ${apiVerse.reference}`;
        verseBlock.style.color = 'var(--text-primary)';
    } else {
        // fallback: pick a random verse from fallback set in the selected language
        const randomIndex = Math.floor(Math.random() * API.fallbackVerses.length);
        const v = API.fallbackVerses[randomIndex][lang] || API.fallbackVerses[randomIndex].es;
        verseBlock.textContent = `${v.text}\n— ${v.reference}`;
        verseBlock.style.color = 'var(--text-primary)';
    }
}
// Reload content when language changes
function reloadDynamicContent(lang) {
    // Update verse display
    if (window.updateVerseDisplay) {
        window.updateVerseDisplay(lang);
    }
    
    // Update bot greeting language
    const greeting = document.querySelector('.bot-greeting');
    if (greeting) {
        greeting.textContent = i18n.get('bot.greeting');
    }
    
    // Update input placeholder
    const botInput = document.getElementById('botInput');
    if (botInput) {
        botInput.placeholder = i18n.get('bot.placeholder');
    }
    
    // Update exploration content (books, characters, timeline)
    renderExplorationContent(lang);

    // Update hero stats and favorites translations
    updateHeroStats(document.getElementById('heroStats'));
    renderFavorites();
    updateSearchStatus(document.getElementById('searchStatus'));
}

// Notification System
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 2rem;
        background: var(--highlight);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 6px;
        font-size: 0.95rem;
        z-index: 3000;
        animation: slideUp 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(20px);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Service Worker registration (optional, for PWA)
if ('serviceWorker' in navigator) {
    // Uncomment when ready for PWA
    // navigator.serviceWorker.register('/sw.js');
}

// Debug utility - Clear cache if needed
window.clearHolyVerseCache = function() {
    localStorage.removeItem('holyverse-daily-verse');
    localStorage.removeItem('holyverse-verse-date');
    console.log('HolyVerse cache cleared');
    location.reload();
};
