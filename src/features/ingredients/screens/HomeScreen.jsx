import { useMemo, useState } from 'react';
import {
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { PrimaryButton } from '../../../core/components';
import { COLORS } from '../../../core/theme';
import { INGREDIENT_LIST } from '../../../services/api/mockData';
import IngredientSelector from '../components/IngredientSelector';

const HomeScreen = ({ navigation }) => {
	const [selectedIngredients, setSelectedIngredients] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');

	const filteredIngredients = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) {
			return INGREDIENT_LIST;
		}
		return INGREDIENT_LIST.filter(name =>
			name.toLowerCase().includes(q),
		);
	}, [searchQuery]);

	const isFindRecipesDisabled = useMemo(
		() => selectedIngredients.length < 3,
		[selectedIngredients.length],
	);

	const handleFindRecipes = () => {
		navigation.navigate('RecipeResults', {
			ingredients: selectedIngredients,
		});
	};

	return (
		<View style={styles.container}>
			<StatusBar barStyle="light-content" />

			{/* ── Purple header banner ── */}
			<View style={styles.headerBanner}>
				<SafeAreaView>
					<View style={styles.headerInner}>
						<View>
							<Text style={styles.title}>{'What\'s in your\nfridge? 🧊'}</Text>
							<Text style={styles.subtitle}>Pick 3–5 ingredients to find recipes</Text>
						</View>
						<View style={styles.counterBadge}>
							<Text style={styles.counterBadgeText}>{selectedIngredients.length}/5</Text>
						</View>
					</View>
				</SafeAreaView>
			</View>

			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.content}>
					{/* ── Search bar ── */}
					<View style={styles.searchContainer}>
						<View style={styles.searchIconWrap}>
							<Icon color={COLORS.primary} name="search" size={18} />
						</View>
						<TextInput
							placeholder="Search ingredients..."
							placeholderTextColor={COLORS.textSecondary}
							style={styles.searchInput}
							value={searchQuery}
							onChangeText={setSearchQuery}
							autoCorrect={false}
							autoCapitalize="none"
							returnKeyType="search"
						/>
					</View>

					{/* ── Section label ── */}
					<View style={styles.sectionRow}>
						<Text style={styles.sectionLabel}>🥦 Ingredients</Text>
						{selectedIngredients.length > 0 && (
							<Text style={styles.sectionHint}>{`${selectedIngredients.length} selected`}</Text>
						)}
					</View>

					<IngredientSelector
						ingredients={filteredIngredients}
						maxSelection={5}
						onSelectionChange={setSelectedIngredients}
					/>
				</View>
			</ScrollView>

			{/* ── Sticky bottom CTA ── */}
			<View style={styles.bottomArea}>
				<SafeAreaView>
					<PrimaryButton
						disabled={isFindRecipesDisabled}
						onPress={handleFindRecipes}
						title="Find Recipes"
					/>
				</SafeAreaView>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background,
	},

	/* ── Header banner ── */
	headerBanner: {
		backgroundColor: COLORS.primary,
		paddingHorizontal: 24,
		paddingBottom: 28,
		borderBottomLeftRadius: 28,
		borderBottomRightRadius: 28,
		// subtle shadow so the card content below looks layered
		shadowColor: COLORS.primary,
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.28,
		shadowRadius: 16,
		elevation: 8,
	},
	headerInner: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		justifyContent: 'space-between',
		marginTop: 12,
	},
	title: {
		fontSize: 26,
		fontWeight: '800',
		color: COLORS.white,
		lineHeight: 34,
	},
	subtitle: {
		marginTop: 6,
		fontSize: 13,
		color: 'rgba(255,255,255,0.72)',
		letterSpacing: 0.2,
	},
	counterBadge: {
		backgroundColor: 'rgba(255,255,255,0.18)',
		borderRadius: 20,
		paddingHorizontal: 14,
		paddingVertical: 8,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.35)',
	},
	counterBadgeText: {
		color: COLORS.white,
		fontSize: 18,
		fontWeight: '700',
	},

	/* ── Scroll & content ── */
	scrollContent: {
		paddingBottom: 120,
	},
	content: {
		paddingHorizontal: 20,
		paddingTop: 20,
	},

	/* ── Search bar ── */
	searchContainer: {
		height: 52,
		borderRadius: 14,
		backgroundColor: COLORS.white,
		paddingHorizontal: 6,
		marginBottom: 20,
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1.5,
		borderColor: COLORS.border,
		shadowColor: COLORS.primary,
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.08,
		shadowRadius: 8,
		elevation: 2,
	},
	searchIconWrap: {
		width: 38,
		height: 38,
		borderRadius: 10,
		backgroundColor: '#ededfb',
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 2,
	},
	searchInput: {
		flex: 1,
		marginLeft: 10,
		fontSize: 15,
		color: COLORS.text,
		paddingVertical: 0,
	},

	/* ── Section row ── */
	sectionRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 12,
	},
	sectionLabel: {
		fontSize: 16,
		fontWeight: '700',
		color: COLORS.text,
	},
	sectionHint: {
		fontSize: 13,
		color: COLORS.accent,
		fontWeight: '600',
	},

	/* ── Bottom CTA ── */
	bottomArea: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		paddingHorizontal: 20,
		paddingTop: 10,
		paddingBottom: 6,
		backgroundColor: 'rgba(247,247,252,0.96)',
		borderTopWidth: 1,
		borderTopColor: COLORS.border,
	},
});

export default HomeScreen;
