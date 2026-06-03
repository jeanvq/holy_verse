/* ============================================
   HolyVerse v2 — auth.js
   ============================================ */

const SUPABASE_URL      = 'https://ejdhomxyqqitgjwjhkvn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqZGhvbXh5cXFpdGdqd2poa3ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwODA4ODYsImV4cCI6MjA4NTY1Njg4Nn0.0sDQA7rKcedbzHKrcoG0IuanezhSVIo2AHsmlmy5Qvc';

let supabaseClient = null;
let currentUser    = null;

function initSupabase() {
  try {
    if (!window.supabase) return;
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    supabaseClient.auth.onAuthStateChange((event, session) => {
  currentUser = session?.user || null;
  if (typeof updateProfileUI === 'function') updateProfileUI(currentUser);
  if (typeof closeAuthSheet === 'function' && currentUser) {
    closeAuthSheet();
    showToast('✅ Sesión iniciada');
  }
});

    supabaseClient.auth.getSession().then(({ data }) => {
  currentUser = data?.session?.user || null;
  if (typeof updateProfileUI === 'function') updateProfileUI(currentUser);
});

  } catch (e) {
    console.warn('Supabase error:', e.message);
  }
}

// Google login
document.getElementById('btnGoogleLogin').addEventListener('click', async () => {
  if (!supabaseClient) { showToast('⚠️ Supabase no configurado'); return; }
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin }
  });
  if (error) showToast('❌ ' + error.message);
});

// Email login
window.loginWithEmail = async function () {
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPassword').value;
  if (!email || !pass) { showToast('Completa todos los campos'); return; }
  if (!supabaseClient) { showToast('⚠️ Supabase no configurado'); return; }
  showToast('Iniciando sesión...');
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password: pass });
  if (error) showToast('❌ ' + error.message);
};

// Email signup
window.signupWithEmail = async function () {
  const name  = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const pass  = document.getElementById('signupPassword').value;
  if (!name || !email || !pass) { showToast('Completa todos los campos'); return; }
  if (!supabaseClient) { showToast('⚠️ Supabase no configurado'); return; }
  showToast('Creando cuenta...');
  const { error } = await supabaseClient.auth.signUp({
    email, password: pass,
    options: { data: { full_name: name } }
  });
  if (error) showToast('❌ ' + error.message);
  else showToast('✅ Revisa tu email para confirmar');
};

// Logout
window.logout = async function () {
  if (supabaseClient) await supabaseClient.auth.signOut();
  currentUser = null;
  updateProfileUI(null);
  showToast('👋 Sesión cerrada');
  showScreen('home');
};

document.addEventListener('DOMContentLoaded', initSupabase);