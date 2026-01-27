import { AlertTriangle } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// 1. Definimos la forma de los datos que recibiremos
interface StockItem {
  name: string;
  stock: number;
}

interface Props {
  items: StockItem[];
}

// 2. Pasamos las Props al componente
export const StockAlerts = ({ items }: Props) => {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <AlertTriangle size={20} color="#f59e0b" />
        <Text style={styles.sectionTitle}>Alertas de Stock</Text>
      </View>
      
      {items.length === 0 ? (
        <Text style={styles.emptyText}>Ninguna alerta de stock</Text>
      ) : (
        items.map((product, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableLabel}>{product.name}</Text>
            <Text style={styles.tableValue}>{product.stock} unid.</Text>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionCard: { backgroundColor: '#fff', padding: 20, borderRadius: 24, marginTop: 25, elevation: 2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 10, color: '#1e293b' },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f8fafc' },
  tableLabel: { color: '#475569', fontSize: 15 },
  tableValue: { fontWeight: 'bold', color: '#ef4444' },
  emptyText: { color: '#64748b', textAlign: 'center', marginTop: 10 }
});