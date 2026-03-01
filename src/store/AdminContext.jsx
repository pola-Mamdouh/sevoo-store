// store/AdminContext.jsx
import { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  fetchProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct,
  getProductsCount
} from '../firebase/productsService';
import { onAuthChange } from '../firebase/authService';

const AdminContext = createContext();

const initialState = {
  isAdmin: false,
  products: [],
  allProducts: [], // جميع المنتجات للإدارة (بدون pagination)
  selectedProduct: null,
  isLoading: false,
  isLoadingMore: false,
  hasMore: true,
  lastVisible: null,
  totalCount: 0,
  error: null
};

const adminReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload, error: null };
    case 'SET_LOADING_MORE':
      return { ...state, isLoadingMore: action.payload };
    case 'SET_ERROR':
      return { ...state, isLoading: false, isLoadingMore: false, error: action.payload };
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
    case 'ADD_PRODUCT':
      return { 
        ...state, 
        allProducts: [...state.allProducts, action.payload],
        products: [action.payload, ...state.products] // أضف في الأول
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
  const PAGE_SIZE = 12; // عدد المنتجات في كل صفحة

  // Listen to auth state
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      dispatch({ type: 'SET_ADMIN', payload: !!user });
    });
    return unsubscribe;
  }, []);

  // Load initial products
  useEffect(() => {
    const loadInitialProducts = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // جلب العدد الكلي للمنتجات
      try {
        const count = await getProductsCount();
        dispatch({ type: 'SET_TOTAL_COUNT', payload: count });
      } catch (error) {
        console.error('Error getting count:', error);
      }
      
      // جلب الصفحة الأولى
      try {
        const result = await fetchProducts(null, PAGE_SIZE);
        dispatch({ type: 'SET_PRODUCTS', payload: result });
        
        // جلب جميع المنتجات للإدارة (لو العدد قليل)
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
    
    loadInitialProducts();
  }, []);

  // جلب جميع المنتجات للإدارة (مرة واحدة)
  const loadAllProductsForAdmin = async () => {
    try {
      let allProducts = [];
      let lastVisible = null;
      let hasMore = true;
      
      while (hasMore) {
        const result = await fetchProducts(lastVisible, 50); // جيب 50 كل مرة
        allProducts = [...allProducts, ...result.products];
        lastVisible = result.lastVisible;
        hasMore = result.hasMore;
      }
      
      dispatch({ type: 'SET_ALL_PRODUCTS', payload: allProducts });
    } catch (error) {
      console.error('Error loading all products:', error);
    }
  };

  // تحميل المزيد من المنتجات
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
  addProduct: async (productData) => {
       
    try {
      const newProduct = await addProduct(productData);
      dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
      
      // تحديث العدد الكلي
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
    // من غير ما تعمل setLoading
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
    // من غير ما تعمل setLoading
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
  
  loadMoreProducts: async () => {
    if (!state.hasMore || state.isLoadingMore) return;
    
    dispatch({ type: 'SET_LOADING_MORE', payload: true });
    
    try {
      const result = await fetchProducts(state.lastVisible, PAGE_SIZE);
      dispatch({ type: 'ADD_MORE_PRODUCTS', payload: result });
    } catch (error) {
      console.error('Error loading more products:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  },
  
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