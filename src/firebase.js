// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Added Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhUFi4DLT78kx2AJpCrzAwYSTo0Hhne28",
  authDomain: "e-commerce-63381.firebaseapp.com",
  projectId: "e-commerce-63381",
  storageBucket: "e-commerce-63381.appspot.com",
  messagingSenderId: "691191979245",
  appId: "1:691191979245:web:1d7f77879ab28cf1fe80e4",
  measurementId: "G-NVXE70H372"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and Google Auth Provider
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Initialize Firestore
const db = getFirestore(app); // Added Firestore initialization

export { auth, googleProvider, db };
