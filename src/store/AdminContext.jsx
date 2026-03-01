// store/AdminContext.jsx
import { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  fetchProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct,
  getProductsCount 
} from '../firebase/productsService';
import { 
  fetchOrders,
  addOrder,
  updateOrderStatus,
  deleteOrder,
  getOrdersCount
} from '../firebase/ordersService';
import { onAuthChange } from '../firebase/authService';

const AdminContext = createContext();

const initialState = {
  isAdmin: false,
  products: [],
  allProducts: [],
  orders: [],
  selectedProduct: null,
  isLoading: false,
  isLoadingMore: false,
  isLoadingOrders: false,
  hasMore: true,
  lastVisible: null,
  totalCount: 0,
  totalOrdersCount: 0,
  ordersError: null,
  error: null
};

const adminReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload, error: null };
    case 'SET_LOADING_MORE':
      return { ...state, isLoadingMore: action.payload };
    case 'SET_ORDERS_LOADING':
      return { ...state, isLoadingOrders: action.payload, ordersError: null };
    case 'SET_ERROR':
      return { ...state, isLoading: false, isLoadingMore: false, error: action.payload };
    case 'SET_ORDERS_ERROR':
      return { ...state, isLoadingOrders: false, ordersError: action.payload };
    case 'SET_PRODUCTS':
      return { 
        ...state, 
        products: action.payload.products, 
        lastVisible: action.payload.lastVisible,
        hasMore: action.payload.hasMore,
        isLoading: false 
      };
    case 'ADD_MORE_PRODUCTS':
      return { 
        ...state, 
        products: [...state.products, ...action.payload.products], 
        lastVisible: action.payload.lastVisible,
        hasMore: action.payload.hasMore,
        isLoadingMore: false 
      };
    case 'SET_ALL_PRODUCTS':
      return { ...state, allProducts: action.payload };
    case 'SET_TOTAL_COUNT':
      return { ...state, totalCount: action.payload };
    case 'SET_TOTAL_ORDERS_COUNT':
      return { ...state, totalOrdersCount: action.payload };
    case 'SET_ORDERS':
      return { 
        ...state, 
        orders: action.payload, 
        isLoadingOrders: false 
      };
    case 'ADD_PRODUCT':
      return { 
        ...state, 
        allProducts: [...state.allProducts, action.payload],
        products: [action.payload, ...state.products]
      };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        allProducts: state.allProducts.map(p =>
          p.id === action.payload.id ? action.payload : p
        ),
        products: state.products.map(p =>
          p.id === action.payload.id ? action.payload : p
        )
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        allProducts: state.allProducts.filter(p => p.id !== action.payload),
        products: state.products.filter(p => p.id !== action.payload)
      };
    case 'ADD_ORDER':
      return { 
        ...state, 
        orders: [action.payload, ...state.orders]
      };
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id 
            ? { ...order, status: action.payload.status, updatedAt: new Date().toISOString() }
            : order
        )
      };
    case 'DELETE_ORDER':
      return {
        ...state,
        orders: state.orders.filter(order => order.id !== action.payload)
      };
    case 'SET_ADMIN':
      return { ...state, isAdmin: action.payload };
    case 'RESET_PAGINATION':
      return { 
        ...state, 
        products: [],
        lastVisible: null,
        hasMore: true,
        isLoading: true 
      };
    default:
      return state;
  }
};

export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);
  const PAGE_SIZE = 12;

  // Listen to auth state
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      dispatch({ type: 'SET_ADMIN', payload: !!user });
    });
    return unsubscribe;
  }, []);

  // Load products from Firestore
  useEffect(() => {
    const loadProducts = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        const count = await getProductsCount();
        dispatch({ type: 'SET_TOTAL_COUNT', payload: count });
      } catch (error) {
        console.error('Error getting count:', error);
      }
      
      try {
        const result = await fetchProducts(null, PAGE_SIZE);
        dispatch({ type: 'SET_PRODUCTS', payload: result });
        
        if (result.hasMore) {
          loadAllProductsForAdmin();
        } else {
          dispatch({ type: 'SET_ALL_PRODUCTS', payload: result.products });
        }
      } catch (error) {
        console.error('Error loading products:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    };
    
    loadProducts();
  }, []);

  // Load orders from Firestore (for admin only)
  const loadOrders = async () => {
    if (!state.isAdmin) return;
    
    dispatch({ type: 'SET_ORDERS_LOADING', payload: true });
    try {
      const orders = await fetchOrders();
      dispatch({ type: 'SET_ORDERS', payload: orders });
      
      const count = await getOrdersCount();
      dispatch({ type: 'SET_TOTAL_ORDERS_COUNT', payload: count });
    } catch (error) {
      console.error('Error loading orders:', error);
      dispatch({ type: 'SET_ORDERS_ERROR', payload: error.message });
    }
  };

  // Load orders when admin status changes
  useEffect(() => {
    if (state.isAdmin) {
      loadOrders();
    }
  }, [state.isAdmin]);

  // Load all products for admin
  const loadAllProductsForAdmin = async () => {
    try {
      let allProducts = [];
      let lastVisible = null;
      let hasMore = true;
      
      while (hasMore) {
        const result = await fetchProducts(lastVisible, 50);
        allProducts = [...allProducts, ...result.products];
        lastVisible = result.lastVisible;
        hasMore = result.hasMore;
      }
      
      dispatch({ type: 'SET_ALL_PRODUCTS', payload: allProducts });
    } catch (error) {
      console.error('Error loading all products:', error);
    }
  };

  // Load more products
  const loadMoreProducts = async () => {
    if (!state.hasMore || state.isLoadingMore) return;
    
    dispatch({ type: 'SET_LOADING_MORE', payload: true });
    
    try {
      const result = await fetchProducts(state.lastVisible, PAGE_SIZE);
      dispatch({ type: 'ADD_MORE_PRODUCTS', payload: result });
    } catch (error) {
      console.error('Error loading more products:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  // Async actions
  const actions = {
    // Product actions
    addProduct: async (productData) => {
      try {
        const newProduct = await addProduct(productData);
        dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
        
        const count = await getProductsCount();
        dispatch({ type: 'SET_TOTAL_COUNT', payload: count });
        
        return newProduct;
      } catch (error) {
        console.error('Error adding product:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },
    
    updateProduct: async (id, productData) => {
      try {
        const updated = await updateProduct(id, productData);
        dispatch({ type: 'UPDATE_PRODUCT', payload: updated });
        return updated;
      } catch (error) {
        console.error('Error updating product:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },
    
    deleteProduct: async (id) => {
      try {
        await deleteProduct(id);
        dispatch({ type: 'DELETE_PRODUCT', payload: id });
        
        const count = await getProductsCount();
        dispatch({ type: 'SET_TOTAL_COUNT', payload: count });
        
        return id;
      } catch (error) {
        console.error('Error deleting product:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },
    
    // Order actions
    addOrder: async (orderData) => {
      try {
        const newOrder = await addOrder(orderData);
        dispatch({ type: 'ADD_ORDER', payload: newOrder });
        
        const count = await getOrdersCount();
        dispatch({ type: 'SET_TOTAL_ORDERS_COUNT', payload: count });
        
        return newOrder;
      } catch (error) {
        console.error('Error adding order:', error);
        throw error;
      }
    },
    
    updateOrderStatus: async (id, status) => {
      try {
        await updateOrderStatus(id, status);
        dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { id, status } });
      } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
      }
    },
    
    deleteOrder: async (id) => {
      try {
        await deleteOrder(id);
        dispatch({ type: 'DELETE_ORDER', payload: id });
        
        const count = await getOrdersCount();
        dispatch({ type: 'SET_TOTAL_ORDERS_COUNT', payload: count });
      } catch (error) {
        console.error('Error deleting order:', error);
        throw error;
      }
    },
    
    reloadOrders: loadOrders,
    loadMoreProducts,
    resetPagination: () => dispatch({ type: 'RESET_PAGINATION' })
  };

  return (
    <AdminContext.Provider value={{ 
      adminState: state, 
      adminDispatch: dispatch, 
      actions,
      pageSize: PAGE_SIZE 
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};