// ==========================================
// BIBLE BOT ENHANCEMENTS - Intelligence Layer
// ==========================================

// Sistema de Análisis Semántico
class SemanticAnalyzer {
    static analyzeQuery(query) {
        const tokens = query.toLowerCase().split(/\s+/);
        const semanticFields = {
            spiritual: ['espíritu', 'alma', 'divinidad', 'sagrado', 'church', 'spiritual', 'holy'],
            emotional: ['amor', 'odio', 'alegr', 'triste', 'fear', 'joy', 'peace'],
            moral: ['justicia', 'pecado', 'virtud', 'vicio', 'sin', 'good', 'evil'],
            historical: ['historia', 'pasado', 'antiguo', 'acontec', 'event', 'ancient', 'past'],
            practical: ['consejo', 'ayuda', 'cómo', 'guía', 'advice', 'help', 'guide']
        };
        
        const matches = {};
        for (const [field, keywords] of Object.entries(semanticFields)) {
            matches[field] = tokens.filter(token => 
                keywords.some(keyword => token.includes(keyword))
            ).length;
        }
        
        return {
            dominant_field: Object.entries(matches).sort((a, b) => b[1] - a[1])[0][0],
            all_fields: matches,
            token_count: tokens.length
        };
    }
    
    static findRelatedTopics(topic, knowledgeBase) {
        const relatedWords = {
            'jesus': ['cristo', 'salvador', 'dios', 'espíritu', 'cruz', 'resurrección'],
            'amor': ['gracia', 'compasión', 'perdón', 'misericordia', 'bondad'],
            'fe': ['confianza', 'creencia', 'esperanza', 'salvación'],
            'dios': ['creador', 'señor', 'todopoderoso', 'eterno', 'trinidad'],
            'biblia': ['versículo', 'escrituras', 'antiguo testamento', 'nuevo testamento']
        };
        
        return relatedWords[topic.toLowerCase()] || [];
    }
}

// Sistema de Sugerencias Inteligentes
class SmartSuggestionEngine {
    constructor(bot) {
        this.bot = bot;
        this.frequentTopics = this.loadFrequentTopics();
    }
    
    loadFrequentTopics() {
        const stored = localStorage.getItem('biblebot_frequent_topics');
        return stored ? JSON.parse(stored) : {};
    }
    
    saveFrequentTopics() {
        localStorage.setItem('biblebot_frequent_topics', JSON.stringify(this.frequentTopics));
    }
    
    trackTopic(topic) {
        this.frequentTopics[topic] = (this.frequentTopics[topic] || 0) + 1;
        this.saveFrequentTopics();
    }
    
    getSmartSuggestions(lastQuery, lang) {
        const suggestions = {
            es: {
                'jesus': ['¿Quiénes fueron los apóstoles de Jesús?', '¿Cuál es el mensaje central de Jesús?', '¿Cuáles fueron los milagros de Jesús?'],
                'amor': ['¿Cómo manifestar el amor cristiano?', '¿Qué dice la Biblia sobre el amor al prójimo?', '¿Cuál es la diferencia entre amor humano y divino?'],
                'fe': ['¿Cómo fortalecer mi fe?', '¿Qué son los milagros y la fe?', '¿Cómo vivir por fe en tiempos difíciles?'],
                'oración': ['¿Cómo hacer una oración efectiva?', '¿Cuáles son ejemplos de oración en la Biblia?', '¿Por qué la oración es importante?'],
                'biblia': ['¿Cuáles son los 66 libros de la Biblia?', '¿Cuál es la estructura del Nuevo Testamento?', '¿Cómo interpretar las Escrituras?']
            },
            en: {
                'jesus': ['Who were the apostles of Jesus?', 'What is Jesus\'s central message?', 'What were Jesus\'s miracles?'],
                'love': ['How to manifest Christian love?', 'What does the Bible say about loving your neighbor?', 'What\'s the difference between human and divine love?'],
                'faith': ['How to strengthen my faith?', 'What are miracles and faith?', 'How to live by faith in difficult times?'],
                'prayer': ['How to pray effectively?', 'What are examples of prayer in the Bible?', 'Why is prayer important?'],
                'bible': ['What are the 66 books of the Bible?', 'What is the structure of the New Testament?', 'How to interpret the Scriptures?']
            }
        };
        
        const topicKey = lastQuery.toLowerCase().split(/\s+/)[0];
        return suggestions[lang][topicKey] || suggestions[lang]['bible'];
    }
    
    getSuggestionsForUser(lang) {
        const topicEntries = Object.entries(this.frequentTopics)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(entry => entry[0]);
        
        const allSuggestions = [];
        for (const topic of topicEntries) {
            allSuggestions.push(...this.getSmartSuggestions(topic, lang));
        }
        
        return allSuggestions.slice(0, 3);
    }
}

// Sistema de Historial mejorado
class ConversationAnalytics {
    constructor() {
        this.sessions = this.loadSessions();
        this.currentSession = this.startNewSession();
    }
    
    loadSessions() {
        const stored = localStorage.getItem('biblebot_sessions');
        return stored ? JSON.parse(stored) : [];
    }
    
    saveSessions() {
        localStorage.setItem('biblebot_sessions', JSON.stringify(this.sessions));
    }
    
    startNewSession() {
        return {
            id: Date.now(),
            startTime: new Date(),
            queries: [],
            moods: [],
            topics: []
        };
    }
    
    recordQuery(query, response, mood, topic) {
        this.currentSession.queries.push({
            query,
            response,
            timestamp: new Date()
        });
        
        if (mood) this.currentSession.moods.push(mood);
        if (topic) this.currentSession.topics.push(topic);
    }
    
    endSession() {
        this.currentSession.endTime = new Date();
        this.currentSession.duration = 
            this.currentSession.endTime - this.currentSession.startTime;
        this.sessions.push(this.currentSession);
        this.saveSessions();
    }
    
    getStatistics() {
        const totalQueries = this.sessions.reduce((sum, s) => sum + s.queries.length, 0);
        const totalSessions = this.sessions.length;
        const moods = this.sessions.flatMap(s => s.moods);
        const moodBreakdown = {};
        moods.forEach(mood => {
            moodBreakdown[mood] = (moodBreakdown[mood] || 0) + 1;
        });
        
        return {
            totalQueries,
            totalSessions,
            averageQueriesPerSession: totalQueries / totalSessions || 0,
            moods: moodBreakdown,
            moodTrend: moods.slice(-10) // últimos 10 estados emocionales
        };
    }
}

// Sistema de almacenamiento de favoritos avanzado
class AdvancedFavorites {
    constructor() {
        this.favorites = this.loadFavorites();
    }
    
    loadFavorites() {
        const stored = localStorage.getItem('biblebot_advanced_favorites');
        return stored ? JSON.parse(stored) : {};
    }
    
    saveFavorites() {
        localStorage.setItem('biblebot_advanced_favorites', JSON.stringify(this.favorites));
    }
    
    addFavorite(verse, category = 'general', notes = '') {
        const key = `${verse.book}_${verse.chapter}_${verse.verse}`;
        this.favorites[key] = {
            verse,
            category,
            notes,
            addedAt: new Date(),
            views: 0,
            lastViewed: null
        };
        this.saveFavorites();
    }
    
    getFavoritesByCategory(category) {
        return Object.values(this.favorites)
            .filter(fav => fav.category === category);
    }
    
    getTopFavorites(limit = 5) {
        return Object.values(this.favorites)
            .sort((a, b) => b.views - a.views)
            .slice(0, limit);
    }
    
    addView(verseKey) {
        if (this.favorites[verseKey]) {
            this.favorites[verseKey].views++;
            this.favorites[verseKey].lastViewed = new Date();
            this.saveFavorites();
        }
    }
}

// Inicializar análisis semántico y sugerencias
const semanticAnalyzer = new SemanticAnalyzer();
const suggestionEngine = new SmartSuggestionEngine(bot);
const conversationAnalytics = new ConversationAnalytics();
const advancedFavorites = new AdvancedFavorites();
