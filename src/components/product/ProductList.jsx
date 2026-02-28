// components/product/ProductList.jsx
import ProductCard from "./ProductCard";

const ProductList = ({ products }) => {
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;