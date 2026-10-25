import { createContext, useContext, useState, useEffect } from 'react';
import { sampleProducts } from '../data';
import { useAuth } from './AuthContext';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(sampleProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch products from backend MongoDB API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error(`Server returned status ${res.status}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        // Map _id to id if needed for component compatibility
        const mapped = data.data.map(p => ({
          ...p,
          id: p._id || p.id
        }));
        setProducts(mapped);
      }
    } catch (err) {
      console.warn('API fetch notice, using fallback marketplace catalog:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Upload product with picture to backend (Cloudinary + MongoDB)
  const addProduct = async (formData) => {
    setError(null);
    try {
      // Build headers with seller authentication
      const headers = {
        'x-seller-role': 'seller',
        'x-seller-id': user?.id || 'seller_' + Date.now(),
      };
      if (user) {
        headers['x-user-payload'] = encodeURIComponent(JSON.stringify(user));
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers,
        body: formData // multipart/form-data handled automatically by browser
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || result.error || 'Failed to upload product.');
      }

      const createdProduct = {
        ...result.data,
        id: result.data._id || result.data.id
      };

      // Prepend newly created product so it immediately appears in all marketplace views
      setProducts(prev => [createdProduct, ...prev]);

      return { success: true, product: createdProduct };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Remove a product from stall
  const deleteProduct = async (productId) => {
    try {
      const headers = {
        'x-seller-role': 'seller',
        'x-seller-id': user?.id || 'seller_' + Date.now(),
      };
      if (user) {
        headers['x-user-payload'] = encodeURIComponent(JSON.stringify(user));
      }

      await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers
      });

      setProducts(prev => prev.filter(p => String(p.id) !== String(productId) && String(p._id) !== String(productId)));
      return { success: true };
    } catch (err) {
      console.error('Delete error:', err);
      // Optimistic delete in frontend
      setProducts(prev => prev.filter(p => String(p.id) !== String(productId) && String(p._id) !== String(productId)));
      return { success: true };
    }
  };

  return (
    <ProductContext.Provider value={{
      products,
      loading,
      error,
      refreshProducts: fetchProducts,
      addProduct,
      deleteProduct
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
