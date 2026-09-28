// ============================================================
// École Nouvelle Ayiti — Konfigirasyon Firebase
// ============================================================
// 1. Ale sou console.firebase.google.com
// 2. Kreye yon NOUVO pwojè (separe de pwojè STOA a)
// 3. Nan Project Settings > General, kopye "firebaseConfig" li ba w la
// 4. Kole valè yo anba a
// ============================================================

const firebaseConfig = {
  apiKey: "REMPLASE-MWEN",
  authDomain: "REMPLASE-MWEN.firebaseapp.com",
  databaseURL: "https://REMPLASE-MWEN-default-rtdb.firebaseio.com",
  projectId: "REMPLASE-MWEN",
  storageBucket: "REMPLASE-MWEN.appspot.com",
  messagingSenderId: "REMPLASE-MWEN",
  appId: "REMPLASE-MWEN",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

// Pou itilize sa nan index.html, ajoute anvan main.js:
// <script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-auth-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-database-compat.js"></script>
// <script src="js/firebase-config.js"></script>
