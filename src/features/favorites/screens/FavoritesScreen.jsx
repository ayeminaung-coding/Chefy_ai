import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../../core/theme';
import { MOCK_RECIPES } from '../../../services/api/mockData';
import RecipeList from '../../recipes/components/RecipeList';

const FavoritesScreen = ({ navigation }) => {
	// Mock favorites using the first two recipes
	const favoriteRecipes = MOCK_RECIPES.slice(0, 2);

	return (
		<View style={styles.container}>
			<SafeAreaView style={styles.header}>
				<View style={styles.headerContent}>
					<Text style={styles.title}>Your Favorites</Text>
					<Text style={styles.subtitle}>
						{favoriteRecipes.length} recipes saved
					</Text>
				</View>
			</SafeAreaView>

			<RecipeList
				recipes={favoriteRecipes}
				onRecipePress={(id) => navigation.navigate("RecipeDetail", { id })}
				emptyMessage="Start exploring and bookmark your favorite recipes!"
			/>
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
	title: {
		fontSize: 24,
		fontWeight: '800',
		color: COLORS.text,
	},
	subtitle: {
		fontSize: 14,
		color: COLORS.textSecondary,
		fontWeight: '500',
		marginTop: 2,
	},
});

export default FavoritesScreen;

