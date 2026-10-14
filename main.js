// ============================================================
// École Nouvelle Ayiti — main.js
// Jere konekte / kreye kont ak Firebase Authentication
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  injekteModalKonekte();
  brancheEvenman();

  firebase.auth().onAuthStateChanged((user) => {
    afichèEtaKonekte(user);
  });
});

// ------------------------------------------------------------
// Kreye modal konekte a yon sèl fwa, ajoute l nan paj la
// ------------------------------------------------------------
function injekteModalKonekte() {
  const modal = document.createElement('div');
  modal.id = 'auth-modal';
  modal.className = 'auth-modal hidden';
  modal.innerHTML = `
    <div class="auth-modal-content" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <button type="button" id="auth-close" class="auth-close" aria-label="Fèmen">&times;</button>
      <h2 id="auth-title">Konekte</h2>
      <form id="auth-form" novalidate>
        <label for="auth-email">Imèl</label>
        <input type="email" id="auth-email" autocomplete="email" required>

        <label for="auth-password">Modpas</label>
        <input type="password" id="auth-password" autocomplete="current-password" minlength="6" required>

        <p id="auth-error" class="auth-error hidden"></p>

        <button type="submit" id="auth-submit" class="auth-submit">Konekte</button>
      </form>
      <p class="auth-switch">
        <span id="auth-switch-text">Ou pa gen kont?</span>
        <button type="button" id="auth-toggle" class="auth-link">Kreye yon kont</button>
      </p>
    </div>
  `;
  document.body.appendChild(modal);
}

// ------------------------------------------------------------
// Branche tout evènman (klik, soumèt fòm, elt.)
// ------------------------------------------------------------
let modEnskripsyon = false; // false = konekte, true = kreye kont

function brancheEvenman() {
  const modal = document.getElementById('auth-modal');
  const form = document.getElementById('auth-form');
  const closeBtn = document.getElementById('auth-close');
  const toggleBtn = document.getElementById('auth-toggle');
  const errorBox = document.getElementById('auth-error');

  // Klike sou "Konekte" nan header la (si moun nan pa konekte deja)
  document.addEventListener('click', (e) => {
    const navBtn = e.target.closest('#nav-konekte');
    if (navBtn && !firebase.auth().currentUser) {
      e.preventDefault();
      ouvèModal();
    } else if (navBtn && firebase.auth().currentUser) {
      e.preventDefault();
      if (confirm('Ou vle dekonekte?')) {
        firebase.auth().signOut();
      }
    }
  });

  closeBtn.addEventListener('click', fèmenModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) fèmenModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) fèmenModal();
  });

  toggleBtn.addEventListener('click', () => {
    modEnskripsyon = !modEnskripsyon;
    mèteAjouModalKonekteOuKreye();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.classList.add('hidden');

    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const submitBtn = document.getElementById('auth-submit');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Tann...';

    try {
      if (modEnskripsyon) {
        await firebase.auth().createUserWithEmailAndPassword(email, password);
      } else {
        await firebase.auth().signInWithEmailAndPassword(email, password);
      }
      fèmenModal();
      form.reset();
    } catch (err) {
      montreErè(err);
    } finally {
      submitBtn.disabled = false;
      mèteAjouModalKonekteOuKreye();
    }
  });
}

function ouvèModal() {
  const modal = document.getElementById('auth-modal');
  modal.classList.remove('hidden');
  document.getElementById('auth-email').focus();
}

function fèmenModal() {
  const modal = document.getElementById('auth-modal');
  modal.classList.add('hidden');
  document.getElementById('auth-error').classList.add('hidden');
}

function mèteAjouModalKonekteOuKreye() {
  document.getElementById('auth-title').textContent = modEnskripsyon ? 'Kreye yon kont' : 'Konekte';
  document.getElementById('auth-submit').textContent = modEnskripsyon ? 'Kreye kont' : 'Konekte';
  document.getElementById('auth-switch-text').textContent = modEnskripsyon ? 'Ou gen yon kont deja?' : 'Ou pa gen kont?';
  document.getElementById('auth-toggle').textContent = modEnskripsyon ? 'Konekte' : 'Kreye yon kont';
}

function montreErè(err) {
  const mesaj = {
    'auth/invalid-email': 'Imèl la pa valid.',
    'auth/user-not-found': 'Pa gen kont ak imèl sa a.',
    'auth/wrong-password': 'Modpas la pa bon.',
    'auth/email-already-in-use': 'Yon kont deja egziste ak imèl sa a.',
    'auth/weak-password': 'Modpas la twò fèb — mete omwen 6 karaktè.',
    'auth/invalid-credential': 'Imèl oswa modpas pa bon.',
    'auth/network-request-failed': 'Pwoblèm koneksyon — tcheke entènèt ou.',
  };
  const errorBox = document.getElementById('auth-error');
  errorBox.textContent = mesaj[err.code] || 'Yon erè rive, eseye ankò.';
  errorBox.classList.remove('hidden');
}

// ------------------------------------------------------------
// Mete ajou bouton "Konekte" nan header la selon si moun konekte
// ------------------------------------------------------------
function afichèEtaKonekte(user) {
  const navBtn = document.getElementById('nav-konekte');
  if (!navBtn) return;

  if (user) {
    const non = user.email.split('@')[0];
    navBtn.textContent = non;
    navBtn.title = 'Klike pou dekonekte';
  } else {
    navBtn.textContent = 'Konekte';
    navBtn.title = '';
  }
}
