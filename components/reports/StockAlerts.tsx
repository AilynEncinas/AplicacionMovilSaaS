import { AlertTriangle } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const StockAlerts = () => {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <AlertTriangle size={20} color="#f59e0b" />
        <Text style={styles.sectionTitle}>Alertas de Stock</Text>
      </View>
      
      <View style={styles.tableRow}>
        <Text style={styles.tableLabel}>Camisa blanca</Text>
        <Text style={styles.tableValue}>1 unid.</Text>
      </View>

      <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
        <Text style={styles.tableLabel}>Pantalón Jean</Text>
        <Text style={styles.tableValue}>3 unid.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionCard: { backgroundColor: '#fff', padding: 20, borderRadius: 24, marginTop: 25, elevation: 2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 10, color: '#1e293b' },
  tableRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f8fafc' 
  },
  tableLabel: { color: '#475569', fontSize: 15 },
  tableValue: { fontWeight: 'bold', color: '#ef4444' }
});