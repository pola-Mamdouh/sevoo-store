// store/OrdersContext.jsx
import { createContext, useContext, useReducer, useEffect } from 'react';

const OrdersContext = createContext();

const initialState = {
  orders: JSON.parse(localStorage.getItem('orders')) || []
};

const ordersReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ORDER':
      const newOrders = [action.payload, ...state.orders];
      localStorage.setItem('orders', JSON.stringify(newOrders));
      return { ...state, orders: newOrders };

    case 'UPDATE_ORDER_STATUS':
      const updatedOrders = state.orders.map(order =>
        order.id === action.payload.orderId
          ? { ...order, status: action.payload.status }
          : order
      );
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      return { ...state, orders: updatedOrders };

    default:
      return state;
  }
};

export const OrdersProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ordersReducer, initialState);

  return (
    <OrdersContext.Provider value={{ orders: state.orders, ordersDispatch: dispatch }}>
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