import { useAuth } from '@/src/hooks/useAuth';
import { useClients } from '@/src/hooks/useClients';
import { useRouter } from 'expo-router';
import { ChevronRight, Search, User, UserX } from 'lucide-react-native';
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
        renderItem={({ item }) => {
          // CORRECCIÓN: Nombre exacto del campo y comparación booleana
          const isInactive = item.isActive === false;

          return (
            <TouchableOpacity 
              style={[styles.card, isInactive && styles.cardInactive]}
              onPress={() => router.push({ 
                pathname: '/(dashboard)/client-detail', 
                params: { id: item.id } 
              })}
            >
              {/* El resto del código se mantiene igual... */}
              <View style={[styles.avatar, isInactive && styles.avatarInactive]}>
                {isInactive ? (
                  <UserX color="#94a3b8" size={20} />
                ) : (
                  <User color="#2563eb" size={20} />
                )}
              </View>

              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={[styles.name, isInactive && styles.textInactive]}>
                    {item.name}
                  </Text>
                  {isInactive && (
                    <View style={styles.badgeInactive}>
                      <Text style={styles.badgeText}>INACTIVO</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.nit, isInactive && styles.textInactive]}>
                  NIT: {item.nit}
                </Text>
              </View>

              <ChevronRight size={20} color="#cbd5e1" />
            </TouchableOpacity>
          );
        }}
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
  
  // Estilos de la Tarjeta
  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'white', 
    padding: 15, 
    marginHorizontal: 15, 
    marginTop: 10, 
    borderRadius: 12, 
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardInactive: { 
    backgroundColor: '#f1f5f9', 
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 0,
  },
  
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarInactive: { backgroundColor: '#e2e8f0' },
  
  name: { fontSize: 16, fontWeight: '600', color: '#334155' },
  nit: { fontSize: 13, color: '#64748b' },
  
  // Estilos para inactivos
  textInactive: { color: '#94a3b8' },
  badgeInactive: { 
    backgroundColor: '#cbd5e1', 
    paddingHorizontal: 6, 
    paddingVertical: 2, 
    borderRadius: 4 
  },
  badgeText: { 
    color: '#64748b', 
    fontSize: 9, 
    fontWeight: 'bold' 
  }
});