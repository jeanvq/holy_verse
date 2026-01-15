// Strip HTML tags helper
function stripTags(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

// API Integration
const API = {
    // Bible API (https://rest.api.bible)
    BIBLE_API_URL: 'https://rest.api.bible/v1/bibles',
    BIBLE_API_KEY: 'Z2cS3kURbkESQWaeO5Lr-',
    EN_BIBLE_ID: 'bba9f40183526463-01', // Berean Standard Bible
    ES_BIBLE_ID: '592420522e16049f-01', // Spanish Bible from your plan
    
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
                verse: 1
            }
        }
    ],

    moodVerses: {
        hopeful: [0, 1, 2],
        anxious: [3, 4],
        grieving: [2, 3],
        joyful: [0, 1],
        confused: [2, 4],
        peaceful: [3, 4]
    },

    // Get available bibles
    async getAvailableBibles() {
        try {
            const res = await fetch(this.BIBLE_API_URL, {
                headers: { 'api-key': this.BIBLE_API_KEY }
            });
            if (!res.ok) throw new Error('Failed to fetch bibles');
            const data = await res.json();
            return data.data;
        } catch (err) {
            console.error('Error fetching bibles:', err);
            return [];
        }
    },

    // Get verse by reference
    async getVerseByReference(reference, lang = 'en') {
        const bibleId = lang === 'en' ? this.EN_BIBLE_ID : this.ES_BIBLE_ID;
        
        try {
            const searchUrl = `${this.BIBLE_API_URL}/${bibleId}/search?query=${encodeURIComponent(reference)}&limit=1`;
            
            const res = await fetch(searchUrl, {
                headers: { 'api-key': this.BIBLE_API_KEY }
            });
            
            if (!res.ok) throw new Error('API search error');
            
            const data = await res.json();
            
            // La API puede retornar "verses" o "passages" dependiendo de la búsqueda
            const verses = data?.data?.verses || [];
            const passages = data?.data?.passages || [];
            
            if (verses.length === 0 && passages.length === 0) return null;
            
            // Si hay passages, usar el primero
            if (passages.length > 0) {
                const passage = passages[0];
                return {
                    text: passage.content ? stripTags(passage.content) : passage.reference,
                    reference: passage.reference || reference,
                    bookId: passage.bookId,
                    id: passage.id
                };
            }
            
            // Si hay verses, obtener detalles del primero
            if (verses.length > 0) {
                const verseRes = await fetch(`${this.BIBLE_API_URL}/${bibleId}/verses/${verses[0].id}`, {
                    headers: { 'api-key': this.BIBLE_API_KEY }
                });
                if (!verseRes.ok) throw new Error('API verse error');
                const vd = await verseRes.json();
                return {
                    text: vd?.data?.content ? stripTags(vd.data.content) : vd?.data?.reference,
                    reference: vd?.data?.reference || reference
                };
            }
        } catch (err) {
            console.error('API verse lookup failed', err);
            return null;
        }
    },

    // Search verses
    async searchVerses(term, lang = 'en', options = {}) {
        const q = term.trim();
        if (!q) return { results: [], total: 0, hasMore: false };

        // Check if searching for a specific verse (e.g., "Hechos 1:10" or "Juan 3:16")
        const specificVerseMatch = q.match(/^([A-Za-z\s]+)\s*(\d+):(\d+)$/i);
        if (specificVerseMatch) {
            const bookName = specificVerseMatch[1].trim();
            const chapterNum = parseInt(specificVerseMatch[2]);
            const verseNum = parseInt(specificVerseMatch[3]);
            
            // Get the specific verse
            const chapterResult = await this.getChapter(bookName, chapterNum, lang);
            if (chapterResult.verses.length > 0) {
                const specificVerse = chapterResult.verses.find(v => v.verse === verseNum);
                if (specificVerse) {
                    return {
                        results: [specificVerse],
                        total: 1,
                        hasMore: false,
                        isSpecific: true
                    };
                }
            }
        }

        // Check if searching for a full chapter (e.g., "Hechos 1" without verse)
        const chapterMatch = q.match(/^(\w+\s*\d+)$/i);
        if (chapterMatch) {
            const parts = chapterMatch[0].match(/^(\w+)\s*(\d+)$/i);
            if (parts) {
                const bookName = parts[1];
                const chapterNum = parseInt(parts[2]);
                const chapterResult = await this.getChapter(bookName, chapterNum, lang);
                if (chapterResult.verses.length > 0) {
                    return {
                        results: chapterResult.verses,
                        total: chapterResult.verses.length,
                        hasMore: false,
                        isChapter: true
                    };
                }
            }
        }

        const {
            limit = 10,  // Changed from 20 to 10 for keyword searches
            offset = 0,
            testament = 'all',
            bookId = 'all',
            compareTranslations = false
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
            let searchUrl = `${this.BIBLE_API_URL}/${bibleId}/search?query=${encodeURIComponent(q)}&limit=${limit}`;
            if (offset > 0) searchUrl += `&offset=${offset}`;

            const res = await fetch(searchUrl, {
                headers: { 'api-key': this.BIBLE_API_KEY }
            });
            
            if (!res.ok) {
                throw new Error(`API error ${res.status}`);
            }

            const data = await res.json();
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
            console.error('API search failed, using fallback data', err);
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
    },

    // Get all verses from a specific chapter
    async getChapter(bookName, chapterNum, lang = 'es') {
        const bibleId = lang === 'en' ? this.EN_BIBLE_ID : this.ES_BIBLE_ID;
        try {
            // First, search for the book to get its ID
            const searchRes = await fetch(`${this.BIBLE_API_URL}/${bibleId}/search?query=${encodeURIComponent(bookName)}&limit=1`, {
                headers: { 'api-key': this.BIBLE_API_KEY }
            });
            
            if (!searchRes.ok) throw new Error('Book not found');
            
            const searchData = await searchRes.json();
            const bookId = searchData?.data?.verses?.[0]?.bookId;
            
            if (!bookId) throw new Error('Could not find book ID');
            
            // Now get the chapter
            const chapterUrl = `${this.BIBLE_API_URL}/${bibleId}/chapters/${bookId}.${chapterNum}?content-type=text&include-notes=false`;
            const chapterRes = await fetch(chapterUrl, {
                headers: { 'api-key': this.BIBLE_API_KEY }
            });
            
            if (!chapterRes.ok) throw new Error(`Chapter not found: ${bookName} ${chapterNum}`);
            
            const chapterData = await chapterRes.json();
            const verses = chapterData?.data?.content ? this.parseChapterContent(chapterData.data.content, bookName, chapterNum) : [];
            
            return {
                book: bookName,
                chapter: chapterNum,
                verses: verses,
                total: verses.length
            };
        } catch (err) {
            console.error('Error fetching chapter:', err);
            return {
                book: bookName,
                chapter: chapterNum,
                verses: [],
                total: 0,
                error: err.message
            };
        }
    },
    
    // Parse chapter content into individual verses
    parseChapterContent(content, bookName, chapterNum) {
        const verses = [];
        // This is a simplified parser - the API returns formatted text
        // Split by verse numbers and extract content
        const versePattern = /\n(\d+)\s+(.*?)(?=\n\d+\s+|\n*$)/gs;
        let match;
        
        while ((match = versePattern.exec(content)) !== null) {
            verses.push({
                verse: parseInt(match[1]),
                text: stripTags(match[2]).trim(),
                reference: `${bookName} ${chapterNum}:${match[1]}`
            });
        }
        
        return verses;
    },

    // Get random verse
    async getRandomVerse() {
        try {
            const randomIndex = Math.floor(Math.random() * this.fallbackVerses.length);
            const verse = this.fallbackVerses[randomIndex];
            const lang = (typeof i18n !== 'undefined') ? i18n.currentLang : 'es';
            return verse[lang];
        } catch (error) {
            console.error('Error fetching verse:', error);
            return this.fallbackVerses[0]['es'];
        }
    },
    
    // Get verses by mood
    async getVersesByMood(mood) {
        try {
            const indices = this.moodVerses[mood] || [0, 1, 2];
            const randomIndex = indices[Math.floor(Math.random() * indices.length)];
            const lang = (typeof i18n !== 'undefined') ? i18n.currentLang : 'es';
            return this.fallbackVerses[randomIndex][lang];
        } catch (error) {
            console.error('Error fetching mood verse:', error);
            return this.fallbackVerses[0]['es'];
        }
    }
};
