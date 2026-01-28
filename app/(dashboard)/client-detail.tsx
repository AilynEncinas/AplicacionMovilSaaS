import apiClient from '@/src/api/client';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Calendar, CreditCard, Package, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ClientDetailScreen() {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const res = await apiClient.get(`/clients/${id}`);
        if (res.data.success) setData(res.data.client);
      } catch (e) {
        console.error("Error al cargar historial", e);
      } finally { setLoading(false); }
    };
    if (id) loadDetail();
  }, [id]);

  const formatDate = (order: any) => {
    if (!order.createAt) return "Reciente";

    const d = new Date(order.createAt);
    if (isNaN(d.getTime())) return "Fecha inválida";

    // Formato: 28/01/2026 - 18:30
    const dateStr = d.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const timeStr = d.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    return `${dateStr} - ${timeStr}`;
 };

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator size="large" color="#2563eb" />
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: data?.name || 'Historial' }} />
      
      <View style={styles.infoCard}>
        <Text style={styles.clientName}>{data?.name || 'Cliente sin nombre'}</Text>
        <Text style={styles.label}>NIT / CI: {data?.nit}</Text>
        <View style={styles.statsBadge}>
            <Text style={styles.statsText}>{data?.orders?.length || 0} compras realizadas</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Historial de Compras</Text>
      
      <FlatList
        data={data?.orders || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.orderCard} 
            onPress={() => setSelectedOrder(item)}
          >
            <View style={styles.orderHeader}>
              <View style={styles.dateInfo}>
                <Calendar size={14} color="#64748b" />
                <Text style={styles.orderDate}>{formatDate(item)}</Text>
              </View>
              <Text style={styles.viewMoreText}>Detalles</Text>
            </View>
            <View style={styles.orderBody}>
              <Text style={styles.orderTotal}>Bs {item.total?.toFixed(2)}</Text>
              <View style={styles.paymentBadge}>
                <CreditCard size={12} color="#2563eb" />
                <Text style={styles.paymentText}>{item.paymentMethod || 'Efectivo'}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No hay historial de ventas disponible.</Text>}
      />

      <Modal visible={!!selectedOrder} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Detalle de Compra</Text>
                <Text style={styles.modalSubtitle}>{selectedOrder ? formatDate(selectedOrder) : ''}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedOrder(null)} style={styles.closeBtn}>
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedOrder?.items?.map((item: any, index: number) => (
                <View key={index} style={styles.itemRow}>
                    <View style={styles.itemIcon}><Package size={18} color="#2563eb" /></View>
                    <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>
                        {item.product?.name || "Producto desconocido"}
                    </Text>
                    <Text style={styles.itemQty}>{item.quantity} unidades x Bs {item.price.toFixed(2)}</Text>
                    </View>
                    <Text style={styles.itemSubtotal}>
                    Bs {item.subtotal.toFixed(2)}
                    </Text>
                </View>
             ))}
              
              <View style={styles.totalDivider} />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>TOTAL</Text>
                <Text style={styles.totalValue}>Bs {selectedOrder?.total?.toFixed(2)}</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 20 },
  infoCard: { backgroundColor: '#2563eb', padding: 20, borderRadius: 24, marginBottom: 25, elevation: 5 },
  clientName: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  label: { color: '#bfdbfe', fontSize: 14, marginTop: 4 },
  statsBadge: { backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginTop: 12 },
  statsText: { color: 'white', fontSize: 12, fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 15 },
  orderCard: { backgroundColor: 'white', padding: 16, borderRadius: 16, marginBottom: 12, borderLeftWidth: 5, borderLeftColor: '#2563eb', elevation: 2 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  dateInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  orderDate: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  viewMoreText: { fontSize: 11, color: '#2563eb', fontWeight: 'bold' },
  orderBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderTotal: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  paymentBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#eff6ff', padding: 6, borderRadius: 8 },
  paymentText: { fontSize: 12, color: '#2563eb', fontWeight: 'bold' },
  empty: { textAlign: 'center', color: '#94a3b8', marginTop: 30 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' },
  modalSubtitle: { fontSize: 13, color: '#64748b' },
  closeBtn: { backgroundColor: '#f1f5f9', padding: 8, borderRadius: 12 },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  itemIcon: { width: 36, height: 36, backgroundColor: '#f8fafc', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  itemName: { fontSize: 15, fontWeight: '600', color: '#334155' },
  itemQty: { fontSize: 12, color: '#94a3b8' },
  itemSubtotal: { fontSize: 15, fontWeight: 'bold', color: '#1e293b' },
  totalDivider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 15 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  totalLabel: { fontSize: 14, color: '#64748b', fontWeight: 'bold' },
  totalValue: { fontSize: 22, fontWeight: 'bold', color: '#2563eb' }
});