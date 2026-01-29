import { AuthProvider } from '@/src/context/AuthContext';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { LogBox } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true, // Esto hace que aparezca el banner arriba (estilo WhatsApp)
    shouldShowList: true,   // Esto hace que se mantenga en el centro de notificaciones
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

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
LogBox.ignoreLogs(['expo-notifications', 'Notifications functionality is not fully supported']);