import apiClient from '@/src/api/client';
import { useEffect, useState } from 'react';

export const useProducts = (storeId: string, role: string) => {
  interface Product {
    id: string;
    name: string;
    stock: number;
    price: number;
    isActive: boolean;
    code: string;
    }
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/product?storeId=${storeId}&role=${role}`);
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error("Error productos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeId) fetchProducts();
  }, [storeId, role]);

  return { products, loading, refresh: fetchProducts };
};