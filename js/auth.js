// Firebase Configuration for HolyVerse
// This is safe to expose (no sensitive API keys)

const firebaseConfig = {
    apiKey: "AIzaSyD_placeholder", // Will be replaced with actual key
    authDomain: "holyverse-firebase.firebaseapp.com",
    projectId: "holyverse-app",
    storageBucket: "holyverse-app.firebasestorage.app",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// Alternative: Use simple localStorage-based auth system
// This doesn't require backend, keeps data locally

const AuthSystem = {
    // User storage key
    STORAGE_KEY: 'holyverse-user',
    SESSION_KEY: 'holyverse-session',
    
    // Initialize auth system
    init() {
        this.checkSession();
        this.setupEventListeners();
    },
    
    // Check if user has active session
    checkSession() {
        const session = localStorage.getItem(this.SESSION_KEY);
        if (session) {
            try {
                const user = JSON.parse(session);
                this.setCurrentUser(user);
                this.updateUI();
            } catch (e) {
                this.logout();
            }
        }
    },
    
    // Register new user
    register(email, password, displayName) {
        return new Promise((resolve, reject) => {
            // Validate inputs
            if (!email || !password || !displayName) {
                reject(new Error('Todos los campos son requeridos'));
                return;
            }
            
            if (password.length < 6) {
                reject(new Error('La contraseña debe tener al menos 6 caracteres'));
                return;
            }
            
            // Check if email already exists
            const allUsers = this.getAllUsers();
            if (allUsers.some(u => u.email === email)) {
                reject(new Error('Este email ya está registrado'));
                return;
            }
            
            // Create user object
            const user = {
                id: this.generateId(),
                email: email,
                displayName: displayName,
                password: this.hashPassword(password), // Simple hash
                createdAt: new Date().toISOString(),
                favorites: [],
                searchHistory: [],
                preferences: {
                    theme: 'dark',
                    language: 'es',
                    notifications: true
                }
            };
            
            // Save user
            const allUsers = this.getAllUsers();
            allUsers.push(user);
            localStorage.setItem('holyverse-users', JSON.stringify(allUsers));
            
            // Create session
            const sessionUser = { ...user };
            delete sessionUser.password;
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionUser));
            
            this.setCurrentUser(sessionUser);
            resolve(sessionUser);
        });
    },
    
    // Login user
    login(email, password) {
        return new Promise((resolve, reject) => {
            const allUsers = this.getAllUsers();
            const user = allUsers.find(u => u.email === email);
            
            if (!user) {
                reject(new Error('Email no encontrado'));
                return;
            }
            
            if (this.hashPassword(password) !== user.password) {
                reject(new Error('Contraseña incorrecta'));
                return;
            }
            
            // Create session
            const sessionUser = { ...user };
            delete sessionUser.password;
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionUser));
            
            this.setCurrentUser(sessionUser);
            resolve(sessionUser);
        });
    },
    
    // Logout user
    logout() {
        localStorage.removeItem(this.SESSION_KEY);
        this.currentUser = null;
        this.updateUI();
    },
    
    // Get current user
    getCurrentUser() {
        return this.currentUser || null;
    },
    
    // Set current user
    setCurrentUser(user) {
        this.currentUser = user;
    },
    
    // Save favorites
    saveFavorite(verse) {
        const user = this.getCurrentUser();
        if (!user) return;
        
        if (!user.favorites) user.favorites = [];
        if (!user.favorites.find(v => v.reference === verse.reference)) {
            user.favorites.push(verse);
            this.updateUser(user);
        }
    },
    
    // Remove favorite
    removeFavorite(verseReference) {
        const user = this.getCurrentUser();
        if (!user) return;
        
        user.favorites = user.favorites.filter(v => v.reference !== verseReference);
        this.updateUser(user);
    },
    
    // Get favorites
    getFavorites() {
        const user = this.getCurrentUser();
        return user?.favorites || [];
    },
    
    // Add to search history
    addSearchHistory(term) {
        const user = this.getCurrentUser();
        if (!user) return;
        
        if (!user.searchHistory) user.searchHistory = [];
        
        // Remove duplicate if exists
        user.searchHistory = user.searchHistory.filter(h => h !== term);
        
        // Add to beginning
        user.searchHistory.unshift(term);
        
        // Keep only last 20
        user.searchHistory = user.searchHistory.slice(0, 20);
        
        this.updateUser(user);
    },
    
    // Get search history
    getSearchHistory() {
        const user = this.getCurrentUser();
        return user?.searchHistory || [];
    },
    
    // Update user preferences
    updatePreferences(preferences) {
        const user = this.getCurrentUser();
        if (!user) return;
        
        user.preferences = { ...user.preferences, ...preferences };
        this.updateUser(user);
    },
    
    // Update user in storage
    updateUser(user) {
        const allUsers = this.getAllUsers();
        const index = allUsers.findIndex(u => u.id === user.id);
        if (index !== -1) {
            allUsers[index] = user;
            localStorage.setItem('holyverse-users', JSON.stringify(allUsers));
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
            this.setCurrentUser(user);
        }
    },
    
    // Get all users (admin only)
    getAllUsers() {
        try {
            return JSON.parse(localStorage.getItem('holyverse-users') || '[]');
        } catch (e) {
            return [];
        }
    },
    
    // Update UI based on auth state
    updateUI() {
        const user = this.getCurrentUser();
        const authContainer = document.getElementById('authContainer');
        const userMenu = document.getElementById('userMenu');
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const userName = document.getElementById('userName');
        
        if (user) {
            // User is logged in
            if (loginBtn) loginBtn.style.display = 'none';
            if (authContainer) authContainer.style.display = 'none';
            if (userMenu) {
                userMenu.style.display = 'flex';
                if (userName) userName.textContent = user.displayName;
            }
            if (logoutBtn) logoutBtn.style.display = 'block';
        } else {
            // User is not logged in
            if (loginBtn) loginBtn.style.display = 'block';
            if (authContainer) authContainer.style.display = 'none';
            if (userMenu) userMenu.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'none';
        }
    },
    
    // Setup event listeners
    setupEventListeners() {
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const authModal = document.getElementById('authModal');
        const closeAuthModal = document.getElementById('closeAuthModal');
        const signupTab = document.getElementById('signupTab');
        const loginTab = document.getElementById('loginTab');
        const signupForm = document.getElementById('signupForm');
        const loginForm = document.getElementById('loginForm');
        
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                if (authModal) authModal.classList.remove('hidden');
            });
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
                showNotification('Sesión cerrada');
            });
        }
        
        if (closeAuthModal) {
            closeAuthModal.addEventListener('click', () => {
                if (authModal) authModal.classList.add('hidden');
            });
        }
        
        if (signupTab) {
            signupTab.addEventListener('click', () => {
                if (signupForm) signupForm.style.display = 'block';
                if (loginForm) loginForm.style.display = 'none';
                signupTab.classList.add('active');
                loginTab.classList.remove('active');
            });
        }
        
        if (loginTab) {
            loginTab.addEventListener('click', () => {
                if (loginForm) loginForm.style.display = 'block';
                if (signupForm) signupForm.style.display = 'none';
                loginTab.classList.add('active');
                signupTab.classList.remove('active');
            });
        }
        
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('signupName').value;
                const email = document.getElementById('signupEmail').value;
                const password = document.getElementById('signupPassword').value;
                
                this.register(email, password, name)
                    .then(() => {
                        showNotification('¡Cuenta creada exitosamente!');
                        if (authModal) authModal.classList.add('hidden');
                        this.updateUI();
                    })
                    .catch(err => {
                        showNotification(err.message, 'error');
                    });
            });
        }
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                
                this.login(email, password)
                    .then(() => {
                        showNotification('¡Sesión iniciada!');
                        if (authModal) authModal.classList.add('hidden');
                        this.updateUI();
                    })
                    .catch(err => {
                        showNotification(err.message, 'error');
                    });
            });
        }
    },
    
    // Simple password hash
    hashPassword(password) {
        // Note: For production, use proper hashing. This is just for demo.
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return 'h' + Math.abs(hash).toString(36);
    },
    
    // Generate unique ID
    generateId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AuthSystem.init());
} else {
    AuthSystem.init();
}
