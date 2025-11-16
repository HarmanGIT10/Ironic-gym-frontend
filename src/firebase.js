// src/firebase.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyB_IrONsrXkuE0aazr9MAxTaR_wwi4Bk8A",
  authDomain: "ironic-66cde.firebaseapp.com",
  projectId: "ironic-66cde",
  storageBucket: "ironic-66cde.firebasestorage.app",
  messagingSenderId: "240773784002",
  appId: "1:240773784002:web:373867d5236e14607f365b",
  measurementId: "G-2N54JKMLX6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// ✅ Export the auth utilities
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
