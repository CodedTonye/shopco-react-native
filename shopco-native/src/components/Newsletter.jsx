import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, type } from '../theme';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>STAY UPTO DATE ABOUT OUR LATEST OFFERS</Text>
      <View style={styles.input}>
        <Ionicons name="mail-outline" size={16} color={colors.faint} />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email address"
          placeholderTextColor={colors.faint}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.field}
        />
      </View>
      <Pressable style={styles.button} onPress={() => email.trim() && setDone(true)}>
        <Text style={styles.buttonText}>{done ? 'Subscribed ✓' : 'Subscribe to Newsletter'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.black,
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 16,
    gap: 14,
    zIndex: 2,
    elevation: 2,
  },
  title: { ...type.h2, fontSize: 26, lineHeight: 28, color: colors.white },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderRadius: 999,
    paddingHorizontal: 16,
  },
  field: { flex: 1, paddingVertical: 13, fontSize: 14 },
  button: { backgroundColor: colors.white, borderRadius: 999, paddingVertical: 14, alignItems: 'center' },
  buttonText: { fontWeight: '600', fontSize: 14 },
});
