
import { useCart } from "../../store/CartContext";
import { Trash2, Plus, Minus } from 'lucide-react';
import Button from "../ui/Button";

const CartItem = ({ item }) => {
  const { dispatch } = useCart();

  return (
    <div className="flex gap-4 p-4 bg-surface rounded-(--radius-card) border border-gray-100 hover:border-gray-200 transition-colors">
      <img
        src={item.image}
        alt={item.name}
        className="h-24 w-20 object-cover rounded-lg bg-gray-100"
      />

      <div className="flex-1 min-w-0">
        <h3 className="font-heading font-semibold text-text-primary truncate">
          {item.name}
        </h3>
        <p className="text-text-muted text-sm mt-0.5">{item.price} جنيه</p>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch({ type: "DECREASE_QUANTITY", payload: item.id })}
              className="!p-1.5"
            >
              <Minus className="w-3.5 h-3.5" />
            </Button>
            
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch({ type: "INCREASE_QUANTITY", payload: item.id })}
              className="!p-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: item.id })}
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