// components/cart/CartItem.jsx
import { useCart } from "../../store/CartContext";
import { Trash2, Plus, Minus } from "lucide-react";
import Button from "../ui/Button";

const CartItem = ({ item }) => {
  const { dispatch } = useCart();

  const handleDecrease = () => {
    dispatch({
      type: "DECREASE_QUANTITY",
      payload: { id: item.id, color: item.selectedColor },
    });
  };

  const handleIncrease = () => {
    dispatch({
      type: "INCREASE_QUANTITY",
      payload: { id: item.id, color: item.selectedColor },
    });
  };

  const handleRemove = () => {
    dispatch({
      type: "REMOVE_FROM_CART",
      payload: { id: item.id, color: item.selectedColor },
    });
  };

  return (
    <div className="flex gap-4 p-4 bg-surface rounded-(--radius-card) border border-gray-100 hover:border-gray-200 transition-colors">
      <img
        src={item.selectedColor?.images?.[0] || item.images?.[0] || item.image}
        alt={item.name}
        className="h-24 w-20 object-cover rounded-lg bg-gray-100"
      />

      <div className="flex-1 min-w-0">
        <h3 className="font-heading font-semibold text-text-primary truncate">
          {item.name}
        </h3>
        {item.selectedColor && (
          <p className="text-xs text-text-muted mt-0.5 flex items-center gap-1">
            <span
              className="inline-block w-3 h-3 rounded-full border border-gray-200"
              style={{ backgroundColor: item.selectedColor.code }}
            />
            {item.selectedColor.name}
          </p>
        )}
        <p className="text-text-muted text-sm mt-0.5">{item.price} جنيه</p>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDecrease}
              className="!p-1.5"
            >
              <Minus className="w-3.5 h-3.5" />
            </Button>

            <span className="w-8 text-center font-medium">{item.quantity}</span>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleIncrease}
              className="!p-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="!p-1.5 text-danger hover:text-danger/80"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;