import { LoginHeader } from '@/components/login/LoginHeader';
import { CustomInput } from '@/components/ui/CustomInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useAuth } from '@/src/hooks/useAuth'; // Usando el "Controlador"
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Extraemos la lógica del Hook
  const { login, loading } = useAuth();

  return (
    <ScrollView contentContainerStyle={styles.scroll} bounces={false}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.loginCard}>
          <LoginHeader />
          
          <CustomInput 
            label="Correo *" 
            value={email} 
            onChangeText={setEmail} 
            keyboardType="email-address" 
          />
          
          <CustomInput 
            label="Contraseña *" 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry 
          />

          <PrimaryButton 
            title="Iniciar Sesión" 
            onPress={() => login(email, password)} 
            loading={loading} 
          />
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