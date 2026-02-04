// Supabase Configuration (add your real values)
// This is safe to expose (public anon key)
const SUPABASE_URL = 'https://ejdhomxyqqitgjwjhkvn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqZGhvbXh5cXFpdGdqd2poa3ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwODA4ODYsImV4cCI6MjA4NTY1Njg4Nn0.0sDQA7rKcedbzHKrcoG0IuanezhSVIo2AHsmlmy5Qvc';

const AuthSystem = {
    // User storage key
    STORAGE_KEY: 'holyverse-user',
    SESSION_KEY: 'holyverse-session',
    GATE_KEY: 'holyverse-auth-skip',
    supabase: null,
    useSupabase: false,
    userData: null,
    
    // Initialize auth system
    init() {
        this.initSupabase();
        this.checkSession();
        this.setupEventListeners();
    },

    initSupabase() {
        const missingConfig = !SUPABASE_URL || !SUPABASE_ANON_KEY ||
            SUPABASE_URL.includes('YOUR_SUPABASE') ||
            SUPABASE_ANON_KEY.includes('YOUR_SUPABASE');

        if (missingConfig || !window.supabase?.createClient) {
            console.warn('Supabase no configurado, usando modo local.');
            this.useSupabase = false;
            return;
        }

        this.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        this.useSupabase = true;

        this.supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                const user = this.mapSupabaseUser(session.user);
                localStorage.removeItem(this.GATE_KEY);
                this.setCurrentUser(user);
                this.loadUserData(session.user.id);
            } else {
                this.setCurrentUser(null);
                this.userData = null;
            }
            this.updateUI();
            this.applyAuthGate();
        });
    },
    
    // Check if user has active session
    async checkSession() {
        if (this.useSupabase && this.supabase) {
            const { data } = await this.supabase.auth.getSession();
            const session = data?.session;
            if (session?.user) {
                const user = this.mapSupabaseUser(session.user);
                localStorage.removeItem(this.GATE_KEY);
                this.setCurrentUser(user);
                await this.loadUserData(session.user.id);
            } else {
                this.setCurrentUser(null);
                this.userData = null;
            }
            this.updateUI();
            this.applyAuthGate();
            return;
        }

        const session = localStorage.getItem(this.SESSION_KEY);
        if (session) {
            try {
                const user = JSON.parse(session);
                this.setCurrentUser(user);
                this.updateUI();
                this.applyAuthGate();
            } catch (e) {
                this.logout();
            }
        } else {
            this.setCurrentUser(null);
            this.userData = null;
            this.updateUI();
        }
        this.applyAuthGate();
    },
    
    // Register new user
    register(email, password, displayName) {
        return new Promise(async (resolve, reject) => {
            if (!email || !password || !displayName) {
                reject(new Error('Todos los campos son requeridos'));
                return;
            }

            if (password.length < 6) {
                reject(new Error('La contraseña debe tener al menos 6 caracteres'));
                return;
            }

            if (this.useSupabase && this.supabase) {
                const { data, error } = await this.supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { displayName }
                    }
                });

                if (error) {
                    reject(error);
                    return;
                }

                const user = data?.user ? this.mapSupabaseUser(data.user) : null;
                if (user) {
                    localStorage.removeItem(this.GATE_KEY);
                    this.setCurrentUser(user);
                    await this.ensureProfile(user);
                }

                resolve(user);
                return;
            }

            const allUsers = this.getAllUsers();
            if (allUsers.some(u => u.email === email)) {
                reject(new Error('Este email ya está registrado'));
                return;
            }

            const user = {
                id: this.generateId(),
                email: email,
                displayName: displayName,
                password: this.hashPassword(password),
                createdAt: new Date().toISOString(),
                favorites: [],
                searchHistory: [],
                preferences: {
                    theme: 'dark',
                    language: 'es',
                    notificationsEnabled: true
                }
            };

            allUsers.push(user);
            localStorage.setItem('holyverse-users', JSON.stringify(allUsers));

            const sessionUser = { ...user };
            delete sessionUser.password;
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionUser));

            localStorage.removeItem(this.GATE_KEY);
            this.setCurrentUser(sessionUser);
            resolve(sessionUser);
        });
    },
    
    // Login user
    login(email, password) {
        return new Promise(async (resolve, reject) => {
            if (this.useSupabase && this.supabase) {
                const { data, error } = await this.supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) {
                    reject(error);
                    return;
                }

                const user = data?.user ? this.mapSupabaseUser(data.user) : null;
                if (user) {
                    localStorage.removeItem(this.GATE_KEY);
                    this.setCurrentUser(user);
                    await this.ensureProfile(user);
                    await this.loadUserData(user.id);
                }

                resolve(user);
                return;
            }

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

            const sessionUser = { ...user };
            delete sessionUser.password;
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionUser));

            localStorage.removeItem(this.GATE_KEY);
            this.setCurrentUser(sessionUser);
            resolve(sessionUser);
        });
    },
    
    // Logout user
    async logout() {
        if (this.useSupabase && this.supabase) {
            await this.supabase.auth.signOut();
        }
        localStorage.removeItem(this.SESSION_KEY);
        this.currentUser = null;
        this.userData = null;
        this.updateUI();
        this.applyAuthGate();
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

        if (this.useSupabase) {
            if (!this.userData) this.userData = this.createDefaultUserData();
            if (!this.userData.favorites.find(v => v.reference === verse.reference)) {
                this.userData.favorites.push(verse);
                this.persistUserData();
            }
            return;
        }

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

        if (this.useSupabase && this.userData) {
            this.userData.favorites = this.userData.favorites.filter(v => v.reference !== verseReference);
            this.persistUserData();
            return;
        }

        if (!user.favorites) return;
        user.favorites = user.favorites.filter(v => v.reference !== verseReference);
        this.updateUser(user);
    },
    
    // Get favorites
    getFavorites() {
        if (this.useSupabase) {
            return this.userData?.favorites || [];
        }
        return this.getCurrentUser()?.favorites || [];
    },
    
    // Add to search history
    addSearchHistory(term) {
        const user = this.getCurrentUser();
        if (!user) return;

        if (this.useSupabase) {
            if (!this.userData) this.userData = this.createDefaultUserData();
            this.userData.searchHistory = this.userData.searchHistory.filter(h =>
                (typeof h === 'string' ? h : h.query) !== term
            );

            this.userData.searchHistory.unshift({
                query: term,
                timestamp: new Date().toISOString()
            });

            this.userData.searchHistory = this.userData.searchHistory.slice(0, 20);

            this.persistUserData();
            return;
        }

        if (!user.searchHistory) user.searchHistory = [];
        user.searchHistory = user.searchHistory.filter(h =>
            (typeof h === 'string' ? h : h.query) !== term
        );
        user.searchHistory.unshift({
            query: term,
            timestamp: new Date().toISOString()
        });
        user.searchHistory = user.searchHistory.slice(0, 20);
        this.updateUser(user);
    },
    
    // Get search history
    getSearchHistory() {
        if (this.useSupabase) {
            return this.userData?.searchHistory || [];
        }
        return this.getCurrentUser()?.searchHistory || [];
    },

    getPreferences() {
        if (this.useSupabase) {
            return this.userData?.preferences || this.createDefaultUserData().preferences;
        }
        return this.getCurrentUser()?.preferences || {};
    },
    
    // Update user preferences
    updatePreferences(preferences) {
        const user = this.getCurrentUser();
        if (!user) return;

        if (this.useSupabase) {
            if (!this.userData) this.userData = this.createDefaultUserData();
            this.userData.preferences = { ...this.userData.preferences, ...preferences };
            this.persistUserData();
            return;
        }

        user.preferences = { ...user.preferences, ...preferences };
        this.updateUser(user);
    },
    
    // Update user in storage
    updateUser(user) {
        if (this.useSupabase) {
            this.setCurrentUser(user);
            return;
        }

        const allUsers = this.getAllUsers();
        const index = allUsers.findIndex(u => u.id === user.id);
        if (index !== -1) {
            allUsers[index] = user;
            localStorage.setItem('holyverse-users', JSON.stringify(allUsers));
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
            this.setCurrentUser(user);
        }
    },

    async updateProfile({ displayName, email }) {
        const user = this.getCurrentUser();
        if (!user) return;

        if (this.useSupabase && this.supabase) {
            const updates = {
                data: {
                    displayName: displayName || user.displayName
                }
            };

            if (email && email !== user.email) {
                updates.email = email;
            }

            const { data, error } = await this.supabase.auth.updateUser(updates);
            if (error) throw error;

            const updatedUser = data?.user ? this.mapSupabaseUser(data.user) : user;
            this.setCurrentUser(updatedUser);

            await this.supabase
                .from('profiles')
                .update({
                    display_name: displayName || updatedUser.displayName,
                    email: email || updatedUser.email
                })
                .eq('id', updatedUser.id);

            return;
        }

        user.displayName = displayName || user.displayName;
        user.email = email || user.email;
        this.updateUser(user);
    },

    removeHistoryItem(index) {
        const user = this.getCurrentUser();
        if (!user) return;

        if (this.useSupabase) {
            if (!this.userData) this.userData = this.createDefaultUserData();
            this.userData.searchHistory.splice(index, 1);
            this.persistUserData();
            return;
        }

        if (!user.searchHistory) return;
        user.searchHistory.splice(index, 1);
        this.updateUser(user);
    },

    clearHistory() {
        const user = this.getCurrentUser();
        if (!user) return;

        if (this.useSupabase) {
            if (!this.userData) this.userData = this.createDefaultUserData();
            this.userData.searchHistory = [];
            this.persistUserData();
            return;
        }

        user.searchHistory = [];
        this.updateUser(user);
    },
    
    // Get all users (admin only)
    getAllUsers() {
        try {
            return JSON.parse(localStorage.getItem('holyverse-users') || '[]');
        } catch (e) {
            return [];
        }
    },

    createDefaultUserData() {
        return {
            favorites: [],
            searchHistory: [],
            preferences: {
                theme: 'dark',
                language: 'es',
                notificationsEnabled: true
            }
        };
    },

    mapSupabaseUser(user) {
        return {
            id: user.id,
            email: user.email,
            displayName: user.user_metadata?.displayName ||
                user.user_metadata?.display_name ||
                (user.email ? user.email.split('@')[0] : 'Usuario'),
            createdAt: user.created_at
        };
    },

    async ensureProfile(user) {
        if (!this.useSupabase || !this.supabase) return;
        const payload = {
            id: user.id,
            email: user.email,
            display_name: user.displayName,
            favorites: this.userData?.favorites || [],
            search_history: this.userData?.searchHistory || [],
            preferences: this.userData?.preferences || this.createDefaultUserData().preferences
        };

        await this.supabase
            .from('profiles')
            .upsert(payload, { onConflict: 'id' });
    },

    async loadUserData(userId) {
        if (!this.useSupabase || !this.supabase) return;

        const { data, error } = await this.supabase
            .from('profiles')
            .select('favorites, search_history, preferences, display_name, email, created_at')
            .eq('id', userId)
            .single();

        if (error || !data) {
            this.userData = this.createDefaultUserData();
            const current = this.getCurrentUser();
            if (current) {
                await this.ensureProfile(current);
            }
            return;
        }

        this.userData = {
            favorites: Array.isArray(data.favorites) ? data.favorites : [],
            searchHistory: Array.isArray(data.search_history) ? data.search_history : [],
            preferences: data.preferences || this.createDefaultUserData().preferences
        };

        const current = this.getCurrentUser();
        if (current) {
            current.displayName = data.display_name || current.displayName;
            current.email = data.email || current.email;
            this.setCurrentUser(current);
        }
    },

    async persistUserData() {
        if (!this.useSupabase || !this.supabase) return;
        const user = this.getCurrentUser();
        if (!user) return;

        await this.supabase
            .from('profiles')
            .update({
                favorites: this.userData?.favorites || [],
                search_history: this.userData?.searchHistory || [],
                preferences: this.userData?.preferences || this.createDefaultUserData().preferences
            })
            .eq('id', user.id);
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
            if (authContainer) authContainer.style.display = 'flex';
            if (userMenu) userMenu.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'none';
        }
    },

    applyAuthGate() {
        const authModal = document.getElementById('authModal');
        const skip = localStorage.getItem(this.GATE_KEY);
        const hasUser = !!this.getCurrentUser();

        if (!hasUser && !skip) {
            if (authModal) authModal.classList.remove('hidden');
            document.body.classList.add('auth-locked');
            return;
        }

        if (authModal) authModal.classList.add('hidden');
        document.body.classList.remove('auth-locked');
    },

    allowGuestAccess() {
        localStorage.setItem(this.GATE_KEY, '1');
        this.applyAuthGate();
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
        const loginGoogleBtn = document.getElementById('loginGoogleBtn');
        const continueGuestBtn = document.getElementById('continueGuestBtn');
        
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                if (authModal) authModal.classList.remove('hidden');
            });
        }

        if (loginGoogleBtn) {
            loginGoogleBtn.addEventListener('click', () => {
                this.loginWithProvider('google');
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
                this.allowGuestAccess();
            });
        }

        if (continueGuestBtn) {
            continueGuestBtn.addEventListener('click', () => {
                this.allowGuestAccess();
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
                        this.applyAuthGate();
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
                        this.applyAuthGate();
                    })
                    .catch(err => {
                        showNotification(err.message, 'error');
                    });
            });
        }
    },

    async loginWithProvider(provider) {
        if (!this.useSupabase || !this.supabase) {
            showNotification('Configura Supabase para usar login social', 'error');
            return;
        }

        const redirectTo = `${window.location.origin}${window.location.pathname}`;
        const { error } = await this.supabase.auth.signInWithOAuth({
            provider,
            options: { redirectTo }
        });

        if (error) {
            showNotification(error.message || 'No se pudo iniciar sesión', 'error');
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
