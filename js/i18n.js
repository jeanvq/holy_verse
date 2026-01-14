// Internationalization System
const i18n = {
    currentLang: localStorage.getItem('holyverse-lang') || 'es',
    
    translations: {
        es: {
            'hero.title': 'Universo Bíblico Interactivo',
            'hero.subtitle': 'Explora historias, contextos y conexiones sagradas',
            'hero.cta.explore': 'Explorar hoy',
            'hero.cta.surprise': 'Verso sorpresa',
            
            'daily.title': 'Versículo del Día',
            'daily.share': 'Compartir',
            'daily.favorite': 'Guardar',
            
            'search.title': 'Busca cualquier versículo',
            'search.subtitle': 'API o fallback local en ES/EN',
            'search.placeholder': 'Juan 3:16 o "amor"',
            'search.action': 'Buscar',
            'search.no_results': 'Sin resultados. Prueba otra referencia.',
            'search.status.online': 'API activa',
            'search.status.offline': 'Modo offline/fallback',
            'search.history.title': 'Búsquedas recientes:',
            
            'favorites.title': 'Tus guardados',
            'favorites.toggle': 'Ver guardados',
            
            'mood.title': '¿Cómo te sientes hoy?',
            'moods.hopeful': 'Esperanzado',
            'moods.anxious': 'Ansioso',
            'moods.grieving': 'Dolido',
            'moods.joyful': 'Alegre',
            'moods.confused': 'Confundido',
            'moods.peaceful': 'Tranquilo',
            
            'explore.title': 'Explora el Universo',
            'explore.books': 'Libros',
            'explore.books.desc': 'Navega por los 66 libros',
            'explore.characters': 'Personajes',
            'explore.characters.desc': 'Descubre historias épicas',
            'explore.maps': 'Mapas',
            'explore.maps.desc': 'Contexto geográfico',
            'explore.timeline': 'Línea de Tiempo',
            'explore.timeline.desc': 'Conecta los eventos',
            'explore.back': 'Atrás',
            'explore.book.detailTitle': 'Explorar',
            'explore.book.cta': 'Versículo inicial sugerido',
            'explore.book.apiHint': 'Pronto podrás abrir cualquier versículo con la API (ES/EN).',
            'explore.book.placeholder': 'Referencia sugerida',
            
            'bot.greeting': 'Hola, soy tu guía del universo bíblico. ¿En qué puedo ayudarte?',
            'bot.placeholder': 'Pregunta algo...',
            'bot.no_answer': 'Interesante pregunta. Aún estoy aprendiendo sobre este tema.',
            
            'footer.desc': 'Explora el universo bíblico de forma interactiva',
            'footer.links.title': 'Enlaces',
            'footer.links.top': 'Arriba',
            'footer.links.search': 'Buscar',
            'footer.copyright': '© 2026 HolyVerse. Todos los derechos reservados.',
            
            'pwa.install': 'Instalar App',
        },
        en: {
            'hero.title': 'Interactive Biblical Universe',
            'hero.subtitle': 'Explore stories, contexts and sacred connections',
            'hero.cta.explore': 'Explore today',
            'hero.cta.surprise': 'Surprise verse',
            
            'daily.title': 'Verse of the Day',
            'daily.share': 'Share',
            'daily.favorite': 'Save',
            
            'search.title': 'Search any verse',
            'search.subtitle': 'API or local fallback EN/ES',
            'search.placeholder': 'John 3:16 or love',
            'search.action': 'Search',
            'search.no_results': 'No results. Try another reference.',
            'search.status.online': 'API online',
            'search.status.offline': 'Offline/fallback',
            'search.history.title': 'Recent searches:',
            
            'favorites.title': 'Your favorites',
            'favorites.toggle': 'View saved',
            
            'mood.title': 'How are you feeling today?',
            'moods.hopeful': 'Hopeful',
            'moods.anxious': 'Anxious',
            'moods.grieving': 'Grieving',
            'moods.joyful': 'Joyful',
            'moods.confused': 'Confused',
            'moods.peaceful': 'Peaceful',
            
            'explore.title': 'Explore the Universe',
            'explore.books': 'Books',
            'explore.books.desc': 'Navigate 66 books',
            'explore.characters': 'Characters',
            'explore.characters.desc': 'Discover epic stories',
            'explore.maps': 'Maps',
            'explore.maps.desc': 'Geographic context',
            'explore.timeline': 'Timeline',
            'explore.timeline.desc': 'Connect the events',
            'explore.back': 'Back',
            'explore.book.detailTitle': 'Explore',
            'explore.book.cta': 'Suggested starting verse',
            'explore.book.apiHint': 'Soon you can open any verse via the API (EN/ES).',
            'explore.book.placeholder': 'Suggested reference',
            
            'bot.greeting': 'Hello, I\'m your guide to the biblical universe. How can I help?',
            'bot.placeholder': 'Ask something...',
            'bot.no_answer': 'Interesting question. I\'m still learning about this topic.',
            
            'footer.desc': 'Explore the biblical universe interactively',
            'footer.links.title': 'Links',
            'footer.links.top': 'Top',
            'footer.links.search': 'Search',
            'footer.copyright': '© 2026 HolyVerse. All rights reserved.',
            
            'pwa.install': 'Install App',
        }
    },
    
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('holyverse-lang', lang);
            this.updatePageTranslations();
        }
    },
    
    get(key) {
        const translations = this.translations[this.currentLang];
        return translations[key] || key;
    },
    
    updatePageTranslations() {
        // Update elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = this.get(key);
        });
        
        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = this.get(key);
        });
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    i18n.updatePageTranslations();
});
