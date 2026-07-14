/* ============================================
   HolyVerse — auth.js (Firebase)
   ============================================ */

const firebaseConfig = {
  apiKey: "AIzaSyCfwhQXZ8sgAr-g8Iq_VDAZkQUfW6Mig28",
  authDomain: "holyverse-d2b32.firebaseapp.com",
  projectId: "holyverse-d2b32",
  storageBucket: "holyverse-d2b32.firebasestorage.app",
  messagingSenderId: "1074473315560",
  appId: "1:1074473315560:web:7845b4a6eae73d2f83ed5d"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const AuthSystem = {
  async loginWithEmail(email, password) {
    try {
      await auth.signInWithEmailAndPassword(email, password);
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
      showToast('✅ Cuenta creada');
      closeAuthSheet();
    } catch (err) {
      showToast(this.friendlyError(err.code));
    }
  },

  async loginWithGoogle() {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithRedirect(provider);
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
});

AuthSystem.handleRedirectResult();

auth.onAuthStateChanged(user => {
  if (typeof updateProfileUI === 'function') {
    updateProfileUI(user);
  }
});