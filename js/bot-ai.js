// AI Integration for Bible Bot
// Integra las funciones de AI con el Bible Bot existente

const BotAI = {
    currentMode: 'chat', // chat, search, devotional
    isAiEnabled: false,
    
    // Initialize AI Bot Features
    init() {
        // Check if AI is configured
        this.isAiEnabled = AI.isConfigured();
        
        // Setup buttons
        const setupBtn = document.getElementById('botAiSetup');
        const modeChat = document.getElementById('botModeChat');
        const modeSearch = document.getElementById('botModeSearch');
        const modeDevotional = document.getElementById('botModeDevotional');
        const botInput = document.getElementById('botInput');
        const botSend = document.getElementById('botSend');
        
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
        
        // Override bot send button to use AI
        if (botSend) {
            botSend.removeEventListener('click', window.sendBotMessage);
            botSend.addEventListener('click', () => this.handleBotMessage());
        }
        
        if (botInput) {
            botInput.removeEventListener('keypress', window.handleBotKeyPress);
            botInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleBotMessage();
            });
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
        this.currentMode = mode;
        
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
        const botInput = document.getElementById('botInput');
        const botContent = document.getElementById('botContent');
        const message = botInput.value.trim();
        
        if (!message) return;
        
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
            
            if (this.currentMode === 'chat') {
                response = await AI.chat(message);
                
                if (response.success) {
                    this.displayChatResponse(botContent, response.response, loading);
                } else if (response.needsSetup) {
                    this.displayError(botContent, 'IA no configurada. Haz clic en 🤖 para configurarla.', loading);
                } else {
                    this.displayError(botContent, response.message, loading);
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
                    this.displaySearchResponse(botContent, response.data, loading);
                } else if (response.needsSetup) {
                    this.displayError(botContent, 'IA no configurada.', loading);
                } else {
                    this.displayError(botContent, response.message, loading);
                }
            }
            else if (this.currentMode === 'devotional') {
                response = await AI.generateDevotional(message, 7, 'es');
                
                if (response.success) {
                    this.displayDevotionalResponse(botContent, response.data, loading);
                } else if (response.needsSetup) {
                    this.displayError(botContent, 'IA no configurada.', loading);
                } else {
                    this.displayError(botContent, response.message, loading);
                }
            }
        } catch (err) {
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
    displaySearchResponse(container, data, loading) {
        loading.remove();
        
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
        
        if (data.topVerses && data.topVerses.length > 0) {
            html += `
                <div style="margin-bottom: 0.5rem;">
                    <strong>Versículos principales:</strong>
                    <ul style="margin: 0.5rem 0 0 1rem; padding: 0;">
                        ${data.topVerses.map(v => `<li>${v}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        if (data.reflection) {
            html += `
                <div style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid var(--border); font-style: italic; font-size: 0.9rem;">
                    "${data.reflection}"
                </div>
            `;
        }
        
        msg.innerHTML = html;
        container.appendChild(msg);
    },
    
    // Display devotional response
    displayDevotionalResponse(container, data, loading) {
        loading.remove();
        
        const msg = document.createElement('div');
        msg.style.cssText = `
            padding: 1rem;
            margin: 0.5rem 0;
            background: var(--accent);
            color: var(--text-primary);
            border-radius: 8px;
            border-left: 3px solid var(--highlight);
            max-height: 400px;
            overflow-y: auto;
        `;
        
        let html = `
            <div style="font-weight: 600; margin-bottom: 1rem; color: var(--highlight);">
                📚 Devocional: ${data.topic || 'Plan de Estudio'}
            </div>
        `;
        
        if (data.devotionals && data.devotionals.length > 0) {
            html += data.devotionals.slice(0, 3).map(dev => `
                <div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
                    <strong>Día ${dev.day}: ${dev.title}</strong>
                    <div style="font-size: 0.85rem; margin-top: 0.25rem;">
                        📖 ${dev.verses ? dev.verses.join(', ') : 'Versículos'}
                    </div>
                    <div style="font-size: 0.85rem; margin-top: 0.25rem; line-height: 1.4;">
                        ${dev.reflection || dev.context || 'Devocional'}
                    </div>
                </div>
            `).join('');
            
            if (data.devotionals.length > 3) {
                html += `<p style="text-align: center; font-size: 0.8rem; color: var(--text-secondary);">... y ${data.devotionals.length - 3} días más</p>`;
            }
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
