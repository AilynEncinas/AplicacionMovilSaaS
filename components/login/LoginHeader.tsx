import { StyleSheet, Text, View } from 'react-native';

export const LoginHeader = () => (
  <View>
    <Text style={styles.logoText}>SBM</Text>
    <Text style={styles.title}>
      Sistema de <Text style={{ color: '#2563eb' }}>ventas e inventarios</Text>
    </Text>
    <Text style={styles.subtitle}>Toma el control total de tu micro-empresa.</Text>
    <Text style={styles.subtitle}>INICIAR SESION</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: { alignSelf: 'center', backgroundColor: '#eff6ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#dbeafe', marginBottom: 16 },
  badgeText: { color: '#2563eb', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  logoText: { fontSize: 28, fontWeight: '800', color: '#1e293b', textAlign: 'center', marginBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0f172a', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#64748b', textAlign: 'center', marginBottom: 32, lineHeight: 22 },
});