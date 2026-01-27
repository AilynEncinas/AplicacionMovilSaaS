import { TopBar } from '@/components/navigation/TopBar';
import { DrawerMenu } from '@/components/navigation/drawerMenu';
import { useAuth } from '@/src/hooks/useAuth';
import { Product, useProducts } from '@/src/hooks/useProducts';
import { EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProductsScreen() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth(); 

  const storeId = user?.storeId || ""; 
  const userRole = user?.role || "seller"; 

  const { products, loading, refresh } = useProducts(storeId, userRole);

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={[styles.productCard, !item.isActive && styles.inactiveCard]}>
      <View style={styles.productInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.productName}>{item.name}</Text>
          {!item.isActive && <EyeOff size={16} color="#94a3b8" style={{marginLeft: 8}} />}
        </View>
        <Text style={styles.productCode}>Cod: {item.code}</Text>
      </View>
      
      <View style={styles.productStats}>
        <Text style={styles.productPrice}>Bs {item.price.toFixed(2)}</Text>
        <View style={[styles.stockBadge, item.stock < 10 ? styles.lowStock : styles.normalStock]}>
          <Text style={styles.stockText}>{item.stock} disponibles</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <DrawerMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
      <TopBar onMenuPress={() => setMenuOpen(true)} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Inventario</Text>
          <Text style={styles.subtitle}>Mostrando productos de sucursal</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderProduct}
            contentContainerStyle={styles.list}
            refreshing={loading}
            onRefresh={refresh}
            ListEmptyComponent={<Text style={styles.empty}>No hay productos para mostrar.</Text>}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

// ESTILOS
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { flex: 1, padding: 20 },
  header: { marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1e293b' },
  subtitle: { color: '#64748b' },
  list: { paddingBottom: 20 },
  productCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  productInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center' }, 
  inactiveCard: { backgroundColor: '#f1f5f9', opacity: 0.8 },
  productName: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  productCode: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  productStats: { alignItems: 'flex-end' },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: '#2563eb', marginBottom: 4 },
  stockBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  normalStock: { backgroundColor: '#dcfce7' },
  lowStock: { backgroundColor: '#fee2e2' },
  stockText: { fontSize: 11, fontWeight: '600', color: '#1e293b' },
  empty: { textAlign: 'center', marginTop: 40, color: '#64748b' }
});