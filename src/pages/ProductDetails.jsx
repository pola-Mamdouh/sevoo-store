// pages/ProductDetails.jsx
import { useParams } from "react-router-dom";
import { useAdmin } from "../store/AdminContext";
import { useCart } from "../store/CartContext";
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProductDetails = () => {
  const { productId } = useParams();
  const { adminState } = useAdmin();
  const products = adminState.products;
  const { cartItems, dispatch } = useCart();

  const product = products.find((p) => p.id === productId);
  const cartItem = cartItems.find(item => item.id === productId);
  const [quantity, setQuantity] = useState(cartItem?.quantity || 0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const updatedItem = cartItems.find(item => item.id === productId);
    setQuantity(updatedItem?.quantity || 0);
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
    dispatch({ type: "ADD_TO_CART", payload: product });
  };

  const handleIncrease = () => {
    dispatch({ type: "INCREASE_QUANTITY", payload: product.id });
  };

  const handleDecrease = () => {
    if (quantity === 1) {
      dispatch({ type: "REMOVE_FROM_CART", payload: product.id });
    } else {
      dispatch({ type: "DECREASE_QUANTITY", payload: product.id });
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      {/* Product Image - FIXED */}
      <div className="relative flex items-center justify-center bg-gray-100 rounded-2xl min-h-[400px] lg:min-h-[500px] p-4">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={handleImageError}
            className="max-w-full max-h-[500px] w-auto h-auto object-contain rounded-lg"
            style={{ maxHeight: '500px', width: 'auto' }}
          />
        ) : (
          <div className="text-center text-text-muted">
            <svg className="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>الصورة غير متوفرة</p>
          </div>
        )}
        
        {product.isNew && (
          <span className="absolute top-4 right-4 bg-success/10 text-success px-3 py-1.5 rounded-full text-sm font-semibold border border-success/20 z-10">
            جديد
          </span>
        )}
      </div>

      {/* Product Info - باقي الكود كما هو */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-heading font-bold text-text-primary mb-2">
            {product.name}
          </h1>
          <p className="text-text-muted">{product.category}</p>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-primary">
            {product.price} جنيه
          </span>
          {product.oldPrice && (
            <span className="text-lg text-text-muted line-through">
              {product.oldPrice} جنيه
            </span>
          )}
        </div>

        <div className="prose prose-lg">
          <p className="text-text-primary leading-relaxed">
            {product.description}
          </p>
        </div>

        {product.features && (
          <ul className="space-y-2">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-text-muted">
                <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                {feature}
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${quantity > 0 ? 'bg-success animate-pulse' : 'bg-success'}`} />
          <span className="text-sm text-text-muted">
            {quantity > 0 ? 'متوفر' : 'متوفر في المخزون'}
          </span>
        </div>

        <div className="pt-4 border-t border-gray-100">
          {quantity === 0 ? (
            <button
              onClick={handleAddToCart}
              className="w-full bg-primary text-white px-8 py-4 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-3 text-lg font-medium"
            >
              <ShoppingCart className="w-5 h-5" />
              أضف للسلة
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDecrease}
                  className={`flex-1 py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-lg font-medium ${
                    quantity === 1
                      ? 'bg-danger/10 text-danger hover:bg-danger/20'
                      : 'bg-gray-100 text-text-primary hover:bg-gray-200'
                  }`}
                >
                  {quantity === 1 ? (
                    <>
                      <Trash2 className="w-5 h-5" />
                      إزالة
                    </>
                  ) : (
                    <>
                      <Minus className="w-5 h-5" />
                      تقليل
                    </>
                  )}
                </button>

                <span className="w-20 text-center text-2xl font-bold text-primary">
                  {quantity}
                </span>

                <button
                  onClick={handleIncrease}
                  className="flex-1 bg-primary text-white py-4 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-lg font-medium"
                >
                  <Plus className="w-5 h-5" />
                  زيادة
                </button>
              </div>
              <p className="text-sm text-success text-center flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 bg-success rounded-full" />
                هذا المنتج مضاف بالفعل إلى سلة التسوق
              </p>
            </div>
          )}
        </div>

        <div className="pt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            متابعة التسوق
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;