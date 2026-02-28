import { createContext, useContext, useEffect, useReducer } from "react";
import { cartReducer } from "./cartReducer";

// Context
const CartContext = createContext();

// Initial State
const initialState = {
  items: JSON.parse(localStorage.getItem("cartItems")) || [],
};

// Provider
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(state.items));
  }, [state.items]);

  // Total Price
  const totalPrice = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems: state.items,
        totalPrice,
        dispatch,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook
export const useCart = () => {
  return useContext(CartContext);
};