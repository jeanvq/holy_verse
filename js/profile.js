// User Profile Management System

const UserProfile = {
    currentUser: null,
    
    // Initialize profile system
    init() {
        this.setupEventListeners();
        this.syncData();
    },
    
    // Setup all event listeners
    setupEventListeners() {
        // Profile button in user menu
        const profileBtn = document.getElementById('profileBtn');
        if (profileBtn) {
            profileBtn.addEventListener('click', () => this.openProfile());
        }
        
        // Close profile modal
        const closeProfileBtn = document.querySelector('.profile-close');
        if (closeProfileBtn) {
            closeProfileBtn.addEventListener('click', () => this.closeProfile());
        }
        
        // Profile modal click outside
        const profileModal = document.getElementById('profileModal');
        if (profileModal) {
            profileModal.addEventListener('click', (e) => {
                if (e.target === profileModal) {
                    this.closeProfile();
                }
            });
        }
        
        // Tab navigation
        const tabBtns = document.querySelectorAll('.profile-tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
        
        // Save settings button
        const saveSettingsBtn = document.getElementById('saveSettingsBtn');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        }
        
        // Clear history button
        const clearHistoryBtn = document.getElementById('clearHistoryBtn');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        }
        
        // Export data button
        const exportDataBtn = document.getElementById('exportDataBtn');
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => this.exportUserData());
        }
        
        // Notification toggle
        const notificationToggle = document.getElementById('notificationToggle');
        if (notificationToggle) {
            notificationToggle.addEventListener('change', (e) => {
                this.toggleNotifications(e.target.checked);
            });
        }
    },
    
    // Open profile modal
    openProfile() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            modal.classList.remove('hidden');
            this.loadProfile();
            this.loadFavorites();
            this.loadHistory();
            this.loadPreferences();
        }
    },
    
    // Close profile modal
    closeProfile() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    },
    
    // Switch between tabs
    switchTab(tabName) {
        // Update buttons
        const tabBtns = document.querySelectorAll('.profile-tab-btn');
        tabBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });
        
        // Update panes
        const panes = document.querySelectorAll('.profile-tab-pane');
        panes.forEach(pane => {
            pane.classList.remove('active');
            if (pane.id === `${tabName}-pane`) {
                pane.classList.add('active');
            }
        });
    },
    
    // Load profile information
    loadProfile() {
        this.currentUser = AuthSystem.getCurrentUser();
        if (!this.currentUser) return;
        
        // Update header
        const avatarEl = document.querySelector('.profile-avatar');
        if (avatarEl) {
            const initials = this.currentUser.displayName
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase();
            avatarEl.textContent = initials;
        }
        
        const nameEl = document.querySelector('.profile-name');
        if (nameEl) nameEl.textContent = this.currentUser.displayName;
        
        const emailEl = document.querySelector('.profile-email');
        if (emailEl) emailEl.textContent = this.currentUser.email;
        
        // Update stats
        const favorites = this.currentUser.favorites || [];
        const history = this.currentUser.searchHistory || [];
        
        const statsElements = {
            'favorites-stat': favorites.length,
            'history-stat': history.length,
            'joined-stat': this.getDaysSinceJoined(this.currentUser.createdAt)
        };
        
        Object.keys(statsElements).forEach(key => {
            const el = document.getElementById(key);
            if (el) el.textContent = statsElements[key];
        });
        
        // Update settings form
        const displayNameInput = document.getElementById('displayNameInput');
        if (displayNameInput) displayNameInput.value = this.currentUser.displayName;
        
        const emailInput = document.getElementById('emailInput');
        if (emailInput) emailInput.value = this.currentUser.email;
    },
    
    // Load user's favorite verses
    loadFavorites() {
        const favorites = this.currentUser?.favorites || [];
        const container = document.getElementById('favoritesList');
        
        if (!container) return;
        
        if (favorites.length === 0) {
            container.innerHTML = `
                <div class="favorites-empty">
                    <div class="favorites-empty-icon">❤️</div>
                    <p>Sin versículos favoritos aún</p>
                    <small>Agrega tus versículos favoritos para verlos aquí</small>
                </div>
            `;
            return;
        }
        
        container.innerHTML = favorites.map((fav, index) => `
            <div class="favorite-item">
                <div class="favorite-reference">${fav.reference}</div>
                <div class="favorite-text">${fav.text}</div>
                <div class="favorite-actions">
                    <button class="favorite-btn" onclick="UserProfile.removeFavorite(${index})">
                        Eliminar
                    </button>
                    <button class="favorite-btn" onclick="UserProfile.shareFavorite(${index})">
                        Compartir
                    </button>
                </div>
            </div>
        `).join('');
    },
    
    // Load search history
    loadHistory() {
        const history = this.currentUser?.searchHistory || [];
        const container = document.getElementById('historyList');
        
        if (!container) return;
        
        if (history.length === 0) {
            container.innerHTML = `
                <div class="history-empty">
                    <p>Sin historial de búsqueda</p>
                    <small>Tus búsquedas aparecerán aquí</small>
                </div>
            `;
            return;
        }
        
        container.innerHTML = history.slice(0, 20).map((item, index) => {
            const date = new Date(item.timestamp);
            const dateStr = this.formatDate(date);
            
            return `
                <div class="history-item">
                    <div class="history-text">
                        <div class="history-search">${item.query}</div>
                        <div class="history-date">${dateStr}</div>
                    </div>
                    <button class="history-delete" onclick="UserProfile.deleteHistoryItem(${index})">
                        🗑️
                    </button>
                </div>
            `;
        }).join('');
    },
    
    // Load user preferences
    loadPreferences() {
        const prefs = this.currentUser?.preferences || {};
        
        const notificationToggle = document.getElementById('notificationToggle');
        if (notificationToggle) {
            notificationToggle.checked = prefs.notificationsEnabled !== false;
        }
    },
    
    // Save profile settings
    saveSettings() {
        const displayNameInput = document.getElementById('displayNameInput');
        const emailInput = document.getElementById('emailInput');
        
        if (!displayNameInput || !emailInput) return;
        
        const newDisplayName = displayNameInput.value.trim();
        const newEmail = emailInput.value.trim();
        
        if (!newDisplayName || !newEmail) {
            this.showNotification('Por favor completa todos los campos', 'error');
            return;
        }
        
        // Update user object
        this.currentUser.displayName = newDisplayName;
        this.currentUser.email = newEmail;
        
        // Save to localStorage
        AuthSystem.setCurrentUser(this.currentUser);
        localStorage.setItem('holyverse-session', JSON.stringify(this.currentUser));
        
        // Update UI
        AuthSystem.updateUI();
        this.loadProfile();
        
        this.showNotification('Perfil actualizado correctamente', 'success');
    },
    
    // Remove a favorite
    removeFavorite(index) {
        if (this.currentUser.favorites) {
            this.currentUser.favorites.splice(index, 1);
            AuthSystem.setCurrentUser(this.currentUser);
            localStorage.setItem('holyverse-session', JSON.stringify(this.currentUser));
            this.loadFavorites();
            this.loadProfile();
            this.showNotification('Versículo eliminado de favoritos', 'success');
        }
    },
    
    // Share a favorite verse
    shareFavorite(index) {
        const fav = this.currentUser.favorites[index];
        if (!fav) return;
        
        const shareText = `${fav.text}\n\n— ${fav.reference}\n\n🙏 Compartido desde HolyVerse`;
        
        if (navigator.share) {
            navigator.share({
                title: `HolyVerse - ${fav.reference}`,
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText);
            this.showNotification('Versículo copiado al portapapeles', 'success');
        }
    },
    
    // Delete history item
    deleteHistoryItem(index) {
        if (this.currentUser.searchHistory) {
            this.currentUser.searchHistory.splice(index, 1);
            AuthSystem.setCurrentUser(this.currentUser);
            localStorage.setItem('holyverse-session', JSON.stringify(this.currentUser));
            this.loadHistory();
            this.loadProfile();
        }
    },
    
    // Clear all history
    clearHistory() {
        if (confirm('¿Estás seguro de que deseas limpiar todo el historial?')) {
            this.currentUser.searchHistory = [];
            AuthSystem.setCurrentUser(this.currentUser);
            localStorage.setItem('holyverse-session', JSON.stringify(this.currentUser));
            this.loadHistory();
            this.loadProfile();
            this.showNotification('Historial eliminado', 'success');
        }
    },
    
    // Toggle notifications
    toggleNotifications(enabled) {
        if (!this.currentUser.preferences) {
            this.currentUser.preferences = {};
        }
        
        this.currentUser.preferences.notificationsEnabled = enabled;
        AuthSystem.setCurrentUser(this.currentUser);
        localStorage.setItem('holyverse-session', JSON.stringify(this.currentUser));
        
        const msg = enabled ? 'Notificaciones activadas' : 'Notificaciones desactivadas';
        this.showNotification(msg, 'success');
    },
    
    // Export user data as JSON
    exportUserData() {
        const dataToExport = {
            user: {
                email: this.currentUser.email,
                displayName: this.currentUser.displayName,
                createdAt: this.currentUser.createdAt
            },
            favorites: this.currentUser.favorites || [],
            searchHistory: this.currentUser.searchHistory || [],
            preferences: this.currentUser.preferences || {},
            exportDate: new Date().toISOString()
        };
        
        const jsonStr = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `holyverse-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Datos exportados correctamente', 'success');
    },
    
    // Sync data between devices (optional: with server)
    syncData() {
        if (AuthSystem.getCurrentUser()) {
            // Store sync timestamp
            const lastSync = new Date().toISOString();
            localStorage.setItem('holyverse-last-sync', lastSync);
        }
    },
    
    // Helper: Format date
    formatDate(date) {
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (seconds < 60) return 'Hace unos segundos';
        if (minutes < 60) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
        if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
        if (days < 7) return `Hace ${days} día${days > 1 ? 's' : ''}`;
        
        return date.toLocaleDateString('es-ES');
    },
    
    // Helper: Days since joined
    getDaysSinceJoined(createdAt) {
        if (!createdAt) return 0;
        const created = new Date(createdAt);
        const now = new Date();
        const diff = now - created;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    },
    
    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notif = document.createElement('div');
        notif.className = `notification notification-${type}`;
        notif.textContent = message;
        notif.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#4ade80' : type === 'error' ? '#f87171' : '#60a5fa'};
            color: white;
            border-radius: 8px;
            z-index: 9999;
            animation: slideIn 0.3s ease;
            font-weight: 500;
        `;
        
        document.body.appendChild(notif);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notif.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notif.remove(), 300);
        }, 3000);
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof AuthSystem !== 'undefined' && AuthSystem.getCurrentUser()) {
            UserProfile.init();
        }
    });
} else {
    if (typeof AuthSystem !== 'undefined' && AuthSystem.getCurrentUser()) {
        UserProfile.init();
    }
}

// Listen for auth changes to reinit profile
document.addEventListener('authStatusChanged', () => {
    if (typeof AuthSystem !== 'undefined' && AuthSystem.getCurrentUser()) {
        UserProfile.init();
    }
});
