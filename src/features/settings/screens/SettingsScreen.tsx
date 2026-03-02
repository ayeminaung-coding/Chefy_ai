import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useMemo, useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Colors, useAppTheme } from '../../../core/theme';
import { MOCK_USER } from '../../../services/api/mockData';
import useAuthStore from '../../../store/authStore';
import useSettingsStore from '../../../store/settingsStore';
import { TabParamList } from '../../../types';

type Props = BottomTabScreenProps<TabParamList, 'Settings'>;

interface InteractiveRowProps {
  icon: string;
  label: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  isLast?: boolean;
  disabled?: boolean;
  colors: Colors;
}

const InteractiveRow = ({
  icon,
  label,
  onPress,
  rightComponent,
  isLast = false,
  disabled = false,
  colors,
}: InteractiveRowProps) => {
  const s = makeStyles(colors);
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.row,
        !isLast && s.rowBorder,
        pressed && !disabled && s.rowPressed,
      ]}
    >
      <View style={s.rowLeft}>
        <View style={[s.iconContainer, { backgroundColor: colors.primary + '18' }]}>
          <Text style={s.rowIconText}>{icon}</Text>
        </View>
        <Text style={s.rowLabel}>{label}</Text>
      </View>
      {rightComponent}
    </Pressable>
  );
};

const SettingsScreen = ({ navigation: _navigation }: Props) => {
  const { colors, isDark } = useAppTheme();
  const s = makeStyles(colors);

  const { isVegetarian, isHalal, darkMode, setVegetarian, setHalal, setDarkMode } =
    useSettingsStore();
  const { logout, user } = useAuthStore();

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const appVersion = useMemo(() => '1.0.0', []);

  // True when the user signed in via Google
  const isGoogleUser = user?.providerData?.some(
    (p) => p.providerId === 'google.com'
  ) ?? false;

  const handleLogout = () => setLogoutModalVisible(true);

  return (
    <View style={s.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={s.header}>
        <View style={s.headerContent}>
          <Text style={s.headerTitle}>Settings</Text>
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.profileSection}>
          <View style={s.avatarContainer}>
            <Image
              source={{
                uri: isGoogleUser && user?.photoURL
                  ? user.photoURL
                  : MOCK_USER.avatarUrl,
              }}
              style={s.avatar}
            />
            <View style={s.editBadge}>
              <Ionicons name="camera" size={14} color={colors.white} />
            </View>
          </View>
          <Text style={s.username}>{user?.displayName ?? MOCK_USER.username}</Text>
          <Text style={s.email}>{user?.email ?? 'yasuo@chefmail.com'}</Text>
        </View>

        {/* ── Dietary filters (affect search results) ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Dietary Filters</Text>
          <Text style={s.sectionHint}>These filters apply to every recipe search.</Text>
          <View style={s.card}>
            <InteractiveRow
              colors={colors}
              icon="🥗"
              label="Vegetarian"
              onPress={() => setVegetarian(!isVegetarian)}
              rightComponent={
                <Switch
                  onValueChange={(v) => setVegetarian(v)}
                  thumbColor={colors.white}
                  trackColor={{ false: colors.disabled, true: colors.primary }}
                  value={isVegetarian}
                />
              }
            />
            <InteractiveRow
              colors={colors}
              icon="🌿"
              label="Halal"
              isLast
              onPress={() => setHalal(!isHalal)}
              rightComponent={
                <Switch
                  onValueChange={(v) => setHalal(v)}
                  thumbColor={colors.white}
                  trackColor={{ false: colors.disabled, true: colors.primary }}
                  value={isHalal}
                />
              }
            />
          </View>
        </View>

        {/* ── App Settings ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>App Settings</Text>
          <View style={s.card}>
            <InteractiveRow
              colors={colors}
              icon="🌙"
              label="Dark Mode"
              onPress={() => setDarkMode(!darkMode)}
              rightComponent={
                <Switch
                  onValueChange={(v) => setDarkMode(v)}
                  thumbColor={colors.white}
                  trackColor={{ false: colors.disabled, true: colors.primary }}
                  value={darkMode}
                />
              }
            />
            <InteractiveRow
              colors={colors}
              icon="🔔"
              label="Notifications"
              rightComponent={
                <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
              }
            />
            <InteractiveRow
              colors={colors}
              icon="🌐"
              label="Language"
              isLast
              rightComponent={<Text style={s.rowValue}>English</Text>}
            />
          </View>
        </View>

        {/* ── Support ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Support</Text>
          <View style={s.card}>
            <InteractiveRow
              colors={colors}
              icon="ℹ️"
              label="About Chefyai"
              rightComponent={<Text style={s.rowValue}>v{appVersion}</Text>}
            />
            <InteractiveRow
              colors={colors}
              icon="📄"
              label="Terms of Service"
              isLast
              rightComponent={
                <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
              }
            />
          </View>
        </View>

        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [s.logoutButton, pressed && s.logoutPressed]}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={s.logoutText}>Logout</Text>
        </Pressable>
      </ScrollView>

      {/* ── Logout confirmation modal (works on web + native) ── */}
      <Modal
        animationType="fade"
        transparent
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <Pressable style={s.modalOverlay} onPress={() => setLogoutModalVisible(false)}>
          <Pressable style={s.modalBox} onPress={() => { }}>
            <View style={s.modalIconWrap}>
              <Ionicons name="log-out-outline" size={28} color={colors.error} />
            </View>
            <Text style={s.modalTitle}>Log out</Text>
            <Text style={s.modalMessage}>Are you sure you want to log out?</Text>
            <View style={s.modalActions}>
              <Pressable
                style={({ pressed }) => [s.modalBtn, s.modalBtnCancel, pressed && s.modalBtnPressed]}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={s.modalBtnCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [s.modalBtn, s.modalBtnConfirm, pressed && s.modalBtnPressed]}
                onPress={() => { setLogoutModalVisible(false); logout(); }}
              >
                <Text style={s.modalBtnConfirmText}>Log out</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      backgroundColor: colors.white,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerContent: { paddingHorizontal: 24, paddingVertical: 16 },
    headerTitle: { fontSize: 24, fontWeight: '800', color: colors.text },
    scrollContent: { paddingBottom: 40 },
    profileSection: {
      alignItems: 'center',
      paddingVertical: 32,
      backgroundColor: colors.white,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      marginBottom: 24,
    },
    avatarContainer: { position: 'relative', marginBottom: 16 },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 4,
      borderColor: colors.background,
    },
    editBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: colors.primary,
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 3,
      borderColor: colors.white,
    },
    username: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 4 },
    email: { fontSize: 14, color: colors.textSecondary, fontWeight: '500' },
    section: { paddingHorizontal: 24, marginBottom: 24 },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      marginBottom: 4,
      marginLeft: 4,
    },
    sectionHint: {
      fontSize: 12,
      color: colors.textSecondary,
      marginLeft: 4,
      marginBottom: 12,
    },
    card: {
      backgroundColor: colors.white,
      borderRadius: 24,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
      ...Platform.select({
        ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8 },
        android: { elevation: 0 },
      }),
    },
    row: {
      height: 64,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
    },
    rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
    rowPressed: { backgroundColor: colors.background },
    rowLeft: { flexDirection: 'row', alignItems: 'center' },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    rowIconText: { fontSize: 18 },
    rowLabel: { fontSize: 16, fontWeight: '600', color: colors.text },
    rowValue: { fontSize: 14, color: colors.textSecondary, fontWeight: '500' },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 24,
      marginTop: 8,
      height: 58,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.error + '30',
      backgroundColor: colors.white,
      ...Platform.select({
        ios: { shadowColor: colors.error, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
        android: { elevation: 0 },
      }),
    },
    logoutPressed: { backgroundColor: colors.error + '05', transform: [{ scale: 0.98 }] },
    logoutText: { fontSize: 16, fontWeight: '700', color: colors.error, marginLeft: 8 },

    // ── Logout modal ──
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    modalBox: {
      width: '100%',
      backgroundColor: colors.white,
      borderRadius: 24,
      padding: 24,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalIconWrap: {
      width: 56,
      height: 56,
      borderRadius: 16,
      backgroundColor: colors.error + '12',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    modalTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 8 },
    modalMessage: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
    modalActions: { flexDirection: 'row', gap: 12, width: '100%' },
    modalBtn: {
      flex: 1,
      height: 48,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalBtnCancel: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalBtnConfirm: { backgroundColor: colors.error },
    modalBtnPressed: { opacity: 0.8 },
    modalBtnCancelText: { fontSize: 15, fontWeight: '700', color: colors.text },
    modalBtnConfirmText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  });

export default SettingsScreen;
