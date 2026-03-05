// components/product/ProductCard.jsx
import { Link } from "react-router-dom";
import { useCart } from "../../store/CartContext";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

const ProductCard = ({ product }) => {
  const { cartItems, dispatch } = useCart();
  const [quantity, setQuantity] = useState(0);
  const [imageError, setImageError] = useState(false);

  // البحث عن العنصر في السلة (أول لون)
  const cartItem = cartItems.find((item) => item.id === product.id);
  const selectedColor = cartItem?.selectedColor;

  // استخدام أول صورة أو الصورة القديمة
  const imageUrl = product.colors?.[0]?.images?.[0] || product.image;

  useEffect(() => {
    setQuantity(cartItem?.quantity || 0);
  }, [cartItem]);

  const handleAddToCart = () => {
    const defaultColor = product.colors?.[0] || null;
    dispatch({ type: "ADD_TO_CART", payload: { ...product, selectedColor: defaultColor } });
  };

  const handleIncrease = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedColor) {
      dispatch({
        type: "INCREASE_QUANTITY",
        payload: { id: product.id, color: selectedColor },
      });
    }
  };

  const handleDecrease = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedColor) return;
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

  const handleImageError = () => setImageError(true);

  return (
    <div className="group bg-surface rounded-(--radius-card) shadow-(--shadow-card) hover:shadow-(--shadow-card-hover) transition-all duration-300 overflow-hidden">
      <Link
        to={`/product/${product.id}`}
        className="relative aspect-square overflow-hidden bg-gray-100 block"
      >
        {!imageError ? (
          <img
            src={imageUrl}
            alt={product.name}
            onError={handleImageError}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {product.isNew && (
          <span className="absolute top-3 right-3 bg-success/10 text-success px-2 py-1 rounded-(--radius-badge) text-xs font-semibold border border-success/20 z-10">
            جديد
          </span>
        )}
      </Link>

      <div className="p-4 space-y-3">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="font-heading font-semibold text-text-primary hover:text-accent transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">
            {product.price} جنيه
          </span>
        </div>

        {quantity === 0 ? (
          <button
            onClick={handleAddToCart}
            className="w-full bg-primary text-white py-2.5 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <ShoppingCart className="w-4 h-4" />
            أضف للسلة
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrease}
              className="flex-1 bg-gray-100 text-text-primary py-2.5 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1 text-sm font-medium"
            >
              {quantity === 1 ? (
                <Trash2 className="w-4 h-4" />
              ) : (
                <Minus className="w-4 h-4" />
              )}
            </button>
            <span className="w-12 text-center font-semibold text-primary">
              {quantity}
            </span>
            <button
              onClick={handleIncrease}
              className="flex-1 bg-primary text-white py-2.5 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-1 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}

        <Link
          to={`/product/${product.id}`}
          className="block text-center text-sm text-text-muted hover:text-primary transition-colors pt-1 border-t border-gray-100 mt-2"
        >
          عرض التفاصيل
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;