// src/firebase/authService.js
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from './config';

export const loginAdmin = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutAdmin = async () => {
  return signOut(auth);
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};