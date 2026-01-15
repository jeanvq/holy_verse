// AI Integration with Google Gemini
// Para usar esto, necesitas una API key de Google Gemini en https://makersuite.google.com/app/apikey

const AI = {
    // Gemini API Configuration
    API_KEY: '', // El usuario debe proporcionar su clave
    API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    
    // Initialize AI
    init(apiKey) {
        if (!apiKey) {
            console.warn('⚠️ AI no inicializado: se requiere API key de Gemini');
            return false;
        }
        this.API_KEY = apiKey;
        return true;
    },
    
    // Simple chat - responde preguntas sobre versículos
    async chat(question, context = '') {
        if (!this.API_KEY) {
            return {
                success: false,
                message: 'IA no configurada. Necesita API key de Google Gemini.',
                needsSetup: true
            };
        }
        
        try {
            const systemPrompt = `Eres un asistente experto en la Biblia. 
            Responde preguntas sobre versículos bíblicos de forma clara, concisa y teológicamente sólida.
            Siempre refiere a versículos específicos cuando sea relevante.
            Eres amable, respetuoso y objetivo.
            ${context ? `Contexto adicional: ${context}` : ''}`;
            
            const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: `${systemPrompt}\n\nPregunta del usuario: ${question}` }]
                    }]
                })
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const data = await response.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No se pudo generar respuesta';
            
            return {
                success: true,
                response: text
            };
        } catch (err) {
            console.error('Error en AI chat:', err);
            return {
                success: false,
                message: `Error: ${err.message}`,
                error: err
            };
        }
    },
    
    // Smart search - busca por significado/tema
    async smartSearch(theme, verses = []) {
        if (!this.API_KEY) {
            return { success: false, needsSetup: true };
        }
        
        try {
            const versesList = verses.map(v => `${v.reference}: ${v.text}`).join('\n\n');
            
            const prompt = `Analiza estos versículos bíblicos y relacionados con el tema "${theme}":

${versesList}

Proporciona:
1. Los versículos más relevantes al tema
2. Por qué son relevantes
3. Conexiones temáticas entre ellos
4. Una reflexión breve (2-3 líneas)

Responde en formato JSON:
{
  "theme": "${theme}",
  "topVerses": ["ref1", "ref2", "ref3"],
  "explanation": "texto",
  "connections": ["conexión1", "conexión2"],
  "reflection": "reflexión"
}`;
            
            const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });
            
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            
            const data = await response.json();
            let result = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
            
            // Limpiar JSON si viene envuelto en markdown
            result = result.replace(/```json\n?|\n?```/g, '').trim();
            
            return {
                success: true,
                data: JSON.parse(result)
            };
        } catch (err) {
            console.error('Error en smart search:', err);
            return {
                success: false,
                message: err.message
            };
        }
    },
    
    // Generate devotional - crea devocionales/planes de estudio
    async generateDevotional(topic, days = 7, lang = 'es') {
        if (!this.API_KEY) {
            return { success: false, needsSetup: true };
        }
        
        try {
            const language = lang === 'es' ? 'español' : 'inglés';
            const prompt = `Crea un plan devocional de ${days} días sobre "${topic}" en ${language}.

Para cada día proporciona:
- Título del día
- Versículo(s) principal(es) (referencia bíblica)
- Contexto/explicación breve
- Reflexión personal
- Oración sugerida

Responde en formato JSON:
{
  "topic": "${topic}",
  "days": ${days},
  "devotionals": [
    {
      "day": 1,
      "title": "Título",
      "verses": ["Juan 1:1"],
      "context": "explicación",
      "reflection": "reflexión",
      "prayer": "oración"
    }
  ]
}

Por favor, asegúrate de que sea bíblicamente preciso y espiritualmente enriquecedor.`;
            
            const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });
            
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            
            const data = await response.json();
            let result = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
            
            // Limpiar JSON
            result = result.replace(/```json\n?|\n?```/g, '').trim();
            
            return {
                success: true,
                data: JSON.parse(result)
            };
        } catch (err) {
            console.error('Error generating devotional:', err);
            return {
                success: false,
                message: err.message
            };
        }
    },
    
    // Analyze verse - explicación detallada de un versículo
    async analyzeVerse(reference, text) {
        if (!this.API_KEY) {
            return { success: false, needsSetup: true };
        }
        
        try {
            const prompt = `Analiza detalladamente este versículo bíblico:

${reference}
"${text}"

Proporciona:
1. Contexto histórico y cultural
2. Significado en el idioma original (si es relevante)
3. Aplicación práctica hoy
4. Conexiones con otros versículos
5. Enseñanzas clave

Responde de forma clara y accesible.`;
            
            const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });
            
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            
            const data = await response.json();
            const analysis = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No se pudo analizar';
            
            return {
                success: true,
                reference: reference,
                analysis: analysis
            };
        } catch (err) {
            console.error('Error analyzing verse:', err);
            return {
                success: false,
                message: err.message
            };
        }
    },
    
    // Setup checker
    isConfigured() {
        return !!this.API_KEY;
    }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.AI = AI;
}
