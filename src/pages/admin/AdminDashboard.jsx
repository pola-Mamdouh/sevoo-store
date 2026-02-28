import { useAdmin } from '../../store/AdminContext';
import { Package, DollarSign, ShoppingBag, TrendingUp, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { adminState } = useAdmin();
  const products = adminState.products;

  const stats = [
    {
      title: 'إجمالي المنتجات',
      value: products.length,
      icon: Package,
      color: 'bg-blue-500',
      link: '/admin/products'
    },
    {
      title: 'منتجات منخفضة المخزون',
      value: products.filter(p => p.stock && p.stock < 10).length,
      icon: ShoppingBag,
      color: 'bg-yellow-500',
      link: '/admin/products?lowStock=true'
    },
    {
      title: 'الفئات',
      value: new Set(products.map(p => p.category)).size,
      icon: TrendingUp,
      color: 'bg-green-500',
      link: '/admin/categories'
    },
    {
      title: 'إجمالي القيمة',
      value: products.reduce((sum, p) => sum + p.price, 0) + ' جنيه',
      icon: DollarSign,
      color: 'bg-purple-500',
      link: '/admin/products'
    }
  ];

  const recentProducts = products.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-text-primary">
          مرحباً بعودتك!
        </h1>
        <p className="text-text-muted mt-1">
          إليك نظرة عامة على متجرك
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-surface rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-text-primary mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Products */}
      <div className="bg-surface rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-semibold">
            آخر المنتجات المضافة
          </h2>
          <Link 
            to="/admin/products"
            className="text-accent hover:text-accent/80 text-sm"
          >
            عرض الكل
          </Link>
        </div>

        <div className="divide-y divide-gray-100">
          {recentProducts.map((product) => (
            <div key={product.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                />
                <div>
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-text-muted">{product.category}</p>
                </div>
              </div>
              <span className="font-bold text-primary">{product.price} جنيه</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/admin/products/new"
          className="bg-gradient-to-r from-primary to-secondary text-white rounded-xl p-6 hover:opacity-90 transition-opacity"
        >
          <PlusCircle className="w-8 h-8 mb-3" />
          <h3 className="text-xl font-semibold mb-1">إضافة منتج جديد</h3>
          <p className="text-white/80">أضف منتج جديد إلى متجرك</p>
        </Link>

        <Link
          to="/admin/products"
          className="bg-accent text-white rounded-xl p-6 hover:opacity-90 transition-opacity"
        >
          <Package className="w-8 h-8 mb-3" />
          <h3 className="text-xl font-semibold mb-1">إدارة المنتجات</h3>
          <p className="text-white/80">تعديل أو حذف المنتجات الحالية</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;