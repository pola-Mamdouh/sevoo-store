// src/firebase/productsService.js
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  orderBy,
  limit,
  startAfter,
  where
} from 'firebase/firestore';
import { db } from './config';

const PRODUCTS_COLLECTION = 'products';

// Fetch products with pagination
export const fetchProducts = async (lastVisible = null, pageSize = 12) => {
  try {
    let q;
    
    if (lastVisible) {
      // جلب الصفحة التالية
      q = query(
        collection(db, PRODUCTS_COLLECTION), 
        orderBy('createdAt', 'desc'),
        startAfter(lastVisible),
        limit(pageSize)
      );
    } else {
      // جلب الصفحة الأولى
      q = query(
        collection(db, PRODUCTS_COLLECTION), 
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );
    }
    
    const snapshot = await getDocs(q);
    
    // آخر عنصر في الصفحة (للاستخدام في الصفحة التالية)
    const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
    
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return {
      products,
      lastVisible: lastVisibleDoc,
      hasMore: snapshot.docs.length === pageSize
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      products: [],
      lastVisible: null,
      hasMore: false
    };
  }
};

// Add a new product
export const addProduct = async (productData) => {
  const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
    ...productData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return { id: docRef.id, ...productData };
};

// Update a product
export const updateProduct = async (id, productData) => {
  const productRef = doc(db, PRODUCTS_COLLECTION, id);
  await updateDoc(productRef, {
    ...productData,
    updatedAt: new Date().toISOString()
  });
  return { id, ...productData };
};

// Delete a product
export const deleteProduct = async (id) => {
  const productRef = doc(db, PRODUCTS_COLLECTION, id);
  await deleteDoc(productRef);
  return id;
};

// Get total count (optional - for better UX)
export const getProductsCount = async () => {
  try {
    const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    return snapshot.size;
  } catch (error) {
    console.error('Error counting products:', error);
    return 0;
  }
};