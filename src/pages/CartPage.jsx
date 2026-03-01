// src/pages/CartPage.jsx
import { useState } from "react";
import { useCart } from "../store/CartContext";
import { useUser } from "../store/UserContext";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import { Link } from "react-router-dom";
import { User, MessageSquare } from "lucide-react";

const CartPage = () => {
  const { cartItems, totalPrice } = useCart();
  const { user, loading } = useUser();
  const [guestName, setGuestName] = useState("");
  const [guestMessage, setGuestMessage] = useState("");

  const handleOrder = () => {
    // تجهيز بيانات العميل
    const userName = user ? user.displayName || "عميل" : guestName.trim() || "عميل";
    const userEmail = user ? user.email : "";
    const additionalMessage = guestMessage.trim();

    const orderDate = new Date().toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const orderDetails = cartItems
      .map(
        (item) =>
          `🛍️ ${item.name}\n   ${item.quantity} × ${item.price} جنيه = ${
            item.price * item.quantity
          } جنيه`
      )
      .join("\n\n");

    let message = `👤 *العميل:* ${userName}\n`;
    if (userEmail) message += `📧 ${userEmail}\n`;
    message += `📅 ${orderDate}\n\n`;
    message += `🛒 *تفاصيل الطلب:*\n${orderDetails}\n\n`;
    message += `💰 *الإجمالي:* ${totalPrice} جنيه\n`;
    if (additionalMessage) {
      message += `\n📝 *رسالة إضافية:*\n${additionalMessage}`;
    }

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
        {/* معلومات المستخدم إذا كان مسجل دخول */}
        {user && (
          <div className="bg-surface rounded-(--radius-card) p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{user.displayName || "مستخدم"}</p>
                <p className="text-xs text-text-muted">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* حقول الإدخال للزوار غير المسجلين */}
        {!user && (
          <div className="bg-surface rounded-(--radius-card) p-4 border border-gray-100 space-y-4">
            <h3 className="font-heading font-semibold text-lg mb-2">معلومات الطلب</h3>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                الاسم <span className="text-accent">(اختياري)</span>
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                  placeholder="أدخل اسمك"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                رسالة إضافية <span className="text-accent">(اختياري)</span>
              </label>
              <div className="relative">
                <MessageSquare className="absolute right-3 top-3 text-text-muted w-4 h-4" />
                <textarea
                  value={guestMessage}
                  onChange={(e) => setGuestMessage(e.target.value)}
                  rows="3"
                  className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm resize-none"
                  placeholder="أي ملاحظات أو طلبات خاصة..."
                />
              </div>
            </div>
          </div>
        )}

        <CartSummary
          total={totalPrice}
          subtotal={totalPrice}
          shipping={totalPrice > 500 ? 0 : 50}
          onOrder={handleOrder}
          user={user}
          guestName={guestName} // نمرر البيانات لـ CartSummary (اختياري)
        />
      </div>
    </div>
  );
};

export default CartPage;