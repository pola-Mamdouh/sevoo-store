// src/pages/CartPage.jsx
import { useCart } from "../store/CartContext";
import { useUser } from "../store/UserContext";
import { useAdmin } from "../store/AdminContext";
import CartItem from "../components/cart/CartItem";
import { Link } from "react-router-dom";
import { User, Phone, MessageCircle } from "lucide-react";
import { useState } from "react";
import Popup from "../components/ui/Popup";

const CartPage = () => {
  const { cartItems, totalPrice, dispatch } = useCart();
  const { user, loading: userLoading } = useUser(); // 👈 أضف user و loading
  const { actions } = useAdmin();
  
  const [orderLoading, setOrderLoading] = useState(false);
  const [popup, setPopup] = useState(null);
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [showGuestForm] = useState(!user);

  // إذا كان user في حالة تحميل
  if (userLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleOrder = async () => {
    setOrderLoading(true);
    
    try {
      // تجهيز بيانات الطلب
      const orderData = {
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        total: totalPrice,
        subtotal: totalPrice,
        shipping: totalPrice > 500 ? 0 : 50,
        customer: user ? {
          uid: user.uid,
          name: user.displayName || 'مستخدم',
          email: user.email
        } : {
          name: guestInfo.name,
          phone: guestInfo.phone,
          message: guestInfo.message,
          isGuest: true
        },
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // حفظ الطلب في Firebase
      await actions.addOrder(orderData);

      // رسالة واتساب
      const message = user 
        ? generateWhatsAppMessage(orderData, user)
        : generateGuestWhatsAppMessage(orderData, guestInfo);

      const url = `https://wa.me/201140385268?text=${encodeURIComponent(message)}`;
      
      // مسح السلة
      dispatch({ type: 'CLEAR_CART' });
      
      // فتح واتساب
      window.open(url, "_blank");
      
      setPopup({
        type: 'success',
        title: 'تم إرسال الطلب',
        message: 'سيتم التواصل معك قريباً'
      });
      
    } catch (error) {
      console.error('Error placing order:', error);
      setPopup({
        type: 'error',
        title: 'خطأ',
        message: 'حدث خطأ أثناء إرسال الطلب'
      });
    } finally {
      setOrderLoading(false);
    }
  };

  const generateWhatsAppMessage = (orderData, user) => {
    const itemsList = orderData.items.map(item => 
      `🛍️ ${item.name}\n   ${item.quantity} × ${item.price} جنيه = ${item.price * item.quantity} جنيه`
    ).join('\n\n');

    return `
👤 *العميل:* ${user.displayName || 'مستخدم'}
📧 ${user.email}
📅 ${new Date().toLocaleDateString('ar-EG')}

🛒 *تفاصيل الطلب:*
${itemsList}

💰 *الإجمالي:* ${orderData.total} جنيه
🚚 *الشحن:* ${orderData.shipping} جنيه
💵 *المبلغ النهائي:* ${orderData.total + orderData.shipping} جنيه
    `;
  };

  const generateGuestWhatsAppMessage = (orderData, guestInfo) => {
    const itemsList = orderData.items.map(item => 
      `🛍️ ${item.name}\n   ${item.quantity} × ${item.price} جنيه = ${item.price * item.quantity} جنيه`
    ).join('\n\n');

    return `
👤 *العميل:* ${guestInfo.name || 'زائر'}
📞 *الهاتف:* ${guestInfo.phone || 'غير مدخل'}
💬 *رسالة:* ${guestInfo.message || 'لا يوجد'}

🛒 *تفاصيل الطلب:*
${itemsList}

💰 *الإجمالي:* ${orderData.total} جنيه
🚚 *الشحن:* ${orderData.shipping} جنيه
💵 *المبلغ النهائي:* ${orderData.total + orderData.shipping} جنيه
    `;
  };

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
        {/* معلومات المستخدم - لو مسجل دخول */}
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

        {/* نموذج الزائر - لو مش مسجل دخول */}
        {!user && showGuestForm && (
          <div className="bg-surface rounded-(--radius-card) p-4 border border-gray-100 space-y-3">
            <h3 className="font-medium mb-2">معلومات التوصيل</h3>
            
            <div>
              <label className="block text-xs text-text-muted mb-1">الاسم</label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                <input
                  type="text"
                  value={guestInfo.name}
                  onChange={(e) => setGuestInfo({...guestInfo, name: e.target.value})}
                  className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                  placeholder="محمد أحمد"
                  disabled={orderLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-text-muted mb-1">رقم الهاتف</label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                <input
                  type="tel"
                  value={guestInfo.phone}
                  onChange={(e) => setGuestInfo({...guestInfo, phone: e.target.value})}
                  className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                  placeholder="01234567890"
                  disabled={orderLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-text-muted mb-1">رسالة (اختياري)</label>
              <div className="relative">
                <MessageCircle className="absolute right-3 top-3 text-text-muted w-4 h-4" />
                <textarea
                  value={guestInfo.message}
                  onChange={(e) => setGuestInfo({...guestInfo, message: e.target.value})}
                  className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm resize-none"
                  placeholder="أي ملاحظات للطلب..."
                  rows="2"
                  disabled={orderLoading}
                />
              </div>
            </div>

            <Link to="/auth" className="text-xs text-accent hover:underline block text-center mt-2">
              أو سجل دخول لحفظ بياناتك
            </Link>
          </div>
        )}

        {/* زر إتمام الطلب */}
        <div className="bg-surface rounded-(--radius-card) p-6 shadow-(--shadow-card) border border-gray-100 sticky top-24">
          <h3 className="font-heading font-semibold text-lg mb-4">ملخص الطلب</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">المجموع الفرعي</span>
              <span className="font-medium">{totalPrice} جنيه</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">الشحن</span>
              <span className="font-medium">{totalPrice > 500 ? 'مجاني' : '50 جنيه'}</span>
            </div>
            <div className="border-t border-gray-100 pt-3 mt-3">
              <div className="flex justify-between font-bold text-lg">
                <span>الإجمالي</span>
                <span className="text-primary">{totalPrice + (totalPrice > 500 ? 0 : 50)} جنيه</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleOrder}
            disabled={orderLoading || (!user && (!guestInfo.name || !guestInfo.phone))}
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
          >
            {orderLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                جاري إرسال الطلب...
              </>
            ) : (
              <>
                إتمام الطلب عبر واتساب
              </>
            )}
          </button>
          
          {!user && (!guestInfo.name || !guestInfo.phone) && (
            <p className="text-xs text-danger text-center mt-2">
              يرجى إدخال الاسم ورقم الهاتف
            </p>
          )}
          
          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-text-muted">
            <span>توصيل مجاني للطلبات فوق 500 جنيه</span>
          </div>
        </div>
      </div>

      {/* Popup */}
      {popup && (
        <Popup
          type={popup.type}
          title={popup.title}
          message={popup.message}
          onClose={() => setPopup(null)}
          autoClose={3000}
        />
      )}
    </div>
  );
};

export default CartPage;