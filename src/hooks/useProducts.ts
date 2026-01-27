import apiClient from '@/src/api/client';
import { useEffect, useState } from 'react';

export interface Product {
  id: string;
  name: string;
  stock: number;
  price: number;
  isActive: boolean;
  code: string;
}

export const useProducts = (storeId: string, role: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    
    if (!storeId) {
      console.log("Esperando storeId válido...");
      return;
    }

    try {
      setLoading(true);
      console.log(`Petición: /product?storeId=${storeId}&role=${role}`);
      
      const response = await apiClient.get(`/product`, {
        params: { storeId, role }
      });

      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error: any) {
      console.error("Error en API de productos:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [storeId, role]);

  return { products, loading, refresh: fetchProducts };
};