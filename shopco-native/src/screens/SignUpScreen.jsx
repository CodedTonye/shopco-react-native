import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, clearSignupResult } from '../store/authSlice';
import { colors, type } from '../theme';

const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export default function SignUpScreen({ navigation }) {
  const dispatch = useDispatch();
  const { signupStatus, signupResult, signupError } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', username: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  function validate() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!validEmail(form.email)) e.email = 'Enter a valid email address';
    if (form.username.trim().length < 3) e.username = 'Username must be at least 3 characters';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit() {
    dispatch(clearSignupResult());
    if (!validate()) return;
    const { confirmPassword, ...payload } = form;
    dispatch(signupUser({ ...payload, firstName: payload.firstName.trim(), lastName: payload.lastName.trim(), email: payload.email.trim(), username: payload.username.trim() }));
  }

  const field = (label, key, opts = {}) => (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={form[key]}
        onChangeText={(v) => update(key, v)}
        style={styles.input}
        autoCapitalize={opts.capitalize || 'none'}
        autoCorrect={false}
        secureTextEntry={opts.secure}
        keyboardType={opts.keyboard}
        placeholderTextColor={colors.faint}
      />
      {errors[key] && <Text style={styles.error}>{errors[key]}</Text>}
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>CREATE ACCOUNT</Text>
        <Text style={styles.sub}>Join Shop.co and start finding your style.</Text>

        {signupStatus === 'succeeded' && signupResult ? (
          <View style={styles.success}>
            <Text style={{ fontWeight: '700', color: '#15803d' }}>
              Account created for {signupResult.firstName} {signupResult.lastName} ✓
            </Text>
            <Text style={{ color: colors.muted, marginTop: 8, lineHeight: 19 }}>
              Since this demo runs on the public DummyJSON API, new accounts are simulated and aren't saved for login. Go to Sign In and use the demo account instead.
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
              <Pressable style={[styles.btn, { marginTop: 0, paddingHorizontal: 20 }]} onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.btnText}>Go to Sign In</Text>
              </Pressable>
              <Pressable style={[styles.btn, styles.btnGhost, { marginTop: 0, paddingHorizontal: 20 }]} onPress={() => dispatch(clearSignupResult())}>
                <Text style={[styles.btnText, { color: colors.black }]}>Create another</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <>
            {field('First name', 'firstName', { capitalize: 'words' })}
            {field('Last name', 'lastName', { capitalize: 'words' })}
            {field('Email', 'email', { keyboard: 'email-address' })}
            {field('Username', 'username')}
            {field('Password', 'password', { secure: true })}
            {field('Confirm password', 'confirmPassword', { secure: true })}

            {signupError && <Text style={styles.error}>{signupError}</Text>}

            <Pressable style={[styles.btn, signupStatus === 'loading' && { opacity: 0.5 }]} disabled={signupStatus === 'loading'} onPress={submit}>
              {signupStatus === 'loading' ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Create Account</Text>}
            </Pressable>
          </>
        )}

        <Text style={styles.switch}>
          Already have an account?{' '}
          <Text style={styles.switchLink} onPress={() => navigation.navigate('SignIn')}>Sign in</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 24, paddingTop: 32, paddingBottom: 48 },
  title: { ...type.h2 },
  sub: { color: colors.muted, marginTop: 6, marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, marginTop: 14 },
  input: { borderWidth: 1, borderColor: 'rgba(0,0,0,0.15)', borderRadius: 999, paddingHorizontal: 18, paddingVertical: 14, fontSize: 15 },
  error: { color: colors.red, fontSize: 12, marginTop: 6 },
  btn: { backgroundColor: colors.black, borderRadius: 999, paddingVertical: 16, alignItems: 'center', marginTop: 24 },
  btnGhost: { backgroundColor: colors.white, borderWidth: 1, borderColor: 'rgba(0,0,0,0.2)' },
  btnText: { color: colors.white, fontWeight: '600', fontSize: 15 },
  success: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', borderWidth: 1, borderRadius: 16, padding: 18, marginTop: 12 },
  switch: { textAlign: 'center', color: colors.muted, marginTop: 28 },
  switchLink: { color: colors.black, fontWeight: '700', textDecorationLine: 'underline' },
});
