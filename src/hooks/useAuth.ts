import apiClient from '@/src/api/client';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/login', {
        email: email.trim(),
        password: password
      });

      if (response.data.success) {
        const { rol } = response.data.user;
        Alert.alert("Éxito", `Bienvenido. Rol: ${rol}`, [
          { text: "Entrar", onPress: () => router.replace('/report') }
        ]);
      }
    } catch (error) {
      Alert.alert("Error", "Correo o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};