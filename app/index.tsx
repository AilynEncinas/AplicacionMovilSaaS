import { LoginHeader } from '@/components/login/LoginHeader';
import { CustomInput } from '@/components/ui/CustomInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Completa los campos");
      return; 
    }

    setLoading(true);
    try {
      const response = await axios.post('http://192.168.1.3:3000/api/login', { // Ajusta la URL según la ip de la computadora
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

  return (
    <ScrollView contentContainerStyle={styles.scroll} bounces={false}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.loginCard}>
          <LoginHeader />
          <CustomInput label="Correo *" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <CustomInput label="Contraseña *" value={password} onChangeText={setPassword} secureTextEntry />
          <PrimaryButton title="Iniciar Sesión" onPress={handleLogin} loading={loading} />
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },
  container: { flex: 1, backgroundColor: '#f8fafc', justifyContent: 'center', padding: 24 },
  loginCard: { backgroundColor: '#ffffff', padding: 28, borderRadius: 32, elevation: 2 },
});