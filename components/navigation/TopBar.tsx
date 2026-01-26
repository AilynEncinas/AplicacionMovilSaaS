import { Menu } from 'lucide-react-native';
import React from 'react';
import { Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

interface Props {
  onMenuPress: () => void;
}

export const TopBar = ({ onMenuPress }: Props) => (
  <View style={styles.topBar}>
    <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
      <Menu size={28} color="#1e293b" />
    </TouchableOpacity>
    <Image 
      source={require('@/assets/logo/Logo.png')} 
      style={styles.logoImage} 
      resizeMode="contain" 
    />
    <View style={{ width: 40 }} />
  </View>
);

const styles = StyleSheet.create({
  topBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'android' ? 45 : 15, 
    paddingBottom: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#fff'
  },
  logoImage: { width: 90, height: 40 },
  menuButton: { padding: 5 },
});