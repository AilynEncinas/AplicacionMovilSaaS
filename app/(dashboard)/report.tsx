import { useFocusEffect } from 'expo-router'; // O de '@react-navigation/native'
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DrawerMenu } from '@/components/navigation/drawerMenu';
import { TopBar } from '@/components/navigation/TopBar';
import { MetricCard } from '@/components/reports/MetricCard';
import { StockAlerts } from '@/components/reports/StockAlerts';

// Hooks personalizados
import { useAuth } from '@/src/hooks/useAuth';
import { useReports } from '@/src/hooks/useReports';

export default function ReportScreen() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // 1. Obtenemos el usuario autenticado para sacar su storeId real
  const { user } = useAuth();
  
  // 2. Pasamos el storeId dinámico al hook de reportes
  const { data, loading, refresh } = useReports(user?.storeId || "");

  // 3. EL TRUCO: Refresco automático al entrar a la pantalla
  useFocusEffect(
    useCallback(() => {
      if (user?.storeId) {
        refresh();
      }
    }, [user?.storeId])
  );

  // 4. Función para el "Pull to Refresh" (deslizar hacia abajo)
  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  if (loading && !data) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Cargando reportes...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <DrawerMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
      <TopBar onMenuPress={() => setMenuOpen(true)} />

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#2563eb"]} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Reportes</Text>
          <Text style={styles.headerSubtitle}>
            Tienda: {user?.storeId === '888abc' ? 'SisToys' : user?.storeId}
          </Text>
        </View>

        {/* Panel de Métricas Principales */}
        <View style={styles.metricsGrid}>
          <MetricCard 
            label="Ventas Hoy" 
            value={`Bs ${data?.totalSales?.toFixed(2) || '0.00'}`} 
            icon="dollar-sign" 
            color="#22c55e"
          />
          <MetricCard 
            label="Pedidos" 
            value={data?.ordersCount?.toString() || '0'} 
            icon="shopping-cart" 
            color="#8b5cf6" 
          />
        </View>

        {/* Alertas de Inventario Bajo */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Alertas de Stock</Text>
          <StockAlerts items={data?.lowStock || []} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 20, paddingBottom: 40 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#64748b' },
  header: { marginBottom: 25 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1e293b' },
  headerSubtitle: { color: '#64748b', fontSize: 16 },
  metricsGrid: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginBottom: 20 
  },
  sectionContainer: { marginTop: 10 },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#1e293b', 
    marginBottom: 15 
  },
});