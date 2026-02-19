import React, { useMemo } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../core/theme';
import { MOCK_RECIPES } from '../../../services/api/mockData';
import RecipeList from '../components/RecipeList';

const RecipeResultsScreen = ({ route, navigation }) => {
	const { ingredients = [] } = route.params || {};

	const filteredRecipes = useMemo(() => {
		if (ingredients.length === 0) return MOCK_RECIPES;
		
		return MOCK_RECIPES.map(recipe => {
			const recipeIngredientNames = recipe.ingredients.map(i => i.name.toLowerCase());
			const missingCount = recipeIngredientNames.filter(
				name => !ingredients.some(selected => name.includes(selected.toLowerCase()))
			).length;
			
			return { ...recipe, missedIngredientCount: missingCount };
		}).sort((a, b) => a.missedIngredientCount - b.missedIngredientCount);
	}, [ingredients]);

	return (
		<View style={styles.container}>
			<SafeAreaView style={styles.header}>
				<View style={styles.headerContent}>
					<Pressable 
						onPress={() => navigation.goBack()}
						style={styles.backButton}
					>
						<Ionicons name="chevron-back" size={24} color={COLORS.text} />
					</Pressable>
					<View style={styles.titleContainer}>
						<Text style={styles.title}>Recommended</Text>
						<Text style={styles.subtitle}>
							{filteredRecipes.length} recipes found
						</Text>
					</View>
				</View>
			</SafeAreaView>

			<RecipeList
				recipes={filteredRecipes}
				onRecipePress={(id) => navigation.navigate("RecipeDetail", { id })}
				emptyMessage="We couldn't find any recipes with those ingredients. Try adding more!"
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
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: COLORS.background,
	},
	titleContainer: {
		marginLeft: 16,
	},
	title: {
		fontSize: 20,
		fontWeight: '800',
		color: COLORS.text,
	},
	subtitle: {
		fontSize: 13,
		color: COLORS.textSecondary,
		fontWeight: '500',
	},
});

export default RecipeResultsScreen;
