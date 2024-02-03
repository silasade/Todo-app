// FirebaseConfig.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDEEcZamNz-hcj1skvDYSwCVhppegQ-Xls",
    authDomain: "todo-app-12a22.firebaseapp.com",
    projectId: "todo-app-12a22",
    storageBucket: "todo-app-12a22.appspot.com",
    messagingSenderId: "91153874946",
    appId: "1:91153874946:web:2d66025e2c65ec19dbe71b"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Initialize auth here

const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider };
