// pages/ProductDetails.jsx
import { useParams } from "react-router-dom";
import { useAdmin } from "../store/AdminContext";
import { useCart } from "../store/CartContext";
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// استيراد Swiper ومكوناته
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";

const ProductDetails = () => {
  const { productId } = useParams();
  const { adminState } = useAdmin();
  const products = adminState.allProducts;
  const { cartItems, dispatch } = useCart();

  const product = products.find((p) => p.id === productId);
  const [selectedColor, setSelectedColor] = useState(null);
  const [currentImages, setCurrentImages] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [imageErrors, setImageErrors] = useState({});
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const mainSwiperRef = useRef(null);

  // تحديد أول لون افتراضي
  useEffect(() => {
    if (product?.colors?.length > 0 && !selectedColor) {
      const firstColor = product.colors[0];
      setSelectedColor(firstColor);
      setCurrentImages(firstColor.images || []);
    }
  }, [product, selectedColor]);

  // عند تغيير اللون المحدد، حدّث الصور وأوقف التشغيل التلقائي
  useEffect(() => {
    if (selectedColor) {
      setCurrentImages(selectedColor.images || []);
      setAutoplayEnabled(false); // أوقف التشغيل التلقائي عند اختيار لون
    }
  }, [selectedColor]);

  useEffect(() => {
    const cartItem = cartItems.find((item) => item.id === productId);
    setQuantity(cartItem?.quantity || 0);
  }, [cartItems, productId]);

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-2">404</h2>
        <p className="text-text-muted mb-6">المنتج غير موجود</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch({ type: "ADD_TO_CART", payload: { ...product, selectedColor } });
  };

  const handleIncrease = () => {
    dispatch({
      type: "INCREASE_QUANTITY",
      payload: { id: product.id, color: selectedColor },
    });
  };

  const handleDecrease = () => {
    if (quantity === 1) {
      dispatch({
        type: "REMOVE_FROM_CART",
        payload: { id: product.id, color: selectedColor },
      });
    } else {
      dispatch({
        type: "DECREASE_QUANTITY",
        payload: { id: product.id, color: selectedColor },
      });
    }
  };

  const handleImageError = (index) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  // عند النقر على صورة مصغرة، نحدد اللون المرتبط بها
  const handleThumbClick = (color, index) => {
    setSelectedColor(color);
    setAutoplayEnabled(false);
    if (mainSwiperRef.current) {
      mainSwiperRef.current.slideTo(index);
    }
  };

  // تجهيز قائمة بكل الصور مع اللون المرتبط
  const allImagesWithColor = product.colors?.flatMap(color =>
    (color.images || []).map(img => ({ url: img, color }))
  ) || [];

  // إذا لم توجد صور من الألوان، نستخدم الصور القديمة
  const displayImages = currentImages.length > 0 ? currentImages : (product.images || (product.image ? [product.image] : ["/placeholder-image.png"]));

  return (
    <div className="container mx-auto py-4 sm:py-6 lg:py-8 overflow-x-hidden">
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 xl:gap-12">
        {/* قسم الصور */}
        <div className="w-full max-w-full overflow-hidden space-y-3 lg:space-y-4">
          {/* السلايدر الرئيسي */}
          <div className="relative bg-gray-100 rounded-xl lg:rounded-2xl">
            <Swiper
              onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
              spaceBetween={0}
              slidesPerView={1}
              navigation={true}
              pagination={{ clickable: true }}
              autoplay={autoplayEnabled ? { delay: 3000, disableOnInteraction: false } : false}
              loop={displayImages.length > 1}
              thumbs={{ swiper: thumbsSwiper }}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              modules={[Navigation, Pagination, Thumbs, Autoplay]}
              className="w-full"
              style={{ aspectRatio: "4/3", maxHeight: "500px" }}
            >
              {displayImages.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <div className="w-full h-full flex items-center justify-center p-2 sm:p-4">
                    {!imageErrors[idx] ? (
                      <img
                        src={img}
                        alt={`${product.name} - ${selectedColor?.name || ''} - ${idx + 1}`}
                        className="max-w-full max-h-full object-contain"
                        onError={() => handleImageError(idx)}
                      />
                    ) : (
                      <div className="text-center text-text-muted">
                        <svg
                          className="w-16 h-16 mx-auto opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-xs mt-1">الصورة غير متوفرة</p>
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            {product.isNew && (
              <span className="absolute top-3 right-3 bg-success/10 text-success px-3 py-1.5 rounded-full text-xs font-semibold border border-success/20 z-10">
                جديد
              </span>
            )}
          </div>

          {/* الصور المصغرة - تعرض كل الصور مع تمييز اللون المحدد */}
          {allImagesWithColor.length > 1 && (
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={8}
              slidesPerView={4}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[Thumbs]}
              className="!ml-0 !mr-0"
            >
              {allImagesWithColor.map((item, idx) => (
                <SwiperSlide key={idx}>
                  <div
                    onClick={() => handleThumbClick(item.color, idx)}
                    className={`cursor-pointer border-2 rounded-lg overflow-hidden w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 transition-all ${
                      selectedColor?.code === item.color.code
                        ? 'border-primary scale-105 shadow-lg'
                        : 'border-transparent hover:border-accent'
                    }`}
                  >
                    <img
                      src={item.url}
                      alt={`مصغرة ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(idx)}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        {/* معلومات المنتج */}
        <div className="w-full max-w-full overflow-hidden space-y-4 lg:space-y-6">
          <div>
            <h1 className="text-2xl lg:text-3xl xl:text-4xl font-heading font-bold text-text-primary break-words">
              {product.name}
            </h1>
            <p className="text-sm lg:text-base text-text-muted">
              {product.category}
            </p>
          </div>

          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-2xl lg:text-3xl font-bold text-primary">
              {product.price} جنيه
            </span>
            {product.oldPrice && (
              <span className="text-base lg:text-lg text-text-muted line-through">
                {product.oldPrice} جنيه
              </span>
            )}
          </div>

          {/* الألوان المتاحة */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-text-primary mb-2">
                الألوان المتاحة
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 transition-all ${
                      selectedColor?.code === color.code
                        ? "border-primary scale-110 shadow-lg"
                        : "border-gray-200 hover:border-accent hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.code }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="prose prose-sm lg:prose-base max-w-full">
            <p className="text-text-primary leading-relaxed break-words">
              {product.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${quantity > 0 ? "bg-success animate-pulse" : "bg-success"}`}
            />
            <span className="text-xs lg:text-sm text-text-muted">
              {quantity > 0 ? "متوفر" : "متوفر في المخزون"}
            </span>
          </div>

          <div className="pt-3 border-t border-gray-100">
            {quantity === 0 ? (
              <button
                onClick={handleAddToCart}
                className="w-full bg-primary text-white px-6 py-3 lg:px-8 lg:py-4 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-base lg:text-lg font-medium"
              >
                <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5" />
                أضف للسلة
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDecrease}
                    className={`flex-1 py-3 lg:py-4 rounded-xl transition-colors flex items-center justify-center gap-1 text-sm lg:text-base font-medium ${
                      quantity === 1
                        ? "bg-danger/10 text-danger hover:bg-danger/20"
                        : "bg-gray-100 text-text-primary hover:bg-gray-200"
                    }`}
                  >
                    {quantity === 1 ? (
                      <>
                        <Trash2 className="w-4 h-4" />
                        إزالة
                      </>
                    ) : (
                      <>
                        <Minus className="w-4 h-4" />
                        تقليل
                      </>
                    )}
                  </button>
                  <span className="w-16 text-center text-xl lg:text-2xl font-bold text-primary">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrease}
                    className="flex-1 bg-primary text-white py-3 lg:py-4 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-1 text-sm lg:text-base font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    زيادة
                  </button>
                </div>
                <p className="text-xs lg:text-sm text-success text-center flex items-center justify-center gap-1">
                  <span className="w-1 h-1 bg-success rounded-full" />
                  هذا المنتج مضاف بالفعل إلى سلة التسوق
                </p>
              </div>
            )}
          </div>

          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-accent hover:text-accent/80 transition-colors text-sm lg:text-base"
            >
              <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4" />
              متابعة التسوق
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;