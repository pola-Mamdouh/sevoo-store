// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBnfTsv3BuOPwtg-0xaH6dd1jMp9MpUJkU",
  authDomain: "sevoo-store.firebaseapp.com",
  projectId: "sevoo-store",
  storageBucket: "sevoo-store.firebasestorage.app",
  messagingSenderId: "54092226321",
  appId: "1:54092226321:web:53f015f6edd737aa41f6b0",
  measurementId: "G-S6MM0N8XZT"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);