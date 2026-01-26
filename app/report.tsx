import { useRouter } from 'expo-router';
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Database,
  DollarSign, LogOut,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Tags, Truck,
  UserCircle,
  UserCog,
  Users
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Dimensions, Image,
  Modal,
  Platform,
  SafeAreaView, ScrollView, StyleSheet,
  Text, TouchableOpacity, View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function ReportScreen() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const MenuItem = ({ icon: Icon, label }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={() => setMenuOpen(false)}>
      <Icon size={20} color="#475569" strokeWidth={2} />
      <Text style={styles.menuItemText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Modal
        animationType="none"
        transparent={true}
        visible={menuOpen}
        onRequestClose={() => setMenuOpen(false)}
      >
        <View style={styles.modalOverlay}>

          <View style={styles.drawer}>
            <View style={styles.drawerHeader}>
              <Image source={require('../assets/logo/Logo.png')} style={styles.drawerLogo} resizeMode="contain" />
              <View style={styles.badgeContainer}>
                <Text style={styles.adminBadge}>Administrador</Text>
              </View>
            </View>

            <ScrollView style={styles.drawerScroll} showsVerticalScrollIndicator={false}>
              <MenuItem icon={Package} label="Producto" />
              <MenuItem icon={Tags} label="Categoría" />
              <MenuItem icon={Truck} label="Proveedor" />
              <MenuItem icon={Users} label="Cliente" />
              <MenuItem icon={BarChart3} label="Ventas" />
              <MenuItem icon={Database} label="Abastecimiento" />
              <MenuItem icon={ShoppingBag} label="Compras Proveedor" />
              <MenuItem icon={UserCog} label="Usuarios" />
              
              <View style={styles.divider} />
              
              <MenuItem icon={Bell} label="Notificaciones" />
              <MenuItem icon={Settings} label="Configuración" />
            </ScrollView>

            <View style={styles.drawerFooter}>
              <View style={styles.userProfile}>
                <UserCircle size={38} color="#64748b" />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>Daniela S.</Text>
                  <Text style={styles.userRole}>admin@sbm.com</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.logoutInline} onPress={() => router.replace('/')}>
                <LogOut size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.closeOverlay} 
            activeOpacity={1} 
            onPress={() => setMenuOpen(false)} 
          />
        </View>
      </Modal>

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => setMenuOpen(true)} style={styles.menuButton}>
          <Menu size={28} color="#1e293b" />
        </TouchableOpacity>
        <Image source={require('../assets/logo/Logo.png')} style={styles.logoImage} resizeMode="contain" />
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Reportes</Text>
          <Text style={styles.headerSubtitle}>Dashboard de ventas e inventario</Text>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.card}>
            <View style={styles.iconBox}><DollarSign size={20} color="#3b82f6" /></View>
            <Text style={styles.cardValue}>Bs 17.809,89</Text>
            <Text style={styles.cardLabel}>Ventas Totales</Text>
          </View>
          <View style={styles.card}>
            <View style={[styles.iconBox, { backgroundColor: '#8b5cf615' }]}><ShoppingCart size={20} color="#8b5cf6" /></View>
            <Text style={styles.cardValue}>28</Text>
            <Text style={styles.cardLabel}>Pedidos</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <AlertTriangle size={20} color="#f59e0b" />
            <Text style={styles.sectionTitle}>Alertas de Stock</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Camisa blanca</Text>
            <Text style={{fontWeight: 'bold', color: '#ef4444'}}>1 unid.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  topBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'android' ? 45 : 15, 
    paddingBottom: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  logoImage: { width: 90, height: 40 },
  menuButton: { padding: 5 },
  
  // --- ESTILOS DEL MENU ---
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    flexDirection: 'row',
  },
  drawer: { 
    width: width * 0.78, 
    backgroundColor: '#fff', 
    height: '100%', 
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  closeOverlay: { 
    flex: 1,
  },
  drawerHeader: { 
    padding: 25, 
    paddingTop: Platform.OS === 'android' ? 50 : 60, 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#f1f5f9' 
  },
  drawerLogo: { width: 110, height: 45, marginBottom: 12 },
  badgeContainer: { flexDirection: 'row' },
  adminBadge: { color: '#2563eb', fontWeight: 'bold', fontSize: 11, backgroundColor: '#eff6ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  drawerScroll: { flex: 1, paddingHorizontal: 15, paddingTop: 10 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, marginBottom: 4 },
  menuItemText: { marginLeft: 15, fontSize: 15, color: '#334155', fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 15 },
  drawerFooter: { padding: 20, borderTopWidth: 1, borderTopColor: '#f1f5f9', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff' },
  userProfile: { flexDirection: 'row', alignItems: 'center' },
  userInfo: { marginLeft: 10 },
  userName: { fontWeight: 'bold', fontSize: 14, color: '#1e293b' },
  userRole: { fontSize: 11, color: '#64748b' },
  logoutInline: { padding: 10 },

  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 20 },
  header: { marginBottom: 25 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1e293b' },
  headerSubtitle: { color: '#64748b' },
  metricsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  card: { backgroundColor: '#fff', width: (width / 2) - 30, padding: 20, borderRadius: 24, elevation: 2 },
  iconBox: { backgroundColor: '#3b82f615', padding: 8, borderRadius: 12, marginBottom: 10, alignSelf: 'flex-start' },
  cardValue: { fontSize: 18, fontWeight: 'bold' },
  cardLabel: { fontSize: 12, color: '#64748b' },
  sectionCard: { backgroundColor: '#fff', padding: 20, borderRadius: 24, marginTop: 25, elevation: 2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f8fafc' },
  tableLabel: { color: '#475569', fontSize: 15 }
});