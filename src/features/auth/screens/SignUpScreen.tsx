import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Image,
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

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

const SignUpScreen = ({ navigation }: Props) => {
  const { colors, isDark } = useAppTheme();
  const s = makeStyles(colors);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const { signUp, googleSignIn, loading, error, clearError } = useAuthStore();

  // Fade-in on mount
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    if (error) { clearError(); }
    if (localError) { setLocalError(null); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, password, confirm]);

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const passwordMatch = password === confirm;
  const isValid =
    email.trim().length > 0 &&
    password.length >= 6 &&
    passwordMatch;

  const handleSignUp = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password || !confirm) {
      setLocalError('Please complete all fields.');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setLocalError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    if (!passwordMatch) {
      setLocalError('Passwords do not match.');
      return;
    }

    if (!isValid) { return; }
    await signUp(email.trim(), password);
  };

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
          {/* ── Back button ── */}
          <Pressable onPress={() => navigation.goBack()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>

          {/* ── Hero ── */}
          <Animated.View
            style={[s.hero, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
          >
            <View style={s.logoWrap}>
              <Image
                source={require('../../../assets/images/splash_logo.png')}
                style={s.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={s.heroTitle}>Create account</Text>
            <Text style={s.heroSub}>Join Chefyai and start cooking smarter</Text>
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

            {/* Confirm Password */}
            <Text style={[s.label, s.labelSpaced]}>Confirm Password</Text>
            <View
              style={[
                s.inputWrap,
                confirmFocused && s.inputFocused,
                confirm.length > 0 && !passwordMatch && s.inputError,
              ]}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={
                  confirm.length > 0 && !passwordMatch
                    ? colors.error
                    : confirmFocused
                    ? colors.primary
                    : colors.textSecondary
                }
                style={s.inputIcon}
              />
              <TextInput
                onBlur={() => setConfirmFocused(false)}
                onChangeText={setConfirm}
                onFocus={() => setConfirmFocused(true)}
                placeholder="Re-enter password"
                placeholderTextColor={colors.disabled}
                secureTextEntry={!showConfirm}
                style={s.input}
                value={confirm}
              />
              <Pressable onPress={() => setShowConfirm((v) => !v)} style={s.eyeBtn}>
                <Ionicons
                  name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textSecondary}
                />
              </Pressable>
            </View>
            {confirm.length > 0 && !passwordMatch && (
              <Text style={s.matchError}>Passwords do not match</Text>
            )}

            {/* Firebase Error */}
            {localError || error ? (
              <View style={s.errorBox}>
                <Ionicons name="alert-circle" size={16} color={colors.error} />
                <Text style={s.errorText}>{localError ?? error}</Text>
              </View>
            ) : null}

            {/* Create Account button */}
            <Pressable
              disabled={!isValid || loading}
              onPress={handleSignUp}
              style={({ pressed }) => [
                s.btn,
                (!isValid || loading) && s.btnDisabled,
                pressed && isValid && s.btnPressed,
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={s.btnText}>Create Account</Text>
              )}
            </Pressable>

            {/* Terms hint */}
            <Text style={s.terms}>
              By signing up you agree to our Terms of Service and Privacy Policy.
            </Text>

            {/* ── Divider ── */}
            <View style={s.dividerRow}>
              <View style={s.dividerLine} />
              <Text style={s.dividerText}>or</Text>
              <View style={s.dividerLine} />
            </View>

            {/* Google Sign-Up button */}
            <Pressable
              disabled={loading}
              onPress={googleSignIn}
              style={({ pressed }) => [
                s.googleBtn,
                pressed && s.googleBtnPressed,
                loading && s.btnDisabled,
              ]}
            >
              <View style={s.googleIconWrap}>
                <Text style={s.googleG}>G</Text>
              </View>
              <Text style={s.googleBtnText}>Continue with Google</Text>
            </Pressable>
          </Animated.View>

          {/* ── Footer ── */}
          <View style={s.footer}>
            <Text style={s.footerText}>Already have an account? </Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text style={s.footerLink}>Sign In</Text>
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
    scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },

    backBtn: {
      width: 42,
      height: 42,
      borderRadius: 13,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 32,
    },

    hero: { alignItems: 'center', marginBottom: 32 },
    logoWrap: {
      width: 88,
      height: 88,
      borderRadius: 28,
      backgroundColor: colors.primary + '18',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    logoImage: { width: 60, height: 60 },
    heroTitle: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 6 },
    heroSub: { fontSize: 15, color: colors.textSecondary, fontWeight: '500', textAlign: 'center' },

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
    inputError: { borderColor: colors.error, backgroundColor: colors.error + '06' },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, fontSize: 15, color: colors.text, fontWeight: '500' },
    eyeBtn: { padding: 4 },

    matchError: { fontSize: 12, color: colors.error, marginTop: 6, marginLeft: 4, fontWeight: '500' },

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

    terms: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', marginTop: 16, lineHeight: 18 },

    footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 32 },
    footerText: { fontSize: 14, color: colors.textSecondary },
    footerLink: { fontSize: 14, fontWeight: '700', color: colors.primary },

    dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
    dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
    dividerText: { marginHorizontal: 12, fontSize: 13, color: colors.textSecondary, fontWeight: '600' },

    googleBtn: {
      height: 56,
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.white,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    googleBtnPressed: { backgroundColor: colors.background, transform: [{ scale: 0.98 }] },
    googleIconWrap: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: '#4285F4',
      alignItems: 'center',
      justifyContent: 'center',
    },
    googleG: { color: '#fff', fontSize: 14, fontWeight: '800' },
    googleBtnText: { fontSize: 15, fontWeight: '700', color: colors.text },
  });

export default SignUpScreen;
