// pages/Home.jsx
import { useEffect } from 'react';
import { useAdmin } from '../store/AdminContext';
import ProductList from '../components/product/ProductList';

const Home = () => {
  const { adminState } = useAdmin();
  const products = adminState.products;

  // Debug: log products whenever they change
  useEffect(() => {
    console.log('Home products updated:', products);
  }, [products]);

  return (
    <>
      <h1 className="text-xl font-bold mb-6">المنتجات</h1>
      {/* key forces re-render when length changes */}
      <ProductList key={products.length} products={products} />
    </>
  );
};

export default Home;