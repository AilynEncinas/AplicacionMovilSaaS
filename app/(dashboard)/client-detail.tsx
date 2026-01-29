import apiClient from '@/src/api/client';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  Calendar,
  CheckCircle,
  Edit,
  MoreVertical,
  Package,
  Save,
  Trash2,
  X
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ClientDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const [menuVisible, setMenuVisible] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [form, setForm] = useState({ name: '', nit: '', phone: '' });

  const loadDetail = async () => {
    try {
      const res = await apiClient.get(`/clients/${id}`);
      if (res.data.success) {
        setData(res.data.client);
        setForm({
          name: res.data.client.name,
          nit: res.data.client.nit,
          phone: res.data.client.phone || ''
        });
      }
    } catch (e) {
      console.error("Error al cargar historial", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadDetail();
  }, [id]);

  const formatDate = (order: any) => {
    if (!order.createAt) return "Reciente";
    const d = new Date(order.createAt);
    return `${d.toLocaleDateString('es-ES')} - ${d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
  };

  const handleUpdate = async () => {
    try {
      const res = await apiClient.patch(`/clients/${id}`, form);
      if (res.data.success) {
        setData({ ...data, ...form });
        setEditModal(false);
        Alert.alert("Éxito", "Cliente actualizado");
      }
    } catch {
      Alert.alert("Error", "No se pudo actualizar");
    }
  };

  const toggleStatus = () => {
    setMenuVisible(false);
    const isCurrentlyInactive = data?.isActive === false;
    const title = isCurrentlyInactive ? "Activar Cliente" : "Desactivar Cliente";
    const message = isCurrentlyInactive 
      ? "¿Deseas habilitar a este cliente para nuevas ventas?" 
      : "¿Estás seguro de desactivar a este cliente?";

    Alert.alert(title, message, [
      { text: "Cancelar", style: "cancel" },
      {
        text: isCurrentlyInactive ? "Activar" : "Desactivar",
        style: isCurrentlyInactive ? "default" : "destructive",
        onPress: async () => {
          try {
            console.log("Intentando cambiar estado. Actual es inactivo:", isCurrentlyInactive);
            
            let res;
            if (isCurrentlyInactive) {
              res = await apiClient.patch(`/clients/${id}`, { 
                isActive: true 
              });
            } else {
              res = await apiClient.delete(`/clients/${id}`);
            }

            console.log("Respuesta del servidor:", res.data);

            if (res.status === 200 || res.status === 201 || res.data.success) {
              Alert.alert("Éxito", isCurrentlyInactive ? "Cliente activado" : "Cliente desactivado");
              await loadDetail(); 
            } else {
              Alert.alert("Aviso", "El servidor no confirmó el cambio, pero no hubo error.");
            }
          } catch (error: any) {
            console.error("Error detallado:", error.response?.data || error.message);
            Alert.alert("Error", "No se pudo cambiar el estado. Revisa la consola.");
          }
        }
      }
    ]);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#2563eb" /></View>;

  const isInactive = data?.isActive === false;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
        
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 15 }}>
          <Text style={{ color: '#64748b', fontWeight: 'bold' }}>← Volver</Text>
        </TouchableOpacity>

        {/* TARJETA PRINCIPAL */}
        <View style={[styles.clientCard, isInactive && styles.cardInactive]}>
          <View style={styles.clientRow}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Text style={styles.clientNameText}>{data?.name}</Text>
                {isInactive && (
                  <View style={styles.statusBadge}><Text style={styles.statusBadgeText}>INACTIVO</Text></View>
                )}
              </View>
              <Text style={styles.clientNitText}>NIT: {data?.nit}</Text>
            </View>

            <View style={{ zIndex: 2000 }}>
              <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)} style={styles.moreActionBtn}>
                <MoreVertical size={24} color="white" />
              </TouchableOpacity>

              {menuVisible && (
                <View style={styles.floatingMenu}>
                  {isInactive ? (
                    <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={toggleStatus}>
                      <CheckCircle size={18} color="#10b981" />
                      <Text style={[styles.menuText, { color: '#10b981' }]}>Activar Cliente</Text>
                    </TouchableOpacity>
                  ) : (
                    <>
                      <TouchableOpacity style={styles.menuItem} onPress={() => { setEditModal(true); setMenuVisible(false); }}>
                        <Edit size={18} color="#2563eb" />
                        <Text style={styles.menuText}>Editar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={toggleStatus}>
                        <Trash2 size={18} color="#ef4444" />
                        <Text style={[styles.menuText, { color: '#ef4444' }]}>Eliminar</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              )}
            </View>
          </View>

          <View style={styles.clientBadgeContainer}>
            <Text style={styles.clientBadgeText}>{data?.orders?.length || 0} compras realizadas</Text>
          </View>
        </View>

        {isInactive && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>Cliente inactivo. Active el perfil para editar información o realizar ventas.</Text>
          </View>
        )}

        <Text style={[styles.sectionHeader, isInactive && { opacity: 0.5 }]}>Historial de Compras</Text>

        <View style={isInactive && { opacity: 0.6 }}>
          {data?.orders?.map((item: any) => (
            <TouchableOpacity key={item.id} style={styles.purchaseCard} onPress={() => setSelectedOrder(item)}>
              <View style={styles.purchaseHeader}>
                <View style={styles.dateInfo}>
                  <Calendar size={14} color="#64748b" />
                  <Text style={styles.purchaseDateText}>{formatDate(item)}</Text>
                </View>
                <Text style={styles.purchaseDetailBtn}>Detalles</Text>
              </View>
              <View style={styles.purchaseFooter}>
                <Text style={styles.purchaseTotalText}>Bs {item.total.toFixed(2)}</Text>
                <View style={styles.methodTag}>
                  <Text style={styles.methodTabText}>{item.paymentMethod || 'Efectivo'}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* MODAL DETALLE DE COMPRA */}
      <Modal visible={!!selectedOrder} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalle de Venta</Text>
              <TouchableOpacity onPress={() => setSelectedOrder(null)}><X size={24} color="#64748b" /></TouchableOpacity>
            </View>
            <ScrollView>
              {selectedOrder?.items?.map((item: any, i: number) => (
                <View key={i} style={styles.productRow}>
                  <Package size={20} color="#2563eb" />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.productName}>{item.product?.name || "Producto"}</Text>
                    <Text style={styles.productSub}>{item.quantity} un. x Bs {item.price}</Text>
                  </View>
                  <Text style={styles.productPrice}>Bs {item.subtotal.toFixed(2)}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL EDITAR CLIENTE */}
      <Modal visible={editModal} animationType="fade" transparent>
        <View style={styles.overlay}>
          <View style={styles.editCardContainer}>
            <Text style={styles.modalHeaderTitle}>Editar Cliente</Text>
            <TextInput style={styles.formInput} value={form.name} onChangeText={t => setForm({...form, name: t})} placeholder="Nombre" />
            <TextInput style={styles.formInput} value={form.nit} onChangeText={t => setForm({...form, nit: t})} placeholder="NIT" keyboardType="numeric" />
            <TouchableOpacity style={styles.submitBtn} onPress={handleUpdate}>
              <Save size={20} color="white" />
              <Text style={styles.submitBtnText}>Actualizar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditModal(false)} style={styles.closeBtn}><Text>Cerrar</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  clientCard: { backgroundColor: '#2563eb', borderRadius: 24, padding: 22, elevation: 10 },
  cardInactive: { backgroundColor: '#94a3b8' },
  clientRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  clientNameText: { color: 'white', fontSize: 24, fontWeight: 'bold', textTransform: 'uppercase' },
  clientNitText: { color: '#bfdbfe', fontSize: 15, marginTop: 4 },
  statusBadge: { backgroundColor: '#ef4444', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusBadgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  clientBadgeContainer: { backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12, marginTop: 15 },
  clientBadgeText: { color: 'white', fontSize: 12, fontWeight: '700' },
  moreActionBtn: { padding: 6, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10 },
  floatingMenu: { position: 'absolute', top: 45, right: 0, backgroundColor: 'white', borderRadius: 12, elevation: 15, width: 170, zIndex: 3000 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  menuText: { fontSize: 14, fontWeight: '600', color: '#334155' },
  warningBox: { backgroundColor: '#fef2f2', padding: 15, borderRadius: 12, marginTop: 15, borderWidth: 1, borderColor: '#fee2e2' },
  warningText: { color: '#991b1b', fontSize: 12, textAlign: 'center', fontWeight: '500' },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', marginVertical: 20, color: '#1e293b' },
  purchaseCard: { backgroundColor: 'white', padding: 18, borderRadius: 18, marginBottom: 14, borderLeftWidth: 6, borderLeftColor: '#2563eb', elevation: 2 },
  purchaseHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  dateInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  purchaseDateText: { fontSize: 13, color: '#64748b' },
  purchaseDetailBtn: { fontSize: 12, color: '#2563eb', fontWeight: 'bold' },
  purchaseFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  purchaseTotalText: { fontSize: 22, fontWeight: 'bold', color: '#1e293b' },
  methodTag: { backgroundColor: '#f1f5f9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  methodTabText: { fontSize: 11, color: '#64748b', fontWeight: 'bold' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 25 },
  editCardContainer: { backgroundColor: 'white', borderRadius: 24, padding: 25 },
  modalHeaderTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  formInput: { backgroundColor: '#f1f5f9', padding: 16, borderRadius: 15, marginBottom: 15, fontSize: 16 },
  submitBtn: { backgroundColor: '#2563eb', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 15, gap: 10 },
  submitBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  closeBtn: { marginTop: 20, alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  productRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  productName: { fontSize: 15, fontWeight: '600' },
  productSub: { fontSize: 12, color: '#64748b' },
  productPrice: { fontSize: 15, fontWeight: 'bold' }
});