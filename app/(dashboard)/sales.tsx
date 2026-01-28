import apiClient from '@/src/api/client';
import { useAuth } from '@/src/hooks/useAuth';
import { useCart } from '@/src/hooks/useCart';
import { useProducts } from '@/src/hooks/useProducts';
import {
  Banknote,
  Image as ImageIcon,
  Minus,
  Plus,
  QrCode,
  Search,
  ShoppingCart,
  X
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SalesScreen() {
  const { user } = useAuth();
  const { products, loading } = useProducts(user?.storeId || "", user?.role || "");
  const { cart, addToCart, removeFromCart, total, itemCount, clearCart } = useCart();
  
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'EFECTIVO' | 'QR' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [clientNit, setClientNit] = useState('');
  const [clientName, setClientName] = useState('');
  const [foundClient, setFoundClient] = useState<any>(null);
  const [isValidatingClient, setIsValidatingClient] = useState(false);

  // --- NUEVO ESTADO PARA EL QR ---
  const [qrModalVisible, setQrModalVisible] = useState(false);

  const filteredProducts = products.filter(p => 
    p.isActive && p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearchClient = async () => {
    if (!clientNit) return;
    setIsValidatingClient(true);
    try {
      const response = await apiClient.post('/clients', { 
        nit: clientNit, 
        storeId: user?.storeId 
      });
      if (response.data.success) {
        setFoundClient(response.data.client);
        setClientName(response.data.client.name);
      }
    } catch (error: any) {
      setFoundClient(null);
      setClientName('');
      Alert.alert("Nuevo Cliente", "NIT no encontrado. Por favor ingrese el nombre para registrarlo.");
    } finally {
      setIsValidatingClient(false);
    }
  };

  // --- FUNCIÓN PARA LIMPIAR TODO TRAS LA VENTA ---
  const resetForm = () => {
    setModalVisible(false);
    setQrModalVisible(false);
    setPaymentMethod(null);
    setClientNit('');
    setClientName('');
    setFoundClient(null);
    clearCart();
  };

  // --- LÓGICA DE ENVÍO A LA BASE DE DATOS ---
  const processSale = async () => {
    setIsProcessing(true);
    try {
      let finalClientId = foundClient?.id;
      
      if (!foundClient) {
        const clientRes = await apiClient.post('/clients', {
          nit: clientNit,
          name: clientName,
          storeId: user?.storeId
        });
        
        if (clientRes.data.success) {
          finalClientId = clientRes.data.client.id;
        } else {
          throw new Error("No se pudo registrar al nuevo cliente");
        }
      }

      const saleData = {
        storeId: user?.storeId,
        sellerId: user?.id,
        clientId: finalClientId, 
        total: total,
        subtotal: total, 
        items: cart.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const response = await apiClient.post('/sales', saleData);

      if (response.data.success) {
        Alert.alert("¡Venta Exitosa!", "Venta registrada con éxito.", [
          { text: "Finalizar", onPress: resetForm }
        ]);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message;
      Alert.alert("Error de Venta", errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  // --- MANEJADOR DEL BOTÓN CONFIRMAR ---
  const handleFinalizeSale = async () => {
    if (!paymentMethod) {
      Alert.alert("Atención", "Selecciona un método de pago");
      return;
    }

    if (!clientNit || (!foundClient && !clientName)) {
      Alert.alert("Atención", "Debe identificar o registrar al cliente");
      return;
    }

    if (paymentMethod === 'QR') {
      setQrModalVisible(true); // Abre el modal del QR
    } else {
      await processSale(); // Procesa directo si es efectivo
    }
  };
  
  const renderItem = ({ item }: { item: any }) => {
    const cartItem = cart.find(c => c.id === item.id);
    return (
      <View style={styles.productCard}>
        <View style={styles.imageContainer}>
            {item.image ? (
            <Image source={{ uri: item.image }} style={styles.productImage} />
            ) : (
            <View style={styles.placeholderImage}><ImageIcon size={30} color="#cbd5e1" /></View>
            )}
        </View>

        <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.productPrice}>Bs {item.price.toFixed(2)}</Text>
            <Text style={styles.stockText}>Stock: {item.stock}</Text>
            
            <View style={styles.counterContainer}>
                {cartItem && (
                <>
                    <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.btnMinus}>
                      <Minus size={18} color="#64748b" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{cartItem.quantity}</Text>
                </>
                )}
                <TouchableOpacity onPress={() => addToCart(item)} style={styles.btnPlus} disabled={item.stock <= 0}>
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
            ListEmptyComponent={!loading ? <Text style={styles.emptyText}>No hay productos</Text> : null}
        />

        {itemCount > 0 && (
            <View style={styles.footer}>
                <View>
                    <Text style={styles.footerLabel}>Total</Text>
                    <Text style={styles.footerTotal}>Bs {total.toFixed(2)}</Text>
                </View>
                <TouchableOpacity style={styles.btnCheckout} onPress={() => setModalVisible(true)}>
                    <Text style={styles.btnCheckoutText}>Continuar</Text>
                </TouchableOpacity>
            </View>
        )}

        {/* MODAL 1: DATOS DEL CLIENTE */}
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.modalOverlay}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Datos del Cliente</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}><X size={24} color="#64748b" /></TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>NIT / CI del Cliente</Text>
                <View style={styles.searchBar}>
                  <TextInput 
                    style={styles.searchInput} 
                    placeholder="Ingrese NIT..." 
                    keyboardType="numeric"
                    value={clientNit}
                    onChangeText={setClientNit}
                  />
                  <TouchableOpacity onPress={handleSearchClient} disabled={isValidatingClient}>
                    {isValidatingClient ? <ActivityIndicator size="small" color="#2563eb" /> : <Search size={20} color="#2563eb" />}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre / Razón Social</Text>
                <TextInput 
                  style={[styles.input, foundClient && styles.inputDisabled]} 
                  placeholder="Nombre del cliente" 
                  value={clientName}
                  onChangeText={setClientName}
                  editable={!foundClient}
                />
              </View>

              <Text style={styles.sectionLabel}>Método de Pago</Text>
              <View style={styles.paymentOptions}>
                <TouchableOpacity 
                  style={[styles.payOption, paymentMethod === 'EFECTIVO' && styles.payOptionActive]}
                  onPress={() => setPaymentMethod('EFECTIVO')}
                >
                  <Banknote size={24} color={paymentMethod === 'EFECTIVO' ? '#2563eb' : '#64748b'} />
                  <Text style={[styles.payText, paymentMethod === 'EFECTIVO' && styles.payTextActive]}>Efectivo</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.payOption, paymentMethod === 'QR' && styles.payOptionActive]}
                  onPress={() => setPaymentMethod('QR')}
                >
                  <QrCode size={24} color={paymentMethod === 'QR' ? '#2563eb' : '#64748b'} />
                  <Text style={[styles.payText, paymentMethod === 'QR' && styles.payTextActive]}>QR</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={[styles.btnFinalize, (!paymentMethod || !clientNit) && styles.btnDisabled]}
                onPress={handleFinalizeSale}
                disabled={isProcessing}
              >
                {isProcessing ? <ActivityIndicator color="white" /> : <Text style={styles.btnFinalizeText}>Confirmar Bs {total.toFixed(2)}</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>

        {/* MODAL 2: NUEVO MODAL DE PAGO CON QR */}
        <Modal animationType="fade" transparent={true} visible={qrModalVisible}>
          <View style={styles.qrModalOverlay}>
            <View style={styles.qrContainer}>
              <Text style={styles.qrTitle}>Pago con QR</Text>
              <Text style={styles.qrSubtitle}>Escanea para pagar Bs {total.toFixed(2)}</Text>
              
              <View style={styles.qrImageWrapper}>
                <Image 
                  source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=SisToys-Venta-${total}` }} 
                  style={styles.qrImage} 
                />
              </View>

              <TouchableOpacity 
                style={[styles.btnFinalize, { width: '100%', backgroundColor: '#22c55e' }]} 
                onPress={processSale} 
                disabled={isProcessing}
              >
                {isProcessing ? <ActivityIndicator color="white" /> : <Text style={styles.btnFinalizeText}>Confirmar Pago</Text>}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setQrModalVisible(false)} style={{ marginTop: 15 }}>
                <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

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
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 15, borderWidth: 1, borderColor: '#e2e8f0' },
  searchInput: { marginLeft: 10, flex: 1, fontSize: 16, height: 40 },
  productCard: { backgroundColor: 'white', borderRadius: 20, marginBottom: 15, flexDirection: 'row', padding: 12, alignItems: 'center', elevation: 3 },
  imageContainer: { width: 80, height: 80, borderRadius: 15, backgroundColor: '#f8fafc', overflow: 'hidden' },
  productImage: { width: '100%', height: '100%' },
  placeholderImage: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  productInfo: { flex: 1, marginLeft: 15 },
  productName: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  productPrice: { fontSize: 15, color: '#2563eb', fontWeight: 'bold' },
  stockText: { fontSize: 12, color: '#94a3b8' },
  counterContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5, alignSelf: 'flex-end' },
  btnPlus: { backgroundColor: '#2563eb', padding: 6, borderRadius: 8 },
  btnMinus: { backgroundColor: '#f1f5f9', padding: 6, borderRadius: 8 },
  quantityText: { fontSize: 16, fontWeight: 'bold', marginHorizontal: 12 },
  footer: { position: 'absolute', bottom: 20, left: 15, right: 15, backgroundColor: '#1e293b', padding: 15, borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerLabel: { color: '#94a3b8', fontSize: 12 },
  footerTotal: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  btnCheckout: { backgroundColor: '#22c55e', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12 },
  btnCheckoutText: { color: 'white', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, color: '#64748b', marginBottom: 5 },
  input: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  inputDisabled: { backgroundColor: '#e2e8f0', color: '#64748b' },
  sectionLabel: { fontSize: 15, fontWeight: '600', marginBottom: 10 },
  paymentOptions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  payOption: { flex: 0.48, padding: 15, borderRadius: 15, alignItems: 'center', borderWidth: 2, borderColor: '#f1f5f9' },
  payOptionActive: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  payText: { marginTop: 5, fontSize: 12 },
  payTextActive: { color: '#2563eb', fontWeight: 'bold' },
  btnFinalize: { backgroundColor: '#2563eb', padding: 15, borderRadius: 15, alignItems: 'center' },
  btnFinalizeText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  btnDisabled: { backgroundColor: '#cbd5e1' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#94a3b8' },

  // --- ESTILOS DEL QR ---
  qrModalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  qrContainer: { 
    width: '85%', 
    backgroundColor: 'white', 
    borderRadius: 30, 
    padding: 25, 
    alignItems: 'center' 
  },
  qrTitle: { fontSize: 20, fontWeight: 'bold', color: '#1e293b', marginBottom: 5 },
  qrSubtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 20 },
  qrImageWrapper: { 
    padding: 10, 
    backgroundColor: 'white', 
    borderRadius: 20, 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9'
  },
  qrImage: { width: 220, height: 220 },
});