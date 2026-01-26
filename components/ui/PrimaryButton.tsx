import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
}

export const PrimaryButton = ({ title, onPress, loading }: Props) => (
  <TouchableOpacity 
    style={[styles.button, loading && { opacity: 0.7 }]} 
    onPress={onPress}
    disabled={loading}
  >
    {loading ? (
      <ActivityIndicator color="#fff" />
    ) : (
      <Text style={styles.buttonText}>{title}</Text>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#2563eb',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});