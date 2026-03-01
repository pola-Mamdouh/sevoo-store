// src/pages/CartPage.jsx
import { useCart } from "../store/CartContext";
import { useUser } from "../store/UserContext";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

const CartPage = () => {
  const { cartItems, totalPrice } = useCart();
  const { user, loading } = useUser();

  const handleOrder = () => {
    // بيانات المستخدم
    const userName = user?.displayName || 'عميل';
    const userEmail = user?.email || '';
    
    // تاريخ الطلب
    const orderDate = new Date().toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // تفاصيل الطلب
    const orderDetails = cartItems
      .map(
        (item) =>
          `🛍️ ${item.name}\n   ${item.quantity} × ${item.price} جنيه = ${item.price * item.quantity} جنيه`
      )
      .join("\n\n");

    // إنشاء رسالة واتساب
    const message = `
👤 *العميل:* ${userName}
📧 ${userEmail}
📅 ${orderDate}

🛒 *تفاصيل الطلب:*
${orderDetails}

💰 *الإجمالي:* ${totalPrice} جنيه
    `;

    const url = `https://wa.me/201140385268?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-2">السلة فارغة</h2>
        <p className="text-text-muted mb-6">أضف منتجات إلى السلة أولاً</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          تسوق الآن
        </Link>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      <div className="space-y-4">
        {/* معلومات المستخدم */}
        {user && (
          <div className="bg-surface rounded-(--radius-card) p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{user.displayName || 'مستخدم'}</p>
                <p className="text-xs text-text-muted">{user.email}</p>
              </div>
            </div>
          </div>
        )}
        
        <CartSummary 
          total={totalPrice} 
          subtotal={totalPrice} 
          shipping={totalPrice > 500 ? 0 : 50} 
          onOrder={handleOrder} 
        />
        
        {!user && (
          <div className="bg-warning/10 text-warning p-4 rounded-lg text-sm border border-warning/20">
            <p className="font-medium mb-1">⚠️ تسجيل الدخول مطلوب</p>
            <p className="mb-3">يجب تسجيل الدخول لإتمام الطلب</p>
            <Link
              to="/auth"
              className="block text-center bg-warning text-white px-4 py-2 rounded-lg hover:bg-warning/90 transition-colors"
            >
              تسجيل الدخول
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;