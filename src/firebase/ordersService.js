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
  where
} from 'firebase/firestore';
import { db } from './config';

const ORDERS_COLLECTION = 'orders';

// Fetch all orders
export const fetchOrders = async () => {
  try {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));
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
      orderBy('createdAt', 'desc')
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

// Add a new order
export const addOrder = async (orderData) => {
  try {
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
      ...orderData,
      status: 'pending', // pending, processing, shipped, delivered, cancelled
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return { 
      id: docRef.id, 
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
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
      orderBy('createdAt', 'desc')
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