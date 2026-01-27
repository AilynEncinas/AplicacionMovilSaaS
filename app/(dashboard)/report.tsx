import { DrawerMenu } from '@/components/navigation/drawerMenu';
import { TopBar } from '@/components/navigation/TopBar';
import { MetricCard } from '@/components/reports/MetricCard';
import { StockAlerts } from '@/components/reports/StockAlerts';
import { useReports } from '@/src/hooks/useReports';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReportScreen() {
  const [menuOpen, setMenuOpen] = useState(false);
  // Reemplaza con un ID real de tu base de datos para probar
  const { data, loading } = useReports("clze..."); 

  if (loading && !data) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <DrawerMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
      <TopBar onMenuPress={() => setMenuOpen(true)} />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Reportes</Text>
          <Text style={styles.headerSubtitle}>Dashboard de ventas e inventario</Text>
        </View>

        <View style={styles.metricsGrid}>
          <MetricCard 
            label="Ventas Hoy" 
            value={`Bs ${data?.totalSales?.toFixed(2) || '0.00'}`} 
            icon="dollar-sign" 
          />
          <MetricCard 
            label="Pedidos" 
            value={data?.ordersCount?.toString() || '0'} 
            icon="shopping-cart" 
            color="#8b5cf6" 
          />
        </View>

        <StockAlerts items={data?.lowStock || []} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 20 },
  header: { marginBottom: 25 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1e293b' },
  headerSubtitle: { color: '#64748b' },
  metricsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
});