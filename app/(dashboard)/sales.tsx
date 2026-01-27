import { useAuth } from '@/src/hooks/useAuth';
import { useCart } from '@/src/hooks/useCart';
import { useProducts } from '@/src/hooks/useProducts';
import { Image as ImageIcon, Minus, Plus, Search, ShoppingCart } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SalesScreen() {
  const { user } = useAuth();
  const { products, loading } = useProducts(user?.storeId || "", user?.role || "");
  const { cart, addToCart, removeFromCart, total, itemCount } = useCart();
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter(p => 
    p.isActive && p.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: any }) => {
    const cartItem = cart.find(c => c.id === item.id);
    const uri = item.image || item.imageUrl;
    return (
      <View style={styles.productCard}>
        <View style={styles.imageContainer}>
            {uri ? (
            <Image 
                source={{ uri: uri }} 
                style={styles.productImage}
                key={item.id}
            />
            ) : (
            <View style={styles.placeholderImage}>
                <ImageIcon size={30} color="#cbd5e1" />
            </View>
            )}
        </View>

        <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.productPrice}>Bs {item.price.toFixed(2)}</Text>
            <Text style={styles.stockText}>Disponible: {item.stock}</Text>
            
            <View style={styles.counterContainer}>
                    {cartItem && (
                    <>
                        <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.btnMinus}>
                        <Minus size={18} color="#64748b" />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{cartItem.quantity}</Text>
                    </>
                    )}
                    <TouchableOpacity 
                    onPress={() => addToCart(item)} 
                    style={styles.btnPlus}
                    disabled={item.stock <= 0}
                    >
                    <Plus size={18} color="white" />
                </TouchableOpacity>
            </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <View style={styles.headerTop}>
                <Text style={styles.title}>Nueva Venta</Text>
                <View style={styles.cartBadge}>
                    <ShoppingCart size={20} color="#2563eb" />
                    {itemCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{itemCount}</Text></View>}
                </View>
            </View>
            
            <View style={styles.searchBar}>
            <Search size={20} color="#64748b" />
            <TextInput 
                placeholder="Buscar productos..." 
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
            />
            </View>
        </View>

        <FlatList 
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 15, paddingBottom: 120 }}
            numColumns={1}
        />

        {itemCount > 0 && (
            <View style={styles.footer}>
            <View>
                <Text style={styles.footerLabel}>Total a pagar</Text>
                <Text style={styles.footerTotal}>Bs {total.toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.btnCheckout} activeOpacity={0.8}>
                <Text style={styles.btnCheckoutText}>Continuar</Text>
            </TouchableOpacity>
            </View>
        )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: { padding: 20, backgroundColor: 'white', borderBottomLeftRadius: 25, borderBottomRightRadius: 25, elevation: 4 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e293b' },
  cartBadge: { padding: 8, backgroundColor: '#eff6ff', borderRadius: 12 },
  badge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#ef4444', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', padding: 12, borderRadius: 15, borderWidth: 1, borderStyle: 'solid', borderColor: '#e2e8f0' },
  searchInput: { marginLeft: 10, flex: 1, fontSize: 16 },
  
  productCard: { backgroundColor: 'white', borderRadius: 20, marginBottom: 15, flexDirection: 'row', padding: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  imageContainer: { width: 90, height: 90, borderRadius: 15, backgroundColor: '#f8fafc', overflow: 'hidden' },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  placeholderImage: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  
  productInfo: { flex: 1, marginLeft: 15 },
  productName: { fontSize: 17, fontWeight: '700', color: '#1e293b' },
  productPrice: { fontSize: 16, color: '#2563eb', fontWeight: 'bold', marginTop: 2 },
  stockText: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  
  counterContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10, alignSelf: 'flex-end' },
  btnPlus: { backgroundColor: '#2563eb', padding: 6, borderRadius: 8 },
  btnMinus: { backgroundColor: '#f1f5f9', padding: 6, borderRadius: 8 },
  quantityText: { fontSize: 16, fontWeight: 'bold', marginHorizontal: 12, color: '#1e293b' },
  
  footer: { position: 'absolute', bottom: 20, left: 15, right: 15, backgroundColor: '#1e293b', padding: 20, borderRadius: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 10 },
  footerLabel: { color: '#94a3b8', fontSize: 13 },
  footerTotal: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  btnCheckout: { backgroundColor: '#22c55e', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 15 },
  btnCheckoutText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});