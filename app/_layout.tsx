// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)/index" /> 
      <Stack.Screen name="(auth)/register" />
      <Stack.Screen name="(dashboard)/report" />
    </Stack>
  );
}