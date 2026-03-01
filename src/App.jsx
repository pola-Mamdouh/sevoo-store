// src/App.jsx
import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import { AdminProvider } from './store/AdminContext'
import AdminRoute from './components/AdminRoute'

// Public Pages
const HomePage = lazy(() => import('./pages/Home'))
const ProductDetailsPage = lazy(() => import('./pages/ProductDetails'))
const CartPage = lazy(() => import('./pages/CartPage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const NotFoundPage = lazy(() => import('./pages/NotFound'))

// Admin Pages
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'))
const AdminProductForm = lazy(() => import('./pages/admin/AdminProductForm'))
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders')) // 👈 أضف هذا السطر

function App() {
  return (
    <AdminProvider>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-muted">جاري التحميل...</p>
          </div>
        </div>
      }>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="product/:productId" element={<ProductDetailsPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="auth" element={<AuthPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
            <Route path="products/new" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
            <Route path="products/edit/:productId" element={<AdminRoute><AdminProductForm /></AdminRoute>} />
            <Route path="orders" element={<AdminRoute><AdminOrders /></AdminRoute>} /> {/* 👈 أضف هذا السطر */}
          </Route>
        </Routes>
      </Suspense>
    </AdminProvider>
  )
}

export default App