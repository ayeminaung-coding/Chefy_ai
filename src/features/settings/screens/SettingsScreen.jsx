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
			<Text style={styles.rowIcon}>{icon}</Text>
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

	const canNavigateTo = routeName => {
		let currentNavigation = navigation;

		while (currentNavigation) {
			const state = currentNavigation.getState?.();
			if (state?.routeNames?.includes(routeName)) {
				return true;
			}
			currentNavigation = currentNavigation.getParent?.();
		}

		return false;
	};

	const handleNavigateOrNotify = (routeName, title) => {
		if (canNavigateTo(routeName)) {
			navigation.navigate(routeName);
			return;
		}

		Alert.alert('Coming soon', `${title} screen is not available yet.`);
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
		<SafeAreaView style={styles.safeArea}>
			<StatusBar barStyle="light-content" />

			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.header}>
					<View style={styles.headerGradient}>
						<View style={[styles.gradientBand, styles.gradientTop]} />
						<View style={[styles.gradientBand, styles.gradientMiddle]} />
						<View style={[styles.gradientBand, styles.gradientBottom]} />
					</View>

					<Text style={styles.headerTitle}>Settings</Text>
				</View>

				<View style={styles.profileCard}>
					<Image source={{ uri: MOCK_USER.avatarUrl }} style={styles.avatar} />
					<Text style={styles.username}>{MOCK_USER.username}</Text>
					<Text style={styles.userId}>{MOCK_USER.userId}</Text>
					<Pressable
						onPress={() => Alert.alert('Coming soon', 'Edit Profile is not available yet.')}
						style={({ pressed }) => [styles.editProfileButton, pressed && styles.editPressed]}
					>
						<Text style={styles.editProfileText}>Edit Profile</Text>
					</Pressable>
				</View>

				<View style={styles.preferencesContainer}>
					<View style={styles.sectionCard}>
						<Text style={styles.sectionHeader}>Dietary Preferences</Text>
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
							isLast
							label="Halal"
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

					<View style={styles.sectionCard}>
						<Text style={styles.sectionHeader}>App Settings</Text>
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
							icon="🌐"
							label="Language"
							onPress={() => handleNavigateOrNotify('Language', 'Language')}
							rightComponent={<Ionicons color={COLORS.textSecondary} name="chevron-forward" size={18} />}
						/>
						<InteractiveRow
							icon="🔔"
							isLast
							label="Notifications"
							onPress={() => handleNavigateOrNotify('Notifications', 'Notifications')}
							rightComponent={<Ionicons color={COLORS.textSecondary} name="chevron-forward" size={18} />}
						/>
					</View>

					<View style={styles.sectionCard}>
						<Text style={styles.sectionHeader}>About</Text>
						<InteractiveRow
							disabled
							icon="ℹ️"
							label="App Version"
							rightComponent={<Text style={styles.versionText}>{appVersion}</Text>}
						/>
						<InteractiveRow
							icon="🔒"
							label="Privacy Policy"
							onPress={() => handleNavigateOrNotify('PrivacyPolicy', 'Privacy Policy')}
							rightComponent={<Ionicons color={COLORS.textSecondary} name="chevron-forward" size={18} />}
						/>
						<InteractiveRow
							icon="📄"
							isLast
							label="Terms of Service"
							onPress={() => handleNavigateOrNotify('TermsOfService', 'Terms of Service')}
							rightComponent={<Ionicons color={COLORS.textSecondary} name="chevron-forward" size={18} />}
						/>
					</View>
				</View>

				<Pressable
					onPress={handleLogout}
					style={({ pressed }) => [styles.logoutButton, pressed && styles.rowPressed]}
				>
					<Text style={styles.logoutText}>Logout</Text>
				</Pressable>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
	scrollContent: {
		paddingBottom: 28,
	},
	header: {
		paddingHorizontal: 24,
		paddingVertical: 32,
		position: 'relative',
		overflow: 'hidden',
	},
	headerGradient: {
		...StyleSheet.absoluteFillObject,
		flexDirection: 'column',
	},
	gradientBand: {
		flex: 1,
	},
	gradientTop: {
		backgroundColor: COLORS.primary,
	},
	gradientMiddle: {
		backgroundColor: '#4343de',
	},
	gradientBottom: {
		backgroundColor: COLORS.accent,
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: '700',
		color: COLORS.white,
	},
	profileCard: {
		backgroundColor: COLORS.white,
		borderRadius: 16,
		padding: 20,
		marginHorizontal: 16,
		marginTop: -40,
		alignItems: 'center',
		shadowColor: COLORS.primary,
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.12,
		shadowRadius: 18,
		elevation: 5,
	},
	avatar: {
		width: 80,
		height: 80,
		borderRadius: 40,
		borderWidth: 3,
		borderColor: COLORS.primary,
	},
	username: {
		marginTop: 12,
		fontSize: 18,
		fontWeight: '700',
		color: COLORS.text,
	},
	userId: {
		marginTop: 4,
		fontSize: 14,
		color: COLORS.textSecondary,
	},
	editProfileButton: {
		marginTop: 10,
		paddingVertical: 6,
		paddingHorizontal: 10,
		borderRadius: 8,
	},
	editProfileText: {
		color: COLORS.accent,
		fontSize: 15,
		fontWeight: '600',
	},
	editPressed: {
		opacity: 0.75,
	},
	preferencesContainer: {
		padding: 16,
	},
	sectionCard: {
		backgroundColor: COLORS.white,
		borderRadius: 12,
		marginBottom: 16,
		overflow: 'hidden',
	},
	sectionHeader: {
		fontSize: 16,
		fontWeight: '700',
		color: COLORS.text,
		padding: 16,
		paddingBottom: 10,
	},
	row: {
		height: 60,
		paddingHorizontal: 16,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: COLORS.white,
	},
	rowBorder: {
		borderBottomWidth: 1,
		borderBottomColor: COLORS.background,
	},
	rowLeft: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	rowIcon: {
		fontSize: 18,
		marginRight: 10,
	},
	rowLabel: {
		fontSize: 16,
		color: COLORS.text,
	},
	rowPressed: {
		transform: [{ scale: 0.985 }],
		opacity: 0.96,
	},
	versionText: {
		fontSize: 14,
		color: COLORS.textSecondary,
	},
	logoutButton: {
		height: 50,
		marginHorizontal: 24,
		marginTop: 8,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: COLORS.accent,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'transparent',
	},
	logoutText: {
		fontSize: 16,
		color: COLORS.accent,
		fontWeight: '600',
	},
});

export default SettingsScreen;
