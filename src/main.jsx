// main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { UserProvider } from './store/UserContext'
import { AdminProvider } from './store/AdminContext'    // 👈 AdminProvider قبل OrdersProvider
import { CartProvider } from './store/CartContext'
import { OrdersProvider } from './store/OrdersContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <AdminProvider>          {/* 👈 AdminProvider هنا عشان OrdersProvider يقدر يستخدم useAdmin */}
          <CartProvider>
            <OrdersProvider>
              <App />
            </OrdersProvider>
          </CartProvider>
        </AdminProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
)