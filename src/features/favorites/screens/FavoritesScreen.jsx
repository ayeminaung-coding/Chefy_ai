import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../../core/theme';

const FavoritesScreen = () => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Favorites</Text>
			<View style={styles.card}>
				<Text style={styles.emptyTitle}>No saved recipes yet</Text>
				<Text style={styles.emptySubtitle}>
					Recipes you bookmark will appear here.
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 24,
	},
	title: {
		color: COLORS.text,
		fontSize: 22,
		fontWeight: '700',
		marginBottom: 14,
	},
	card: {
		width: '100%',
		backgroundColor: COLORS.white,
		borderRadius: 16,
		paddingVertical: 24,
		paddingHorizontal: 18,
		borderWidth: 1,
		borderColor: COLORS.secondary,
		alignItems: 'center',
	},
	emptyTitle: {
		fontSize: 18,
		fontWeight: '700',
		color: COLORS.text,
		marginBottom: 6,
	},
	emptySubtitle: {
		fontSize: 14,
		lineHeight: 20,
		color: COLORS.textSecondary,
		textAlign: 'center',
	},
});

export default FavoritesScreen;
