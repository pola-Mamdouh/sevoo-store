import { useCart } from "../store/CartContext";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";

const CartPage = () => {
  const { cartItems, totalPrice } = useCart();

  const handleOrder = () => {
    const message = cartItems
      .map(
        (item) =>
          `${item.name} × ${item.quantity} = ${
            item.price * item.quantity
          }`
      )
      .join("\n");

    const url = `https://wa.me/201140385268?text=${encodeURIComponent(
      message + `\n\nالإجمالي: ${totalPrice} جنيه`
    )}`;

    window.open(url, "_blank");
  };

  if (cartItems.length === 0)
    return <p>السلة فارغة</p>;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      <CartSummary total={totalPrice} onOrder={handleOrder} />
    </div>
  );
};

export default CartPage;