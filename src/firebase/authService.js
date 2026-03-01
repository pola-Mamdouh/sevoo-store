// src/firebase/authService.js
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from './config';

// للمستخدم العادي - تسجيل جديد
export const registerUser = async (email, password, displayName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  // إضافة اسم المستخدم
  await updateProfile(userCredential.user, {
    displayName: displayName
  });
  return userCredential.user;
};

// للمستخدم العادي - تسجيل دخول
export const loginUser = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// للأدمن - تسجيل دخول (نفس الكود)
export const loginAdmin = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// تسجيل خروج للجميع
export const logoutUser = async () => {
  return signOut(auth);
};

// مراقبة حالة تسجيل الدخول
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// الحصول على المستخدم الحالي
export const getCurrentUser = () => {
  return auth.currentUser;
};