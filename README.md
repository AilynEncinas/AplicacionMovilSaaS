# 📦 Sistema de Gestión de Inventario y Ventas

Este sistema es una solución móvil integral diseñada para optimizar el control de productos, la gestión de ventas y la comunicación de stock en tiempo real. Permite a los administradores y vendedores llevar un registro preciso de los movimientos del negocio desde cualquier lugar.

## 🚀 Funcionalidades Principales
- **Control de Inventario:** Visualización de stock con filtros dinámicos por nombre y categoría.
- **Gestión de Ventas:** Registro de transacciones con búsqueda de clientes y emisión de tickets (PDF).
- **Notificaciones:** Alertas de stock bajo con indicadores visuales (badges) y campanas.
- **Seguridad:** Autenticación de usuarios y protección de rutas.

## 🛠️ Requisitos de Instalación

Ejecuta los siguientes comandos para configurar todas las dependencias necesarias:

### Backend & Seguridad
```bash
npm install cors
npm install -D @types/cors

### Interfaz y Gráficos (Iconos Lucide)
```bash
npx expo install react-native-svg lucide-react-native

### Almacenamiento Local
```bash
npx expo install @react-native-async-storage/async-storage

### Impresión, Compartir y Notificaciones
```bash
npx expo install expo-print expo-sharing
npx expo install expo-notifications

### Herramientas de Despliegue (EAS)
```bash
npm install -g eas-cli

##🚦 Cómo empezar

1. Clona este repositorio.
2. Instala las dependencias mencionadas arriba.
3. Inicia el proyecto con npx expo start.
