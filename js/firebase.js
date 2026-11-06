import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";
  import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-analytics.js";
  import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyCLN_7MQcpaIRdIIns-aaDm6v9KGGdlH_4",
    authDomain: "freak-vau.firebaseapp.com",
    projectId: "freak-vau",
    storageBucket: "freak-vau.firebasestorage.app",
    messagingSenderId: "489412388046",
    appId: "1:489412388046:web:b2954fe0e40ae8d1385c9f",
    measurementId: "G-JSYRVC0Z55"
  };

  const app = initializeApp(firebaseConfig);
  isSupported().then(ok => { if (ok) getAnalytics(app); }).catch(() => {});
  const db = getFirestore(app);

  // used by script.js when a new member enters the vault
  window.fbSaveMember = m => addDoc(collection(db, "vault_members"), {
    name: m.name, aka: m.aka, role: m.role, spot: m.spot, photo: m.photo || "",
    createdAt: serverTimestamp()
  });
