// Strip HTML tags helper
function stripTags(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

// API Integration
const API = {
    // Bible API (https://api.scripture.api.bible)
    BIBLE_API_URL: 'https://rest.api.bible/v1/bibles',
    BIBLE_API_KEY: 'Z2cS3kURbkESQWaeO5Lr-',
    EN_BIBLE_ID: 'bba9f40183526463-01', // Berean Standard Bible (available in your plan)
    ES_BIBLE_ID: '592420522e16049f-01', // RVR09 - needs to be added to your plan
    USE_FALLBACK_FOR_ES: true, // Use local data for Spanish until you add Spanish bible to your plan 
    
    // Function to get available bibles for this API key
    async getAvailableBibles() {
        try {
            const res = await fetch(this.BIBLE_API_URL, {
                headers: { 'api-key': this.BIBLE_API_KEY }
            });
            if (!res.ok) throw new Error('Failed to fetch bibles');
            const data = await res.json();
            console.log('Available Bibles:', data.data);
            return data.data;
        } catch (err) {
            console.error('Error fetching bibles:', err);
            return [];
        }
    }, 
    
    // Fallback data for demo / offline
    fallbackVerses: [
        {
            es: {
                text: 'Porque Dios amó tanto al mundo que dio a su único Hijo, para que todo el que crea en él no se pierda, sino que tenga vida eterna.',
                reference: 'Juan 3:16',
                book: 'Juan',
                chapter: 3,
                verse: 16
            },
            en: {
                text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
                reference: 'John 3:16',
                book: 'John',
                chapter: 3,
                verse: 16
            }
        },
        {
            es: {
                text: 'En el principio era el Verbo, y el Verbo estaba con Dios, y el Verbo era Dios.',
                reference: 'Juan 1:1',
                book: 'Juan',
                chapter: 1,
                verse: 1
            },
            en: {
                text: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
                reference: 'John 1:1',
                book: 'John',
                chapter: 1,
                verse: 1
            }
        },
        {
            es: {
                text: 'Estaré contigo; no te dejaré ni te abandonaré.',
                reference: 'Josué 1:5',
                book: 'Josué',
                chapter: 1,
                verse: 5
            },
            en: {
                text: 'No one will be able to stand against you all the days of your life. As I was with Moses, so I will be with you; I will never leave you nor forsake you.',
                reference: 'Joshua 1:5',
                book: 'Joshua',
                chapter: 1,
                verse: 5
            }
        },
        {
            es: {
                text: 'Encomienda tu camino al Señor, confía en él, y él actuará.',
                reference: 'Salmo 37:5',
                book: 'Salmos',
                chapter: 37,
                verse: 5
            },
            en: {
                text: 'Commit to the Lord whatever you do, and your plans will succeed.',
                reference: 'Psalm 37:5',
                book: 'Psalms',
                chapter: 37,
                verse: 5
            }
        },
        {
            es: {
                text: 'Porque no nos ha dado Dios espíritu de cobardía, sino de poder, de amor y de dominio propio.',
                reference: '2 Timoteo 1:7',
                book: '2 Timoteo',
                chapter: 1,
                verse: 7
            },
            en: {
                text: 'For the Spirit God gave us does not make us timid, but gives us power, love and a sound mind.',
                reference: '2 Timothy 1:7',
                book: '2 Timothy',
                chapter: 1,
                verse: 7
            }
        },
        {
            es: {
                text: 'Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.',
                reference: 'Mateo 11:28',
                book: 'Mateo',
                chapter: 11,
                verse: 28
            },
            en: {
                text: 'Come to me, all you who are weary and burdened, and I will give you rest.',
                reference: 'Matthew 11:28',
                book: 'Matthew',
                chapter: 11,
                verse: 28
            }
        },
        {
            es: {
                text: 'He venido para que tengan vida, y la tengan en abundancia.',
                reference: 'Juan 10:10',
                book: 'Juan',
                chapter: 10,
                verse: 10
            },
            en: {
                text: 'I have come that they may have life, and to the full.',
                reference: 'John 10:10',
                book: 'John',
                chapter: 10,
                verse: 10
            }
        },
        {
            es: {
                text: 'La paz os dejo, mi paz os doy; no como el mundo la da, yo os la doy.',
                reference: 'Juan 14:27',
                book: 'Juan',
                chapter: 14,
                verse: 27
            },
            en: {
                text: 'Peace I leave with you; my peace I give you. I do not give to you as the world gives.',
                reference: 'John 14:27',
                book: 'John',
                chapter: 14,
                verse: 27
            }
        },
        {
            es: {
                text: 'Todo lo puedo en Cristo que me fortalece.',
                reference: 'Filipenses 4:13',
                book: 'Filipenses',
                chapter: 4,
                verse: 13
            },
            en: {
                text: 'I can do all things through Christ who strengthens me.',
                reference: 'Philippians 4:13',
                book: 'Philippians',
                chapter: 4,
                verse: 13
            }
        },
        {
            es: {
                text: 'Confía en el Señor de todo corazón, y no te apoyes en tu propia inteligencia.',
                reference: 'Proverbios 3:5',
                book: 'Proverbios',
                chapter: 3,
                verse: 5
            },
            en: {
                text: 'Trust in the Lord with all your heart and lean not on your own understanding.',
                reference: 'Proverbs 3:5',
                book: 'Proverbs',
                chapter: 3,
                verse: 5
            }
        },
        {
            es: {
                text: 'El Señor es mi pastor; nada me faltará.',
                reference: 'Salmo 23:1',
                book: 'Salmos',
                chapter: 23,
                verse: 1
            },
            en: {
                text: 'The Lord is my shepherd; I shall not want.',
                reference: 'Psalm 23:1',
                book: 'Psalms',
                chapter: 23,
                verse: 1
            }
        },
        {
            es: {
                text: 'Porque donde dos o tres se reúnen en mi nombre, allí estoy yo en medio de ellos.',
                reference: 'Mateo 18:20',
                book: 'Mateo',
                chapter: 18,
                verse: 20
            },
            en: {
                text: 'For where two or three gather in my name, there am I with them.',
                reference: 'Matthew 18:20',
                book: 'Matthew',
                chapter: 18,
                verse: 20
            }
        },
        {
            es: {
                text: 'Y conoceréis la verdad, y la verdad os hará libres.',
                reference: 'Juan 8:32',
                book: 'Juan',
                chapter: 8,
                verse: 32
            },
            en: {
                text: 'Then you will know the truth, and the truth will set you free.',
                reference: 'John 8:32',
                book: 'John',
                chapter: 8,
                verse: 32
            }
        },
        {
            es: {
                text: 'Pedid, y se os dará; buscad, y hallaréis; llamad, y se os abrirá.',
                reference: 'Mateo 7:7',
                book: 'Mateo',
                chapter: 7,
                verse: 7
            },
            en: {
                text: 'Ask and it will be given to you; seek and you will find; knock and the door will be opened to you.',
                reference: 'Matthew 7:7',
                book: 'Matthew',
                chapter: 7,
                verse: 7
            }
        },
        {
            es: {
                text: 'Yo soy el camino, la verdad y la vida; nadie viene al Padre sino por mí.',
                reference: 'Juan 14:6',
                book: 'Juan',
                chapter: 14,
                verse: 6
            },
            en: {
                text: 'I am the way and the truth and the life. No one comes to the Father except through me.',
                reference: 'John 14:6',
                book: 'John',
                chapter: 14,
                verse: 6
            }
        },
        {
            es: {
                text: 'El amor es paciente, es bondadoso. El amor no es envidioso ni jactancioso ni orgulloso.',
                reference: '1 Corintios 13:4',
                book: '1 Corintios',
                chapter: 13,
                verse: 4
            },
            en: {
                text: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud.',
                reference: '1 Corinthians 13:4',
                book: '1 Corinthians',
                chapter: 13,
                verse: 4
            }
        }
    ],

    // Mood-based verse suggestions
    moodVerses: {
        hopeful: [0, 3, 4, 6],
        anxious: [1, 4, 5, 7],
        grieving: [3, 5, 7],
        joyful: [6, 7],
        confused: [0, 3, 4],
        peaceful: [7, 5, 3]
    },

    async getVerseByReference(reference, lang = 'en') {
        if (!this.BIBLE_API_KEY || this.BIBLE_API_KEY === 'YOUR_API_KEY_HERE') {
            return null;
        }
        const bibleId = lang === 'en' ? this.EN_BIBLE_ID : this.ES_BIBLE_ID;
        const query = encodeURIComponent(reference);
        try {
            const res = await fetch(`${this.BIBLE_API_URL}/${bibleId}/search?query=${query}&limit=1`, {
                headers: { 'api-key': this.BIBLE_API_KEY }
            });
            if (!res.ok) throw new Error('API search error');
            const data = await res.json();
            const verseId = data?.data?.verses?.[0]?.id;
            if (!verseId) return null;
            const verseRes = await fetch(`${this.BIBLE_API_URL}/${bibleId}/verses/${verseId}`, {
                headers: { 'api-key': this.BIBLE_API_KEY }
            });
            if (!verseRes.ok) throw new Error('Verse fetch error');
            const verseData = await verseRes.json();
            return {
                text: verseData?.data?.content ? stripTags(verseData.data.content) : verseData?.data?.reference,
                reference: verseData?.data?.reference || reference
            };
        } catch (err) {
            console.error('API verse lookup failed', err);
            return null;
        }
    },

    async searchVerses(term, lang = 'en', options = {}) {
        const q = term.{ results: [], total: 0, hasMore: false };

        const {
            limit = 20,
            offset = 0,
            testament = 'all',
            bookId = 'all',
            compareTranslations = false
        } = options;

        // Use fallback for Spanish if not available in API
        if (lang === 'es' && this.USE_FALLBACK_FOR_ES) {
            const filtered = this.fallbackVerses
                .map(v => v[lang] || v.es)
                .filter(v => v.text.toLowerCase().includes(q.toLowerCase()) || v.reference.toLowerCase().includes(q.toLowerCase()));
            const results = filtered.slice(offset, offset + limit);
            return { 
                results, 
                total: filtered.length, 
                hasMore: filtered.length > (offset + limit) 
            };
        }ranslations = false
        } = options;

        // If no API key, search locally in fallback
        if (!this.BIBLE_API_KEY || this.BIBLE_API_KEY === 'YOUR_API_KEY_HERE') {
            const filtered = this.fallbackVerses
                .map(v => v[lang] || v.es)
                .filter(v => v.text.toLowerCase().includes(q.toLowerCase()) || v.reference.toLowerCase().includes(q.toLowerCase()));
            const results = filtered.slice(offset, offset + limit);
            return { 
                results, 
                total: filtered.length, 
                hasMore: filtered.length > (offset + limit) 
            };
        }

        const bibleId = lang === 'en' ? this.EN_BIBLE_ID : this.ES_BIBLE_ID;
        try {
            // Build search URL with parameters
            let searchUrl = `${this.BIBLE_API_URL}/${bibleId}/search?query=${encodeURIComponent(q)}&limit=${limit}`;
            
            if (offset > 0) searchUrl += `&offset=${offset}`;

            console.log('Search URL:', searchUrl);
            console.log('API Key:', this.BIBLE_API_KEY);

            const res = await fetch(searchUrl, {
                headers: { 'api-key': this.BIBLE_API_KEY }
            });
            
            console.log('API Response status:', res.status);
            
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                console.error('API Error:', errorData);
                throw new Error(`API search error: ${res.status} - ${JSON.stringify(errorData)}`);
            }
            const data = await res.json();
            console.log('API Data:', data);
            const verses = data?.data?.verses || [];
            const total = data?.data?.total || verses.length;
            const results = [];
            
            // Fetch verse details
            for (const v of verses) {
                try {
                    const verseRes = await fetch(`${this.BIBLE_API_URL}/${bibleId}/verses/${v.id}`, {
                        headers: { 'api-key': this.BIBLE_API_KEY }
                    });
                    if (verseRes.ok) {
                        const vd = await verseRes.json();
                        const verseData = {
                            text: vd?.data?.content ? stripTags(vd.data.content) : vd?.data?.reference,
                            reference: vd?.data?.reference || v.reference,
                            bookId: v.bookId,
                            chapterId: v.chapterId,
                            id: v.id
                        };
                        
                        // If comparing translations, fetch the other language
                        if (compareTranslations) {
                            const otherLang = lang === 'en' ? 'es' : 'en';
                            const otherBibleId = lang === 'en' ? this.ES_BIBLE_ID : this.EN_BIBLE_ID;
                            try {
                                const otherRes = await fetch(`${this.BIBLE_API_URL}/${otherBibleId}/verses/${v.id}`, {
                                    headers: { 'api-key': this.BIBLE_API_KEY }
                                });
                                if (otherRes.ok) {
                                    const otherVd = await otherRes.json();
                                    verseData.translation = {
                                        text: otherVd?.data?.content ? stripTags(otherVd.data.content) : otherVd?.data?.reference,
                                        reference: otherVd?.data?.reference,
                                        lang: otherLang
                                    };
                                }
                            } catch (err) {
                                console.warn('Translation fetch failed', err);
                            }
                        }
                        
                        results.push(verseData);
                    }
                } catch (err) {
                    console.warn('Verse fetch failed', err);
                }
            }
            
            return { results, total, hasMore: total > (offset + limit) };
        } catch (err) {
            console.error('API search failed', err);
            return { results: [], total: 0, hasMore: false };
        }
    },

    async getRandomVerse() {
        try {
            const randomIndex = Math.floor(Math.random() * this.fallbackVerses.length);
            const verse = this.fallbackVerses[randomIndex];
            return verse[i18n.currentLang];
        } catch (error) {
            console.error('Error fetching verse:', error);
            return this.fallbackVerses[0][i18n.currentLang];
        }
    },
    
    async getVersesByMood(mood) {
        try {
            const indices = this.moodVerses[mood] || [0, 1, 2];
            const randomIndex = indices[Math.floor(Math.random() * indices.length)];
            return this.fallbackVerses[randomIndex][i18n.currentLang];
        } catch (error) {
            console.error('Error fetching mood verses:', error);
            return this.fallbackVerses[0][i18n.currentLang];
        }
    },
    
    async connectRealAPI() {
        console.log('Ready to connect to real Bible API');
    }
};

// Cache daily verse
class VerseCache {
    constructor() {
        this.storageKey = 'holyverse-daily-verse';
        this.dateKey = 'holyverse-verse-date';
    }
    
    getDaily(lang = null) {
        const today = new Date().toDateString();
        const cachedDate = localStorage.getItem(this.dateKey);
        
        if (cachedDate === today) {
            const cached = localStorage.getItem(this.storageKey);
            if (cached) {
                const verseData = JSON.parse(cached);
                if (lang && verseData[lang]) return verseData[lang];
                return verseData;
            }
        }
        return null;
    }
    
    setDaily(fullVerse) {
        const today = new Date().toDateString();
        localStorage.setItem(this.dateKey, today);
        localStorage.setItem(this.storageKey, JSON.stringify(fullVerse));
    }
    
    clearCache() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.dateKey);
    }
}

const verseCache = new VerseCache();
