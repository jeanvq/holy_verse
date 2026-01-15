// AI Integration for Bible Bot
// Integra las funciones de AI con el Bible Bot existente

console.log('🚀 BotAI.js cargado');

const BotAI = {
    currentMode: 'chat', // chat, search, devotional
    isAiEnabled: false,
    
    // Initialize AI Bot Features
    init() {
        console.log('🚀 BotAI.init() ejecutado - Modo inicial:', this.currentMode);
        
        // Check if AI is configured
        this.isAiEnabled = AI.isConfigured();
        
        // Setup buttons
        const setupBtn = document.getElementById('botAiSetup');
        const modeChat = document.getElementById('botModeChat');
        const modeSearch = document.getElementById('botModeSearch');
        const modeDevotional = document.getElementById('botModeDevotional');
        const botInput = document.getElementById('botInput');
        const botSend = document.getElementById('botSend');
        
        console.log('🔍 Elementos encontrados:');
        console.log('  - botInput:', botInput);
        console.log('  - botSend:', botSend);
        console.log('  - modeChat:', modeChat);
        console.log('  - modeSearch:', modeSearch);
        console.log('  - modeDevotional:', modeDevotional);
        
        if (setupBtn) {
            setupBtn.addEventListener('click', () => {
                if (!this.isAiEnabled) {
                    AISetup.showSetupModal();
                } else {
                    this.toggleAiModes();
                }
            });
        }
        
        if (modeChat) {
            modeChat.addEventListener('click', () => this.switchMode('chat'));
        }
        if (modeSearch) {
            modeSearch.addEventListener('click', () => this.switchMode('search'));
        }
        if (modeDevotional) {
            modeDevotional.addEventListener('click', () => this.switchMode('devotional'));
        }
        
        if (botSend) {
            console.log('🔌 Removiendo ALL event listeners de botSend');
            // Clone and replace to remove ALL listeners
            const newBotSend = botSend.cloneNode(true);
            botSend.parentNode.replaceChild(newBotSend, botSend);
            
            // Get the new reference
            const botSendNew = document.getElementById('botSend');
            botSendNew.addEventListener('click', () => {
                console.log('🔌 Evento CLICK en botSend disparado');
                this.handleBotMessage();
            });
            console.log('🔌 Nuevo event listener agregado a botSend (clonado)');
        }
        
        if (botInput) {
            console.log('🔌 Removiendo ALL event listeners de botInput');
            // Clone and replace to remove ALL listeners
            const newBotInput = botInput.cloneNode(true);
            botInput.parentNode.replaceChild(newBotInput, botInput);
            
            // Get the new reference
            const botInputNew = document.getElementById('botInput');
            botInputNew.addEventListener('keypress', (e) => {
                console.log('🔌 Evento KEYPRESS en botInput:', e.key);
                if (e.key === 'Enter') {
                    console.log('🔌 Enter detectado en botInput');
                    this.handleBotMessage();
                }
            });
            console.log('🔌 Nuevo event listener agregado a botInput (clonado)');
        }
        
        // Listen for AI setup completion
        document.addEventListener('aiSetupComplete', () => {
            this.isAiEnabled = true;
            this.updateAiStatus();
        });
    },
    
    // Toggle AI modes visibility
    toggleAiModes() {
        const modesContainer = document.getElementById('botAiModes');
        if (modesContainer) {
            modesContainer.style.display = modesContainer.style.display === 'none' ? 'block' : 'none';
        }
    },
    
    // Switch between modes
    switchMode(mode) {
        console.log('🔄 switchMode llamado con modo:', mode);
        this.currentMode = mode;
        console.log('🔄 currentMode ahora es:', this.currentMode);
        
        // Update button styles
        document.querySelectorAll('.bot-mode-btn').forEach(btn => {
            btn.style.background = 'var(--border)';
            btn.style.color = 'var(--text-primary)';
        });
        
        const activeBtn = {
            chat: document.getElementById('botModeChat'),
            search: document.getElementById('botModeSearch'),
            devotional: document.getElementById('botModeDevotional')
        }[mode];
        
        if (activeBtn) {
            activeBtn.style.background = 'var(--highlight)';
            activeBtn.style.color = 'white';
        }
        
        // Update placeholder
        const botInput = document.getElementById('botInput');
        const placeholders = {
            chat: 'Pregunta algo sobre la Biblia...',
            search: 'Busca por tema (ej: amor, esperanza)...',
            devotional: 'Tema para devocional (ej: fe, paciencia)...'
        };
        
        if (botInput) {
            botInput.placeholder = placeholders[mode];
            botInput.focus();
        }
    },
    
    // Update AI status
    updateAiStatus() {
        const setupBtn = document.getElementById('botAiSetup');
        if (setupBtn) {
            setupBtn.title = this.isAiEnabled ? 'IA Activa' : 'Configurar IA';
            setupBtn.style.color = this.isAiEnabled ? 'var(--success)' : 'var(--text-secondary)';
        }
    },
    
    // Handle bot message with AI
    async handleBotMessage() {
        console.log('🤖🤖🤖 handleBotMessage INICIADO 🤖🤖🤖');
        
        const botInput = document.getElementById('botInput');
        const botContent = document.getElementById('botContent');
        
        console.log('🤖 botInput element:', botInput);
        console.log('🤖 botInput.value (ANTES trim):', JSON.stringify(botInput?.value));
        console.log('🤖 botInput.value length:', botInput?.value?.length);
        console.log('🤖 typeof botInput.value:', typeof botInput?.value);
        
        const rawValue = botInput?.value || '';
        console.log('🤖 Raw value después OR:', JSON.stringify(rawValue));
        
        const message = rawValue.trim();
        
        console.log('🤖 Mensaje capturado (después trim):', JSON.stringify(message));
        console.log('🤖 Modo actual:', this.currentMode);
        
        if (!message || message.length === 0) {
            console.log('🤖 Mensaje vacío, abortando');
            return;
        }
        
        // Show user message
        const userMsg = document.createElement('div');
        userMsg.style.cssText = `
            padding: 0.75rem;
            margin: 0.5rem 0;
            background: var(--highlight);
            color: white;
            border-radius: 8px;
            word-break: break-word;
            text-align: right;
        `;
        userMsg.textContent = message;
        botContent.appendChild(userMsg);
        
        // Clear input
        botInput.value = '';
        
        // Show loading
        const loading = document.createElement('div');
        loading.style.cssText = `
            padding: 0.75rem;
            margin: 0.5rem 0;
            color: var(--text-secondary);
            text-align: center;
        `;
        loading.textContent = '⏳ Procesando...';
        botContent.appendChild(loading);
        
        // Scroll to bottom
        botContent.scrollTop = botContent.scrollHeight;
        
        try {
            let response;
            
            console.log('🤖 Entrando en try block');
            
            if (this.currentMode === 'chat') {
                console.log('🤖 CHAT MODE DETECTADO - sending message:', message);
                console.log('🤖 Llamando a AI.chat()...');
                response = await AI.chat(message);
                console.log('🤖 Chat response received:', response);
                
                if (response.success) {
                    console.log('🤖 Chat success - displaying response');
                    this.displayChatResponse(botContent, response.response, loading);
                } else if (response.needsSetup) {
                    console.log('🤖 Chat setup needed');
                    this.displayError(botContent, 'IA no configurada. Haz clic en 🤖 para configurarla.', loading);
                } else {
                    console.log('🤖 Chat error:', response.message);
                    this.displayError(botContent, response.message || 'Error desconocido en el chat', loading);
                }
            } 
            else if (this.currentMode === 'search') {
                // Get current search results for context
                const currentVerses = document.querySelectorAll('[data-verse]');
                const verses = [];
                currentVerses.forEach(el => {
                    try {
                        const verse = JSON.parse(el.dataset.verse);
                        verses.push({ reference: verse.reference, text: verse.text });
                    } catch (e) {}
                });
                
                response = await AI.smartSearch(message, verses.slice(0, 5));
                
                if (response.success) {
                    loading.remove();
                    this.displaySearchResponse(botContent, response);
                } else if (response.needsSetup) {
                    this.displayError(botContent, 'IA no configurada.', loading);
                } else {
                    this.displayError(botContent, response.message, loading);
                }
            }
            else if (this.currentMode === 'devotional') {
                response = await AI.generateDevotional(message, 7, 'es');
                
                if (response.success) {
                    loading.remove();
                    this.displayDevotionalResponse(botContent, response);
                } else if (response.needsSetup) {
                    this.displayError(botContent, 'IA no configurada.', loading);
                } else {
                    this.displayError(botContent, response.message, loading);
                }
            }
        } catch (err) {
            console.error('❌❌❌ ERROR CAPTURADO EN CATCH:', err);
            console.error('Stack:', err.stack);
            this.displayError(botContent, `Error: ${err.message}`, loading);
        }
        
        botContent.scrollTop = botContent.scrollHeight;
    },
    
    // Display chat response
    displayChatResponse(container, response, loading) {
        loading.remove();
        
        const msg = document.createElement('div');
        msg.style.cssText = `
            padding: 0.75rem;
            margin: 0.5rem 0;
            background: var(--accent);
            color: var(--text-primary);
            border-radius: 8px;
            border-left: 3px solid var(--highlight);
            word-break: break-word;
            line-height: 1.5;
        `;
        msg.textContent = response;
        container.appendChild(msg);
    },
    
    // Display search response
    displaySearchResponse(container, data) {
        const msg = document.createElement('div');
        msg.style.cssText = `
            padding: 1rem;
            margin: 0.5rem 0;
            background: var(--accent);
            color: var(--text-primary);
            border-radius: 8px;
            border-left: 3px solid var(--gold);
        `;
        
        let html = `
            <div style="font-weight: 600; margin-bottom: 0.5rem; color: var(--gold);">
                🔍 Tema: ${data.theme || 'Búsqueda'}
            </div>
        `;
        
        // Handle both topVerses and relevantVerses
        const verses = data.relevantVerses || data.topVerses || [];
        if (verses && verses.length > 0) {
            html += `
                <div style="margin-bottom: 0.5rem;">
                    <strong>Versículos principales:</strong>
                    <ul style="margin: 0.5rem 0 0 1rem; padding: 0;">
                        ${verses.map(v => `<li>${v}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        if (data.explanation) {
            html += `
                <div style="margin-bottom: 0.5rem; padding: 0.5rem; background: rgba(0,0,0,0.2); border-radius: 4px;">
                    <strong>Explicación:</strong><br>
                    ${data.explanation}
                </div>
            `;
        }
        
        if (data.connections && data.connections.length > 0) {
            html += `
                <div style="margin-bottom: 0.5rem;">
                    <strong>Conexiones temáticas:</strong>
                    <ul style="margin: 0.5rem 0 0 1rem; padding: 0;">
                        ${data.connections.map(c => `<li>${c}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        if (data.reflection) {
            html += `
                <div style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid var(--border); font-style: italic; font-size: 0.9rem;">
                    💭 "${data.reflection}"
                </div>
            `;
        }
        
        msg.innerHTML = html;
        container.appendChild(msg);
    },
    
    // Display devotional response
    displayDevotionalResponse(container, data) {
        const msg = document.createElement('div');
        msg.style.cssText = `
            padding: 1rem;
            margin: 0.5rem 0;
            background: var(--accent);
            color: var(--text-primary);
            border-radius: 8px;
            border-left: 3px solid var(--highlight);
            max-height: 500px;
            overflow-y: auto;
        `;
        
        let html = `
            <div style="font-weight: 600; margin-bottom: 1rem; color: var(--highlight); text-align: center;">
                📚 Devocional: ${data.topic || 'Plan de Estudio'}
            </div>
        `;
        
        if (data.devotionals && Array.isArray(data.devotionals) && data.devotionals.length > 0) {
            // Show all devotionals
            html += data.devotionals.map(dev => `
                <div style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
                    <div style="font-weight: 600; color: var(--gold); margin-bottom: 0.5rem;">
                        Día ${dev.day}: ${dev.title || 'Devocional'}
                    </div>
                    <div style="font-size: 0.9rem; margin-bottom: 0.5rem;">
                        <strong>📖 Versículos:</strong> ${Array.isArray(dev.verses) ? dev.verses.join(', ') : dev.verses || 'N/A'}
                    </div>
                    ${dev.context ? `<div style="font-size: 0.85rem; margin-bottom: 0.5rem; line-height: 1.4;"><strong>Contexto:</strong> ${dev.context}</div>` : ''}
                    ${dev.reflection ? `<div style="font-size: 0.85rem; margin-bottom: 0.5rem; line-height: 1.4; font-style: italic;"><strong>Reflexión:</strong> ${dev.reflection}</div>` : ''}
                    ${dev.prayer ? `<div style="font-size: 0.85rem; margin-bottom: 0.5rem; line-height: 1.4; color: var(--text-secondary);"><strong>💭 Oración:</strong> ${dev.prayer}</div>` : ''}
                </div>
            `).join('');
        } else {
            html += `<p style="color: var(--text-secondary);">No se pudo generar el devocional</p>`;
        }
        
        msg.innerHTML = html;
        container.appendChild(msg);
    },
    
    // Display error
    displayError(container, error, loading) {
        loading.remove();
        
        const msg = document.createElement('div');
        msg.style.cssText = `
            padding: 0.75rem;
            margin: 0.5rem 0;
            background: rgba(255, 71, 87, 0.1);
            color: var(--error);
            border-radius: 8px;
            border-left: 3px solid var(--error);
        `;
        msg.textContent = error;
        container.appendChild(msg);
    }
};

// Initialize when AI setup is complete
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => BotAI.init(), 500);
    });
} else {
    setTimeout(() => BotAI.init(), 500);
}

// Also initialize when page becomes visible
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !BotAI.initialized) {
        BotAI.init();
    }
});
