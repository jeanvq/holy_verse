// Utility functions for HolyVerse

// String utilities
export const StringUtils = {
    // Remove accents from text
    removeAccents(str) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    },
    
    // Fuzzy match similarity
    calculateSimilarity(str1, str2) {
        const s1 = this.removeAccents(str1).toLowerCase();
        const s2 = this.removeAccents(str2).toLowerCase();
        
        let matches = 0;
        for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
            if (s1[i] === s2[i]) matches++;
        }
        
        return matches / Math.max(s1.length, s2.length);
    },
    
    // Truncate text
    truncate(text, length = 100) {
        return text.length > length ? text.substring(0, length) + '...' : text;
    }
};

// Bible API Integration
export const BibleAPI = {
    // List of free Bible APIs
    APIs: {
        SCRIPTURE_BIBLE: 'https://api.scripture.api.bible/v1',
        BIBLE_DB: 'https://www.bible-api.com',
    },
    
    // Fetch verse by reference
    async fetchVerse(reference, lang = 'es') {
        try {
            // Try Bible API
            const response = await fetch(
                `${this.APIs.BIBLE_DB}/${encodeURIComponent(reference)}?translation=spa`
            );
            
            if (response.ok) {
                const data = await response.json();
                return {
                    text: data.text,
                    reference: data.reference,
                    translation: data.translation
                };
            }
        } catch (error) {
            console.warn('Bible API unavailable:', error);
        }
        
        return null;
    },
    
    // Search verses by keyword
    async searchVerses(keyword, lang = 'es') {
        try {
            const response = await fetch(
                `${this.APIs.BIBLE_DB}/search/${encodeURIComponent(keyword)}?translation=spa`
            );
            
            if (response.ok) {
                const data = await response.json();
                return data.results || [];
            }
        } catch (error) {
            console.warn('Search unavailable:', error);
        }
        
        return [];
    }
};

// Analytics for conversation improvements
export const ConversationAnalytics = {
    trackQuery(query, response, mood = null) {
        const analytics = JSON.parse(localStorage.getItem('holyverse-analytics') || '{}');
        
        const entry = {
            timestamp: new Date().toISOString(),
            query,
            mood,
            responseLength: response.length,
        };
        
        if (!analytics.conversations) analytics.conversations = [];
        analytics.conversations.push(entry);
        
        // Keep only last 100 conversations
        if (analytics.conversations.length > 100) {
            analytics.conversations = analytics.conversations.slice(-100);
        }
        
        localStorage.setItem('holyverse-analytics', JSON.stringify(analytics));
    },
    
    getStats() {
        const analytics = JSON.parse(localStorage.getItem('holyverse-analytics') || '{}');
        const conversations = analytics.conversations || [];
        
        return {
            totalQueries: conversations.length,
            moodBreakdown: this.getMoodBreakdown(conversations),
            topTopics: this.getTopTopics(conversations),
            averageResponseLength: conversations.reduce((sum, c) => sum + c.responseLength, 0) / conversations.length || 0
        };
    },
    
    getMoodBreakdown(conversations) {
        const moods = {};
        conversations.forEach(c => {
            if (c.mood) {
                moods[c.mood] = (moods[c.mood] || 0) + 1;
            }
        });
        return moods;
    },
    
    getTopTopics(conversations) {
        const topics = {};
        conversations.forEach(c => {
            const words = c.query.toLowerCase().split(/\s+/);
            words.forEach(word => {
                if (word.length > 3) {
                    topics[word] = (topics[word] || 0) + 1;
                }
            });
        });
        
        return Object.entries(topics)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([word, count]) => ({ word, count }));
    }
};

// Suggestion engine
export const SuggestionEngine = {
    suggestions: {
        es: {
            general: [
                '¿Cuál es el significado de la fe?',
                '¿Puedes explicarme sobre Jesús?',
                '¿Qué dice la Biblia sobre el amor?',
                '¿Cómo puedo entender mejor la Biblia?',
                '¿Cuál es el propósito de la oración?'
            ],
            hopeful: [
                'Cuéntame sobre la esperanza en la Biblia',
                'Versículos sobre la resurrección',
                '¿Qué promesas hay para el futuro?'
            ],
            anxious: [
                'Versículos para la paz',
                '¿Cómo confiar en Dios en tiempos difíciles?',
                'Promesas de protección en la Biblia'
            ],
            grieving: [
                '¿Cómo maneja la Biblia el dolor?',
                'Versículos de consuelo',
                '¿Hay esperanza después de la pérdida?'
            ]
        },
        en: {
            general: [
                'What is the meaning of faith?',
                'Can you explain Jesus to me?',
                'What does the Bible say about love?',
                'How can I better understand the Bible?',
                'What is the purpose of prayer?'
            ],
            hopeful: [
                'Tell me about hope in the Bible',
                'Verses about resurrection',
                'What promises are there for the future?'
            ],
            anxious: [
                'Verses for peace',
                'How do I trust God in difficult times?',
                'Promises of protection in the Bible'
            ],
            grieving: [
                'How does the Bible address pain?',
                'Verses of comfort',
                'Is there hope after loss?'
            ]
        }
    },
    
    getSuggestions(lang = 'es', mood = null) {
        const categoryKey = mood || 'general';
        return this.suggestions[lang]?.[categoryKey] || this.suggestions[lang]?.general || [];
    },
    
    getRandomSuggestion(lang = 'es', mood = null) {
        const sugg = this.getSuggestions(lang, mood);
        return sugg[Math.floor(Math.random() * sugg.length)] || '';
    }
};

// Local verse cache for offline support
export const VerseCache = {
    cache: JSON.parse(localStorage.getItem('holyverse-verse-cache') || '{}'),
    
    get(reference) {
        return this.cache[reference] || null;
    },
    
    set(reference, data) {
        this.cache[reference] = {
            ...data,
            timestamp: new Date().toISOString()
        };
        this.save();
    },
    
    save() {
        localStorage.setItem('holyverse-verse-cache', JSON.stringify(this.cache));
    },
    
    clear() {
        this.cache = {};
        localStorage.removeItem('holyverse-verse-cache');
    }
};

// Native Share API Utility
export const ShareUtils = {
    // Check if Web Share API is supported
    isSupported() {
        return navigator.share !== undefined;
    },
    
    // Share verse using native share
    async shareVerse(verseText, verseReference) {
        const shareData = {
            title: 'HolyVerse - ' + verseReference,
            text: `${verseText}\n\n— ${verseReference}`,
            url: window.location.href
        };
        
        if (this.isSupported()) {
            try {
                await navigator.share(shareData);
                return { success: true, method: 'native' };
            } catch (err) {
                if (err.name === 'AbortError') {
                    return { success: false, cancelled: true };
                }
                console.log('Native share failed, falling back to custom menu');
                return { success: false, error: err };
            }
        } else {
            // Fallback to custom share menu
            return { success: false, method: 'custom' };
        }
    },
    
    // Copy to clipboard
    async copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (err) {
                console.error('Clipboard write failed', err);
                return false;
            }
        } else {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                document.body.removeChild(textarea);
                return true;
            } catch (err) {
                document.body.removeChild(textarea);
                return false;
            }
        }
    }
};

export default {
    StringUtils,
    BibleAPI,
    ConversationAnalytics,
    SuggestionEngine,
    VerseCache,
    ShareUtils
};
