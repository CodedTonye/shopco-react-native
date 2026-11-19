import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authSlice';
import { colors, type } from '../theme';

export default function SignInScreen({ navigation }) {
  const dispatch = useDispatch();
  const { status, error } = useSelector((s) => s.auth);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  async function submit() {
    setFormError('');
    if (!username.trim() || !password.trim()) {
      setFormError('Please enter both a username and password.');
      return;
    }
    const result = await dispatch(loginUser({ username: username.trim(), password }));
    if (loginUser.fulfilled.match(result)) navigation.navigate('Main', { screen: 'Home' });
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>SIGN IN</Text>
        <Text style={styles.sub}>Welcome back. Enter your details to continue.</Text>

        <Text style={styles.label}>Username</Text>
        <TextInput value={username} onChangeText={setUsername} placeholder="e.g. emilys" autoCapitalize="none" autoCorrect={false} style={styles.input} placeholderTextColor={colors.faint} />
        <Text style={styles.label}>Password</Text>
        <TextInput value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry autoCapitalize="none" style={styles.input} placeholderTextColor={colors.faint} />

        {(formError || error) && <Text style={styles.error}>{formError || error}</Text>}

        <Pressable style={[styles.btn, status === 'loading' && { opacity: 0.5 }]} disabled={status === 'loading'} onPress={submit}>
          {status === 'loading' ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Sign In</Text>}
        </Pressable>

        <View style={styles.note}>
          <Text style={styles.noteText}>
            This app signs in against the public DummyJSON API, which only accepts its own test accounts — not ones created on the Sign Up screen.
          </Text>
          <Pressable onPress={() => { setUsername('emilys'); setPassword('emilyspass'); }}>
            <Text style={styles.noteLink}>Fill in a demo account (emilys / emilyspass)</Text>
          </Pressable>
        </View>

        <Text style={styles.switch}>
          Don't have an account?{' '}
          <Text style={styles.switchLink} onPress={() => navigation.navigate('SignUp')}>Create one</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 24, paddingTop: 32 },
  title: { ...type.h2 },
  sub: { color: colors.muted, marginTop: 6, marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, marginTop: 14 },
  input: { borderWidth: 1, borderColor: 'rgba(0,0,0,0.15)', borderRadius: 999, paddingHorizontal: 18, paddingVertical: 14, fontSize: 15 },
  error: { color: colors.red, marginTop: 14 },
  btn: { backgroundColor: colors.black, borderRadius: 999, paddingVertical: 16, alignItems: 'center', marginTop: 24 },
  btnText: { color: colors.white, fontWeight: '600', fontSize: 15 },
  note: { backgroundColor: colors.grey, borderRadius: 16, padding: 16, marginTop: 20, gap: 8 },
  noteText: { fontSize: 12, color: colors.muted, lineHeight: 17 },
  noteLink: { fontWeight: '700', fontSize: 12, textDecorationLine: 'underline' },
  switch: { textAlign: 'center', color: colors.muted, marginTop: 24 },
  switchLink: { color: colors.black, fontWeight: '700', textDecorationLine: 'underline' },
});
