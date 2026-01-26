import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

interface Props extends TextInputProps {
  label: string;
}

export const CustomInput = ({ label, ...props }: Props) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <TextInput 
      style={styles.input} 
      placeholderTextColor="#94a3b8"
      {...props} 
    />
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#334155' },
  input: { 
    backgroundColor: '#ffffff', 
    paddingHorizontal: 16, 
    paddingVertical: 14, 
    borderRadius: 12, 
    fontSize: 16, 
    borderWidth: 1, 
    borderColor: '#e2e8f0', 
    color: '#0f172a' 
  },
});