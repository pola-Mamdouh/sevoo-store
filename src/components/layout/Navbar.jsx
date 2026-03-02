// src/components/layout/Navbar.jsx
import { Link } from "react-router-dom";
import { useCart } from "../../store/CartContext";
import { useOrders } from "../../store/OrdersContext";
import { useUser } from "../../store/UserContext";
import { ShoppingCart, User, LogOut, Search, Package } from 'lucide-react';
import { useState } from 'react';
import Button from "../ui/Button";
import { logoutUser } from '../../firebase/authService';

const Navbar = () => {
  const { cartItems } = useCart();
  const { orders } = useOrders();
  const { user, loading } = useUser();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="sticky top-0 bg-surface/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 items-center h-16">
          {/* الجانب الأيسر - أيقونة البحث */}
          <div className="flex justify-start">
            <Button
              variant="ghost"
              size="sm"
              className="!p-2 hidden md:flex"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="w-5 h-5" />
            </Button>
          </div>

          {/* المنتصف - اللوجو */}
          <div className="flex justify-center">
            <Link 
              to="/" 
              className="font-heading text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            >
              SeVoOo
            </Link>
          </div>

          {/* الجانب الأيمن - أيقونات */}
          <div className="flex justify-end items-center gap-1">
            {loading ? (
              <div className="w-8 h-8 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : user ? (
              <>
                <span className="hidden md:block text-sm text-text-muted ml-2">
                  {user.displayName || 'مستخدم'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="!p-2"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="!p-2" title="تسجيل الدخول">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            )}

            {/* أيقونة الطلبات */}
            <Link to="/my-orders">
              <Button variant="ghost" size="sm" className="!p-2 relative" title="طلباتي">
                <Package className="w-5 h-5" />
                {orders.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1">
                    {orders.length}
                  </span>
                )}
              </Button>
            </Link>

            {/* أيقونة السلة */}
            <Link to="/cart">
              <Button variant="ghost" size="sm" className="!p-2 relative" title="سلة التسوق">
                <ShoppingCart className="w-5 h-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1">
                    {cartItems.length}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* شريط البحث في الموبايل */}
        {isSearchOpen && (
          <div className="md:hidden py-3 border-t border-gray-100">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
              <input
                type="text"
                placeholder="ابحث عن منتجات..."
                className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;