// components/product/ProductList.jsx
import ProductCard from "./ProductCard";

const ProductList = ({ products, isLoading = false }) => {
  // حالة التحميل
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-surface rounded-(--radius-card) shadow-(--shadow-card) overflow-hidden animate-pulse">
            <div className="aspect-square bg-gray-200"></div>
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // لا توجد منتجات
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="font-heading text-xl font-semibold text-text-primary mb-2">
          لا توجد منتجات
        </h3>
        <p className="text-text-muted">
          لم نتمكن من العثور على أي منتجات. حاول مرة أخرى لاحقاً.
        </p>
      </div>
    );
  }

  // عرض المنتجات
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;