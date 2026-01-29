import apiClient from '@/src/api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const context = useContext(AuthContext);

  if (!context) throw new Error('useAuth debe estar dentro de un AuthProvider');

  const { user, setUser } = context;

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/login', {
        email: email.trim(),
        password: password
      });

      if (response.data.success) {
        const userData = response.data.user;

        const loggedUser = {
          id: userData.id,
          name: userData.name || "Usuario",
          role: userData.rol || userData.role || "usuario",
          storeId: userData.storeId || userData.id_microempresa 
        };

        if (!loggedUser.storeId) {
          console.warn("No existe storeId asociado al usuario");
        }

        setUser(loggedUser);
        await AsyncStorage.setItem('@user', JSON.stringify(loggedUser));

        Alert.alert("Éxito", `Bienvenido ${loggedUser.name}`, [
          { text: "Entrar", onPress: () => router.replace('/(dashboard)/report') }
        ]);
      }
    } catch (error: any) {
      Alert.alert("Error", "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@user');
    setUser(null);
    router.replace('/(auth)');
  };

  return { login, logout, loading, user, isAuthenticated: !!user };
};