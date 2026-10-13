// ============================================================
// École Nouvelle Ayiti — Konfigirasyon Firebase
// ============================================================
// 1. Ale sou console.firebase.google.com
// 2. Kreye yon NOUVO pwojè (separe de pwojè STOA a)
// 3. Nan Project Settings > General, kopye "firebaseConfig" li ba w la
// 4. Kole valè yo anba a
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyBXSdGvBDk8c9rPZ5cneGsNni2sgBTodq0",
  authDomain: "ecole-nouvelle-ayiti.firebaseapp.com",
  databaseURL: "https://ecole-nouvelle-ayiti-default-rtdb.firebaseio.com",
  projectId: "ecole-nouvelle-ayiti",
  storageBucket: "ecole-nouvelle-ayiti.firebasestorage.app",
  messagingSenderId: "441308500901",
  appId: "1:441308500901:web:e22e3759437dd1747bce4c",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

// Pou itilize sa nan index.html, ajoute anvan main.js:
// <script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-auth-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-database-compat.js"></script>
// <script src="js/firebase-config.js"></script>
