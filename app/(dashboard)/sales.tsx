import apiClient from '@/src/api/client';
import { useAuth } from '@/src/hooks/useAuth';
import { useCart } from '@/src/hooks/useCart';
import { useProducts } from '@/src/hooks/useProducts';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
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
  Dimensions,
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
const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 40) / 2;

export default function SalesScreen() {
  const { user } = useAuth();
  const { products, loading } = useProducts(user?.storeId || "", user?.role || "");
  // Asumiendo que useCart tiene updateQuantity para el input manual
  const { cart, addToCart, removeFromCart, updateQuantity, total, itemCount, clearCart } = useCart();
  
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  
  const [paymentMethod, setPaymentMethod] = useState<'EFECTIVO' | 'QR' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientNit, setClientNit] = useState('');
  const [clientName, setClientName] = useState('');
  const [foundClient, setFoundClient] = useState<any>(null);
  const [isValidatingClient, setIsValidatingClient] = useState(false);

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
        const client = response.data.client;

        // VALIDACIÓN DE CLIENTE ACTIVO
        if (client.isActive === false) {
          setFoundClient(null);
          setClientName('');
          Alert.alert(
            "Cliente Inactivo", 
            "Este cliente se encuentra desactivado y no puede realizar compras. Por favor, actívelo desde la sección de Clientes."
          );
        } else {
          // Cliente encontrado y activo
          setFoundClient(client);
          setClientName(client.name);
        }
      }
    } catch (error: any) {
      setFoundClient(null);
      setClientName('');
      // Si el error es 404 o similar, asumimos que es nuevo
      Alert.alert("Nuevo Cliente", "NIT no encontrado. Ingrese el nombre para registrarlo.");
    } finally {
      setIsValidatingClient(false);
    }
  };

  const resetForm = () => {
    setModalVisible(false);
    setQrModalVisible(false);
    setCartModalVisible(false);
    setPaymentMethod(null);
    setClientNit('');
    setClientName('');
    setFoundClient(null);
    clearCart();
  };

  const processSale = async () => {
    // Validación de seguridad
    if (cart.length === 0) return;

    setIsProcessing(true);
    try {
      // 1. Construir el objeto de venta
      const saleData = {
        storeId: user?.storeId,
        sellerId: user?.id,
        clientId: foundClient?.id || null, // ID si existe
        clientNit: clientNit,              // Datos para el registro si es nuevo
        clientName: clientName,
        total: total,
        paymentMethod: paymentMethod,
        items: cart.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      // 2. Enviar al backend
      const response = await apiClient.post('/sales', saleData);

      if (response.data.success) {
        Alert.alert(
          "¡Venta Exitosa!", 
          "¿Deseas generar el comprobante de venta?", 
          [
            { text: "No, finalizar", onPress: resetForm },
            { 
              text: "SÍ, GENERAR PDF", 
              onPress: async () => {
                await generatePDF(saleData); // Ahora saleData sí existe aquí
                resetForm();
              }
            }
          ]
        );
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error de Venta", error.response?.data?.message || "No se pudo procesar la venta");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinalizeSale = async () => {
    if (!paymentMethod || !clientNit) {
      Alert.alert("Atención", "Complete el método de pago y NIT");
      return;
    }
    if (paymentMethod === 'QR') setQrModalVisible(true);
    else await processSale();
  };

  // --- RENDERIZADO EN GRID ---
  const renderItem = ({ item }: { item: any }) => {
    const cartItem = cart.find(c => c.id === item.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    return (
      <View style={styles.gridCard}>
        <View style={styles.gridImageContainer}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.gridImage} />
          ) : (
            <View style={styles.placeholderImage}><ImageIcon size={40} color="#cbd5e1" /></View>
          )}
          {quantity > 0 && (
            <View style={styles.quantityBadge}>
              <Text style={styles.quantityBadgeText}>{quantity}</Text>
            </View>
          )}
        </View>

        <View style={styles.gridInfo}>
          <Text style={styles.gridName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.gridPrice}>Bs {item.price.toFixed(2)}</Text>
          <Text style={styles.gridStock}>Stock: {item.stock}</Text>
          
          <View style={styles.gridActions}>
            <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.actionBtn}>
              <Minus size={16} color="#64748b" />
            </TouchableOpacity>
            
            <TextInput
              style={styles.manualInput}
              keyboardType="numeric"
              value={quantity.toString()}
              onChangeText={(val) => {
                if (val === '') return updateQuantity(item.id, 0);
                
                const num = parseInt(val);
                if (isNaN(num)) return;

                if (num > item.stock) {
                  Alert.alert("Límite de Stock", `Solo hay ${item.stock} disponibles.`);
                  updateQuantity(item.id, item.stock);
                } else {
                  updateQuantity(item.id, num);
                }
              }}
            />

            <TouchableOpacity 
              onPress={() => addToCart(item)} 
              style={[
                styles.actionBtn, 
                { backgroundColor: '#2563eb' },
                (cart.find(c => c.id === item.id)?.quantity >= item.stock) && { backgroundColor: '#cbd5e1' }
              ]}
              disabled={item.stock <= 0 || (cart.find(c => c.id === item.id)?.quantity >= item.stock)}
            >
              <Plus size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const generatePDF = async (saleData: any) => {
    const htmlContent = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; color: #333; }
            .header { text-align: center; border-bottom: 2px dashed #bbb; padding-bottom: 10px; margin-bottom: 10px; }
            .store-name { font-size: 24px; font-weight: bold; text-transform: uppercase; }
            .info { font-size: 12px; margin-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { border-bottom: 1px solid #333; text-align: left; font-size: 12px; padding: 5px 0; }
            td { padding: 8px 0; font-size: 12px; border-bottom: 1px solid #eee; }
            .total-section { margin-top: 15px; border-top: 2px solid #333; padding-top: 10px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .total { font-size: 18px; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; font-size: 10px; color: #777; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="store-name">SISTOYS</div>
            <div class="info">La Paz - Bolivia</div>
            <div class="info">Vendedor: ${user?.name || 'Caja 1'}</div>
            <div class="info">Fecha: ${new Date().toLocaleString()}</div>
          </div>

          <div class="info"><strong>Cliente:</strong> ${clientName || 'S/N'}</div>
          <div class="info"><strong>NIT/CI:</strong> ${clientNit || '0'}</div>

          <table>
            <thead>
              <tr>
                <th style="width: 50%">Producto</th>
                <th style="width: 10%">Cant</th>
                <th style="width: 20%">P.Unit</th>
                <th style="width: 20%; text-align: right;">Subt</th>
              </tr>
            </thead>
            <tbody>
              ${cart.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td style="text-align: right;">${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total-section">
            <div class="row">
              <span>Subtotal:</span>
              <span>Bs ${total.toFixed(2)}</span>
            </div>
            <div class="row">
              <span>Descuento:</span>
              <span>Bs 0.00</span>
            </div>
            <div class="row total">
              <span>TOTAL:</span>
              <span>Bs ${total.toFixed(2)}</span>
            </div>
          </div>

          <div class="footer">
            <p>¡Gracias por su compra!</p>
            <p>Este documento es un comprobante de venta interno.</p>
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      Alert.alert("Error", "No se pudo generar el PDF");
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Nueva Venta</Text>
          <TouchableOpacity onPress={() => setCartModalVisible(true)} style={styles.cartBadge}>
            <ShoppingCart size={22} color="#2563eb" />
            {itemCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{itemCount}</Text></View>}
          </TouchableOpacity>
        </View>
        <View style={styles.searchBar}>
          <Search size={20} color="#64748b" />
          <TextInput placeholder="Buscar productos..." style={styles.searchInput} value={search} onChangeText={setSearch} />
        </View>
      </View>

      <FlatList 
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={{ padding: 10, paddingBottom: 120 }}
        ListEmptyComponent={!loading ? <Text style={styles.emptyText}>No hay productos</Text> : null}
      />

      {itemCount > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setCartModalVisible(true)}>
            <Text style={styles.footerLabel}>Ver detalle ({itemCount}) ▲</Text>
            <Text style={styles.footerTotal}>Bs {total.toFixed(2)}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnCheckout} onPress={() => setModalVisible(true)}>
            <Text style={styles.btnCheckoutText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* MODAL RESUMEN */}
      <Modal animationType="fade" transparent visible={cartModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '80%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Resumen del Pedido</Text>
              <TouchableOpacity onPress={() => setCartModalVisible(false)}><X size={24} color="#64748b" /></TouchableOpacity>
            </View>
            <FlatList
              data={cart}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.cartSummaryItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.summaryItemName}>{item.name}</Text>
                    <Text style={styles.summaryItemDetails}>Bs {item.price.toFixed(2)} c/u</Text>
                  </View>
                  <TextInput
                    style={styles.summaryInput}
                    keyboardType="numeric"
                    value={item.quantity.toString()}
                    onChangeText={(v) => updateQuantity(item.id, parseInt(v) || 0)}
                  />
                  <Text style={styles.summaryItemTotal}>Bs {(item.quantity * item.price).toFixed(2)}</Text>
                </View>
              )}
            />
            <View style={styles.summaryFooter}>
              <Text style={styles.summaryTotalValue}>Total: Bs {total.toFixed(2)}</Text>
              <TouchableOpacity style={styles.btnFinalize} onPress={() => {setCartModalVisible(false); setModalVisible(true);}}>
                <Text style={styles.btnFinalizeText}>Ir a pagar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL CLIENTE */}
      <Modal animationType="slide" transparent visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Datos del Cliente</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}><X size={24} color="#64748b" /></TouchableOpacity>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>NIT / CI</Text>
              <View style={styles.searchBar}>
                <TextInput 
                  style={styles.searchInput} 
                  placeholder="NIT..." 
                  keyboardType="numeric" 
                  value={clientNit} 
                  onChangeText={(text) => {
                    setClientNit(text);
                    if (foundClient) {
                      setFoundClient(null);
                      setClientName('');
                    }
                  }} 
                />
                <TouchableOpacity onPress={handleSearchClient} disabled={isValidatingClient}>
                  {isValidatingClient ? <ActivityIndicator size="small" color="#2563eb" /> : <Search size={20} color="#2563eb" />}
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput style={[styles.input, foundClient && styles.inputDisabled]} placeholder="Nombre..." value={clientName} onChangeText={setClientName} editable={!foundClient} />
            </View>
            <Text style={styles.sectionLabel}>Método de Pago</Text>
            <View style={styles.paymentOptions}>
              <TouchableOpacity style={[styles.payOption, paymentMethod === 'EFECTIVO' && styles.payOptionActive]} onPress={() => setPaymentMethod('EFECTIVO')}>
                <Banknote size={24} color={paymentMethod === 'EFECTIVO' ? '#2563eb' : '#64748b'} />
                <Text style={[styles.payText, paymentMethod === 'EFECTIVO' && styles.payTextActive]}>Efectivo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.payOption, paymentMethod === 'QR' && styles.payOptionActive]} onPress={() => setPaymentMethod('QR')}>
                <QrCode size={24} color={paymentMethod === 'QR' ? '#2563eb' : '#64748b'} />
                <Text style={[styles.payText, paymentMethod === 'QR' && styles.payTextActive]}>QR</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.btnFinalize} onPress={handleFinalizeSale} disabled={isProcessing}>
              {isProcessing ? <ActivityIndicator color="white" /> : <Text style={styles.btnFinalizeText}>Confirmar Bs {total.toFixed(2)}</Text>}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* MODAL QR */}
      <Modal animationType="fade" transparent visible={qrModalVisible}>
        <View style={styles.qrModalOverlay}>
          <View style={styles.qrContainer}>
            <Text style={styles.qrTitle}>Pago con QR</Text>
            <View style={styles.qrImageWrapper}>
              <Image source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=SisToys-${total}` }} style={styles.qrImage} />
            </View>
            <TouchableOpacity style={[styles.btnFinalize, { backgroundColor: '#22c55e' }]} onPress={processSale} disabled={isProcessing}>
              <Text style={styles.btnFinalizeText}>Confirmar Pago</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setQrModalVisible(false)} style={{ marginTop: 15 }}>
              <Text style={{ color: '#ef4444' }}>Cancelar</Text>
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
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', paddingHorizontal: 12, borderRadius: 15, borderWidth: 1, borderColor: '#e2e8f0' },
  searchInput: { marginLeft: 10, flex: 1, height: 45 },
  
  // GRID STYLES
  gridCard: { backgroundColor: 'white', borderRadius: 15, margin: 5, width: COLUMN_WIDTH, elevation: 3, overflow: 'hidden' },
  gridImageContainer: { width: '100%', height: 140, backgroundColor: '#f8fafc' },
  gridImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  placeholderImage: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  quantityBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#2563eb', borderRadius: 10, paddingHorizontal: 6 },
  quantityBadgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  gridInfo: { padding: 10 },
  gridName: { fontSize: 14, fontWeight: 'bold', color: '#1e293b' },
  gridPrice: { fontSize: 15, color: '#2563eb', fontWeight: '800' },
  gridStock: { fontSize: 11, color: '#94a3b8' },
  gridActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  actionBtn: { backgroundColor: '#f1f5f9', padding: 6, borderRadius: 8 },
  manualInput: { width: 35, textAlign: 'center', fontWeight: 'bold', fontSize: 14, borderBottomWidth: 1, borderBottomColor: '#cbd5e1' },
  
  footer: { position: 'absolute', bottom: 20, left: 15, right: 15, backgroundColor: '#1e293b', padding: 15, borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 10 },
  footerLabel: { color: '#94a3b8', fontSize: 12 },
  footerTotal: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  btnCheckout: { backgroundColor: '#22c55e', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12 },
  btnCheckoutText: { color: 'white', fontWeight: 'bold' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  
  // SUMMARY MODAL
  cartSummaryItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  summaryItemName: { fontSize: 15, fontWeight: '600' },
  summaryItemDetails: { fontSize: 12, color: '#64748b' },
  summaryInput: { backgroundColor: '#f1f5f9', width: 45, textAlign: 'center', borderRadius: 5, marginHorizontal: 10, padding: 4, fontWeight: 'bold' },
  summaryItemTotal: { fontSize: 15, fontWeight: '700', width: 80, textAlign: 'right' },
  summaryFooter: { marginTop: 15, paddingTop: 15, borderTopWidth: 2, borderTopColor: '#f1f5f9' },
  summaryTotalValue: { fontSize: 20, fontWeight: 'bold', color: '#2563eb', textAlign: 'center', marginBottom: 10 },
  
  btnFinalize: { backgroundColor: '#2563eb', padding: 15, borderRadius: 15, alignItems: 'center' },
  btnFinalizeText: { color: 'white', fontWeight: 'bold' },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, color: '#64748b', marginBottom: 5 },
  input: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  inputDisabled: { backgroundColor: '#e2e8f0', color: '#64748b' },
  sectionLabel: { fontSize: 15, fontWeight: '600', marginVertical: 10 },
  paymentOptions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  payOption: { flex: 0.48, padding: 15, borderRadius: 15, alignItems: 'center', borderWidth: 2, borderColor: '#f1f5f9' },
  payOptionActive: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  payText: { marginTop: 5, fontSize: 12 },
  payTextActive: { color: '#2563eb', fontWeight: 'bold' },
  qrModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  qrContainer: { width: '85%', backgroundColor: 'white', borderRadius: 30, padding: 25, alignItems: 'center' },
  qrTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  qrImageWrapper: { padding: 10, backgroundColor: 'white', borderRadius: 20, marginBottom: 20, borderWidth: 1, borderColor: '#f1f5f9' },
  qrImage: { width: 220, height: 220 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#94a3b8' }
});