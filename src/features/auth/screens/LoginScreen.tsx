import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useAppTheme } from '../../../core/theme';
import useAuthStore from '../../../store/authStore';
import { AuthStackParamList } from '../../../types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const { colors, isDark } = useAppTheme();
  const s = makeStyles(colors);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const { login, loading, error, clearError } = useAuthStore();

  // Subtle fade-in on mount
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // Clear error when inputs change
  useEffect(() => {
    if (error) { clearError(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, password]);

  const handleLogin = async () => {
    if (!email.trim() || !password) { return; }
    await login(email.trim(), password);
  };

  const isValid = email.trim().length > 0 && password.length >= 6;

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <KeyboardAvoidingView
        style={s.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Hero ── */}
          <Animated.View
            style={[s.hero, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
          >
            <View style={s.logoWrap}>
              <Text style={s.logoEmoji}>👨‍🍳</Text>
            </View>
            <Text style={s.heroTitle}>Welcome back</Text>
            <Text style={s.heroSub}>Sign in to your Chefyai account</Text>
          </Animated.View>

          {/* ── Card ── */}
          <Animated.View
            style={[s.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
          >
            {/* Email */}
            <Text style={s.label}>Email</Text>
            <View style={[s.inputWrap, emailFocused && s.inputFocused]}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={emailFocused ? colors.primary : colors.textSecondary}
                style={s.inputIcon}
              />
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onBlur={() => setEmailFocused(false)}
                onChangeText={setEmail}
                onFocus={() => setEmailFocused(true)}
                placeholder="you@example.com"
                placeholderTextColor={colors.disabled}
                style={s.input}
                value={email}
              />
            </View>

            {/* Password */}
            <Text style={[s.label, s.labelSpaced]}>Password</Text>
            <View style={[s.inputWrap, passwordFocused && s.inputFocused]}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={passwordFocused ? colors.primary : colors.textSecondary}
                style={s.inputIcon}
              />
              <TextInput
                onBlur={() => setPasswordFocused(false)}
                onChangeText={setPassword}
                onFocus={() => setPasswordFocused(true)}
                placeholder="Min. 6 characters"
                placeholderTextColor={colors.disabled}
                secureTextEntry={!showPassword}
                style={s.input}
                value={password}
              />
              <Pressable onPress={() => setShowPassword((v) => !v)} style={s.eyeBtn}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textSecondary}
                />
              </Pressable>
            </View>

            {/* Error */}
            {error ? (
              <View style={s.errorBox}>
                <Ionicons name="alert-circle" size={16} color={colors.error} />
                <Text style={s.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Sign In button */}
            <Pressable
              disabled={!isValid || loading}
              onPress={handleLogin}
              style={({ pressed }) => [
                s.btn,
                (!isValid || loading) && s.btnDisabled,
                pressed && isValid && s.btnPressed,
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={s.btnText}>Sign In</Text>
              )}
            </Pressable>
          </Animated.View>

          {/* ── Footer ── */}
          <View style={s.footer}>
            <Text style={s.footerText}>Don't have an account? </Text>
            <Pressable onPress={() => navigation.navigate('SignUp')}>
              <Text style={s.footerLink}>Sign Up</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const makeStyles = (colors: ReturnType<typeof import('../../../core/theme').useAppTheme>['colors']) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    kav: { flex: 1 },
    scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 },

    hero: { alignItems: 'center', marginBottom: 40 },
    logoWrap: {
      width: 88,
      height: 88,
      borderRadius: 28,
      backgroundColor: colors.primary + '18',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    logoEmoji: { fontSize: 44 },
    heroTitle: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 6 },
    heroSub: { fontSize: 15, color: colors.textSecondary, fontWeight: '500' },

    card: {
      backgroundColor: colors.white,
      borderRadius: 24,
      overflow: 'hidden',
      padding: 24,
      borderWidth: 1,
      borderColor: colors.border,
      ...Platform.select({
        ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8 },
        android: { elevation: 0 },
      }),
    },

    label: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, marginBottom: 8, letterSpacing: 0.4 },
    labelSpaced: { marginTop: 16 },
    inputWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: colors.border,
      paddingHorizontal: 14,
      height: 54,
    },
    inputFocused: { borderColor: colors.primary, backgroundColor: colors.primary + '06' },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, fontSize: 15, color: colors.text, fontWeight: '500' },
    eyeBtn: { padding: 4 },

    errorBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.error + '12',
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginTop: 16,
      gap: 8,
    },
    errorText: { flex: 1, fontSize: 13, color: colors.error, fontWeight: '500' },

    btn: {
      height: 56,
      borderRadius: 16,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 24,
    },
    btnDisabled: { backgroundColor: colors.disabled },
    btnPressed: { opacity: 0.88, transform: [{ scale: 0.98 }] },
    btnText: { fontSize: 16, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },

    footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 32 },
    footerText: { fontSize: 14, color: colors.textSecondary },
    footerLink: { fontSize: 14, fontWeight: '700', color: colors.primary },
  });

export default LoginScreen;
