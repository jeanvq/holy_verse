// AI Configuration and Setup Modal UI
const AISetup = {
    // Show setup modal
    showSetupModal() {
        const modal = document.getElementById('aiSetupModal') || this.createSetupModal();
        modal.classList.remove('hidden');
    },
    
    // Create setup modal
    createSetupModal() {
        const modal = document.createElement('div');
        modal.id = 'aiSetupModal';
        modal.className = 'modal hidden';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="AISetup.closeSetupModal()"></div>
            <div class="modal-content" style="max-width: 500px;">
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
        
        status.innerHTML = '⏳ Probando API key...';
        status.style.color = 'var(--text-secondary)';
        
        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: 'Prueba' }]
                        }]
                    })
                }
            );
            
            if (response.ok) {
                status.innerHTML = '✅ ¡API key válida! Haz clic en Guardar.';
                status.style.color = 'var(--success)';
            } else if (response.status === 401) {
                status.innerHTML = '❌ API key inválida o expirada';
                status.style.color = 'var(--error)';
            } else {
                status.innerHTML = '❌ Error al probar API key';
                status.style.color = 'var(--error)';
            }
        } catch (err) {
            status.innerHTML = '❌ Error de conexión';
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
        
        // Initialize AI
        AI.init(key);
        
        status.style.display = 'block';
        status.innerHTML = '✅ API key guardada correctamente. IA activada.';
        status.style.color = 'var(--success)';
        
        setTimeout(() => {
            this.closeSetupModal();
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
            AI.init(savedKey);
            console.log('✅ IA inicializada con API key guardada');
        } else {
            console.log('⚠️ IA no configurada. Usuario puede configurarla desde el bot.');
        }
    }
};

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AISetup.init());
} else {
    AISetup.init();
}
