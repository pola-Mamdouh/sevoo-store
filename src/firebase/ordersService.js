// src/firebase/ordersService.js
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  orderBy,
  where,
  getCountFromServer,
  setDoc
} from 'firebase/firestore';
import { db } from './config';

const ORDERS_COLLECTION = 'orders';
const COUNTERS_COLLECTION = 'counters';

// دالة للحصول على رقم الطلب التالي
export const getNextOrderNumber = async () => {
  try {
    const counterRef = doc(db, COUNTERS_COLLECTION, 'orders');
    const counterSnapshot = await getDocs(collection(db, COUNTERS_COLLECTION));
    
    let nextNumber = 1;
    
    if (counterSnapshot.empty) {
      // أول مرة - أنشئ العداد
      await setDoc(counterRef, { current: 1 });
    } else {
      // اقرأ القيمة الحالية وزيدها
      const counterData = counterSnapshot.docs[0].data();
      nextNumber = (counterData.current || 0) + 1;
      await updateDoc(counterRef, { current: nextNumber });
    }
    
    return nextNumber;
  } catch (error) {
    console.error('Error getting next order number:', error);
    // Fallback: استخدم timestamp لو حصل خطأ
    return parseInt(Date.now().toString().slice(-6));
  }
};

// Fetch all orders
export const fetchOrders = async () => {
  try {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy('orderNumber', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

// Fetch orders by status
export const fetchOrdersByStatus = async (status) => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION), 
      where('status', '==', status),
      orderBy('orderNumber', 'desc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching orders by status:', error);
    return [];
  }
};

// Add a new order with sequential number
export const addOrder = async (orderData) => {
  try {
    // احصل على رقم الطلب التالي
    const orderNumber = await getNextOrderNumber();
    
    const orderWithNumber = {
      ...orderData,
      orderNumber,
      status: 'قيد الانتظار',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), orderWithNumber);
    
    return { 
      id: docRef.id, 
      ...orderWithNumber
    };
  } catch (error) {
    console.error('Error adding order:', error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (id, status) => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, id);
    await updateDoc(orderRef, {
      status,
      updatedAt: new Date().toISOString()
    });
    return { id, status };
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Delete order
export const deleteOrder = async (id) => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, id);
    await deleteDoc(orderRef);
    return id;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

// Get orders count
export const getOrdersCount = async () => {
  try {
    const snapshot = await getDocs(collection(db, ORDERS_COLLECTION));
    return snapshot.size;
  } catch (error) {
    console.error('Error counting orders:', error);
    return 0;
  }
};

// Get orders by date range
export const fetchOrdersByDateRange = async (startDate, endDate) => {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('createdAt', '>=', startDate),
      where('createdAt', '<=', endDate),
      orderBy('orderNumber', 'desc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching orders by date:', error);
    return [];
  }
};