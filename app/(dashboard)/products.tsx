import { TopBar } from '@/components/navigation/TopBar';
import { DrawerMenu } from '@/components/navigation/drawerMenu';
import { useAuth } from '@/src/hooks/useAuth';
import { Product, useProducts } from '@/src/hooks/useProducts';
import { EyeOff, Search, X } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProductsScreen() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  
  const { user } = useAuth(); 
  const storeId = user?.storeId || ""; 
  const userRole = user?.role || "seller"; 
  const { products, loading, refresh } = useProducts(storeId, userRole);

  // 1. Extraer categorías únicas de los productos
  const categories = useMemo(() => {
    const uniqueCats = Array.from(new Set(products.map(p => p.category || 'Sin Categoría')));
    return ['Todos', ...uniqueCats];
  }, [products]);

  // 2. Lógica de filtrado combinada (Nombre + Categoría)
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesName = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
      return matchesName && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={[styles.productCard, !item.isActive && styles.inactiveCard]}>
      <View style={styles.productInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.productName}>{item.name}</Text>
          {!item.isActive && <EyeOff size={14} color="#94a3b8" style={{marginLeft: 8}} />}
        </View>
        <Text style={styles.productCode}>Cod: {item.code} • <Text style={{color: '#64748b'}}>{item.category}</Text></Text>
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
          
          {/* BUSCADOR */}
          <View style={styles.searchContainer}>
            <Search size={18} color="#64748b" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nombre o código..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={18} color="#64748b" />
              </TouchableOpacity>
            )}
          </View>

          {/* FILTRO DE CATEGORÍAS */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderProduct}
            contentContainerStyle={styles.list}
            refreshing={loading}
            onRefresh={refresh}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.empty}>No se encontraron productos</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { flex: 1, paddingHorizontal: 20 },
  header: { marginTop: 10, marginBottom: 15 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1e293b', marginBottom: 15 },
  
  // Estilos Buscador
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#1e293b' },

  // Estilos Categorías
  categoriesScroll: { marginTop: 15, marginBottom: 5 },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    height: 36,
  },
  categoryChipActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  categoryText: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  categoryTextActive: { color: '#fff' },

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
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
  },
  productInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center' }, 
  inactiveCard: { backgroundColor: '#f1f5f9', opacity: 0.8 },
  productName: { fontSize: 15, fontWeight: '600', color: '#1e293b' },
  productCode: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  productStats: { alignItems: 'flex-end' },
  productPrice: { fontSize: 15, fontWeight: 'bold', color: '#2563eb', marginBottom: 4 },
  stockBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  normalStock: { backgroundColor: '#dcfce7' },
  lowStock: { backgroundColor: '#fee2e2' },
  stockText: { fontSize: 11, fontWeight: '600', color: '#1e293b' },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  empty: { textAlign: 'center', color: '#94a3b8', fontSize: 15 }
});