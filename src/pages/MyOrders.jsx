// pages/MyOrders.jsx
import { useOrders } from "../store/OrdersContext";
import { Link } from "react-router-dom";
import { Package, Calendar, Clock, ChevronRight } from 'lucide-react';

const statusColors = {
  'قيد الانتظار': 'bg-warning/10 text-warning border-warning/20',
  'تم التأكيد': 'bg-success/10 text-success border-success/20',
  'تم الشحن': 'bg-accent/10 text-accent border-accent/20',
  'تم التوصيل': 'bg-primary/10 text-primary border-primary/20',
  'ملغي': 'bg-danger/10 text-danger border-danger/20'
};

const statusIcons = {
  'قيد الانتظار': Clock,
  'تم التأكيد': Package,
  'تم الشحن': Package,
  'تم التوصيل': Package,
  'ملغي': Package
};

const MyOrders = () => {
  const { orders } = useOrders();

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          لا توجد طلبات
        </h2>
        <p className="text-text-muted mb-6">
          لم تقم بطلب أي منتجات بعد
        </p>
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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-heading font-bold text-text-primary mb-6">
        طلباتي
      </h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const StatusIcon = statusIcons[order.status] || Package;
          const StatusColor = statusColors[order.status] || 'bg-gray-100 text-gray-600';

          return (
            <div
              key={order.id}
              className="bg-surface rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              {/* Order Header */}
              <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/5 rounded-lg">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">رقم الطلب</p>
                    <p className="font-medium text-text-primary">{order.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-text-muted" />
                    <span className="text-sm text-text-muted">
                      {new Date(order.date).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${StatusColor}`}>
                    <StatusIcon className="w-3 h-3" />
                    {order.status}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-text-muted">
                        {item.quantity} × {item.price} جنيه
                      </p>
                    </div>
                    <span className="font-bold text-primary">
                      {item.quantity * item.price} جنيه
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="p-4 bg-gray-50 rounded-b-xl flex items-center justify-between">
                <div>
                  <span className="text-sm text-text-muted">الإجمالي</span>
                  <span className="text-xl font-bold text-primary mr-2">
                    {order.total} جنيه
                  </span>
                </div>
                <Link
                  to={`/order/${order.id}`}
                  className="text-accent hover:text-accent/80 flex items-center gap-1 text-sm"
                >
                  عرض التفاصيل
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;