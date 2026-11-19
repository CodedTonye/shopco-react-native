import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme';

export default function AnnouncementBar() {
  const [open, setOpen] = useState(true);
  const navigation = useNavigation();
  if (!open) return null;
  return (
    <View style={styles.bar}>
      <Text style={styles.text}>
        Sign up and get 20% off to your first order.{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>
          Sign Up Now
        </Text>
      </Text>
      <Pressable onPress={() => setOpen(false)} hitSlop={12} style={styles.close}>
        <Text style={styles.closeText}>✕</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { backgroundColor: colors.black, paddingVertical: 10, paddingHorizontal: 36 },
  text: { color: colors.white, fontSize: 12, textAlign: 'center' },
  link: { color: colors.white, fontWeight: '700', textDecorationLine: 'underline' },
  close: { position: 'absolute', right: 12, top: 10 },
  closeText: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
});
