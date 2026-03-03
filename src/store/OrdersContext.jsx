// src/store/OrdersContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc 
} from 'firebase/firestore';
import { useUser } from './UserContext';
import { useAdmin } from './AdminContext'; // سنحتاج إلى useAdmin

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const { adminState } = useAdmin(); // adminState.isAdmin يحدد إذا كان المستخدم أدمن

  useEffect(() => {
    let q;
    if (adminState?.isAdmin) {
      // إذا كان أدمن، يرَى جميع الطلبات
      q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    } else if (user) {
      // إذا كان مستخدم عادي، يرى طلباته فقط
      q = query(collection(db, 'orders'), where('userId', '==', user.uid));
    } else {
      // زائر (بدون حساب) – يمكن إما إخفاء الطلبات أو استخدام guestId
      setOrders([]);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user, adminState?.isAdmin]);

  // دالة لإضافة طلب جديد
  const addOrder = async (orderData) => {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        userId: user?.uid || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  };

  // دالة لتحديث حالة الطلب
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };

  return (
    <OrdersContext.Provider value={{ orders, loading, addOrder, updateOrderStatus }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};