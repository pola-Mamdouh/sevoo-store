// src/pages/CartPage.jsx
import { useCart } from "../store/CartContext";
import { useUser } from "../store/UserContext";
import { useOrders } from "../store/OrdersContext";
import CartItem from "../components/cart/CartItem";
import { Link, useNavigate } from "react-router-dom";
import { User, Phone, MessageCircle, MapPin, Home, Navigation } from "lucide-react";
import { useState } from "react";
import Popup from "../components/ui/Popup";

const CartPage = () => {
  const { cartItems, totalPrice, dispatch } = useCart();
  const { user, loading: userLoading } = useUser();
  const { addOrder } = useOrders();
  const navigate = useNavigate();

  const [orderLoading, setOrderLoading] = useState(false);
  const [popup, setPopup] = useState(null);
  const [guestInfo, setGuestInfo] = useState({
    name: "",
    phone: "",
    message: "",
    address: "",
    city: "",
    locationLink: ""
  });

  const shipping = totalPrice > 500 ? 0 : 50;
  const finalTotal = totalPrice + shipping;

  if (userLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const link = `https://www.google.com/maps?q=${latitude},${longitude}`;
          setGuestInfo({ ...guestInfo, locationLink: link });
          setPopup({
            type: "success",
            title: "تم تحديد الموقع",
            message: "تم إضافة رابط الموقع بنجاح"
          });
        },
        (error) => {
          setPopup({
            type: "error",
            title: "خطأ",
            message: "لم نتمكن من تحديد موقعك، يرجى إدخال العنوان يدوياً"
          });
        }
      );
    } else {
      setPopup({
        type: "error",
        title: "غير مدعوم",
        message: "المتصفح لا يدعم تحديد الموقع الجغرافي"
      });
    }
  };

  const handleOrder = async () => {
    if (!user && (!guestInfo.name || !guestInfo.phone || !guestInfo.address)) {
      setPopup({
        type: "error",
        title: "خطأ",
        message: "يرجى إدخال الاسم ورقم الهاتف والعنوان",
      });
      return;
    }

    setOrderLoading(true);

    const customer = user
      ? {
          name: user.displayName || "مستخدم",
          phone: user.phoneNumber || "غير متوفر",
          email: user.email,
          address: guestInfo.address || "",
          city: guestInfo.city || "",
          locationLink: guestInfo.locationLink || ""
        }
      : {
          name: guestInfo.name,
          phone: guestInfo.phone,
          message: guestInfo.message,
          address: guestInfo.address,
          city: guestInfo.city,
          locationLink: guestInfo.locationLink
        };

    const newOrder = {
      items: cartItems,
      subtotal: totalPrice,
      shipping,
      total: finalTotal,
      date: new Date().toISOString(),
      status: "قيد الانتظار",
      customer,
      userId: user?.uid || null,
      guestId: !user ? `guest_${Date.now()}` : null,
    };

    // رسالة واتساب مع عرض اللون والعنوان
    const itemsList = cartItems
      .map((item) => {
        let itemDetails = `${item.name}`;
        if (item.selectedColor) {
          itemDetails += ` (${item.selectedColor.name})`;
        }
        itemDetails += ` × ${item.quantity} = ${item.price * item.quantity} جنيه`;
        return itemDetails;
      })
      .join("\n");

    const addressInfo = `
🏠 المدينة: ${customer.city || "غير محدد"}
📍 العنوان: ${customer.address || "غير محدد"}
🗺️ رابط الموقع: ${customer.locationLink || "لا يوجد"}`;

    const customerInfo = user
      ? `👤 الاسم: ${customer.name}\n📧 البريد: ${customer.email || "غير متوفر"}${addressInfo}`
      : `👤 الاسم: ${customer.name}\n📞 الهاتف: ${customer.phone}\n💬 رسالة: ${customer.message || "لا يوجد"}${addressInfo}`;

    const message = `🛍️ طلب جديد:\n\n${itemsList}\n\n💰 الإجمالي: ${finalTotal} جنيه\n🚚 الشحن: ${shipping === 0 ? "مجاني" : shipping + " جنيه"}\n\n${customerInfo}`;

    const whatsappUrl = `https://wa.me/201140385268?text=${encodeURIComponent(message)}`;

    try {
      const orderId = await addOrder(newOrder);
      window.open(whatsappUrl, "_blank");
      dispatch({ type: "CLEAR_CART" });

      setPopup({
        type: "success",
        title: "تم إرسال الطلب",
        message: "رقم الطلب: " + orderId,
      });

      setTimeout(() => {
        navigate("/my-orders");
      }, 2000);
    } catch (error) {
      setPopup({
        type: "error",
        title: "خطأ",
        message: "حدث خطأ أثناء حفظ الطلب",
      });
    } finally {
      setOrderLoading(false);
    }
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

        {!user && (
          <div className="bg-surface rounded-(--radius-card) p-4 border border-gray-100 space-y-3">
            <h3 className="font-medium mb-2">معلومات التوصيل</h3>

            <div>
              <label className="block text-xs text-text-muted mb-1">الاسم</label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                <input
                  type="text"
                  value={guestInfo.name}
                  onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
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
                  onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                  className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                  placeholder="01234567890"
                  disabled={orderLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-text-muted mb-1">المدينة</label>
              <div className="relative">
                <Home className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                <input
                  type="text"
                  value={guestInfo.city}
                  onChange={(e) => setGuestInfo({ ...guestInfo, city: e.target.value })}
                  className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                  placeholder="مثال: القاهرة"
                  disabled={orderLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-text-muted mb-1">العنوان بالتفصيل</label>
              <div className="relative">
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                <input
                  type="text"
                  value={guestInfo.address}
                  onChange={(e) => setGuestInfo({ ...guestInfo, address: e.target.value })}
                  className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                  placeholder="الشارع، رقم المبنى، المنطقة..."
                  disabled={orderLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-text-muted mb-1">رابط الموقع (اختياري)</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Navigation className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                  <input
                    type="url"
                    value={guestInfo.locationLink}
                    onChange={(e) => setGuestInfo({ ...guestInfo, locationLink: e.target.value })}
                    className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                    placeholder="رابط خرائط جوجل"
                    disabled={orderLoading}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={orderLoading}
                  className="px-3 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm whitespace-nowrap"
                >
                  حدد موقعي
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-text-muted mb-1">رسالة (اختياري)</label>
              <div className="relative">
                <MessageCircle className="absolute right-3 top-3 text-text-muted w-4 h-4" />
                <textarea
                  value={guestInfo.message}
                  onChange={(e) => setGuestInfo({ ...guestInfo, message: e.target.value })}
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

        {/* إذا كان المستخدم مسجل دخول، نعرض له نفس الحقول ولكن غير مطالب بإدخال الاسم والهاتف */}
        {user && (
          <div className="bg-surface rounded-(--radius-card) p-4 border border-gray-100 space-y-3">
            <h3 className="font-medium mb-2">عنوان التوصيل</h3>

            <div>
              <label className="block text-xs text-text-muted mb-1">المدينة</label>
              <div className="relative">
                <Home className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                <input
                  type="text"
                  value={guestInfo.city}
                  onChange={(e) => setGuestInfo({ ...guestInfo, city: e.target.value })}
                  className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                  placeholder="مثال: القاهرة"
                  disabled={orderLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-text-muted mb-1">العنوان بالتفصيل</label>
              <div className="relative">
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                <input
                  type="text"
                  value={guestInfo.address}
                  onChange={(e) => setGuestInfo({ ...guestInfo, address: e.target.value })}
                  className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                  placeholder="الشارع، رقم المبنى، المنطقة..."
                  disabled={orderLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-text-muted mb-1">رابط الموقع (اختياري)</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Navigation className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                  <input
                    type="url"
                    value={guestInfo.locationLink}
                    onChange={(e) => setGuestInfo({ ...guestInfo, locationLink: e.target.value })}
                    className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm"
                    placeholder="رابط خرائط جوجل"
                    disabled={orderLoading}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={orderLoading}
                  className="px-3 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm whitespace-nowrap"
                >
                  حدد موقعي
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-text-muted mb-1">رسالة (اختياري)</label>
              <div className="relative">
                <MessageCircle className="absolute right-3 top-3 text-text-muted w-4 h-4" />
                <textarea
                  value={guestInfo.message}
                  onChange={(e) => setGuestInfo({ ...guestInfo, message: e.target.value })}
                  className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none text-sm resize-none"
                  placeholder="أي ملاحظات للطلب..."
                  rows="2"
                  disabled={orderLoading}
                />
              </div>
            </div>
          </div>
        )}

        <div className="bg-surface rounded-(--radius-card) p-6 shadow-(--shadow-card) border border-gray-100 sticky top-24">
          <h3 className="font-heading font-semibold text-lg mb-4">ملخص الطلب</h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">المجموع الفرعي</span>
              <span className="font-medium">{totalPrice} جنيه</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">الشحن</span>
              <span className="font-medium">{shipping === 0 ? "مجاني" : `${shipping} جنيه`}</span>
            </div>
            <div className="border-t border-gray-100 pt-3 mt-3">
              <div className="flex justify-between font-bold text-lg">
                <span>الإجمالي</span>
                <span className="text-primary">{finalTotal} جنيه</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleOrder}
            disabled={orderLoading || (!user && (!guestInfo.name || !guestInfo.phone || !guestInfo.address)) || (user && !guestInfo.address)}
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
          >
            {orderLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                جاري إرسال الطلب...
              </>
            ) : (
              <>إتمام الطلب عبر واتساب</>
            )}
          </button>

          {!user && (!guestInfo.name || !guestInfo.phone || !guestInfo.address) && (
            <p className="text-xs text-danger text-center mt-2">يرجى إدخال الاسم ورقم الهاتف والعنوان</p>
          )}
          {user && !guestInfo.address && (
            <p className="text-xs text-danger text-center mt-2">يرجى إدخال العنوان</p>
          )}

          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-text-muted">
            <span>توصيل مجاني للطلبات فوق 500 جنيه</span>
          </div>
        </div>
      </div>

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