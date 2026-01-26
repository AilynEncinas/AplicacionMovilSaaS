import { DrawerMenu } from '@/components/navigation/drawerMenu';
import { TopBar } from '@/components/navigation/TopBar';
import { MetricCard } from '@/components/reports/MetricCard';
import { StockAlerts } from '@/components/reports/StockAlerts';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ReportScreen() {
  const [menuOpen, setMenuOpen] = useState(false);

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
          <MetricCard label="Ventas Totales" value="Bs 17.809,89" icon="dollar-sign" />
          <MetricCard label="Pedidos" value="28" icon="shopping-cart" color="#8b5cf6" />
        </View>

        <StockAlerts />
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