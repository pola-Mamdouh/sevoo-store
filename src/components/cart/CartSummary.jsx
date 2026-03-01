import { CreditCard, Truck } from 'lucide-react';
import Button from "../ui/Button";

const CartSummary = ({ total, subtotal, shipping, onOrder, isSubmitting }) => {
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
            <span className="text-primary">{total + shipping} جنيه</span>
          </div>
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        className="w-full mt-6"
        onClick={onOrder}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
            جاري التحميل...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 ml-2" />
            إتمام الطلب عبر واتساب
          </>
        )}
      </Button>

      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-text-muted">
        <Truck className="w-3.5 h-3.5" />
        <span>توصيل مجاني للطلبات فوق 500 جنيه</span>
      </div>
    </div>
  );
};

export default CartSummary;