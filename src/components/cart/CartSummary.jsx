// CartSummary.jsx
import { CreditCard, Truck, User } from 'lucide-react';
import Button from "../ui/Button";

const CartSummary = ({ total, subtotal, shipping, onOrder, user }) => {
  return (
    <div className="bg-surface rounded-(--radius-card) p-6 shadow-(--shadow-card) border border-gray-100 sticky top-24">
      <h3 className="font-heading font-semibold text-lg mb-4">ملخص الطلب</h3>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-text-muted">المجموع الفرعي</span>
          <span className="font-medium">{subtotal} جنيه</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">الشحن</span>
          <span className="font-medium">{shipping === 0 ? 'مجاني' : `${shipping} جنيه`}</span>
        </div>
        <div className="border-t border-gray-100 pt-3 mt-3">
          <div className="flex justify-between font-bold text-lg">
            <span>الإجمالي</span>
            <span className="text-primary">{total} جنيه</span>
          </div>
        </div>
      </div>
      
      <Button 
        variant="primary" 
        size="lg" 
        className="w-full mt-6"
        onClick={onOrder}
        disabled={!user}
      >
        <CreditCard className="w-4 h-4" />
        إتمام الطلب عبر واتساب
      </Button>
      
      {!user && (
        <p className="text-xs text-danger text-center mt-2">
          يجب تسجيل الدخول لإتمام الطلب
        </p>
      )}
      
      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-text-muted">
        <Truck className="w-3.5 h-3.5" />
        <span>توصيل مجاني للطلبات فوق 500 جنيه</span>
      </div>
    </div>
  );
};

export default CartSummary;