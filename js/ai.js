// AI Integration with Google Gemini
// Para usar esto, necesitas una API key de Google Gemini en https://makersuite.google.com/app/apikey

console.log('🚀 AI.js cargado - versión mejorada con logging completo');

const AI = {
    // Gemini API Configuration
    API_KEY: '', // El usuario debe proporcionar su clave
    API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    
    // Initialize AI
    init(apiKey) {
        if (!apiKey) {
            console.warn('⚠️ AI no inicializado: se requiere API key de Gemini');
            return false;
        }
        this.API_KEY = apiKey;
        console.log('✅ AI inicializado con Gemini API');
        return true;
    },
    
    // Helper: Limpiar respuesta JSON de markdown blocks
    cleanJsonResponse(text) {
        if (!text) return '{}';
        // Remover código blocks markdown
        text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        // Remover espacios/saltos al inicio y final
        text = text.trim();
        // Si empieza y termina con llaves, es JSON
        if (!text.startsWith('{') && !text.startsWith('[')) {
            // Buscar primer { o [
            const jsonStart = Math.min(
                text.indexOf('{') >= 0 ? text.indexOf('{') : Infinity,
                text.indexOf('[') >= 0 ? text.indexOf('[') : Infinity
            );
            if (jsonStart !== Infinity) {
                text = text.substring(jsonStart);
            }
        }
        // Encontrar el último } o ] válido
        let lastBrace = text.lastIndexOf('}');
        let lastBracket = text.lastIndexOf(']');
        let endIndex = Math.max(lastBrace, lastBracket);
        if (endIndex > 0) {
            text = text.substring(0, endIndex + 1);
        }
        return text;
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
            const systemPrompt = `Eres un asistente EXPERTO en la Biblia y teología cristiana.
TU DEBER ES: Responder todas las preguntas sobre la Biblia, personajes bíblicos, versículos y temas religiosos de forma CLARA, DETALLADA y PRECISA.

INSTRUCCIONES CRÍTICAS:
1. SIEMPRE proporciona respuestas específicas y detalladas - NUNCA digas "no tengo respuesta"
2. Incluye SIEMPRE referencias a versículos bíblicos específicos cuando sea relevante
3. Si preguntan por un personaje bíblico, proporciona:
   - Quién fue (resumen)
   - Qué hizo (acciones principales)
   - Versículos principales donde aparece
   - Lecciones o significado espiritual

4. Eres experto en:
   - Personajes bíblicos (Adán, Eva, Noé, Abraham, Moisés, David, Jesús, Pablo, Job, etc.)
   - Eventos bíblicos principales
   - Doctrinas cristianas
   - Contexto histórico y cultural

5. Responde SIEMPRE en español
6. Sé conciso pero completo (2-3 párrafos máximo)
7. Usa un tono amable, respetuoso y educativo

${context ? `Contexto adicional: ${context}` : ''}`;
            
            console.log('📝 System prompt:', systemPrompt.substring(0, 100) + '...');
            
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
                const error = await response.text();
                console.error('API Response Error:', error);
                throw new Error(`API error ${response.status}: ${error.substring(0, 100)}`);
            }
            
            const data = await response.json();
            console.log('📥 Raw API response data:', JSON.stringify(data, null, 2));
            
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            console.log('📋 Extracted text:', text);
            
            if (!text) {
                console.error('Unexpected API response:', data);
                throw new Error('Respuesta vacía del API');
            }
            
            console.log('✅ Chat respondido:', text.substring(0, 150));
            
            return {
                success: true,
                response: text
            };
        } catch (err) {
            console.error('❌ Error en AI chat:', err);
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
            return { 
                success: false, 
                message: 'IA no configurada',
                needsSetup: true 
            };
        }
        
        try {
            const versesList = verses && verses.length > 0
                ? verses.map(v => `${v.reference}: ${v.text.substring(0, 150)}`).join('\n\n')
                : `Buscar versículos relacionados con: ${theme}`;
            
            const prompt = `Analiza estos versículos bíblicos relacionados con el tema "${theme}":

${versesList}

Proporciona análisis en formato JSON exacto:
{
  "theme": "${theme}",
  "relevantVerses": ["ref1", "ref2", "ref3"],
  "explanation": "explicación clara del tema en 2-3 líneas",
  "connections": ["conexión temática 1", "conexión temática 2"],
  "reflection": "reflexión breve aplicable hoy (2 líneas)"
}

IMPORTANTE: Responde SOLO con el JSON válido. Sin markdown, sin explicaciones adicionales.`;
            
            console.log('📤 Enviando búsqueda inteligente:', theme);
            
            const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });
            
            if (!response.ok) {
                const error = await response.text();
                console.error('❌ API Error:', error);
                throw new Error(`API error ${response.status}`);
            }
            
            const data = await response.json();
            console.log('📥 Respuesta del API:', data);
            
            let result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (!result) {
                throw new Error('Respuesta vacía del API');
            }
            
            // Limpiar JSON
            result = this.cleanJsonResponse(result);
            console.log('🧹 JSON limpiado:', result.substring(0, 100));
            
            // Parse JSON
            const parsed = JSON.parse(result);
            
            console.log('✅ Búsqueda procesada:', parsed.theme);
            
            return {
                success: true,
                ...parsed
            };
        } catch (err) {
            console.error('❌ Error en smart search:', err);
            return {
                success: false,
                message: `Error: ${err.message}`,
                error: err.message
            };
        }
    },
    
    // Generate devotional - crea devocionales/planes de estudio
    async generateDevotional(topic, days = 7, lang = 'es') {
        if (!this.API_KEY) {
            return { 
                success: false, 
                message: 'IA no configurada',
                needsSetup: true 
            };
        }
        
        try {
            const language = lang === 'es' ? 'español' : 'inglés';
            
            const prompt = `Crea un plan devocional de ${days} días sobre "${topic}" en ${language}.

Para CADA uno de los ${days} días proporciona EXACTAMENTE:
- Título del día
- Versículo(s) principal(es) - REFERENCIAS BÍBLICAS REALES
- Contexto/explicación breve
- Reflexión personal
- Oración sugerida

Responde SOLO en formato JSON válido sin markdown:
{
  "topic": "${topic}",
  "days": ${days},
  "devotionals": [
    {
      "day": 1,
      "title": "Título del día",
      "verses": ["Juan 1:1", "Génesis 1:1"],
      "context": "explicación del contexto",
      "reflection": "reflexión personal aplicable",
      "prayer": "oración corta"
    },
    {
      "day": 2,
      "title": "Título del día",
      "verses": ["Salmos 23:1"],
      "context": "explicación",
      "reflection": "reflexión",
      "prayer": "oración"
    }
  ]
}

IMPORTANTE: 
1. Responde SOLO con JSON válido
2. Incluye TODOS los ${days} días
3. Sin markdown, sin código blocks, sin explicaciones adicionales
4. Versículos DEBEN ser referencias reales y válidas`;
            
            console.log('📤 Generando devocional:', topic);
            
            const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });
            
            if (!response.ok) {
                const error = await response.text();
                console.error('❌ API Error:', error);
                throw new Error(`API error ${response.status}`);
            }
            
            const data = await response.json();
            console.log('📥 Respuesta del API (primeros 200 chars):', data?.candidates?.[0]?.content?.parts?.[0]?.text?.substring(0, 200));
            
            let result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (!result) {
                throw new Error('Respuesta vacía del API');
            }
            
            // Limpiar JSON
            result = this.cleanJsonResponse(result);
            console.log('🧹 JSON limpiado (primeros 200 chars):', result.substring(0, 200));
            
            // Parse JSON
            const parsed = JSON.parse(result);
            
            if (!parsed.devotionals || !Array.isArray(parsed.devotionals)) {
                throw new Error('Formato de devocional inválido');
            }
            
            console.log('✅ Devocional generado:', parsed.devotionals.length, 'días');
            
            return {
                success: true,
                ...parsed
            };
        } catch (err) {
            console.error('❌ Error generating devotional:', err);
            return {
                success: false,
                message: `Error: ${err.message}`,
                error: err.message
            };
        }
    },
    
    // Analyze verse - explicación detallada de un versículo
    async analyzeVerse(reference, text) {
        if (!this.API_KEY) {
            return { 
                success: false, 
                message: 'IA no configurada',
                needsSetup: true 
            };
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

Responde de forma clara y accesible en español.`;
            
            console.log('📤 Analizando versículo:', reference);
            
            const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });
            
            if (!response.ok) {
                const error = await response.text();
                console.error('❌ API Error:', error);
                throw new Error(`API error: ${response.status}`);
            }
            
            const data = await response.json();
            const analysis = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (!analysis) {
                throw new Error('Respuesta vacía del API');
            }
            
            console.log('✅ Análisis completado');
            
            return {
                success: true,
                reference: reference,
                analysis: analysis
            };
        } catch (err) {
            console.error('❌ Error analyzing verse:', err);
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
