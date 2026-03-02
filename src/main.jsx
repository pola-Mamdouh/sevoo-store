// main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { CartProvider } from './store/CartContext'
import { OrdersProvider } from './store/OrdersContext'
import { UserProvider } from './store/UserContext' 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>     
        <CartProvider>
          <OrdersProvider>
            <App />
          </OrdersProvider>
        </CartProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
)