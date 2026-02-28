import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdmin } from "../../store/AdminContext";
import { Save, X, Image as ImageIcon } from "lucide-react";

const AdminProductForm = () => {
  const navigate = useNavigate();
  const { productId } = useParams();

  const { adminState, actions } = useAdmin();
  const { isLoading } = adminState;
  const products = adminState.products;
  const isEditing = !!productId;

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    price: "",
    description: "",
    category: "",
    image: "",
    stock: "",
    isNew: false,
    discount: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load product data if editing
  useEffect(() => {
    if (isEditing) {
      const product = products.find((p) => p.id === productId);
      if (product) {
        setFormData({
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description || "",
          category: product.category || "",
          image: product.image,
          stock: product.stock || "",
          isNew: product.isNew || false,
          discount: product.discount || "",
        });
      }
    } else {
      // For new product, Firestore will generate ID automatically
      setFormData((prev) => ({
        ...prev,
        id: "", // remove local ID generation
      }));
    }
  }, [isEditing, productId, products]);

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "اسم المنتج مطلوب";
    }

    if (!formData.price) {
      newErrors.price = "سعر المنتج مطلوب";
    } else if (isNaN(formData.price) || formData.price <= 0) {
      newErrors.price = "يرجى إدخال سعر صحيح";
    }

    if (!formData.category.trim()) {
      newErrors.category = "الفئة مطلوبة";
    }

    if (!formData.image.trim()) {
      newErrors.image = "صورة المنتج مطلوبة";
    } else if (!formData.image.match(/^https?:\/\/.+/)) {
      newErrors.image = "يرجى إدخال رابط صورة صحيح";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const productData = {
      ...formData,
      price: Number(formData.price),
      stock: formData.stock ? Number(formData.stock) : 0,
      discount: formData.discount ? Number(formData.discount) : 0,
    };

    // Remove id field for new products
    if (!isEditing) {
      delete productData.id;
    }

    setIsSubmitting(true);

    try {
      if (isEditing) {
        await actions.updateProduct(productId, productData);
      } else {
        await actions.addProduct(productData);
      }
      navigate("/admin/products");
    } catch (error) {
      console.error("Error saving product:", error);
      alert("حدث خطأ أثناء حفظ المنتج");
    } finally {
      setIsSubmitting(false);
    }
  };

  const suggestedCategories = [
    "تيشيرتات",
    "قمصان",
    "بناطيل",
    "هوديز",
    "جاكيتات",
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-heading font-bold text-text-primary">
          {isEditing ? "تعديل المنتج" : "إضافة منتج جديد"}
        </h1>
        <button
          onClick={() => navigate("/admin/products")}
          className="text-text-muted hover:text-text-primary transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-surface rounded-xl shadow-sm p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                اسم المنتج <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent/20 outline-none transition-colors
                  ${errors.name ? "border-danger" : "border-gray-200 focus:border-accent"}`}
                placeholder="مثال: تيشيرت قطن ساده"
              />
              {errors.name && (
                <p className="text-danger text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                السعر <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent/20 outline-none transition-colors
                  ${errors.price ? "border-danger" : "border-gray-200 focus:border-accent"}`}
                placeholder="مثال: 250"
              />
              {errors.price && (
                <p className="text-danger text-sm mt-1">{errors.price}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                الفئة <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                list="categories"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent/20 outline-none transition-colors
                  ${errors.category ? "border-danger" : "border-gray-200 focus:border-accent"}`}
                placeholder="مثال: تيشيرتات"
              />
              <datalist id="categories">
                {suggestedCategories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
              {errors.category && (
                <p className="text-danger text-sm mt-1">{errors.category}</p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                المخزون
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-colors"
                placeholder="مثال: 100"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              الوصف
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows="4"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-colors resize-none"
              placeholder="وصف تفصيلي للمنتج..."
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              صورة المنتج <span className="text-danger">*</span>
            </label>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent/20 outline-none transition-colors
                    ${errors.image ? "border-danger" : "border-gray-200 focus:border-accent"}`}
                  placeholder="https://example.com/image.jpg"
                />
                {errors.image && (
                  <p className="text-danger text-sm mt-1">{errors.image}</p>
                )}
              </div>

              {/* Image Preview */}
              <div className="w-full md:w-48 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/200x150?text=Invalid+Image";
                    }}
                  />
                ) : (
                  <div className="text-center text-text-muted">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                    <p className="text-xs">معاينة الصورة</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isNew}
                onChange={(e) =>
                  setFormData({ ...formData, isNew: e.target.checked })
                }
                className="w-4 h-4 text-accent rounded border-gray-300 focus:ring-accent"
              />
              <span className="text-sm">منتج جديد</span>
            </label>

            <div className="w-32">
              <label className="block text-sm text-text-primary mb-1">
                نسبة الخصم (%)
              </label>
              <input
                type="number"
                value={formData.discount}
                onChange={(e) =>
                  setFormData({ ...formData, discount: e.target.value })
                }
                min="0"
                max="100"
                className="w-full px-3 py-1 border border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-6 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={isLoading} // 👈 Use global isLoading
            className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? ( // 👈 Use global isLoading
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                حفظ المنتج
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
