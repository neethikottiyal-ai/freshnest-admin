import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "freshnest-90da8.firebaseapp.com",
  projectId: "freshnest-90da8",
  storageBucket: "freshnest-90da8.firebasestorage.app",
  messagingSenderId: "805813095058",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
