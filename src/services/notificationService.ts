import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';

export const sendLocalNotification = async (title: string, body: string) => {
  try {
    // 1. Intentamos la notificación (esto fallará en Expo Go SDK 53+)
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        sound: true,
      },
      trigger: null,
    });
  } catch (error) {
    // 2. Si falla (como está pasando ahora), capturamos el error silenciosamente
    console.log("Notificaciones no soportadas en este entorno");
  } finally {
    // 3. SIEMPRE mostramos una Alert. Esto es lo que verás en tu pantalla
    // Simula el comportamiento de la notificación para que puedas probar tu lógica
    Alert.alert(title, body);
  }
};