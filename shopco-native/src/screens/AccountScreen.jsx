import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { selectCurrentUser, logoutUser } from '../store/authSlice';
import { colors, type } from '../theme';

export default function AccountScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }} edges={['top']}>
      <View style={styles.wrap}>
        <Text style={styles.title}>ACCOUNT</Text>
        {user ? (
          <View style={{ alignItems: 'center', gap: 6, marginTop: 24 }}>
            <Image source={{ uri: user.image }} style={styles.avatar} />
            <Text style={{ fontSize: 20, fontWeight: '800', marginTop: 8 }}>{user.firstName} {user.lastName}</Text>
            <Text style={{ color: colors.muted }}>{user.email}</Text>
            <Pressable style={[styles.btn, styles.ghost, { marginTop: 24 }]} onPress={() => dispatch(logoutUser())}>
              <Text style={[styles.btnText, { color: colors.black }]}>Log out</Text>
            </Pressable>
          </View>
        ) : (
          <View style={{ alignItems: 'center', gap: 14, marginTop: 40 }}>
            <Ionicons name="person-circle-outline" size={84} color={colors.faint} />
            <Text style={{ color: colors.muted, textAlign: 'center' }}>Sign in to see your account, or create one to get 20% off your first order.</Text>
            <Pressable style={styles.btn} onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.btnText}>Sign In</Text>
            </Pressable>
            <Pressable style={[styles.btn, styles.ghost]} onPress={() => navigation.navigate('SignUp')}>
              <Text style={[styles.btnText, { color: colors.black }]}>Create Account</Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16 },
  title: { ...type.h2 },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.cream },
  btn: { backgroundColor: colors.black, borderRadius: 999, paddingVertical: 15, paddingHorizontal: 40, alignSelf: 'stretch', alignItems: 'center' },
  ghost: { backgroundColor: colors.white, borderWidth: 1, borderColor: 'rgba(0,0,0,0.2)' },
  btnText: { color: colors.white, fontWeight: '600', fontSize: 15 },
});
