/* ============================================
   HolyVerse — auth.js (Firebase)
   ============================================ */

const firebaseConfig = {
  apiKey: "AIzaSyCfwhQXZ8sgAr-g8Iq_VDAZkQUfW6Mig28",
  authDomain: "holyverse-d2b32.firebaseapp.com",
  projectId: "holyverse-d2b32",
  storageBucket: "holyverse-d2b32.firebasestorage.app",
  messagingSenderId: "1074473315560",
  appId: "1:1074473315560:web:7845b4a6eae73d2f83ed5d",
  measurementId: "G-CZV9W7C1Y5"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const analytics = firebase.analytics();

window.logAnalyticsEvent = function(name, params) {
  try {
    analytics.logEvent(name, params || {});
  } catch (err) {
    console.error('Analytics error:', err);
  }
};

// ── Se dispara cada vez que Firebase confirma el estado real de sesión
// (al abrir la app con sesión ya guardada, tras login, o logout) — evita
// que otras partes de la app lean datos viejos de localStorage antes de
// que auth.currentUser esté realmente confirmado.
auth.onAuthStateChanged((user) => {
  if (typeof updateProfileUI === 'function') updateProfileUI(user);
  if (window.YearPlan) {
    YearPlan.renderHomeCard();
    const ypScreen = document.getElementById('screen-yearplan');
    if (ypScreen && ypScreen.classList.contains('active')) YearPlan.renderScreen();
  }
});
const AuthSystem = {

async migrateGuestData(uid) {
  const localFavs = JSON.parse(localStorage.getItem('hv_favorites') || '[]');
  const localHighlights = JSON.parse(localStorage.getItem('hv_highlights') || '[]');

  if (!localFavs.length && !localHighlights.length) return;

  const batch = db.batch();

  localFavs.forEach(fav => {
    const id = sanitizeFavId(fav.reference);
    const ref = db.collection('users').doc(uid).collection('favoritos').doc(id);
    batch.set(ref, {
      reference: fav.reference,
      text: fav.text,
      savedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  });

  localHighlights.forEach(h => {
    const id = sanitizeFavId(h.reference);
    const ref = db.collection('users').doc(uid).collection('subrayados').doc(id);
    batch.set(ref, {
      reference: h.reference,
      text: h.text,
      book: h.book || null,
      chapter: h.chapter || null,
      verse: h.verse || null,
      savedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  });

  await batch.commit();
  localStorage.removeItem('hv_favorites');
  localStorage.removeItem('hv_highlights');
  showToast('✅ Tus favoritos y subrayados de invitado se sincronizaron con tu cuenta');
},
  
  async updateDisplayName(newName) {
    try {
      const user = auth.currentUser;
      if (!user) return { success: false };
      await user.updateProfile({ displayName: newName });
      await db.collection('users').doc(user.uid).set({ name: newName }, { merge: true });
      if (typeof updateProfileUI === 'function') updateProfileUI(auth.currentUser);
      showToast('✅ Nombre actualizado');
      return { success: true };
    } catch (err) {
      showToast(this.friendlyError ? this.friendlyError(err.code) : 'No se pudo actualizar el nombre');
      return { success: false };
    }
  },
  async loginWithEmail(email, password) {
  try {
    const cred = await auth.signInWithEmailAndPassword(email, password);
    await this.migrateGuestData(cred.user.uid);
    logAnalyticsEvent('login', { method: 'email' });
    showToast('✅ Sesión iniciada');
    closeAuthSheet();
    } catch (err) {
      showToast(this.friendlyError(err.code));
    }
  },

  async signupWithEmail(name, email, password) {
    try {
      const cred = await auth.createUserWithEmailAndPassword(email, password);
      await cred.user.updateProfile({ displayName: name });
      await db.collection('users').doc(cred.user.uid).set({
        name,
        email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      await this.migrateGuestData(cred.user.uid);
      logAnalyticsEvent('sign_up', { method: 'email' });
      showToast('✅ Cuenta creada');
      closeAuthSheet();
    } catch (err) {
      showToast(this.friendlyError(err.code));
    }
  },

  

async handleRedirectResult() {
  try {
    const result = await auth.getRedirectResult();
    if (!result.user) return;
    const user = result.user;
    const docRef = db.collection('users').doc(user.uid);
    const doc = await docRef.get();
    if (!doc.exists) {
      await docRef.set({
        name: user.displayName || '',
        email: user.email || '',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
    showToast('✅ Sesión iniciada con Google');
    closeAuthSheet();
  } catch (err) {
    if (err.code) showToast(this.friendlyError(err.code));
  }
},

  async loginWithGoogle() {
    try {
      let user;
      if (window.Capacitor && Capacitor.isNativePlatform()) {
        // App nativa: usar el plugin nativo de Google Sign-In
        const { FirebaseAuthentication } = Capacitor.Plugins;
        const result = await FirebaseAuthentication.signInWithGoogle();
        const idToken = result.credential?.idToken;
        if (!idToken) throw new Error('No se recibió idToken de Google');
        const credential = firebase.auth.GoogleAuthProvider.credential(idToken);
        const authResult = await auth.signInWithCredential(credential);
        user = authResult.user;
      } else {
        // Web: flujo original con popup
        const provider = new firebase.auth.GoogleAuthProvider();
        const authResult = await auth.signInWithPopup(provider);
        user = authResult.user;
      }
      const docRef = db.collection('users').doc(user.uid);
      const doc = await docRef.get();
      if (!doc.exists) {
        await docRef.set({
          name: user.displayName || '',
          email: user.email || '',
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
      await this.migrateGuestData(user.uid);
      logAnalyticsEvent('login', { method: 'google' });
      showToast('✅ Sesión iniciada con Google');
      closeAuthSheet();
    } catch (err) {
      const cancelled = err.code === 'auth/popup-closed-by-user' ||
        err.code === 'auth/cancelled-popup-request' ||
        (err.message && err.message.toLowerCase().includes('cancel'));
      if (!cancelled) {
        showToast(this.friendlyError(err.code));
      }
    }
  },

  async loginWithApple() {
    if (this._appleLoginInProgress) return;
    this._appleLoginInProgress = true;
    try {
      let user;
      if (window.Capacitor && Capacitor.isNativePlatform()) {
        // App nativa: usar el plugin nativo de Apple Sign-In
        const { FirebaseAuthentication } = Capacitor.Plugins;
        const result = await FirebaseAuthentication.signInWithApple();
        const idToken = result.credential?.idToken;
        const rawNonce = result.credential?.nonce;
        if (!idToken) throw new Error('No se recibió idToken de Apple');
        const provider = new firebase.auth.OAuthProvider('apple.com');
        const credential = provider.credential({ idToken, rawNonce });
        const authResult = await auth.signInWithCredential(credential);
        user = authResult.user;
      } else {
        // Web: flujo original con popup
        const provider = new firebase.auth.OAuthProvider('apple.com');
        provider.addScope('email');
        provider.addScope('name');
        const authResult = await auth.signInWithPopup(provider);
        user = authResult.user;
      }
      const docRef = db.collection('users').doc(user.uid);
      const doc = await docRef.get();
      if (!doc.exists) {
        await docRef.set({
          name: user.displayName || '',
          email: user.email || '',
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
      await this.migrateGuestData(user.uid);
      logAnalyticsEvent('login', { method: 'apple' });
      showToast('✅ Sesión iniciada con Apple');
      closeAuthSheet();
    } catch (err) {
      const cancelled = err.code === 'auth/popup-closed-by-user' ||
        err.code === 'auth/cancelled-popup-request' ||
        (err.message && err.message.toLowerCase().includes('cancel'));
      if (!cancelled) {
        showToast(this.friendlyError(err.code));
      }
    } finally {
      this._appleLoginInProgress = false;
    }
  },

  async forgotPassword(email) {
  if (!email) {
    showToast('Escribe tu correo arriba primero');
    return;
  }
  try {
    await auth.sendPasswordResetEmail(email);
    showToast('📧 Revisa tu correo para restablecer tu contraseña');
  } catch (err) {
    showToast(this.friendlyError(err.code));
  }
},

  async logout() {
    await auth.signOut();
    showToast('Sesión cerrada');
  },
  async deleteAccount() {
    const user = auth.currentUser;
    if (!user) return;
    const uid = user.uid;
    try {
      // Borrar subcolecciones de datos del usuario
      const subcollections = ['favoritos', 'notas', 'subrayados'];
      for (const sub of subcollections) {
        const snap = await db.collection('users').doc(uid).collection(sub).get();
        const batch = db.batch();
        snap.forEach(docSnap => batch.delete(docSnap.ref));
        if (!snap.empty) await batch.commit();
      }
      // Borrar el documento principal del usuario
      await db.collection('users').doc(uid).delete();
      // Borrar la cuenta de autenticación
      await user.delete();
      showToast('Cuenta eliminada');
      return { success: true };
    } catch (err) {
      if (err.code === 'auth/requires-recent-login') {
        return { success: false, requiresRecentLogin: true };
      }
      showToast(this.friendlyError(err.code) || 'Error al eliminar la cuenta');
      return { success: false, error: err.code };
    }
  },

  friendlyError(code) {
    const messages = {
      'auth/invalid-email': 'Correo inválido',
      'auth/user-not-found': 'No existe una cuenta con ese correo',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/invalid-credential': 'Correo o contraseña incorrectos',
      'auth/email-already-in-use': 'Ya existe una cuenta con ese correo',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
      'auth/too-many-requests': 'Demasiados intentos, espera un momento'
    };
    return messages[code] || 'Ocurrió un error, intenta de nuevo';
  }
};

window.AuthSystem = AuthSystem;

document.addEventListener('DOMContentLoaded', () => {
  const btnGoogle = document.getElementById('btnGoogleLogin');
  if (btnGoogle) {
    btnGoogle.addEventListener('click', () => AuthSystem.loginWithGoogle());
  }
  const btnApple = document.getElementById('btnAppleLogin');
  if (btnApple) {
    btnApple.addEventListener('click', () => AuthSystem.loginWithApple());
  }
});

AuthSystem.handleRedirectResult();

auth.onAuthStateChanged(user => {
  if (typeof updateProfileUI === 'function') {
    updateProfileUI(user);
  }
});