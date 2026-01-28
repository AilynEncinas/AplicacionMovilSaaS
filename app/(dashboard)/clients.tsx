import { useAuth } from '@/src/hooks/useAuth';
import { useClients } from '@/src/hooks/useClients';
import { useRouter } from 'expo-router';
import { ChevronRight, Search, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ClientsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { clients, loading, fetchClients } = useClients(user?.storeId || "");
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || c.nit.includes(search)
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Clientes</Text>
        <View style={styles.searchBar}>
          <Search size={20} color="#64748b" />
          <TextInput 
            placeholder="Buscar por nombre o NIT..." 
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <FlatList
        data={filteredClients}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchClients} colors={["#2563eb"]} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push({ 
              pathname: '/(dashboard)/client-detail', 
              params: { id: item.id } 
            })}
          >
            <View style={styles.avatar}><User color="#2563eb" size={20} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.nit}>NIT: {item.nit}</Text>
            </View>
            <ChevronRight size={20} color="#cbd5e1" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#1e293b' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', paddingHorizontal: 12, borderRadius: 12 },
  input: { flex: 1, height: 45, marginLeft: 10 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 15, marginHorizontal: 15, marginTop: 10, borderRadius: 12, elevation: 1 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  name: { fontSize: 16, fontWeight: '600', color: '#334155' },
  nit: { fontSize: 13, color: '#64748b' }
});