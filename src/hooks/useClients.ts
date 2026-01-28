import apiClient from '@/src/api/client';
import { useCallback, useState } from 'react';

export const useClients = (storeId: string) => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchClients = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const response = await apiClient.get(`/clients?storeId=${storeId}`);
      if (response.data.success) setClients(response.data.clients);
    } catch (error) {
      console.error("Error al cargar clientes", error);
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  const removeClient = async (id: string) => {
    try {
      const response = await apiClient.delete(`/clients/${id}`);
      if (response.data.success) {
        setClients(prev => prev.filter(c => c.id !== id));
        return true;
      }
    } catch (error) {
      return false;
    }
  };

  return { clients, loading, fetchClients, removeClient };
};