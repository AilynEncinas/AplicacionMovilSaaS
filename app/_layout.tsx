import { AuthProvider } from '@/src/context/AuthContext';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { LogBox } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true, 
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