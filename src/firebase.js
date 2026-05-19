import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:"AIzaSyDRrf6gYpMLt-vadzBcN9uyn706ipiPf8s",
  authDomain: "freshnest-90da8.firebaseapp.com",
  projectId: "freshnest-90da8",
  storageBucket: "freshnest-90da8.appspot.com",
  messagingSenderId: "805813095058",
  appId:"1:805813095058:web:d8a4cf4da935b47c7db44b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
