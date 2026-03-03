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
  AlertCircle,
} from "lucide-react";
import Popup from "../../components/ui/Popup"; // 👈 استيراد Popup

const AdminProducts = () => {
  const { adminState, actions } = useAdmin();
  const { allProducts, isLoading } = adminState;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [popup, setPopup] = useState(null); // 👈 حالة الـ popup
  const itemsPerPage = 10;

  // Show loading skeleton while fetching initial data
  if (isLoading && allProducts.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>

        {/* Search & Filter Skeleton */}
        <div className="bg-surface rounded-xl p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="sm:w-48 h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-surface rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {[...Array(5)].map((_, i) => (
                    <th key={i} className="py-4 px-6">
                      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[...Array(5)].map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {[...Array(5)].map((_, colIndex) => (
                      <td key={colIndex} className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {colIndex === 0 && (
                            <>
                              <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                              <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                                <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                              </div>
                            </>
                          )}
                          {colIndex === 1 && (
                            <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                          )}
                          {colIndex === 2 && (
                            <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                          )}
                          {colIndex === 3 && (
                            <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                          )}
                          {colIndex === 4 && (
                            <div className="flex gap-2">
                              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  const filteredProducts = allProducts.filter((product) => {
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

  const categories = ["all", ...new Set(allProducts.map((p) => p.category))];

  const handleDelete = async (productId, productName) => {
    if (window.confirm(`هل أنت متأكد من حذف "${productName}"؟`)) {
      setDeletingId(productId);
      try {
        await actions.deleteProduct(productId);
        setPopup({
          type: "success",
          title: "تم الحذف",
          message: `تم حذف "${productName}" بنجاح`,
        });
      } catch (error) {
        console.error("Error deleting product:", error);
        setPopup({
          type: "error",
          title: "خطأ",
          message: "حدث خطأ أثناء حذف المنتج",
        });
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleDeleteAll = async () => {
    setIsDeletingAll(true);
    try {
      // حذف المنتجات واحداً تلو الآخر
      for (const product of allProducts) {
        await actions.deleteProduct(product.id);
      }
      setShowDeleteAllModal(false);
      setPopup({
        type: "success",
        title: "تم الحذف",
        message: `تم حذف ${allProducts.length} منتج بنجاح`,
      });
    } catch (error) {
      console.error("Error deleting all products:", error);
      setPopup({
        type: "error",
        title: "خطأ",
        message: "حدث خطأ أثناء حذف المنتجات",
      });
    } finally {
      setIsDeletingAll(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-heading font-bold text-text-primary">
          إدارة المنتجات
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDeleteAllModal(true)}
            className="bg-danger/10 text-danger px-4 py-2 rounded-lg hover:bg-danger/20 transition-colors inline-flex items-center gap-2 border border-danger/20"
            disabled={allProducts.length === 0}
          >
            <Trash2 className="w-4 h-4" />
            حذف الكل ({allProducts.length})
          </button>
          <Link
            to="/admin/products/new"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
          >
            <span>+</span>
            إضافة منتج جديد
          </Link>
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
                        src={product.images?.[0] || product.image}
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

      {/* Delete All Confirmation Modal */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 text-danger mb-4">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-xl font-bold">تأكيد الحذف</h3>
            </div>

            <p className="text-text-primary mb-2">
              هل أنت متأكد من حذف جميع المنتجات؟
            </p>
            <p className="text-text-muted text-sm mb-6">
              عدد المنتجات:{" "}
              <span className="font-bold text-danger">
                {allProducts.length}
              </span>
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleDeleteAll}
                disabled={isDeletingAll}
                className="flex-1 bg-danger text-white py-2 rounded-lg hover:bg-danger/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeletingAll ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    جاري الحذف...
                  </>
                ) : (
                  "نعم، حذف الكل"
                )}
              </button>
              <button
                onClick={() => setShowDeleteAllModal(false)}
                disabled={isDeletingAll}
                className="flex-1 bg-gray-100 text-text-primary py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup Notification */}
      {popup && (
        <Popup
          type={popup.type}
          title={popup.title}
          message={popup.message}
          onClose={() => setPopup(null)}
          autoClose={3000}
        />
      )}
    </div>
  );
};

export default AdminProducts;
