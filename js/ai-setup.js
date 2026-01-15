// AI Configuration and Setup Modal UI
const AISetup = {
    // Show setup modal
    showSetupModal() {
        // PROTECCIÓN: Si ya hay API key configurada, no mostrar modal
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey && AI.isConfigured()) {
            console.log('✅ AI ya está configurado, no mostrar modal');
            return;
        }
        
        const modal = document.getElementById('aiSetupModal') || this.createSetupModal();
        modal.classList.remove('hidden');
        
        // Precargar API key si existe
        const keyInput = document.getElementById('geminiApiKey');
        if (keyInput && savedKey) {
            keyInput.value = savedKey;
            console.log('✅ API key precargada desde localStorage');
        }
    },
    
    // Create setup modal
    createSetupModal() {
        const modal = document.createElement('div');
        modal.id = 'aiSetupModal';
        modal.className = 'modal hidden';
        
        // Detectar si es mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const contentStyle = isMobile 
            ? 'max-width: 95vw; width: 95vw; left: 50%; top: 50%; transform: translate(-50%, -50%); position: fixed;'
            : 'max-width: 500px;';
        
        modal.innerHTML = `
            <div class="modal-overlay" onclick="AISetup.closeSetupModal()"></div>
            <div class="modal-content" style="${contentStyle}">
                <div class="modal-header" style="padding: 1.5rem; border-bottom: 1px solid var(--border);">
                    <h2 style="margin: 0; color: var(--highlight);">🤖 Configurar IA</h2>
                    <button onclick="AISetup.closeSetupModal()" style="position: absolute; right: 1rem; top: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
                </div>
                <div style="padding: 1.5rem;">
                    <p style="margin-bottom: 1rem; color: var(--text-secondary);">
                        Para usar las funciones de IA avanzadas, necesitas una API key de Google Gemini (gratis).
                    </p>
                    
                    <div style="background: var(--accent); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                        <h4 style="margin-top: 0;">📝 Pasos:</h4>
                        <ol style="margin: 0.5rem 0; padding-left: 1.5rem; color: var(--text-secondary); font-size: 0.9rem;">
                            <li>Ve a <a href="https://makersuite.google.com/app/apikey" target="_blank" style="color: var(--highlight);">makersuite.google.com/app/apikey</a></li>
                            <li>Inicia sesión con tu cuenta Google</li>
                            <li>Crea una nueva API key</li>
                            <li>Copia la clave y pégala aquí</li>
                        </ol>
                    </div>
                    
                    <div style="margin-bottom: 1rem;">
                        <label for="geminiApiKey" style="display: block; font-weight: 600; margin-bottom: 0.5rem;">API Key de Gemini:</label>
                        <input 
                            type="password" 
                            id="geminiApiKey" 
                            placeholder="Pega tu API key aquí"
                            style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: 6px; background: var(--primary); color: var(--text-primary); font-size: 0.9rem; box-sizing: border-box;"
                        >
                    </div>
                    
                    <div style="display: flex; gap: 1rem;">
                        <button id="aiSetupTest" style="flex: 1; padding: 0.75rem; background: var(--highlight); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                            🧪 Probar
                        </button>
                        <button id="aiSetupSave" style="flex: 1; padding: 0.75rem; background: var(--success); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                            💾 Guardar
                        </button>
                    </div>
                    
                    <div id="aiSetupStatus" style="margin-top: 1rem; padding: 1rem; background: var(--accent); border-radius: 6px; display: none;"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners
        document.getElementById('aiSetupTest').addEventListener('click', () => this.testApiKey());
        document.getElementById('aiSetupSave').addEventListener('click', () => this.saveApiKey());
        document.getElementById('geminiApiKey').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.saveApiKey();
        });
        
        return modal;
    },
    
    // Test API key
    async testApiKey() {
        const key = document.getElementById('geminiApiKey').value.trim();
        const status = document.getElementById('aiSetupStatus');
        status.style.display = 'block';
        
        if (!key) {
            status.innerHTML = '❌ Por favor ingresa una API key';
            status.style.color = 'var(--error)';
            return;
        }
        
        status.innerHTML = '⏳ Consultando modelos disponibles...';
        status.style.color = 'var(--text-secondary)';
        
        try {
            // Paso 1: Obtener lista de modelos disponibles
            console.log('📋 Consultando ListModels API...');
            const listResponse = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
            );
            
            if (!listResponse.ok) {
                if (listResponse.status === 401 || listResponse.status === 403) {
                    status.innerHTML = `❌ API key inválida o sin permisos<br><small>Verifica en: <a href="https://aistudio.google.com/apikey" target="_blank">AI Studio</a></small>`;
                    status.style.color = 'var(--error)';
                    return;
                }
                throw new Error(`ListModels falló: ${listResponse.status}`);
            }
            
            const listData = await listResponse.json();
            console.log('📋 Modelos disponibles:', listData);
            
            // Filtrar modelos que soporten generateContent
            const availableModels = (listData.models || [])
                .filter(model => model.supportedGenerationMethods?.includes('generateContent'))
                .map(model => model.name);
            
            console.log(`✅ Modelos compatibles encontrados: ${availableModels.length}`, availableModels);
            
            if (availableModels.length === 0) {
                status.innerHTML = '❌ No hay modelos disponibles para esta API key';
                status.style.color = 'var(--error)';
                return;
            }
            
            // Paso 2: Probar el primer modelo disponible
            status.innerHTML = `⏳ Probando modelo: ${availableModels[0]}...`;
            
            const modelUrl = `https://generativelanguage.googleapis.com/v1beta/${availableModels[0]}:generateContent`;
            console.log(`🧪 Probando: ${modelUrl}`);
            
            const testResponse = await fetch(
                `${modelUrl}?key=${key}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: 'Hola' }]
                        }]
                    })
                }
            );
            
            if (testResponse.ok) {
                console.log(`✅ Modelo funcional: ${availableModels[0]}`);
                localStorage.setItem('gemini_api_url', modelUrl);
                const modelName = availableModels[0].split('/').pop();
                status.innerHTML = `✅ ¡API key válida! Usando: ${modelName}`;
                status.style.color = 'var(--success)';
            } else {
                const errorData = await testResponse.json().catch(() => ({}));
                console.error(`❌ Error probando modelo:`, errorData);
                status.innerHTML = `❌ Error al probar modelo: ${errorData.error?.message || 'Unknown'}`;
                status.style.color = 'var(--error)';
            }
            
        } catch (err) {
            console.error('❌ Error en testApiKey:', err);
            status.innerHTML = `❌ Error: ${err.message}`;
            status.style.color = 'var(--error)';
        }
    },
    
    // Save API key
    saveApiKey() {
        const key = document.getElementById('geminiApiKey').value.trim();
        const status = document.getElementById('aiSetupStatus');
        
        if (!key) {
            status.style.display = 'block';
            status.innerHTML = '❌ Por favor ingresa una API key';
            status.style.color = 'var(--error)';
            return;
        }
        
        // Save to localStorage
        localStorage.setItem('gemini_api_key', key);
        console.log('💾 API key guardada en localStorage');
        
        // Initialize AI
        AI.init(key);
        console.log('✅ AI inicializado con la API key');
        
        status.style.display = 'block';
        status.innerHTML = '✅ API key guardada correctamente. IA activada.';
        status.style.color = 'var(--success)';
        
        // Disparar evento personalizado
        document.dispatchEvent(new Event('aiSetupComplete'));
        
        setTimeout(() => {
            this.closeSetupModal();
            // Limpiar input
            const input = document.getElementById('geminiApiKey');
            if (input) input.value = '';
        }, 1500);
    },
    
    // Close modal
    closeSetupModal() {
        const modal = document.getElementById('aiSetupModal');
        if (modal) modal.classList.add('hidden');
    },
    
    // Initialize on load
    init() {
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) {
            const result = AI.init(savedKey);
            if (result) {
                console.log('✅ AISetup: IA inicializada con API key guardada');
                console.log('   🔑 API Key: ' + savedKey.substring(0, 10) + '...');
                
                // Disparar evento para notificar a otros módulos
                const event = new Event('aiConfigured');
                document.dispatchEvent(event);
                
                // Notificar al BotAI que la IA está lista
                if (typeof window.BotAI !== 'undefined' && window.BotAI.init) {
                    console.log('✅ AISetup: Notificando a BotAI...');
                    window.BotAI.init();
                }
            } else {
                console.warn('⚠️ Error al inicializar AI con la API key guardada');
                localStorage.removeItem('gemini_api_key');
                localStorage.removeItem('gemini_api_url');
            }
        } else {
            console.log('⚠️ AISetup: IA no configurada. Usuario puede configurarla desde el bot.');
        }
    }
};

// IMPORTANTE: Inicializar INMEDIATAMENTE (no esperar a DOMContentLoaded)
console.log('🚀 ai-setup.js: Ejecutando AISetup.init() AHORA');
AISetup.init();

// También ejecutar cuando DOM esté listo (por si acaso)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🔄 ai-setup.js: DOMContentLoaded - re-verificando');
        AISetup.init();
    });
}
