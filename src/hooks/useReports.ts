import apiClient from '@/src/api/client';
import { useEffect, useState } from 'react';

export const useReports = (storeId: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const response = await apiClient.get(`/report/dashboard?storeId=${storeId}`);
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Error al cargar reportes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeId) fetchReports();
  }, [storeId]);

  return { data, loading, refresh: fetchReports };
};