import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import { AdminProvider } from './store/AdminContext'
import AdminRoute from './components/AdminRoute'

// Public Pages
const HomePage = lazy(() => import('./pages/Home'))
const ProductDetailsPage = lazy(() => import('./pages/ProductDetails'))
const CartPage = lazy(() => import('./pages/CartPage'))
const NotFoundPage = lazy(() => import('./pages/NotFound'))

// Admin Pages
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'))
const AdminProductForm = lazy(() => import('./pages/admin/AdminProductForm'))

function App() {
  return (
    <AdminProvider>
      <Suspense fallback={<div className="p-8 text-center">جاري التحميل...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="product/:productId" element={<ProductDetailsPage />} />
            <Route path="cart" element={<CartPage />} />
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
          </Route>
        </Routes>
      </Suspense>
    </AdminProvider>
  )
}

export default App