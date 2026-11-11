import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";
  import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-analytics.js";
  import { getFirestore, collection, addDoc, serverTimestamp, doc, getDoc, runTransaction } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

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

  // ---- limited stock: how many pieces of a kit were taken (collection "stock", one doc per kit slug)
  window.fbStockGet = async slug => {
    const s = await getDoc(doc(db, "stock", slug));
    return s.exists() ? (s.data().sold || 0) : 0;
  };
  // takes one piece atomically; returns {ok:false} when everything is gone
  window.fbStockClaim = (slug, max) => runTransaction(db, async tx => {
    const ref = doc(db, "stock", slug), s = await tx.get(ref);
    const sold = s.exists() ? (s.data().sold || 0) : 0;
    if (sold >= max) return { ok: false, sold };
    tx.set(ref, { sold: sold + 1, updatedAt: serverTimestamp() });
    return { ok: true, sold: sold + 1 };
  });
  window.dispatchEvent(new Event("fb-ready"));
