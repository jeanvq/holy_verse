// Bible Bot - Intelligent Guide
class BibleBot {
    constructor() {
        this.isOpen = false;
        this.currentMood = null;
        this.knowledgeBase = this.initializeKnowledge();
        this.conversationHistory = [];
    }
    
    initializeKnowledge() {
        return {
            es: {
                'hola': 'Hola, soy tu guía del universo bíblico. ¿Cómo estás hoy? Cuéntame qué te trae por aquí.',
                'ayuda': 'Puedo ayudarte con:\n- Explicaciones de versículos\n- Conexiones entre pasajes\n- Contexto histórico\n- Significados de palabras hebreas y griegas\n- Historias bíblicas',
                'biblia': 'La Biblia es un conjunto de 66 libros divididos en Antiguo y Nuevo Testamento. ¿Hay algún libro o pasaje específico que quieras explorar?',
                'jesus': 'Jesucristo es la figura central del Nuevo Testamento. Nació en Belén, fue crucificado y resucitó al tercer día. Su mensaje de amor transformó el mundo.',
                'dios': 'Dios es presentado en la Biblia como el creador del universo, el ser supremo, Padre, Hijo (Jesús) y Espíritu Santo (la Trinidad).',
                'fe': 'La fe es la convicción de que Dios existe y actúa. Es central en la relación entre los creyentes y Dios.',
                'amor': 'El amor (ágape en griego) es el principio fundamental del evangelio. Dios nos ama y nos llama a amar a otros.',
                'espiritu santo': 'El Espíritu Santo es la tercera persona de la Trinidad, que guía, fortalece y consuela a los creyentes.',
                'gracia': 'La gracia es el favor inmerecido de Dios. Es un regalo, no algo que podamos ganar.',
                'salvacion': 'La salvación es la liberación del pecado y sus consecuencias a través de la fe en Jesucristo.',
                'oracion': 'La oración es la comunicación con Dios. Es hablar honestamente con él sobre nuestras necesidades, gratitud y preocupaciones.',
                'pecado': 'El pecado es la separación de Dios. La Biblia enseña que todos somos pecadores, pero Cristo ofrece redención.',
                'perdon': 'Dios ofrece perdón a través del arrepentimiento y la fe en Cristo. El perdón restaura nuestra relación con Dios.',
                'resurreccion': 'La Resurrección de Jesús es el evento central del cristianismo, confirmando su divinidad y ofreciendo esperanza de vida eterna.',
                'milagros': 'Los milagros en la Biblia demuestran el poder de Dios y su amor por la humanidad. Servían para validar el mensaje de Jesús.',
            },
            en: {
                'hello': 'Hello, I\'m your guide to the biblical universe. How are you today? Tell me what brings you here.',
                'help': 'I can help you with:\n- Verse explanations\n- Connections between passages\n- Historical context\n- Meanings of Hebrew and Greek words\n- Biblical stories',
                'bible': 'The Bible is a collection of 66 books divided into Old and New Testaments. Is there a specific book or passage you want to explore?',
                'jesus': 'Jesus Christ is the central figure of the New Testament. He was born in Bethlehem, crucified, and rose on the third day. His message of love transformed the world.',
                'god': 'God is presented in the Bible as the creator of the universe, the supreme being, Father, Son (Jesus), and Holy Spirit (the Trinity).',
                'faith': 'Faith is the conviction that God exists and acts. It\'s central to the relationship between believers and God.',
                'love': 'Love (agape in Greek) is the fundamental principle of the gospel. God loves us and calls us to love others.',
                'holy spirit': 'The Holy Spirit is the third person of the Trinity, who guides, strengthens, and comforts believers.',
                'grace': 'Grace is the unmerited favor of God. It\'s a gift, not something we can earn.',
                'salvation': 'Salvation is liberation from sin and its consequences through faith in Jesus Christ.',
                'prayer': 'Prayer is communication with God. It\'s speaking honestly with him about our needs, gratitude, and concerns.',
                'sin': 'Sin is separation from God. The Bible teaches that we are all sinners, but Christ offers redemption.',
                'forgiveness': 'God offers forgiveness through repentance and faith in Christ. Forgiveness restores our relationship with God.',
                'resurrection': 'The Resurrection of Jesus is the central event of Christianity, confirming his divinity and offering hope for eternal life.',
                'miracles': 'Miracles in the Bible demonstrate God\'s power and his love for humanity. They served to validate Jesus\' message.',
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
        
        // Try to find matching response
        for (const [key, response] of Object.entries(kb)) {
            if (normalizedQuery.includes(key) || normalizedQuery.startsWith(key)) {
                const botResponse = this.enrichResponse(response, lang);
                this.conversationHistory.push({
                    type: 'bot',
                    message: botResponse,
                    timestamp: new Date()
                });
                return botResponse;
            }
        }
        
        // If no match, try to provide a contextual response
        return this.generateContextualResponse(query, lang);
    }
    
    enrichResponse(response, lang) {
        // Add relevant verses to responses
        const additions = {
            es: {
                'amor': '\n\nVersículo clave: "Dios es amor" (1 Juan 4:8)',
                'fe': '\n\nVersículo clave: "La fe es confianza en lo que se espera y certeza de lo que no se ve" (Hebreos 11:1)',
                'gracia': '\n\nVersículo clave: "Por gracia sois salvos por la fe" (Efesios 2:8)',
            },
            en: {
                'love': '\n\nKey verse: "God is love" (1 John 4:8)',
                'faith': '\n\nKey verse: "Faith is confidence in what we hope for and assurance about what we do not see" (Hebrews 11:1)',
                'grace': '\n\nKey verse: "For it is by grace you have been saved, through faith" (Ephesians 2:8)',
            }
        };
        
        const key = Object.keys(this.knowledgeBase[lang]).find(k => response.includes(this.knowledgeBase[lang][k]));
        if (key && additions[lang][key]) {
            return response + additions[lang][key];
        }
        
        return response;
    }
    
    generateContextualResponse(query, lang) {
        const noAnswerMsgs = {
            es: 'Esa es una pregunta interesante. Aunque no tengo una respuesta específica sobre eso, te invito a explorar la Biblia o a refine tu pregunta. ¿Hay algo más en lo que pueda ayudarte?',
            en: 'That\'s an interesting question. While I don\'t have a specific answer about that, I invite you to explore the Bible or refine your question. Is there anything else I can help you with?'
        };
        
        const response = noAnswerMsgs[lang];
        this.conversationHistory.push({
            type: 'bot',
            message: response,
            timestamp: new Date()
        });
        
        return response;
    }
    
    togglePanel() {
        this.isOpen = !this.isOpen;
        return this.isOpen;
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
        botInput.focus();
    } else {
        botPanel.classList.add('hidden');
    }
});

botClose.addEventListener('click', () => {
    bot.isOpen = false;
    botPanel.classList.add('hidden');
});

async function sendMessage() {
    const message = botInput.value.trim();
    if (!message) return;
    
    // Add user message to UI
    const userMsg = document.createElement('div');
    userMsg.className = 'bot-message user';
    userMsg.textContent = message;
    botContent.appendChild(userMsg);
    
    botInput.value = '';
    
    // Get bot response
    const response = await bot.processQuery(message);
    
    // Add bot message to UI
    setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'bot-message bot';
        botMsg.textContent = response;
        botContent.appendChild(botMsg);
        botContent.scrollTop = botContent.scrollHeight;
    }, 300);

    const ref = typeof extractReferenceFromText === 'function' ? extractReferenceFromText(message) : null;
    if (ref && typeof openVerseFromReference === 'function') {
        openVerseFromReference(ref);
    }
}

botSend.addEventListener('click', sendMessage);
botInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
