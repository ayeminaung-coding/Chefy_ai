import { useMemo, useRef, useState } from 'react';
import {
	Animated,
	Image,
	Pressable,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { PrimaryButton } from '../../../core/components';
import { COLORS } from '../../../core/theme';
import { MOCK_RECIPES } from '../../../services/api/mockData';

const RecipeDetailScreen = ({ navigation, route }) => {
	const recipeIdParam = route?.params?.recipeId ?? route?.params?.id;
	const recipeId = Number(recipeIdParam);

	const recipe = useMemo(
		() => MOCK_RECIPES.find(item => item.id === recipeId),
		[recipeId],
	);

	const [isBookmarked, setIsBookmarked] = useState(false);
	const bookmarkScale = useRef(new Animated.Value(1)).current;

	const animateBookmark = () => {
		Animated.sequence([
			Animated.timing(bookmarkScale, {
				toValue: 1.15,
				duration: 120,
				useNativeDriver: true,
			}),
			Animated.spring(bookmarkScale, {
				toValue: 1,
				speed: 16,
				bounciness: 8,
				useNativeDriver: true,
			}),
		]).start();
	};

	const handleBookmarkToggle = () => {
		setIsBookmarked(prev => !prev);
		animateBookmark();
	};

	if (!recipe) {
		return (
			<SafeAreaView style={styles.notFoundContainer}>
				<Text style={styles.notFoundTitle}>Recipe not found</Text>
				<Text style={styles.notFoundText}>
					We couldn&apos;t load that recipe. Please go back and try again.
				</Text>
				<PrimaryButton onPress={() => navigation.goBack()} title="Go Back" />
			</SafeAreaView>
		);
	}

	return (
		<View style={styles.screen}>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.heroContainer}>
					<Image source={{ uri: recipe.image }} style={styles.heroImage} />

					<View pointerEvents="none" style={styles.gradientOverlay}>
						<View style={styles.gradientLayerOne} />
						<View style={styles.gradientLayerTwo} />
						<View style={styles.gradientLayerThree} />
					</View>

					<SafeAreaView style={styles.heroActions}>
						<Pressable
							onPress={() => navigation.goBack()}
							style={styles.iconButton}
						>
							<Ionicons color={COLORS.text} name="arrow-back" size={20} />
						</Pressable>

						<Animated.View style={{ transform: [{ scale: bookmarkScale }] }}>
							<Pressable onPress={handleBookmarkToggle} style={styles.iconButton}>
								<Ionicons
									color={isBookmarked ? COLORS.accent : COLORS.text}
									name={isBookmarked ? 'heart' : 'heart-outline'}
									size={20}
								/>
							</Pressable>
						</Animated.View>
					</SafeAreaView>
				</View>

				<View style={styles.contentSection}>
					<Text style={styles.recipeTitle}>{recipe.title}</Text>

					<View style={styles.infoCard}>
						<View style={styles.infoItem}>
							<Ionicons color={COLORS.secondary} name="time-outline" size={18} />
							<Text style={styles.infoText}>{`${recipe.readyInMinutes} min`}</Text>
						</View>

						<Text style={styles.infoDivider}>|</Text>

						<View style={styles.infoItem}>
							<Ionicons color={COLORS.secondary} name="people-outline" size={18} />
							<Text style={styles.infoText}>{`${recipe.servings} servings`}</Text>
						</View>
					</View>

					<Text style={styles.sectionTitle}>Ingredients</Text>
					<View style={styles.ingredientsCard}>
						{recipe.ingredients.map((ingredient, index) => (
							<View
								key={`${ingredient.name}-${index}`}
								style={[
									styles.ingredientRow,
									index < recipe.ingredients.length - 1 && styles.ingredientSpacing,
								]}
							>
								<Text style={styles.bullet}>•</Text>
								<Text style={styles.ingredientText}>{`${ingredient.amount}${ingredient.unit} ${ingredient.name}`}</Text>
							</View>
						))}
					</View>

					<Text style={styles.sectionTitle}>Instructions</Text>
					{recipe.instructions.map((step, index) => (
						<View
							key={`step-${index}`}
							style={[styles.instructionCard, index > 0 && styles.instructionSpacing]}
						>
							<View style={styles.stepBadge}>
								<Text style={styles.stepNumber}>{index + 1}</Text>
							</View>
							<Text style={styles.stepText}>{step}</Text>
						</View>
					))}
				</View>
			</ScrollView>

			<View style={styles.bottomBackdrop}>
				<SafeAreaView style={styles.bottomSafeArea}>
					<View style={styles.buttonWrapper}>
						<PrimaryButton title="Start Cooking" onPress={() => {}} />
						<View pointerEvents="none" style={styles.playIconWrapper}>
							<Ionicons color={COLORS.white} name="play" size={16} />
						</View>
					</View>
				</SafeAreaView>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
	scrollContent: {
		paddingBottom: 120,
	},
	heroContainer: {
		position: 'relative',
		width: '100%',
		height: 300,
		overflow: 'hidden',
	},
	heroImage: {
		width: '100%',
		height: '100%',
	},
	gradientOverlay: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		height: 140,
		justifyContent: 'flex-end',
	},
	gradientLayerOne: {
		height: 42,
		backgroundColor: 'rgba(6, 6, 10, 0.2)',
	},
	gradientLayerTwo: {
		height: 42,
		backgroundColor: 'rgba(6, 6, 10, 0.4)',
	},
	gradientLayerThree: {
		height: 56,
		backgroundColor: COLORS.text,
	},
	heroActions: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		paddingHorizontal: 16,
		paddingTop: 12,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	iconButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: 'rgba(255, 255, 255, 0.9)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	contentSection: {
		marginTop: -24,
		padding: 20,
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		backgroundColor: COLORS.background,
	},
	recipeTitle: {
		fontSize: 24,
		fontWeight: '700',
		color: COLORS.text,
		marginBottom: 14,
	},
	infoCard: {
		backgroundColor: COLORS.white,
		borderRadius: 12,
		padding: 12,
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 20,
	},
	infoItem: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	infoDivider: {
		marginHorizontal: 12,
		color: '#d0d0e5',
		fontSize: 16,
	},
	infoText: {
		marginLeft: 6,
		fontSize: 14,
		color: COLORS.text,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '700',
		color: COLORS.text,
		marginBottom: 12,
	},
	ingredientsCard: {
		backgroundColor: COLORS.white,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: COLORS.secondary,
		padding: 16,
		marginBottom: 20,
	},
	ingredientRow: {
		flexDirection: 'row',
		alignItems: 'flex-start',
	},
	ingredientSpacing: {
		marginBottom: 8,
	},
	bullet: {
		color: COLORS.accent,
		fontSize: 20,
		lineHeight: 24,
		marginRight: 8,
	},
	ingredientText: {
		flex: 1,
		fontSize: 16,
		color: COLORS.text,
		lineHeight: 24,
	},
	instructionCard: {
		backgroundColor: COLORS.white,
		borderRadius: 12,
		padding: 16,
		flexDirection: 'row',
		alignItems: 'flex-start',
	},
	instructionSpacing: {
		marginTop: 12,
	},
	stepBadge: {
		width: 28,
		height: 28,
		borderRadius: 14,
		backgroundColor: COLORS.primary,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
		marginTop: 2,
	},
	stepNumber: {
		color: COLORS.white,
		fontWeight: '700',
		fontSize: 14,
	},
	stepText: {
		flex: 1,
		fontSize: 16,
		color: COLORS.text,
		lineHeight: 24,
	},
	bottomBackdrop: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(247, 247, 252, 0.92)',
		borderTopWidth: 1,
		borderTopColor: 'rgba(141, 141, 236, 0.18)',
	},
	bottomSafeArea: {
		paddingHorizontal: 16,
		paddingTop: 10,
		paddingBottom: 10,
	},
	buttonWrapper: {
		position: 'relative',
	},
	playIconWrapper: {
		position: 'absolute',
		left: 16,
		top: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
	},
	notFoundContainer: {
		flex: 1,
		padding: 24,
		justifyContent: 'center',
		backgroundColor: COLORS.background,
	},
	notFoundTitle: {
		fontSize: 24,
		fontWeight: '700',
		color: COLORS.text,
		marginBottom: 8,
	},
	notFoundText: {
		fontSize: 16,
		color: COLORS.textSecondary,
		marginBottom: 20,
		lineHeight: 24,
	},
});

export default RecipeDetailScreen;
