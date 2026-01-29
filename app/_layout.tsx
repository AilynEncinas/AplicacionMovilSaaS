import { AuthProvider } from '@/src/context/AuthContext';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)/index" /> 
        <Stack.Screen name="(auth)/register" />
        <Stack.Screen name="(dashboard)/report" />
        <Stack.Screen name="(dashboard)/products" />
        <Stack.Screen name="(dashboard)/clients" />
        <Stack.Screen name="(dashboard)/notifications" />
      </Stack>
    </AuthProvider>
  );
}