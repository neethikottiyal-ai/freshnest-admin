import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCuiSFExWTT4ku1xEWtLZkzJhDp2l38jMw",
  authDomain: "freshnest-erp.firebaseapp.com",
  projectId: "freshnest-erp",
  storageBucket: "freshnest-erp.firebasestorage.app",
  messagingSenderId: "378767473305",
  appId: "1:378767473305:web:3fb10c5a71f801bd379608"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
