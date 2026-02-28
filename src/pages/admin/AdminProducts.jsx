import { useState } from "react";
import { useAdmin } from "../../store/AdminContext";
import { Link } from "react-router-dom";
import {
  Search,
  Edit,
  Trash2,
  MoreVertical,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const AdminProducts = () => {
  const { adminState, actions } = useAdmin();
  const products = adminState.products;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const itemsPerPage = 10;

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const categories = ["all", ...new Set(products.map((p) => p.category))];

  const handleDelete = async (productId, productName) => {
    if (window.confirm(`هل أنت متأكد من حذف "${productName}"؟`)) {
      setDeletingId(productId);
      try {
        await actions.deleteProduct(productId);
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("حدث خطأ أثناء حذف المنتج");
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-heading font-bold text-text-primary">
          إدارة المنتجات
        </h1>
        <Link
          to="/admin/products/new"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
        >
          <span>+</span>
          إضافة منتج جديد
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="bg-surface rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
            />
          </div>

          {/* Category Filter */}
          <div className="sm:w-48 relative">
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none appearance-none bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "جميع الفئات" : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-text-muted mt-2">
          إجمالي النتائج: {filteredProducts.length}
        </p>
      </div>

      {/* Products Table */}
      <div className="bg-surface rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-right py-4 px-6 text-sm font-semibold text-text-primary">
                  المنتج
                </th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-text-primary">
                  الفئة
                </th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-text-primary">
                  السعر
                </th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-text-primary">
                  المخزون
                </th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-text-primary">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-text-muted truncate max-w-xs">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-primary">
                    {product.price} جنيه
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        product.stock > 10
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {product.stock || "غير محدد"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={deletingId === product.id}
                        className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors disabled:opacity-50"
                        title="حذف"
                      >
                        {deletingId === product.id ? (
                          <div className="w-4 h-4 border-2 border-danger border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        className="p-2 text-text-muted hover:bg-gray-100 rounded-lg transition-colors"
                        title="المزيد"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-text-muted">
              عرض {startIndex + 1} -{" "}
              {Math.min(startIndex + itemsPerPage, filteredProducts.length)} من{" "}
              {filteredProducts.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 bg-primary text-white rounded-lg">
                {currentPage}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
