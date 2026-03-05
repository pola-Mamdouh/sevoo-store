// src/pages/admin/AdminOrders.jsx
import { useOrders } from '../../store/OrdersContext';
import { useState } from 'react';
import { 
  Search, 
  Package, 
  Calendar, 
  User, 
  Phone, 
  MessageCircle,
  MapPin,
  Navigation
} from 'lucide-react';

const AdminOrders = () => {
  const { orders, loading, updateOrderStatus } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.phone?.includes(searchTerm) ||
      order.customer?.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    'قيد الانتظار': 'bg-warning/10 text-warning border-warning/20',
    'تم التأكيد': 'bg-success/10 text-success border-success/20',
    'تم الشحن': 'bg-accent/10 text-accent border-accent/20',
    'تم التوصيل': 'bg-primary/10 text-primary border-primary/20',
    'ملغي': 'bg-danger/10 text-danger border-danger/20'
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      alert('حدث خطأ أثناء تحديث الحالة');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-heading font-bold text-text-primary">
          إدارة الطلبات
        </h1>
      </div>

      {/* Search & Filter */}
      <div className="bg-surface rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث برقم الطلب أو اسم العميل أو العنوان..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none bg-white"
            >
              <option value="all">جميع الحالات</option>
              <option value="قيد الانتظار">قيد الانتظار</option>
              <option value="تم التأكيد">تم التأكيد</option>
              <option value="تم الشحن">تم الشحن</option>
              <option value="تم التوصيل">تم التوصيل</option>
              <option value="ملغي">ملغي</option>
            </select>
          </div>
        </div>
        <p className="text-sm text-text-muted mt-2">
          إجمالي الطلبات: {filteredOrders.length}
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-surface rounded-xl">
            <Package className="w-16 h-16 mx-auto text-text-muted mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">لا توجد طلبات</h3>
            <p className="text-text-muted">لم يتم تقديم أي طلبات بعد</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
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
                    <p className="font-medium text-text-primary">{order.id.slice(0, 8)}...</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-text-muted" />
                    <span className="text-sm text-text-muted">
                      {new Date(order.date || order.createdAt).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-text-muted" />
                    <span>{order.customer?.name || 'غير محدد'}</span>
                  </div>
                  {order.customer?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-text-muted" />
                      <span>{order.customer.phone}</span>
                    </div>
                  )}
                  {order.customer?.email && (
                    <div className="flex items-center gap-2">
                      <span>{order.customer.email}</span>
                    </div>
                  )}
                  {order.customer?.city && (
                    <div className="flex items-center gap-2">
                      <span>المدينة: {order.customer.city}</span>
                    </div>
                  )}
                </div>

                {/* Address fields */}
                {order.customer?.address && (
                  <div className="flex items-center gap-2 text-sm mt-2">
                    <MapPin className="w-4 h-4 text-text-muted flex-shrink-0" />
                    <span className="text-text-primary">{order.customer.address}</span>
                  </div>
                )}
                {order.customer?.locationLink && (
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <Navigation className="w-4 h-4 text-text-muted flex-shrink-0" />
                    <a 
                      href={order.customer.locationLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-accent hover:underline break-all"
                    >
                      رابط الموقع
                    </a>
                  </div>
                )}
                {order.customer?.message && (
                  <div className="flex items-start gap-2 text-sm mt-2">
                    <MessageCircle className="w-4 h-4 text-text-muted flex-shrink-0 mt-0.5" />
                    <span className="text-text-muted">{order.customer.message}</span>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="p-4">
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.selectedColor?.images?.[0] || item.images?.[0] || item.image} 
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        {item.selectedColor && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <span 
                              className="w-3 h-3 rounded-full border border-gray-200" 
                              style={{ backgroundColor: item.selectedColor.code }}
                            />
                            <span className="text-xs text-text-muted">
                              {item.selectedColor.name}
                            </span>
                          </div>
                        )}
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
              </div>

              {/* Order Footer */}
              <div className="p-4 bg-gray-50 rounded-b-xl flex items-center justify-between">
                <div>
                  <span className="text-sm text-text-muted">الإجمالي</span>
                  <span className="text-xl font-bold text-primary mr-2">
                    {order.total} جنيه
                  </span>
                </div>
                <div className="flex gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="px-3 py-1 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="قيد الانتظار">قيد الانتظار</option>
                    <option value="تم التأكيد">تم التأكيد</option>
                    <option value="تم الشحن">تم الشحن</option>
                    <option value="تم التوصيل">تم التوصيل</option>
                    <option value="ملغي">ملغي</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminOrders;