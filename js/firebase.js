/* Loads Firebase with fallback versions and logs the REAL reason if it fails */
const VERSIONS = ["12.15.0", "12.18.0", "12.14.0", "12.10.0"];
const firebaseConfig = {
  apiKey: "AIzaSyCLN_7MQcpaIRdIIns-aaDm6v9KGGdlH_4",
  authDomain: "freak-vau.firebaseapp.com",
  projectId: "freak-vau",
  storageBucket: "freak-vau.firebasestorage.app",
  messagingSenderId: "489412388046",
  appId: "1:489412388046:web:b2954fe0e40ae8d1385c9f",
  measurementId: "G-JSYRVC0Z55"
};

async function loadFirebase() {
  let lastErr;
  for (const v of VERSIONS) {
    const base = "https://www.gstatic.com/firebasejs/" + v + "/";
    try {
      const [app, analytics, auth, fs] = await Promise.all([
        import(base + "firebase-app.js"),
        import(base + "firebase-analytics.js"),
        import(base + "firebase-auth.js"),
        import(base + "firebase-firestore.js")
      ]);
      console.log("FREAK: Firebase " + v + " loaded");
      return { app, analytics, auth, fs };
    } catch (e) {
      lastErr = e;
      console.warn("FREAK: Firebase " + v + " failed to load:", e && e.message);
    }
  }
  throw lastErr;
}

(async () => {
  try {
    const { app: A, analytics: AN, auth: AU, fs: F } = await loadFirebase();
    const app = A.initializeApp(firebaseConfig);
    AN.isSupported().then(ok => { if (ok) AN.getAnalytics(app); }).catch(() => {});
    const db = F.getFirestore(app);
    const auth = AU.getAuth(app);

    window.fbGoogleSignIn = async () => {
      const r = await AU.signInWithPopup(auth, new AU.GoogleAuthProvider());
      const u = r.user;
      return { name: u.displayName || "", photo: u.photoURL || "" };
    };

    window.fbSaveMember = m => F.addDoc(F.collection(db, "vault_members"), {
      name: m.name, aka: m.aka, role: m.role, spot: m.spot, photo: m.photo || "",
      createdAt: F.serverTimestamp()
    });

    window.fbStockGet = async slug => {
      const s = await F.getDoc(F.doc(db, "stock", slug));
      return s.exists() ? (s.data().sold || 0) : 0;
    };
    window.fbStockClaim = (slug, max) => F.runTransaction(db, async tx => {
      const ref = F.doc(db, "stock", slug), s = await tx.get(ref);
      const sold = s.exists() ? (s.data().sold || 0) : 0;
      if (sold >= max) return { ok: false, sold };
      tx.set(ref, { sold: sold + 1, updatedAt: F.serverTimestamp() });
      return { ok: true, sold: sold + 1 };
    });
    window.__fbReady = true;
    window.dispatchEvent(new Event("fb-ready"));
  } catch (e) {
    window.__fbError = e;
    console.error("FREAK: Firebase could not be loaded. Reason:", e && (e.message || e));
  }
})();
