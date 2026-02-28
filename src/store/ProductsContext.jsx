import { createContext, useContext, useReducer } from "react";
import productsData from "../data/products";

// Context
const ProductsContext = createContext();

// Reducer
const productsReducer = (state, action) => {
  switch (action.type) {
    case "SET_PRODUCTS":
      return {
        ...state,
        products: action.payload,
      };

    default:
      return state;
  }
};

// Initial State
const initialState = {
  products: productsData,
};

// Provider
export const ProductsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productsReducer, initialState);

  return (
    <ProductsContext.Provider
      value={{
        products: state.products,
        dispatch,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

// Custom Hook
export const useProducts = () => {
  return useContext(ProductsContext);
};