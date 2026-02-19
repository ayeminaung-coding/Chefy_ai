import { useMemo, useState } from 'react';
import {
	Alert,
	Image,
	Pressable,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Switch,
	Text,
	Platform,
	View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { COLORS } from '../../../core/theme';
import { MOCK_USER } from '../../../services/api/mockData';

const InteractiveRow = ({
	icon,
	label,
	onPress,
	rightComponent,
	isLast,
	disabled,
}) => (
	<Pressable
		disabled={disabled}
		onPress={onPress}
		style={({ pressed }) => [
			styles.row,
			!isLast && styles.rowBorder,
			pressed && !disabled && styles.rowPressed,
		]}
	>
		<View style={styles.rowLeft}>
			<View style={[styles.iconContainer, { backgroundColor: COLORS.primary + '10' }]}>
				<Text style={styles.rowIconText}>{icon}</Text>
			</View>
			<Text style={styles.rowLabel}>{label}</Text>
		</View>
		{rightComponent}
	</Pressable>
);

const SettingsScreen = ({ navigation }) => {
	const [preferences, setPreferences] = useState({
		isVegetarian: MOCK_USER.preferences.isVegetarian,
		isHalal: MOCK_USER.preferences.isHalal,
		darkMode: MOCK_USER.preferences.darkMode,
	});

	const appVersion = useMemo(() => '1.0.0', []);

	const togglePreference = key => {
		setPreferences(prev => ({
			...prev,
			[key]: !prev[key],
		}));
	};

	const handleLogout = () => {
		Alert.alert('Log out', 'Are you sure you want to log out?', [
			{ text: 'Cancel', style: 'cancel' },
			{
				text: 'Log out',
				style: 'destructive',
				onPress: () => Alert.alert('Logged out', 'You have been logged out.'),
			},
		]);
	};

	return (
		<View style={styles.container}>
			<StatusBar barStyle="dark-content" />
			<SafeAreaView style={styles.header}>
				<View style={styles.headerContent}>
					<Text style={styles.headerTitle}>Settings</Text>
				</View>
			</SafeAreaView>

			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.profileSection}>
					<View style={styles.avatarContainer}>
						<Image source={{ uri: MOCK_USER.avatarUrl }} style={styles.avatar} />
						<View style={styles.editBadge}>
							<Ionicons name="camera" size={14} color={COLORS.white} />
						</View>
					</View>
					<Text style={styles.username}>{MOCK_USER.username}</Text>
					<Text style={styles.email}>yasuo@chefmail.com</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Preferences</Text>
					<View style={styles.card}>
						<InteractiveRow
							icon="🥗"
							label="Vegetarian"
							onPress={() => togglePreference('isVegetarian')}
							rightComponent={
								<Switch
									onValueChange={() => togglePreference('isVegetarian')}
									thumbColor={COLORS.white}
									trackColor={{ false: COLORS.disabled, true: COLORS.primary }}
									value={preferences.isVegetarian}
								/>
							}
						/>
						<InteractiveRow
							icon="🌙"
							label="Halal"
							isLast
							onPress={() => togglePreference('isHalal')}
							rightComponent={
								<Switch
									onValueChange={() => togglePreference('isHalal')}
									thumbColor={COLORS.white}
									trackColor={{ false: COLORS.disabled, true: COLORS.primary }}
									value={preferences.isHalal}
								/>
							}
						/>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>App Settings</Text>
					<View style={styles.card}>
						<InteractiveRow
							icon="🌙"
							label="Dark Mode"
							onPress={() => togglePreference('darkMode')}
							rightComponent={
								<Switch
									onValueChange={() => togglePreference('darkMode')}
									thumbColor={COLORS.white}
									trackColor={{ false: COLORS.disabled, true: COLORS.primary }}
									value={preferences.darkMode}
								/>
							}
						/>
						<InteractiveRow
							icon="🔔"
							label="Notifications"
							rightComponent={<Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />}
						/>
						<InteractiveRow
							icon="🌐"
							label="Language"
							isLast
							rightComponent={<Text style={styles.rowValue}>English</Text>}
						/>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Support</Text>
					<View style={styles.card}>
						<InteractiveRow
							icon="ℹ️"
							label="About Chefyai"
							rightComponent={<Text style={styles.rowValue}>v{appVersion}</Text>}
						/>
						<InteractiveRow
							icon="📄"
							label="Terms of Service"
							isLast
							rightComponent={<Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />}
						/>
					</View>
				</View>

				<Pressable
					onPress={handleLogout}
					style={({ pressed }) => [
						styles.logoutButton,
						pressed && styles.logoutPressed
					]}
				>
					<Ionicons name="log-out-outline" size={20} color={COLORS.error} />
					<Text style={styles.logoutText}>Logout</Text>
				</Pressable>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
	header: {
		backgroundColor: COLORS.white,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.border,
	},
	headerContent: {
		paddingHorizontal: 24,
		paddingVertical: 16,
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: '800',
		color: COLORS.text,
	},
	scrollContent: {
		paddingBottom: 40,
	},
	profileSection: {
		alignItems: 'center',
		paddingVertical: 32,
		backgroundColor: COLORS.white,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.border,
		marginBottom: 24,
	},
	avatarContainer: {
		position: 'relative',
		marginBottom: 16,
	},
	avatar: {
		width: 100,
		height: 100,
		borderRadius: 50,
		borderWidth: 4,
		borderColor: COLORS.background,
	},
	editBadge: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		backgroundColor: COLORS.primary,
		width: 30,
		height: 30,
		borderRadius: 15,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 3,
		borderColor: COLORS.white,
	},
	username: {
		fontSize: 22,
		fontWeight: '700',
		color: COLORS.text,
		marginBottom: 4,
	},
	email: {
		fontSize: 14,
		color: COLORS.textSecondary,
		fontWeight: '500',
	},
	section: {
		paddingHorizontal: 24,
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 14,
		fontWeight: '700',
		color: COLORS.textSecondary,
		textTransform: 'uppercase',
		letterSpacing: 1.2,
		marginBottom: 12,
		marginLeft: 4,
	},
	card: {
		backgroundColor: COLORS.white,
		borderRadius: 24,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: COLORS.border,
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.03,
				shadowRadius: 8,
			},
			android: {
				elevation: 0,
			},
		}),
	},
	row: {
		height: 64,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
	},
	rowBorder: {
		borderBottomWidth: 1,
		borderBottomColor: COLORS.border,
	},
	rowPressed: {
		backgroundColor: COLORS.background,
	},
	rowLeft: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	iconContainer: {
		width: 36,
		height: 36,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
	},
	rowIconText: {
		fontSize: 18,
	},
	rowLabel: {
		fontSize: 16,
		fontWeight: '600',
		color: COLORS.text,
	},
	rowValue: {
		fontSize: 14,
		color: COLORS.textSecondary,
		fontWeight: '500',
	},
	logoutButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginHorizontal: 24,
		marginTop: 8,
		height: 58,
		borderRadius: 24,
		borderWidth: 1,
		borderColor: COLORS.error + '30',
		backgroundColor: COLORS.white,
		...Platform.select({
			ios: {
				shadowColor: COLORS.error,
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.05,
				shadowRadius: 4,
			},
			android: {
				elevation: 0,
			},
		}),
	},
	logoutPressed: {
		backgroundColor: COLORS.error + '05',
		transform: [{ scale: 0.98 }],
	},
	logoutText: {
		fontSize: 16,
		fontWeight: '700',
		color: COLORS.error,
		marginLeft: 8,
	},
});

export default SettingsScreen;



