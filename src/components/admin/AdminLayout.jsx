// components/admin/AdminLayout.jsx
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  Settings, 
  LogOut,
  Menu,
  X,
  ShoppingBag 
} from 'lucide-react';
import { useState } from 'react';
import { useAdmin } from '../../store/AdminContext';
import { logoutUser } from '../../firebase/authService';

const AdminLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { adminDispatch } = useAdmin();

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'الرئيسية', end: true },
    { path: '/admin/products', icon: Package, label: 'المنتجات' },
    { path: '/admin/products/new', icon: PlusCircle, label: 'إضافة منتج' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'الطلبات' }, 
    { path: '/admin/settings', icon: Settings, label: 'الإعدادات' },

  ];

  const isActive = (path, end = false) => {
    if (end) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      adminDispatch({ type: 'SET_ADMIN', payload: false });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 bg-primary text-white p-2 rounded-lg"
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 right-0 h-full w-64 bg-surface shadow-lg z-40
        transform transition-transform duration-300 lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-sm text-text-muted mt-1">لوحة التحكم</p>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-6 py-3 text-sm font-medium
                transition-colors relative
                ${isActive(item.path, item.end)
                  ? 'text-primary bg-primary/5 before:absolute before:right-0 before:top-0 before:h-full before:w-1 before:bg-primary'
                  : 'text-text-muted hover:text-text-primary hover:bg-gray-50'
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-text-muted hover:text-danger transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:mr-64 min-h-screen">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;