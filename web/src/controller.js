import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBXOHKlcASY4ZpagX-MyBBPi7LUIJm7VYo",
  authDomain: "muview-687e9.firebaseapp.com",
  projectId: "muview-687e9",
  storageBucket: "muview-687e9.firebasestorage.app",
  messagingSenderId: "330225356346",
  appId: "1:330225356346:web:d0958dc9f5feffb051af03"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


