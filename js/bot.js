// Fuzzy String Matching Algorithm (Levenshtein Distance)
class FuzzyMatcher {
    static levenshteinDistance(str1, str2) {
        const len1 = str1.length;
        const len2 = str2.length;
        const matrix = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(0));
        
        for (let i = 0; i <= len1; i++) matrix[0][i] = i;
        for (let j = 0; j <= len2; j++) matrix[j][0] = j;
        
        for (let j = 1; j <= len2; j++) {
            for (let i = 1; i <= len1; i++) {
                const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(
                    matrix[j][i - 1] + 1,
                    matrix[j - 1][i] + 1,
                    matrix[j - 1][i - 1] + indicator
                );
            }
        }
        return matrix[len2][len1];
    }
    
    static calculateSimilarity(str1, str2) {
        const distance = this.levenshteinDistance(str1, str2);
        const maxLen = Math.max(str1.length, str2.length);
        return 1 - (distance / maxLen);
    }
    
    static findBestMatch(query, keywords, threshold = 0.6) {
        let bestMatch = null;
        let bestScore = threshold;
        
        for (const keyword of keywords) {
            const score = this.calculateSimilarity(query, keyword);
            if (score > bestScore) {
                bestScore = score;
                bestMatch = keyword;
            }
        }
        
        return { match: bestMatch, score: bestScore };
    }
}

// Patrón de búsqueda de versículos (Libro Capítulo:Versículo)
class VersePatternMatcher {
    static parseVerseReference(text) {
        // Patrones: "Juan 3:16", "Génesis 1", "1 Corintios 13:4-7", etc.
        const versePattern = /([1-3]?\s*[A-Za-záéíóúñÁÉÍÓÚÑ]+)\s*(\d+):?(\d+)?(?:-(\d+))?/gi;
        const matches = [];
        let match;
        
        while ((match = versePattern.exec(text)) !== null) {
            matches.push({
                book: match[1].trim(),
                chapter: parseInt(match[2]),
                verseStart: match[3] ? parseInt(match[3]) : 1,
                verseEnd: match[4] ? parseInt(match[4]) : match[3] ? parseInt(match[3]) : null
            });
        }
        
        return matches.length > 0 ? matches : null;
    }
}

// Bible Bot - Intelligent Guide
class BibleBot {
    constructor() {
        this.isOpen = false;
        this.currentMood = null;
        this.knowledgeBase = this.initializeKnowledge();
        this.synonyms = this.initializeSynonyms();
        this.conversationHistory = [];
        this.emotionContext = this.initializeEmotionContext();
        this.questionsAsked = 0;
        this.learnedQuestions = this.loadLearnedQuestions();
        this.intentPatterns = this.initializeIntentPatterns();
        this.explanationBase = this.initializeExplanations();
        this.userPreferences = this.loadUserPreferences();
    }
    
    // Cargar preguntas aprendidas del localStorage
    loadLearnedQuestions() {
        const stored = localStorage.getItem('biblebot_learned_questions');
        return stored ? JSON.parse(stored) : {};
    }
    
    // Guardar preguntas aprendidas
    saveLearnedQuestions() {
        localStorage.setItem('biblebot_learned_questions', JSON.stringify(this.learnedQuestions));
    }
    
    // Cargar preferencias del usuario
    loadUserPreferences() {
        const stored = localStorage.getItem('biblebot_user_preferences');
        return stored ? JSON.parse(stored) : { responseLength: 'medium', favoriteTopics: [] };
    }
    
    // Guardar preferencias
    saveUserPreferences() {
        localStorage.setItem('biblebot_user_preferences', JSON.stringify(this.userPreferences));
    }
    
    // Analizar intención de la pregunta
    initializeIntentPatterns() {
        return {
            definition: ['¿qué es', 'definición', 'significa', 'explicame', 'what is', 'definition', 'explain', 'meaning'],
            story: ['historia', 'cuéntame', 'pasó', 'sucedió', 'story', 'tell me', 'happened', 'what happened'],
            advice: ['consejo', 'ayuda', 'cómo', 'debo', 'deberías', 'advice', 'help', 'should', 'how can'],
            reflection: ['reflexión', 'pensamiento', 'lección', 'significado profundo', 'reflection', 'lesson', 'meaning', 'teach me'],
            verification: ['¿es verdad', 'es correcto', '¿verdad', 'is it true', 'is it correct', 'really'],
            connection: ['relación', 'conexión', 'vínculo', 'similar', 'connection', 'relationship', 'similar', 'like']
        };
    }
    
    // Base de explicaciones detalladas
    initializeExplanations() {
        return {
            es: {
                'jesus': {
                    short: 'Jesucristo es la figura central del cristianismo.',
                    medium: 'Jesucristo nació en Belén, predicó el evangelio del amor, fue crucificado y resucitó al tercer día.',
                    long: 'Jesucristo (6 a.C. - 30 d.C.) es la encarnación de Dios en forma humana. Nació en Belén de una virgen, predicó durante 3 años sobre el reino de Dios, realizó milagros, fue crucificado por los romanos bajo Poncio Pilato, y según la fe cristiana, resucitó al tercer día. Su muerte es vista como el sacrificio final que redime al mundo del pecado. Ascendió al cielo y los cristianos lo esperan para el juicio final.',
                    reflection: 'Jesucristo representa el amor incondicional de Dios hacia la humanidad. Su vida y enseñanzas desafían nuestras prioridades, invitándonos a vivir con compasión, humildad y sacrificio por otros.',
                    verses: ['Juan 3:16', 'Mateo 28:19-20', 'Romanos 6:9']
                },
                'fe': {
                    short: 'La fe es la confianza en Dios.',
                    medium: 'La fe es creer en Dios y confiar en sus promesas, aunque no podamos ver evidencia física.',
                    long: 'La fe (del latín "fides") es más que creencia intelectual; es confianza profunda y relación con Dios. Según Hebreos 11:1, es "la certeza de lo que no se ve". La fe activa está acompañada por acciones que demuestran nuestra confianza. No es un salto a lo irracional, sino confianza basada en evidencia histórica y experiencia personal.',
                    reflection: 'La fe nos transforma. No es estática sino un viaje continuo de crecimiento y confianza. Nos permite enfrentar incertidumbre con paz.',
                    verses: ['Hebreos 11:1', 'Romanos 3:22-28', 'Efesios 2:8-9']
                },
                'amor': {
                    short: 'El amor es el mandamiento más grande según Jesús.',
                    medium: 'El amor (ágape) es sacrificial, incondicional y busca el bien del otro sin esperar recompensa.',
                    long: 'En el idioma griego, "ágape" (el amor divino) se distingue de "filio" (amor fraternal) y "eros" (amor romántico). Es el amor que Dios nos muestra a través de Cristo: desinteresado, sacrificial, abarcador. El mandamiento de amar a Dios y al prójimo resume toda la ley y los profetas. Este amor debe transformar nuestras relaciones, políticas y decisiones diarias.',
                    reflection: 'El amor verdadero requiere vulnerabilidad, riesgo y compromiso continuo. Es la fuerza más transformadora del universo.',
                    verses: ['1 Corintios 13:4-8', 'Juan 13:34-35', '1 Juan 4:7-8']
                }
            },
            en: {
                'jesus': {
                    short: 'Jesus Christ is the central figure of Christianity.',
                    medium: 'Jesus was born in Bethlehem, preached the gospel of love, was crucified, and rose on the third day.',
                    long: 'Jesus Christ (6 BC - 30 AD) is God incarnate in human form. Born in Bethlehem of a virgin, he preached about God\'s kingdom for 3 years, performed miracles, was crucified by Romans under Pontius Pilate, and according to Christian faith, rose on the third day. His death is seen as the final sacrifice that redeems the world from sin. He ascended to heaven and Christians await his return for final judgment.',
                    reflection: 'Jesus represents God\'s unconditional love for humanity. His life and teachings challenge our priorities, inviting us to live with compassion, humility, and sacrifice for others.',
                    verses: ['John 3:16', 'Matthew 28:19-20', 'Romans 6:9']
                },
                'faith': {
                    short: 'Faith is trust in God.',
                    medium: 'Faith is believing in God and trusting his promises, even without physical evidence.',
                    long: 'Faith (from Latin "fides") is more than intellectual belief; it\'s deep trust and relationship with God. According to Hebrews 11:1, it\'s "the certainty of what is not seen." Active faith is accompanied by actions that demonstrate our trust. It\'s not a leap into irrationality, but trust based on historical evidence and personal experience.',
                    reflection: 'Faith transforms us. It\'s not static but a continuous journey of growth and trust. It allows us to face uncertainty with peace.',
                    verses: ['Hebrews 11:1', 'Romans 3:22-28', 'Ephesians 2:8-9']
                },
                'love': {
                    short: 'Love is the greatest commandment according to Jesus.',
                    medium: 'Love (agape) is sacrificial, unconditional, and seeks the good of others without expecting reward.',
                    long: 'In Greek, "agape" (divine love) is distinguished from "philo" (brotherly love) and "eros" (romantic love). It\'s the love God shows us through Christ: selfless, sacrificial, all-encompassing. The commandment to love God and neighbor summarizes all the law and prophets. This love must transform our relationships, politics, and daily decisions.',
                    reflection: 'True love requires vulnerability, risk, and continuous commitment. It\'s the most transformative force in the universe.',
                    verses: ['1 Corinthians 13:4-8', 'John 13:34-35', '1 John 4:7-8']
                }
            }
        };
    }
    
    // Detectar la intención de la pregunta
    detectIntent(query) {
        const patterns = this.intentPatterns;
        for (const [intent, keywords] of Object.entries(patterns)) {
            for (const keyword of keywords) {
                if (query.toLowerCase().includes(keyword)) {
                    return intent;
                }
            }
        }
        return 'general';
    }
    
    // Obtener respuesta con nivel de detalle apropiado
    getDetailedResponse(topic, intent) {
        const lang = i18n.currentLang;
        const explanations = this.explanationBase[lang];
        const topicKey = topic.toLowerCase().replace(/\s/g, '');
        
        if (explanations[topicKey]) {
            const explanation = explanations[topicKey];
            const length = this.userPreferences.responseLength || 'medium';
            
            return {
                text: explanation[length] || explanation.medium,
                verses: explanation.verses,
                reflection: explanation.reflection
            };
        }
        
        return null;
    }
    
    
    initializeEmotionContext() {
        return {
            es: {
                'hopeful': { triggers: ['esperanz', 'futur', 'positiv', 'alegr'], verses: ['Romanos 15:13', 'Salmos 42:5'] },
                'anxious': { triggers: ['ansi', 'preocup', 'miedo', 'nervios'], verses: ['Filipenses 4:6-7', 'Salmos 56:3'] },
                'grieving': { triggers: ['dolor', 'triste', 'luto', 'pérdid'], verses: ['2 Corintios 1:3-4', 'Apocalipsis 21:4'] },
                'joyful': { triggers: ['alegr', 'feliz', 'gozo', 'celebr'], verses: ['Filipenses 4:4', 'Salmos 16:11'] },
                'confused': { triggers: ['confus', 'inciert', 'duda', 'entend'], verses: ['Proverbios 3:5-6', 'Santiago 1:5'] },
                'peaceful': { triggers: ['paz', 'calm', 'tranquil', 'sereno'], verses: ['Juan 14:27', 'Salmos 23:1-4'] }
            },
            en: {
                'hopeful': { triggers: ['hope', 'futur', 'posit', 'cheer'], verses: ['Romans 15:13', 'Psalm 42:5'] },
                'anxious': { triggers: ['anxious', 'worry', 'fear', 'stress'], verses: ['Philippians 4:6-7', 'Psalm 56:3'] },
                'grieving': { triggers: ['grief', 'sad', 'mourn', 'loss'], verses: ['2 Corinthians 1:3-4', 'Revelation 21:4'] },
                'joyful': { triggers: ['joy', 'happy', 'celebr', 'glad'], verses: ['Philippians 4:4', 'Psalm 16:11'] },
                'confused': { triggers: ['confus', 'unclear', 'doubt', 'lost'], verses: ['Proverbs 3:5-6', 'James 1:5'] },
                'peaceful': { triggers: ['peace', 'calm', 'tranquil', 'quiet'], verses: ['John 14:27', 'Psalm 23:1-4'] }
            }
        };
    }
    
    initializeSynonyms() {
        return {
            es: {
                'perdon': ['arrepentimiento', 'reconciliación', 'redención', 'clemencia'],
                'amor': ['caridad', 'ágape', 'afecto', 'devoción'],
                'fe': ['creencia', 'confianza', 'convicción', 'certeza'],
                'jesus': ['cristo', 'jesucristo', 'salvador', 'mesías'],
                'dios': ['señor', 'creador', 'todopoderoso', 'eterno'],
                'milagro': ['prodigio', 'maravilla', 'portento', 'obra divina'],
                'oración': ['ruego', 'plegaria', 'súplica', 'intercesión'],
                'gracia': ['misericordia', 'favor', 'clemencia', 'bondad'],
                'salvación': ['redención', 'liberación', 'vida eterna', 'gloria'],
                'pecado': ['ofensa', 'transgresión', 'culpa', 'iniquidad'],
            },
            en: {
                'forgiveness': ['repentance', 'reconciliation', 'redemption', 'mercy'],
                'love': ['charity', 'agape', 'affection', 'devotion'],
                'faith': ['belief', 'trust', 'conviction', 'certainty'],
                'jesus': ['christ', 'christ jesus', 'savior', 'messiah'],
                'god': ['lord', 'creator', 'almighty', 'eternal'],
                'miracle': ['wonder', 'marvel', 'sign', 'divine work'],
                'prayer': ['plea', 'petition', 'supplication', 'intercession'],
                'grace': ['mercy', 'favor', 'clemency', 'kindness'],
                'salvation': ['redemption', 'liberation', 'eternal life', 'glory'],
                'sin': ['offense', 'transgression', 'guilt', 'iniquity'],
            }
        };
    }
    
    initializeKnowledge() {
        return {
            es: {
                'hola': 'Hola, soy tu guía del universo bíblico. ¿Cómo estás hoy? Cuéntame qué te trae por aquí.',
                'ayuda': 'Puedo ayudarte con:\n- Explicaciones de versículos\n- Conexiones entre pasajes\n- Contexto histórico\n- Significados de palabras hebreas y griegas\n- Historias bíblicas',
                'biblia': 'La Biblia es un conjunto de 66 libros divididos en Antiguo y Nuevo Testamento. ¿Hay algún libro o pasaje específico que quieras explorar?',
                'jesus': 'Jesucristo es la figura central del Nuevo Testamento. Nació en Belén, fue crucificado y resucitó al tercer día. Su mensaje de amor transformó el mundo.',
                'dios': 'Dios es presentado en la Biblia como el creador del universo, el ser supremo, Padre, Hijo (Jesús) y Espíritu Santo (la Trinidad).',
                'fe': 'La fe es la convicción de que Dios existe y actúa. Es central en la relación entre los creyentes y Dios. Es confianza en lo que no vemos pero creemos.',
                'amor': 'El amor (ágape en griego) es el principio fundamental del evangelio. Dios nos ama incondicionalmente y nos llama a amar a otros de la misma manera.',
                'espiritu santo': 'El Espíritu Santo es la tercera persona de la Trinidad, que guía, fortalece y consuela a los creyentes constantemente.',
                'gracia': 'La gracia es el favor inmerecido de Dios. Es un regalo, no algo que podamos ganar. La gracia nos transforma y redime.',
                'salvacion': 'La salvación es la liberación del pecado y sus consecuencias a través de la fe en Jesucristo. Es accesible a todos.',
                'oracion': 'La oración es la comunicación honesta con Dios. Es hablar sobre nuestras necesidades, gratitud y preocupaciones en presencia divina.',
                'pecado': 'El pecado es la separación de Dios. La Biblia enseña que todos somos pecadores, pero Cristo ofrece redención completa.',
                'perdon': 'Dios ofrece perdón a través del arrepentimiento y la fe en Cristo. El perdón restaura nuestra relación con Dios y nos libera.',
                'resurreccion': 'La Resurrección de Jesús es el evento central del cristianismo, confirmando su divinidad y ofreciendo esperanza de vida eterna.',
                'milagros': 'Los milagros en la Biblia demuestran el poder de Dios y su amor por la humanidad. Servían para validar el mensaje de Jesús.',
                'esperanza': 'La esperanza es la confianza en Dios para el futuro. No es optimismo ingenuo sino fe sólida en las promesas de Dios.',
                'sacrificio': 'El sacrificio de Jesús en la cruz fue el acto final y supremo que redimió al mundo del pecado.',
                'tribu': 'Las 12 tribus de Israel representan el pueblo elegido de Dios, cada una con su propia historia y significado.',
                'profeta': 'Los profetas eran mensajeros de Dios que transmitían su palabra al pueblo. Predecían eventos y llamaban al arrepentimiento.',
                'milagro': 'Los milagros son acciones sobrenaturales de Dios que demuestran su poder absoluto sobre la naturaleza y la vida.',
                'redencion': 'La redención es el acto de ser liberado del pecado por el sacrificio de Jesucristo. Nos restaura a una relación correcta con Dios.',
                'compasion': 'La compasión es el sentimiento de empatía y deseo de aliviar el sufrimiento ajeno. Dios muestra compasión hacia todos.',
                'paciencia': 'La paciencia es la virtud de soportar dificultades sin queja y confiar en Dios durante las pruebas.',
                'gozo': 'El gozo es la alegría profunda que viene de nuestra relación con Dios, diferente a la felicidad temporal.',
                'prudencia': 'La prudencia es la sabiduría práctica para vivir bien y tomar decisiones sabias según la voluntad de Dios.',
                'justicia': 'La justicia de Dios es perfecta e imparcial. Busca lo correcto y castiga el mal con equidad absoluta.',
                'misericordia': 'La misericordia es la compasión de Dios hacia nosotros a pesar de nuestro pecado. Es un aspecto clave de su naturaleza.',
                'arrepentimiento': 'El arrepentimiento es el cambio genuino de mentalidad y corazón, apartándose del pecado hacia Dios.',
            },
            en: {
                'hello': 'Hello, I\'m your guide to the biblical universe. How are you today? Tell me what brings you here.',
                'help': 'I can help you with:\n- Verse explanations\n- Connections between passages\n- Historical context\n- Meanings of Hebrew and Greek words\n- Biblical stories',
                'bible': 'The Bible is a collection of 66 books divided into Old and New Testaments. Is there a specific book or passage you want to explore?',
                'jesus': 'Jesus Christ is the central figure of the New Testament. He was born in Bethlehem, crucified, and rose on the third day. His message of love transformed the world.',
                'god': 'God is presented in the Bible as the creator of the universe, the supreme being, Father, Son (Jesus), and Holy Spirit (the Trinity).',
                'faith': 'Faith is the conviction that God exists and acts. It\'s central to the relationship between believers and God. It\'s trust in what we cannot see.',
                'love': 'Love (agape in Greek) is the fundamental principle of the gospel. God loves us unconditionally and calls us to love others the same way.',
                'holy spirit': 'The Holy Spirit is the third person of the Trinity, who guides, strengthens, and comforts believers constantly.',
                'grace': 'Grace is the unmerited favor of God. It\'s a gift, not something we can earn. Grace transforms and redeems us.',
                'salvation': 'Salvation is liberation from sin and its consequences through faith in Jesus Christ. It\'s accessible to all.',
                'prayer': 'Prayer is honest communication with God. It\'s speaking about our needs, gratitude, and concerns in divine presence.',
                'sin': 'Sin is separation from God. The Bible teaches that we are all sinners, but Christ offers complete redemption.',
                'forgiveness': 'God offers forgiveness through repentance and faith in Christ. Forgiveness restores our relationship with God and frees us.',
                'resurrection': 'The Resurrection of Jesus is the central event of Christianity, confirming his divinity and offering hope for eternal life.',
                'miracles': 'Miracles in the Bible demonstrate God\'s power and his love for humanity. They served to validate Jesus\' message.',
                'hope': 'Hope is confidence in God for the future. It\'s not naive optimism but solid faith in God\'s promises.',
                'sacrifice': 'Jesus\' sacrifice on the cross was the final and supreme act that redeemed the world from sin.',
                'tribe': 'The 12 tribes of Israel represent God\'s chosen people, each with their own history and significance.',
                'prophet': 'Prophets were God\'s messengers who transmitted His word to the people. They predicted events and called for repentance.',
                'miracle': 'Miracles are supernatural actions of God that demonstrate His absolute power over nature and life.',
                'redemption': 'Redemption is the act of being freed from sin by Jesus Christ\'s sacrifice. It restores us to a right relationship with God.',
                'compassion': 'Compassion is the feeling of empathy and desire to relieve others\' suffering. God shows compassion to all.',
                'patience': 'Patience is the virtue of enduring difficulties without complaint and trusting God during trials.',
                'joy': 'Joy is the deep gladness that comes from our relationship with God, different from temporary happiness.',
                'wisdom': 'Wisdom is the practical knowledge to live well and make wise decisions according to God\'s will.',
                'justice': 'God\'s justice is perfect and impartial. It seeks what is right and punishes evil with absolute fairness.',
                'mercy': 'Mercy is God\'s compassion toward us despite our sin. It\'s a key aspect of His nature.',
                'repentance': 'Repentance is genuine change of mind and heart, turning away from sin toward God.',
            }
        };
    }
    
    async processQuery(query) {
        const lang = i18n.currentLang;
        const kb = this.knowledgeBase[lang];
        const normalizedQuery = query.toLowerCase().trim();
        
        // Save to conversation history
        this.conversationHistory.push({
            type: 'user',
            message: query,
            timestamp: new Date()
        });
        
        this.questionsAsked++;
        
        // NIVEL 0: Búsqueda de versículos por referencia (Juan 3:16, Génesis 1, etc)
        const verseReference = VersePatternMatcher.parseVerseReference(query);
        if (verseReference) {
            const verseResponse = this.findVerseByReference(verseReference[0], lang);
            if (verseResponse) {
                return this.saveAndReturnResponse(verseResponse, lang);
            }
        }
        
        // NIVEL 1: Buscar en preguntas aprendidas (respuestas personalizadas)
        if (this.learnedQuestions[normalizedQuery]) {
            const learned = this.learnedQuestions[normalizedQuery];
            return this.saveAndReturnResponse(learned.response, lang);
        }
        
        // NIVEL 2: Búsqueda exacta (más rápida)
        for (const [key, response] of Object.entries(kb)) {
            if (normalizedQuery.includes(key) || normalizedQuery.startsWith(key)) {
                const intent = this.detectIntent(query);
                const botResponse = this.buildMultipartResponse(response, key, intent, lang);
                this.learnedQuestions[normalizedQuery] = { response: botResponse, timestamp: new Date() };
                this.saveLearnedQuestions();
                return this.saveAndReturnResponse(botResponse, lang);
            }
        }
        
        // NIVEL 3: Búsqueda por sinónimos
        const synonymMatch = this.findSynonymMatch(normalizedQuery, lang);
        if (synonymMatch) {
            const response = kb[synonymMatch];
            const intent = this.detectIntent(query);
            const botResponse = this.buildMultipartResponse(response, synonymMatch, intent, lang);
            this.learnedQuestions[normalizedQuery] = { response: botResponse, timestamp: new Date() };
            this.saveLearnedQuestions();
            return this.saveAndReturnResponse(botResponse, lang);
        }
        
        // NIVEL 4: Fuzzy matching (tolerancia a errores)
        const keywords = Object.keys(kb);
        const fuzzyResult = FuzzyMatcher.findBestMatch(normalizedQuery, keywords, 0.65);
        if (fuzzyResult.match) {
            const response = kb[fuzzyResult.match];
            const intent = this.detectIntent(query);
            const botResponse = this.buildMultipartResponse(response, fuzzyResult.match, intent, lang);
            return this.saveAndReturnResponse(botResponse, lang);
        }
        
        // NIVEL 5: Respuesta contextual inteligente
        return this.generateContextualResponse(query, lang);
    }
    
    // Buscar versículo por referencia (Juan 3:16, etc)
    findVerseByReference(ref, lang) {
        const versesList = API.fallbackVerses;
        const normalized = `${ref.book.toLowerCase()} ${ref.chapter}`;
        
        for (const verse of versesList) {
            const text = lang === 'es' ? verse.es : verse.en;
            if (text.reference.toLowerCase().includes(normalized)) {
                return lang === 'es' 
                    ? `📖 ${text.reference}\n\n${text.text}`
                    : `📖 ${text.reference}\n\n${text.text}`;
            }
        }
        
        return null;
    }
    
    // Construir respuesta multipart: respuesta + versos + reflexión
    buildMultipartResponse(baseResponse, keyword, intent, lang) {
        let response = baseResponse;
        const detailedInfo = this.getDetailedResponse(keyword, intent);
        
        if (detailedInfo) {
            response = detailedInfo.text;
            
            // Agregar versos clave
            if (detailedInfo.verses && detailedInfo.verses.length > 0) {
                response += `\n\n📖 ${lang === 'es' ? 'Versículos clave:' : 'Key verses:'}\n`;
                detailedInfo.verses.forEach(v => response += `• ${v}\n`);
            }
            
            // Agregar reflexión si es apropiado
            if (intent === 'reflection' || intent === 'advice') {
                response += `\n\n💭 ${lang === 'es' ? 'Reflexión:' : 'Reflection:'}\n${detailedInfo.reflection}`;
            }
        }
        
        return response;
    }

    
    findSynonymMatch(query, lang) {
        const synonymMap = this.synonyms[lang];
        
        for (const [mainWord, synonymList] of Object.entries(synonymMap)) {
            if (query.includes(mainWord)) return mainWord;
            for (const synonym of synonymList) {
                if (query.includes(synonym)) return mainWord;
            }
        }
        
        return null;
    }
    
    saveAndReturnResponse(response, lang) {
        this.conversationHistory.push({
            type: 'bot',
            message: response,
            timestamp: new Date()
        });
        return response;
    }
    
    enrichResponse(response, keyword, lang) {
        // Add relevant verses to responses
        const verseAdditions = {
            es: {
                'amor': '\n\n📖 Versículos clave:\n- "Dios es amor" (1 Juan 4:8)\n- "El amor nunca deja de ser" (1 Corintios 13:8)',
                'fe': '\n\n📖 Versículos clave:\n- "La fe es confianza en lo que se espera" (Hebreos 11:1)\n- "El justo vivirá por fe" (Romanos 1:17)',
                'gracia': '\n\n📖 Versículos clave:\n- "Por gracia sois salvos por la fe" (Efesios 2:8)\n- "La gracia es suficiente" (2 Corintios 12:9)',
                'jesus': '\n\n📖 Versículos clave:\n- "Yo soy el camino, la verdad y la vida" (Juan 14:6)\n- "En ti están guardados todos los tesoros de la sabiduría" (Colosenses 2:3)',
                'dios': '\n\n📖 Versículos clave:\n- "En el principio creó Dios" (Génesis 1:1)\n- "Dios es espíritu" (Juan 4:24)',
                'esperanza': '\n\n📖 Versículos clave:\n- "La esperanza que tenemos es un ancla para el alma" (Hebreos 6:19)',
                'perdon': '\n\n📖 Versículos clave:\n- "Si confesamos nuestros pecados, él es fiel y justo" (1 Juan 1:9)\n- "El que no perdona no puede ser perdonado" (Marcos 11:26)',
                'oracion': '\n\n📖 Versículos clave:\n- "Pedid y se os dará" (Mateo 7:7)\n- "Orad sin cesar" (1 Tesalonicenses 5:17)',
                'salvacion': '\n\n📖 Versículos clave:\n- "Porque de tal manera amó Dios al mundo" (Juan 3:16)',
                'milagro': '\n\n📖 Versículos clave:\n- "Jesús hizo muchos otros milagros" (Juan 21:25)\n- "Los milagros confirman la palabra" (Marcos 16:20)',
            },
            en: {
                'love': '\n\n📖 Key verses:\n- "God is love" (1 John 4:8)\n- "Love never fails" (1 Corinthians 13:8)',
                'faith': '\n\n📖 Key verses:\n- "Faith is confidence in what we hope for" (Hebrews 11:1)\n- "The righteous will live by faith" (Romans 1:17)',
                'grace': '\n\n📖 Key verses:\n- "For by grace you have been saved through faith" (Ephesians 2:8)\n- "My grace is sufficient" (2 Corinthians 12:9)',
                'jesus': '\n\n📖 Key verses:\n- "I am the way, the truth, and the life" (John 14:6)\n- "In Him are hidden all treasures of wisdom" (Colossians 2:3)',
                'god': '\n\n📖 Key verses:\n- "In the beginning God created" (Genesis 1:1)\n- "God is spirit" (John 4:24)',
                'hope': '\n\n📖 Key verses:\n- "This hope we have as an anchor for the soul" (Hebrews 6:19)',
                'forgiveness': '\n\n📖 Key verses:\n- "If we confess our sins, He is faithful and just" (1 John 1:9)\n- "If you do not forgive, you cannot be forgiven" (Mark 11:26)',
                'prayer': '\n\n📖 Key verses:\n- "Ask and it will be given to you" (Matthew 7:7)\n- "Pray without ceasing" (1 Thessalonians 5:17)',
                'salvation': '\n\n📖 Key verses:\n- "For God so loved the world" (John 3:16)',
                'miracle': '\n\n📖 Key verses:\n- "Jesus performed many other miracles" (John 21:25)\n- "These signs will accompany those who believe" (Mark 16:20)',
            }
        };
        
        if (verseAdditions[lang] && verseAdditions[lang][keyword]) {
            return response + verseAdditions[lang][keyword];
        }
        
        return response;
    }
    
    generateContextualResponse(query, lang) {
        const analysisResult = this.analyzeQueryType(query, lang);
        
        // Detect emotion from query
        const detectedMood = this.detectMoodFromQuery(query, lang);
        if (detectedMood) {
            this.currentMood = detectedMood;
        }
        
        let response = '';
        const responses = {
            es: {
                definition: 'Esa es una pregunta sobre conceptos bíblicos. ¿Podrías ser más específico?',
                story: 'Te invito a explorar esa historia en la Biblia. Podría haber muchos detalles interesantes.',
                question: 'Esa es una pregunta profunda. La fe, la esperanza y el amor son clave en la Biblia.',
                emotion: `Entiendo que te sientes {mood}. La Biblia tiene palabras de consuelo para ti.`,
                default: 'Esa es una pregunta interesante. Aunque no tengo una respuesta específica, te invito a explorar la Biblia o refina tu pregunta.'
            },
            en: {
                definition: 'That\'s a question about biblical concepts. Could you be more specific?',
                story: 'I invite you to explore that story in the Bible. There could be many interesting details.',
                question: 'That\'s a deep question. Faith, hope, and love are key in the Bible.',
                emotion: 'I understand you feel {mood}. The Bible has words of comfort for you.',
                default: 'That\'s an interesting question. While I don\'t have a specific answer, I invite you to explore the Bible or refine your question.'
            }
        };
        
        const responseSet = responses[lang];
        response = responseSet[analysisResult] || responseSet.default;
        
        if (detectedMood && response.includes('{mood}')) {
            const moodLabel = {
                es: { hopeful: 'esperanzado', anxious: 'ansioso', grieving: 'dolido', joyful: 'alegre', confused: 'confundido', peaceful: 'tranquilo' },
                en: { hopeful: 'hopeful', anxious: 'anxious', grieving: 'grieving', joyful: 'joyful', confused: 'confused', peaceful: 'peaceful' }
            };
            response = response.replace('{mood}', moodLabel[lang][detectedMood] || 'así');
            
            // Add relevant verses for mood
            const emotionCtx = this.emotionContext[lang][detectedMood];
            if (emotionCtx && emotionCtx.verses) {
                response += '\n\n📖 Versículos para ti: ' + emotionCtx.verses.join(', ');
            }
        }
        
        return this.saveAndReturnResponse(response, lang);
    }
    
    analyzeQueryType(query, lang) {
        const q = query.toLowerCase();
        if (q.includes('¿qué') || q.includes('¿cuál') || q.includes('what') || q.includes('which')) return 'definition';
        if (q.includes('historia') || q.includes('cuéntame') || q.includes('story') || q.includes('tell')) return 'story';
        if (q.includes('por qué') || q.includes('cómo') || q.includes('why') || q.includes('how')) return 'question';
        return 'default';
    }
    
    detectMoodFromQuery(query, lang) {
        const q = query.toLowerCase();
        const emotionCtx = this.emotionContext[lang];
        
        for (const [mood, context] of Object.entries(emotionCtx)) {
            for (const trigger of context.triggers) {
                if (q.includes(trigger)) return mood;
            }
        }
        
        return null;
    }
    
    togglePanel() {
        this.isOpen = !this.isOpen;
        return this.isOpen;
    }
    
    // API Integration for real Bible verses
    async fetchVerseFromAPI(reference) {
        try {
            // Try using Bible API
            const response = await fetch(`https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-02/search?query=${encodeURIComponent(reference)}`, {
                headers: { 'api-key': 'YOUR_API_KEY' }
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.passages ? data.passages[0] : null;
            }
        } catch (error) {
            console.log('API unavailable, using local fallback');
        }
        
        return null;
    }
    
    // Get follow-up suggestions based on conversation history
    getFollowUpSuggestions(lang) {
        if (this.conversationHistory.length < 2) return [];
        
        const suggestions = {
            es: [
                '¿Hay algo más que quieras saber?',
                '¿Te gustaría explorar un tema relacionado?',
                '¿Cómo puedo profundizar en esto?',
                'Puedo contarte más detalles si lo deseas.',
            ],
            en: [
                'Is there anything else you\'d like to know?',
                'Would you like to explore a related topic?',
                'How can I dive deeper into this?',
                'I can tell you more details if you\'d like.',
            ]
        };
        
        return suggestions[lang] || [];
    }
    
    // Get conversation context for better responses
    getConversationContext() {
        const recentHistory = this.conversationHistory.slice(-4); // Last 2 exchanges
        return {
            recentMessages: recentHistory,
            questionsAsked: this.questionsAsked,
            currentMood: this.currentMood
        };
    }
    
    // Clear conversation history (optional)
    clearHistory() {
        this.conversationHistory = [];
        this.questionsAsked = 0;
        this.currentMood = null;
    }
}

// Initialize bot
const bot = new BibleBot();

// DOM Elements
const botToggle = document.getElementById('botToggle');
const botPanel = document.getElementById('botPanel');
const botClose = document.getElementById('botClose');
const botInput = document.getElementById('botInput');
const botSend = document.getElementById('botSend');
const botContent = document.getElementById('botContent');

// Event Listeners
botToggle.addEventListener('click', () => {
    if (bot.togglePanel()) {
        botPanel.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scroll on mobile
        botInput.focus();
        
        // Show greeting if first time
        if (bot.conversationHistory.length === 0) {
            const lang = i18n.currentLang;
            const greetingKey = lang === 'es' ? 'hola' : 'hello';
            const greeting = bot.knowledgeBase[lang][greetingKey];
            
            setTimeout(() => {
                const botMsg = document.createElement('div');
                botMsg.className = 'bot-message bot';
                botMsg.textContent = greeting;
                botContent.appendChild(botMsg);
                botContent.scrollTop = botContent.scrollHeight;
            }, 200);
        }
    } else {
        botPanel.classList.add('hidden');
    }
});

botClose.addEventListener('click', () => {
    bot.isOpen = false;
    botPanel.classList.add('hidden');
    document.body.style.overflow = ''; // Restore scroll
});

async function sendMessage() {
    const message = botInput.value.trim();
    if (!message) return;
    
    // Disable input while processing
    botInput.disabled = true;
    botSend.disabled = true;
    
    // Add user message to UI
    const userMsg = document.createElement('div');
    userMsg.className = 'bot-message user';
    userMsg.innerHTML = `<span>${escapeHtml(message)}</span>`;
    botContent.appendChild(userMsg);
    
    botInput.value = '';
    
    // Get bot response
    const response = await bot.processQuery(message);
    
    // Add bot message to UI with typing effect
    setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'bot-message bot';
        botMsg.innerHTML = `<span>${escapeHtml(response)}</span>`;
        botContent.appendChild(botMsg);
        botContent.scrollTop = botContent.scrollHeight;
        
        // Re-enable input
        botInput.disabled = false;
        botSend.disabled = false;
        botInput.focus();
    }, 300);

    // Try to extract and open verse reference
    const ref = typeof extractReferenceFromText === 'function' ? extractReferenceFromText(message) : null;
    if (ref && typeof openVerseFromReference === 'function') {
        openVerseFromReference(ref);
    }
}

// Helper function to escape HTML and preserve newlines
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]).replace(/\n/g, '<br>');
}

botSend.addEventListener('click', sendMessage);
botInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});
