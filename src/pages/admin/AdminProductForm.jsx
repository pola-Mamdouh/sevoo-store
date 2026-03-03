// pages/admin/AdminProductForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdmin } from '../../store/AdminContext';
import { Save, X, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import Popup from '../../components/ui/Popup';

// قائمة الألوان الشائعة للاختيار السريع
const COMMON_COLORS = [
  { name: 'أسود', code: '#000000' },
  { name: 'أبيض', code: '#FFFFFF' },
  { name: 'رمادي', code: '#808080' },
  { name: 'أحمر', code: '#FF0000' },
  { name: 'أزرق', code: '#0000FF' },
  { name: 'أخضر', code: '#008000' },
  { name: 'أصفر', code: '#FFFF00' },
  { name: 'بنفسجي', code: '#800080' },
  { name: 'وردي', code: '#FFC0CB' },
  { name: 'بني', code: '#8B4513' },
];

const AdminProductForm = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { adminState, actions } = useAdmin();
  const { allProducts } = adminState;
  const isEditing = !!productId;

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
    isNew: false,
    discount: '',
    colors: [] // مصفوفة من الكائنات { name, code, images: [] }
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popup, setPopup] = useState(null);
  const [imageErrors, setImageErrors] = useState({}); // لتتبع أخطاء الصور

  // تحميل بيانات المنتج عند التعديل
  useEffect(() => {
    if (isEditing) {
      const product = allProducts.find(p => p.id === productId);
      if (product) {
        // تحويل البيانات القديمة إذا كانت موجودة
        let colors = product.colors || [];
        // إذا كان المنتج قديماً ولا يحتوي على الألوان بالهيكل الجديد
        if (colors.length === 0 && product.image) {
          // إنشاء لون افتراضي
          colors = [{ name: 'افتراضي', code: '#CCCCCC', images: product.images || [product.image] }];
        }
        setFormData({
          name: product.name || '',
          price: product.price || '',
          description: product.description || '',
          category: product.category || '',
          stock: product.stock || '',
          isNew: product.isNew || false,
          discount: product.discount || '',
          colors: colors
        });
      }
    }
  }, [isEditing, productId, allProducts]);

  // التحقق من الصحة
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'اسم المنتج مطلوب';
    if (!formData.price) newErrors.price = 'سعر المنتج مطلوب';
    else if (isNaN(formData.price) || formData.price <= 0) newErrors.price = 'يرجى إدخال سعر صحيح';
    if (!formData.category.trim()) newErrors.category = 'الفئة مطلوبة';
    if (formData.colors.length === 0) newErrors.colors = 'يجب إضافة لون واحد على الأقل';
    else {
      formData.colors.forEach((color, idx) => {
        if (!color.name.trim()) {
          newErrors[`color_name_${idx}`] = 'اسم اللون مطلوب';
        }
        if (!color.code) {
          newErrors[`color_code_${idx}`] = 'كود اللون مطلوب';
        }
        if (color.images.length === 0) {
          newErrors[`color_images_${idx}`] = `يجب إضافة صورة واحدة على الأقل للون ${color.name || idx + 1}`;
        }
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // دوال إدارة الألوان
  const addColor = (colorTemplate = null) => {
    const newColor = colorTemplate || { name: '', code: '#000000', images: [] };
    setFormData({
      ...formData,
      colors: [...formData.colors, newColor]
    });
  };

  const updateColor = (index, field, value) => {
    const updatedColors = [...formData.colors];
    updatedColors[index][field] = value;
    setFormData({ ...formData, colors: updatedColors });
  };

  const removeColor = (index) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter((_, i) => i !== index)
    });
  };

  // دوال إدارة الصور داخل اللون
  const addImageToColor = (colorIndex) => {
    const updatedColors = [...formData.colors];
    updatedColors[colorIndex].images.push('');
    setFormData({ ...formData, colors: updatedColors });
  };

  const updateColorImage = (colorIndex, imageIndex, value) => {
    const updatedColors = [...formData.colors];
    updatedColors[colorIndex].images[imageIndex] = value;
    setFormData({ ...formData, colors: updatedColors });
  };

  const removeColorImage = (colorIndex, imageIndex) => {
    const updatedColors = [...formData.colors];
    updatedColors[colorIndex].images = updatedColors[colorIndex].images.filter((_, i) => i !== imageIndex);
    setFormData({ ...formData, colors: updatedColors });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const productData = {
      name: formData.name,
      price: Number(formData.price),
      description: formData.description,
      category: formData.category,
      stock: formData.stock ? Number(formData.stock) : 0,
      isNew: formData.isNew,
      discount: formData.discount ? Number(formData.discount) : 0,
      colors: formData.colors
    };

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await actions.updateProduct(productId, productData);
        setPopup({ type: 'success', title: 'تم التعديل', message: 'تم تعديل المنتج بنجاح' });
      } else {
        await actions.addProduct(productData);
        setPopup({ type: 'success', title: 'تم الإضافة', message: 'تم إضافة المنتج بنجاح' });
      }
      setTimeout(() => navigate('/admin/products'), 1500);
    } catch (error) {
      setPopup({ type: 'error', title: 'خطأ', message: 'حدث خطأ أثناء حفظ المنتج' });
      setIsSubmitting(false);
    }
  };

  const suggestedCategories = ['تيشيرتات', 'قمصان', 'بناطيل', 'هوديز', 'جاكيتات'];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-heading font-bold text-text-primary">
          {isEditing ? 'تعديل المنتج' : 'إضافة منتج جديد'}
        </h1>
        <button
          onClick={() => navigate('/admin/products')}
          className="text-text-muted hover:text-text-primary transition-colors"
          disabled={isSubmitting}
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* المعلومات الأساسية */}
        <div className="bg-surface rounded-xl shadow-sm p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* الاسم */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                اسم المنتج <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent/20 outline-none transition-colors
                  ${errors.name ? 'border-danger' : 'border-gray-200 focus:border-accent'}`}
                placeholder="مثال: تيشيرت قطن ساده"
                disabled={isSubmitting}
              />
              {errors.name && <p className="text-danger text-sm mt-1">{errors.name}</p>}
            </div>

            {/* السعر */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                السعر <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent/20 outline-none transition-colors
                  ${errors.price ? 'border-danger' : 'border-gray-200 focus:border-accent'}`}
                placeholder="مثال: 250"
                disabled={isSubmitting}
              />
              {errors.price && <p className="text-danger text-sm mt-1">{errors.price}</p>}
            </div>

            {/* الفئة */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                الفئة <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                list="categories"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent/20 outline-none transition-colors
                  ${errors.category ? 'border-danger' : 'border-gray-200 focus:border-accent'}`}
                placeholder="مثال: تيشيرتات"
                disabled={isSubmitting}
              />
              <datalist id="categories">
                {suggestedCategories.map(cat => <option key={cat} value={cat} />)}
              </datalist>
              {errors.category && <p className="text-danger text-sm mt-1">{errors.category}</p>}
            </div>

            {/* المخزون */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">المخزون</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-colors"
                placeholder="مثال: 100"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* الوصف */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">الوصف</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-colors resize-none"
              placeholder="وصف تفصيلي للمنتج..."
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* الألوان والصور */}
        <div className="bg-surface rounded-xl shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">الألوان والصور</h2>
            <button
              type="button"
              onClick={() => addColor()}
              className="text-accent hover:text-accent/80 flex items-center gap-1 text-sm"
            >
              <Plus className="w-4 h-4" />
              إضافة لون جديد
            </button>
          </div>

          {errors.colors && <p className="text-danger text-sm">{errors.colors}</p>}

          {/* قائمة الألوان الشائعة للإضافة السريعة */}
          <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
            <span className="text-sm text-text-muted">ألوان شائعة:</span>
            {COMMON_COLORS.map((color) => (
              <button
                key={color.code}
                type="button"
                onClick={() => addColor({ name: color.name, code: color.code, images: [] })}
                className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-accent transition-all"
                style={{ backgroundColor: color.code }}
                title={color.name}
              />
            ))}
          </div>

          {/* عرض الألوان المضافة */}
          {formData.colors.map((color, colorIndex) => (
            <div key={colorIndex} className="border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">اللون {colorIndex + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeColor(colorIndex)}
                  className="text-danger hover:text-danger/80"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* اسم اللون */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">اسم اللون</label>
                  <input
                    type="text"
                    value={color.name}
                    onChange={(e) => updateColor(colorIndex, 'name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent/20 outline-none transition-colors
                      ${errors[`color_name_${colorIndex}`] ? 'border-danger' : 'border-gray-200 focus:border-accent'}`}
                    placeholder="مثل: أحمر"
                    disabled={isSubmitting}
                  />
                  {errors[`color_name_${colorIndex}`] && (
                    <p className="text-danger text-xs mt-1">{errors[`color_name_${colorIndex}`]}</p>
                  )}
                </div>

                {/* كود اللون */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">كود اللون</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={color.code}
                      onChange={(e) => updateColor(colorIndex, 'code', e.target.value)}
                      className="w-10 h-10 p-1 border border-gray-200 rounded-lg cursor-pointer"
                      disabled={isSubmitting}
                    />
                    <input
                      type="text"
                      value={color.code}
                      onChange={(e) => updateColor(colorIndex, 'code', e.target.value)}
                      className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent/20 outline-none transition-colors
                        ${errors[`color_code_${colorIndex}`] ? 'border-danger' : 'border-gray-200 focus:border-accent'}`}
                      placeholder="#000000"
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors[`color_code_${colorIndex}`] && (
                    <p className="text-danger text-xs mt-1">{errors[`color_code_${colorIndex}`]}</p>
                  )}
                </div>
              </div>

              {/* صور اللون */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-text-primary">صور هذا اللون</label>
                  <button
                    type="button"
                    onClick={() => addImageToColor(colorIndex)}
                    className="text-accent hover:text-accent/80 flex items-center gap-1 text-xs"
                  >
                    <Plus className="w-3 h-3" />
                    إضافة صورة
                  </button>
                </div>

                {color.images.length === 0 ? (
                  <p className="text-text-muted text-sm py-2">لا توجد صور لهذا اللون. أضف صورة واحدة على الأقل.</p>
                ) : (
                  <div className="space-y-2">
                    {color.images.map((url, imgIndex) => (
                      <div key={imgIndex} className="flex items-center gap-2">
                        <div className="flex-1 relative">
                          <input
                            type="url"
                            value={url}
                            onChange={(e) => updateColorImage(colorIndex, imgIndex, e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent/20 outline-none transition-colors
                              ${errors[`color_images_${colorIndex}`] ? 'border-danger' : 'border-gray-200 focus:border-accent'}`}
                            placeholder="https://example.com/image.jpg"
                            disabled={isSubmitting}
                          />
                        </div>
                        {/* معاينة الصورة */}
                        <div className="w-12 h-12 bg-gray-100 rounded border border-gray-200 overflow-hidden flex-shrink-0">
                          {url && !imageErrors[`${colorIndex}-${imgIndex}`] ? (
                            <img
                              src={url}
                              alt={`معاينة`}
                              className="w-full h-full object-cover"
                              onError={() => setImageErrors(prev => ({ ...prev, [`${colorIndex}-${imgIndex}`]: true }))}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-text-muted">
                              <ImageIcon className="w-4 h-4 opacity-50" />
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeColorImage(colorIndex, imgIndex)}
                          className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                          disabled={isSubmitting}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {errors[`color_images_${colorIndex}`] && (
                  <p className="text-danger text-xs mt-1">{errors[`color_images_${colorIndex}`]}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* خيارات إضافية */}
        <div className="bg-surface rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isNew}
                onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                className="w-4 h-4 text-accent rounded border-gray-300 focus:ring-accent"
                disabled={isSubmitting}
              />
              <span className="text-sm">منتج جديد</span>
            </label>

            <div className="w-32">
              <label className="block text-sm text-text-primary mb-1">نسبة الخصم (%)</label>
              <input
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                min="0"
                max="100"
                className="w-full px-3 py-1 border border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-colors"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center"
          >
            {isSubmitting ? (
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

export default AdminProductForm;