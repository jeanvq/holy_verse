// Mobile-specific enhancements for HolyVerse

// Native Share API
function setupNativeShare() {
    const shareButtons = document.querySelectorAll('[data-share-verse]');
    
    shareButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const verseEl = e.target.closest('[data-verse]');
            if (!verseEl) return;
            
            const verse = JSON.parse(verseEl.dataset.verse);
            const shareData = {
                title: `HolyVerse - ${verse.reference}`,
                text: `${verse.text}\n\n— ${verse.reference}`,
                url: window.location.href
            };
            
            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        console.log('Share failed', err);
                        fallbackShare(shareData);
                    }
                }
            } else {
                fallbackShare(shareData);
            }
        });
    });
}

function fallbackShare(shareData) {
    // Show custom share menu
    const shareMenu = document.getElementById('shareMenu') || document.getElementById('surpriseShareMenu');
    if (shareMenu) {
        shareMenu.classList.remove('hidden');
    }
}

// Voice Search
function setupVoiceSearch() {
    const voiceBtn = document.getElementById('voiceSearchBtn');
    if (!voiceBtn) return;
    
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        voiceBtn.style.display = 'none';
        return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = i18n?.currentLang === 'en' ? 'en-US' : 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    let isListening = false;
    
    voiceBtn.addEventListener('click', () => {
        if (isListening) {
            recognition.stop();
            return;
        }
        
        voiceBtn.classList.add('listening');
        recognition.start();
        isListening = true;
    });
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = transcript;
            document.getElementById('searchBtn')?.click();
        }
    };
    
    recognition.onend = () => {
        voiceBtn.classList.remove('listening');
        isListening = false;
    };
    
    recognition.onerror = (event) => {
        console.error('Voice recognition error', event.error);
        voiceBtn.classList.remove('listening');
        isListening = false;
        
        if (event.error === 'not-allowed') {
            showNotification(i18n?.currentLang === 'es' 
                ? 'Permiso de micrófono denegado' 
                : 'Microphone permission denied');
        }
    };
}

// Swipe to close modals
function setupSwipeGestures() {
    const modals = document.querySelectorAll('.modal, .bot-panel');
    
    modals.forEach(modal => {
        let startY = 0;
        let currentY = 0;
        let isDragging = false;
        
        const modalContent = modal.querySelector('.modal-content, .bot-content') || modal;
        
        modalContent.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            isDragging = true;
        }, { passive: true });
        
        modalContent.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentY = e.touches[0].clientY;
            const diff = currentY - startY;
            
            // Only allow downward swipes
            if (diff > 0) {
                modal.style.transform = `translateY(${diff}px)`;
                modal.style.transition = 'none';
            }
        }, { passive: true });
        
        modalContent.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            
            const diff = currentY - startY;
            modal.style.transition = 'transform 0.3s ease';
            
            // If swiped down more than 100px, close modal
            if (diff > 100) {
                modal.style.transform = 'translateY(100%)';
                setTimeout(() => {
                    modal.classList.add('hidden');
                    modal.style.transform = '';
                    document.body.classList.remove('modal-open', 'bot-open');
                    document.documentElement.classList.remove('modal-open', 'bot-open');
                }, 300);
            } else {
                modal.style.transform = '';
            }
            
            startY = 0;
            currentY = 0;
        });
    });
}

// Pull to refresh
function setupPullToRefresh() {
    let startY = 0;
    let isPulling = false;
    const threshold = 80;
    
    const refreshIndicator = document.createElement('div');
    refreshIndicator.className = 'pull-refresh-indicator';
    refreshIndicator.innerHTML = '<span class="refresh-spinner">↻</span>';
    document.body.insertBefore(refreshIndicator, document.body.firstChild);
    
    document.addEventListener('touchstart', (e) => {
        if (window.scrollY === 0) {
            startY = e.touches[0].clientY;
            isPulling = true;
        }
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
        if (!isPulling || window.scrollY > 0) return;
        
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY;
        
        if (diff > 0 && diff < threshold * 2) {
            refreshIndicator.style.transform = `translateY(${Math.min(diff, threshold)}px)`;
            refreshIndicator.style.opacity = Math.min(diff / threshold, 1);
            
            if (diff > threshold) {
                refreshIndicator.classList.add('ready');
            } else {
                refreshIndicator.classList.remove('ready');
            }
        }
    }, { passive: true });
    
    document.addEventListener('touchend', () => {
        if (!isPulling) return;
        
        const diff = parseInt(refreshIndicator.style.transform.replace(/[^0-9]/g, '') || '0');
        
        if (diff > threshold) {
            // Trigger refresh
            refreshIndicator.classList.add('refreshing');
            location.reload();
        } else {
            refreshIndicator.style.transform = '';
            refreshIndicator.style.opacity = '';
            refreshIndicator.classList.remove('ready');
        }
        
        isPulling = false;
        startY = 0;
    });
}

// Auto dark mode based on system preference
function setupAutoDarkMode() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Only auto-apply if user hasn't set preference
    const savedTheme = localStorage.getItem('holyverse-theme');
    if (!savedTheme) {
        applyTheme(prefersDark.matches ? 'dark' : 'light');
    }
    
    // Listen for system theme changes
    prefersDark.addEventListener('change', (e) => {
        const savedTheme = localStorage.getItem('holyverse-theme');
        if (!savedTheme) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
}

function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-theme');
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) themeBtn.textContent = '☀️';
    } else {
        document.body.classList.remove('light-theme');
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) themeBtn.textContent = '🌙';
    }
}

// Install PWA prompt
function setupPWAInstallPrompt() {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show install button if not already installed
        const installBtn = document.getElementById('installPWA');
        if (installBtn) {
            installBtn.classList.remove('hidden');
            
            installBtn.addEventListener('click', async () => {
                if (!deferredPrompt) return;
                
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                
                if (outcome === 'accepted') {
                    console.log('PWA installed');
                    installBtn.classList.add('hidden');
                }
                
                deferredPrompt = null;
            });
        }
    });
    
    // Hide install button if already installed
    window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        const installBtn = document.getElementById('installPWA');
        if (installBtn) installBtn.classList.add('hidden');
    });
}

// Initialize all mobile enhancements
function initMobileEnhancements() {
    // Only run on mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile || window.innerWidth <= 768) {
        setupNativeShare();
        setupSwipeGestures();
        setupPullToRefresh();
        setupMobileAIEnhancements();
    }
    
    setupVoiceSearch();
    setupAutoDarkMode();
    setupPWAInstallPrompt();
}

// Mejorar funcionalidad de IA en mobile
function setupMobileAIEnhancements() {
    // Fix para modales en mobile - asegurar que se vean correctamente
    const style = document.createElement('style');
    style.innerHTML = `
        @media (max-width: 768px) {
            .modal {
                z-index: 9999 !important;
            }
            .modal-overlay {
                position: fixed !important;
            }
            .modal-content {
                position: fixed !important;
                max-width: 90vw !important;
                overflow-y: auto !important;
                -webkit-overflow-scrolling: touch;
            }
            #aiSetupModal .modal-content {
                max-width: 95vw !important;
                width: 95vw !important;
                left: 50% !important;
                transform: translateX(-50%) !important;
                top: 50% !important;
                -webkit-transform: translate(-50%, -50%) !important;
            }
        }
        
        @media (max-width: 480px) {
            #aiSetupModal .modal-content {
                max-height: 80vh !important;
                max-width: 98vw !important;
            }
            #aiSetupModal input {
                font-size: 16px !important;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Mejorar handlers táctiles para botones de IA
    const setupBtn = document.getElementById('botAiSetup');
    if (setupBtn) {
        setupBtn.addEventListener('touchstart', function(e) {
            this.style.background = 'rgba(79, 209, 197, 0.2)';
        }, false);
        setupBtn.addEventListener('touchend', function(e) {
            this.style.background = 'transparent';
        }, false);
    }
    
    console.log('✅ Mobile AI enhancements aplicados');
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileEnhancements);
} else {
    initMobileEnhancements();
}
