import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJLsR7HgFUn-4wRotx0cNhp78J7fFT6SU",
  authDomain: "fakedatagen-29a31.firebaseapp.com",
  databaseURL: "https://fakedatagen-29a31-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fakedatagen-29a31",
  storageBucket: "fakedatagen-29a31.appspot.com",
  messagingSenderId: "999112072172",
  appId: "1:999112072172:android:18ffe6091cd016e35bfec9",
};

//initialize firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);