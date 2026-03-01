// pages/Home.jsx
import { useEffect } from 'react';
import { useAdmin } from '../store/AdminContext';
import ProductList from '../components/product/ProductList';

const Home = () => {
  const { adminState } = useAdmin();
  const { products, isLoading } = adminState; // 👈 استخدم isLoading

  // Debug: log products whenever they change
  useEffect(() => {
    console.log('Home products updated:', products);
  }, [products]);

  return (
    <>
      <h1 className="text-xl font-bold mb-6">المنتجات</h1>
      {/* مرر isLoading إلى ProductList */}
      <ProductList products={products} isLoading={isLoading} />
    </>
  );
};

export default Home;