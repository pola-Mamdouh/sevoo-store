// store/AdminContext.jsx
import { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  fetchProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct 
} from '../firebase/productsService';
import { onAuthChange } from '../firebase/authService';

const AdminContext = createContext();

const initialState = {
  isAdmin: false,
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null
};
// store/AdminContext.jsx - update the reducer cases

const adminReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload, isLoading: false };
    case 'ADD_PRODUCT':
      return { 
        ...state, 
        products: [...state.products, action.payload], 
        isLoading: false 
      };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.payload.id ? action.payload : p
        ),
        isLoading: false  
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload),
        isLoading: false  
      };
    case 'SET_ADMIN':
      return { ...state, isAdmin: action.payload };
    default:
      return state;
  }
};
export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

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
        const products = await fetchProducts();
        dispatch({ type: 'SET_PRODUCTS', payload: products });
      } catch (error) {
        console.error('Error loading products:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    };
    loadProducts();
  }, []);

  // Async actions
  const actions = {
    addProduct: async (productData) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const newProduct = await addProduct(productData);
        dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
      } catch (error) {
        console.error('Error adding product:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },
    updateProduct: async (id, productData) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const updated = await updateProduct(id, productData);
        dispatch({ type: 'UPDATE_PRODUCT', payload: updated });
      } catch (error) {
        console.error('Error updating product:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    },
    deleteProduct: async (id) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        await deleteProduct(id);
        dispatch({ type: 'DELETE_PRODUCT', payload: id });
      } catch (error) {
        console.error('Error deleting product:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
        throw error;
      }
    }
  };

  return (
    <AdminContext.Provider value={{ adminState: state, adminDispatch: dispatch, actions }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};