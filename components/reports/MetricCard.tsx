import { DollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

const Icons = {
  'dollar-sign': DollarSign,
  'shopping-cart': ShoppingCart,
  'package': Package,
  'trending-up': TrendingUp,
};

interface Props {
  label: string;
  value: string;
  icon: keyof typeof Icons;
  color?: string;
}

export const MetricCard = ({ label, value, icon, color = '#3b82f6' }: Props) => {
  const Icon = Icons[icon];
  
  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: `${color}15` }]}>
        <Icon size={20} color={color} />
      </View>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { 
    backgroundColor: '#fff', 
    width: (width / 2) - 30, 
    padding: 20, 
    borderRadius: 24, 
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  iconBox: { padding: 8, borderRadius: 12, marginBottom: 10, alignSelf: 'flex-start' },
  cardValue: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  cardLabel: { fontSize: 12, color: '#64748b', marginTop: 2 },
});