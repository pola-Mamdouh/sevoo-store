// pages/Home.jsx
import { useEffect, useCallback } from 'react';
import { useAdmin } from '../store/AdminContext';
import ProductList from '../components/product/ProductList';

const Home = () => {
  const { adminState, actions, pageSize } = useAdmin();
  const { products, isLoading, isLoadingMore, hasMore, totalCount } = adminState;

  // تحميل المزيد عند التمرير
  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      actions.loadMoreProducts();
    }
  }, [isLoadingMore, hasMore, actions]);

  // التمرير اللانهائي
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // لو وصلت قرب الآخر (300px من الآخر)
      if (scrollTop + windowHeight >= documentHeight - 300) {
        handleLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleLoadMore]);

  // Debug: log products whenever they change
  useEffect(() => {
    console.log('Home products updated:', products.length, 'Total:', totalCount);
  }, [products, totalCount]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">المنتجات</h1>
        {totalCount > 0 && (
          <p className="text-text-muted">
            عرض {products.length} من {totalCount} منتج
          </p>
        )}
      </div>
      
      <ProductList 
        products={products} 
        isLoading={isLoading && products.length === 0}
      />
      
      {/* مؤشر تحميل المزيد */}
      {isLoadingMore && (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* رسالة انتهاء المنتجات */}
      {!hasMore && products.length > 0 && (
        <p className="text-center text-text-muted py-8">
          🎉 لقد وصلت إلى نهاية قائمة المنتجات
        </p>
      )}
    </div>
  );
};

export default Home;