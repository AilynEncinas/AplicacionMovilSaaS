import { useRouter } from 'expo-router';
import { BarChart3, LogOut, Package, Settings, UserCircle, Users } from 'lucide-react-native';
import React from 'react';
import { Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export const DrawerMenu = ({ visible, onClose }: { visible: boolean, onClose: () => void }) => {
  const router = useRouter();

  const MenuItem = ({ icon: Icon, label, path }: { icon: any, label: string, path?: string }) => (
    <TouchableOpacity 
      style={styles.menuItem} 
      onPress={() => {
        onClose();
        if (path) {
          router.push(path as any);
        }
      }}
    >
      <Icon size={20} color="#475569" strokeWidth={2} />
      <Text style={styles.menuItemText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal animationType="none" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.drawer}>
          <View style={styles.drawerHeader}>
            <Image source={require('@/assets/logo/Logo.png')} style={styles.drawerLogo} resizeMode="contain" />
            <Text style={styles.adminBadge}>Administrador</Text>
          </View>

          <ScrollView style={styles.drawerScroll}>
            <MenuItem icon={Package} label="Inventario" path="/products" />
            <MenuItem icon={Package} label="Ventas" path="/sales" />
            <MenuItem icon={BarChart3} label="Reportes" path="/report" />
            <MenuItem icon={Users} label="Clientes" path='/clients'/>
            <MenuItem icon={Users} label="Notificaciones" path='/notifications'/>
            
            <View style={styles.divider} />
            <MenuItem icon={Settings} label="Configuración" />
          </ScrollView>

          <View style={styles.drawerFooter}>
            <UserCircle size={38} color="#64748b" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.userName}>Daniela S.</Text>
            </View>
            
            <TouchableOpacity onPress={() => router.replace('/(auth)')}>
              <LogOut size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', flexDirection: 'row' },
  drawer: { width: width * 0.78, backgroundColor: '#fff', height: '100%' },
  drawerHeader: { padding: 25, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  drawerLogo: { width: 110, height: 45, marginBottom: 12 },
  adminBadge: { color: '#2563eb', fontWeight: 'bold', alignSelf: 'flex-start', fontSize: 11, backgroundColor: '#eff6ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  drawerScroll: { flex: 1, paddingHorizontal: 15 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  menuItemText: { marginLeft: 15, fontSize: 15, color: '#334155' },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 15 },
  drawerFooter: { padding: 20, borderTopWidth: 1, borderTopColor: '#f1f5f9', flexDirection: 'row', alignItems: 'center' },
  userName: { fontWeight: 'bold', fontSize: 14 }
});