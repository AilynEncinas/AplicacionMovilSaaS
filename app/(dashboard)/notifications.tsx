import apiClient from '@/src/api/client';
import { AlertTriangle, Banknote, Bell, Clock } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (error) {
      console.error("Error cargando notificaciones", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const renderItem = ({ item }: { item: any }) => {
    const isStock = item.type === 'STOCK';

    return (
      <View style={[styles.card, isStock && styles.cardStock]}>
        <View style={[styles.iconContainer, isStock ? styles.iconStock : styles.iconPayment]}>
          {isStock ? (
            <AlertTriangle size={22} color="#991b1b" />
          ) : (
            <Banknote size={22} color="#166534" />
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.timeRow}>
              <Clock size={12} color="#94a3b8" />
              <Text style={styles.dateText}>
                {new Date(item.date).toLocaleDateString()}
              </Text>
            </View>
          </View>

          <Text style={styles.description}>{item.description}</Text>

          {!isStock && (
            <View style={styles.paymentBadge}>
              <Text style={styles.paymentText}>
                {/* Corregido: Todo el string unido dentro del componente Text */}
                {`${item.method} • Bs ${item.amount.toFixed(2)}`}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <Bell size={24} color="#1e293b" />
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchNotifications} />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Bell size={50} color="#cbd5e1" />
              <Text style={styles.emptyText}>No tienes notificaciones pendientes</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1e293b' },
  card: { 
    flexDirection: 'row', 
    backgroundColor: 'white', 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cardStock: { 
    borderLeftWidth: 4, 
    borderLeftColor: '#ef4444',
    backgroundColor: '#fff1f2'
  },
  iconContainer: { 
    width: 45, 
    height: 45, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 12
  },
  iconPayment: { backgroundColor: '#dcfce7' },
  iconStock: { backgroundColor: '#fee2e2' },
  content: { flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dateText: { fontSize: 11, color: '#94a3b8' },
  description: { fontSize: 14, color: '#64748b', lineHeight: 20 },
  paymentBadge: { 
    marginTop: 8, 
    backgroundColor: '#f1f5f9', 
    alignSelf: 'flex-start', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 6 
  },
  paymentText: { fontSize: 12, fontWeight: 'bold', color: '#475569' },
  empty: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 15, color: '#94a3b8', fontSize: 16 }
});