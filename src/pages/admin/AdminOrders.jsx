// src/pages/admin/AdminOrders.jsx
import { useState } from 'react';
import { useAdmin } from '../../store/AdminContext';
import { 
  Package, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  Truck,
  Clock,
  Eye
} from 'lucide-react';

const AdminOrders = () => {
  const { adminState, actions } = useAdmin();
  const { orders, isLoadingOrders } = adminState;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statusColors = {
    pending: 'bg-warning/10 text-warning border-warning/20',
    processing: 'bg-accent/10 text-accent border-accent/20',
    shipped: 'bg-primary/10 text-primary border-primary/20',
    delivered: 'bg-success/10 text-success border-success/20',
    cancelled: 'bg-danger/10 text-danger border-danger/20'
  };

  const statusLabels = {
    pending: 'قيد الانتظار',
    processing: 'قيد المعالجة',
    shipped: 'تم الشحن',
    delivered: 'تم التوصيل',
    cancelled: 'ملغي'
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.phone?.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (orderId, newStatus) => {
    await actions.updateOrderStatus(orderId, newStatus);
  };

  if (isLoadingOrders) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-heading font-bold text-text-primary">
          إدارة الطلبات
        </h1>
        <div className="text-text-muted">
          إجمالي الطلبات: {orders.length}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-surface rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث عن طلب (اسم، ايميل، هاتف)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="sm:w-48 relative">
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none appearance-none bg-white"
            >
              <option value="all">جميع الحالات</option>
              <option value="pending">قيد الانتظار</option>
              <option value="processing">قيد المعالجة</option>
              <option value="shipped">تم الشحن</option>
              <option value="delivered">تم التوصيل</option>
              <option value="cancelled">ملغي</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-surface rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Order Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-primary" />
                  <span className="font-medium">طلب #{order.id.slice(-8)}</span>
                  <span className="text-sm text-text-muted">
                    {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs border ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                  
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="text-sm border rounded-lg px-2 py-1 bg-white"
                  >
                    <option value="pending">قيد الانتظار</option>
                    <option value="processing">قيد المعالجة</option>
                    <option value="shipped">تم الشحن</option>
                    <option value="delivered">تم التوصيل</option>
                    <option value="cancelled">ملغي</option>
                  </select>
                  
                  <button
                    onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                    className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Order Details - Show when selected */}
            {selectedOrder?.id === order.id && (
              <div className="p-4 space-y-4">
                {/* Customer Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">معلومات العميل</h4>
                    <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
                      <p><span className="text-text-muted">الاسم:</span> {order.customer?.name || 'غير محدد'}</p>
                      {order.customer?.email && (
                        <p><span className="text-text-muted">البريد:</span> {order.customer.email}</p>
                      )}
                      {order.customer?.phone && (
                        <p><span className="text-text-muted">الهاتف:</span> {order.customer.phone}</p>
                      )}
                      {order.customer?.message && (
                        <p><span className="text-text-muted">رسالة:</span> {order.customer.message}</p>
                      )}
                      {order.customer?.isGuest && (
                        <p className="text-warning">زائر</p>
                      )}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h4 className="font-medium mb-2">ملخص الطلب</h4>
                    <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
                      <p><span className="text-text-muted">المجموع الفرعي:</span> {order.subtotal || order.total} جنيه</p>
                      <p><span className="text-text-muted">الشحن:</span> {order.shipping || 0} جنيه</p>
                      <p className="font-bold text-primary">الإجمالي: {(order.total + (order.shipping || 0))} جنيه</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-medium mb-2">المنتجات</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-text-muted">
                            {item.quantity} × {item.price} جنيه = {item.quantity * item.price} جنيه
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-16 bg-surface rounded-xl">
            <Package className="w-16 h-16 mx-auto text-text-muted opacity-50 mb-4" />
            <h3 className="font-heading text-xl font-semibold text-text-primary mb-2">
              لا توجد طلبات
            </h3>
            <p className="text-text-muted">
              لم يتم تقديم أي طلبات بعد
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;