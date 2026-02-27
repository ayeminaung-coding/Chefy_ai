import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { PrimaryButton } from '../../../core/components';
import { COLORS } from '../../../core/theme';
import { getRecipeDetail } from '../../../services/api/spoonacularApi';
import useFavoritesStore from '../../../store/favoritesStore';
import { RecipeDetail, RootStackParamList } from '../../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'RecipeDetail'>;

const RecipeDetailScreen = ({ navigation, route }: Props) => {
  const recipeId = route.params.recipeId;

  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const bookmarkScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let cancelled = false;
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getRecipeDetail(recipeId);
        if (!cancelled) {
          setRecipe(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load recipe.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    fetchDetail();
    return () => {
      cancelled = true;
    };
  }, [recipeId]);

  const animateBookmark = () => {
    Animated.sequence([
      Animated.timing(bookmarkScale, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(bookmarkScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleBookmarkToggle = () => {
    if (!recipe) {
      return;
    }
    toggleFavorite(recipe);
    animateBookmark();
  };

  if (loading) {
    return (
      <View style={styles.centeredFullScreen}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator color={COLORS.primary} size="large" />
        <Text style={styles.loadingText}>Loading recipe…</Text>
      </View>
    );
  }

  if (error || !recipe) {
    return (
      <SafeAreaView style={styles.notFoundContainer}>
        <Ionicons name="alert-circle-outline" size={52} color={COLORS.error} />
        <Text style={styles.notFoundTitle}>Recipe not found</Text>
        <Text style={styles.notFoundText}>
          {error ?? "We couldn't load that recipe. Please go back and try again."}
        </Text>
        <PrimaryButton onPress={() => navigation.goBack()} title="Go Back" />
      </SafeAreaView>
    );
  }

  const bookmarked = isFavorite(recipe.id);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroContainer}>
          <Image source={{ uri: recipe.image }} style={styles.heroImage} />
          <View style={styles.overlay} />

          <SafeAreaView style={styles.heroActions}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.iconButton}
            >
              <Ionicons color={COLORS.text} name="chevron-back" size={24} />
            </Pressable>

            <Animated.View style={{ transform: [{ scale: bookmarkScale }] }}>
              <Pressable onPress={handleBookmarkToggle} style={styles.iconButton}>
                <Ionicons
                  color={bookmarked ? COLORS.primary : COLORS.text}
                  name={bookmarked ? 'heart' : 'heart-outline'}
                  size={24}
                />
              </Pressable>
            </Animated.View>
          </SafeAreaView>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.recipeTitle}>{recipe.title}</Text>

          <View style={styles.statsContainer}>
            {recipe.readyInMinutes != null && (
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: COLORS.primary + '10' }]}>
                  <Ionicons color={COLORS.primary} name="time-outline" size={20} />
                </View>
                <Text style={styles.statValue}>{recipe.readyInMinutes}m</Text>
                <Text style={styles.statLabel}>Time</Text>
              </View>
            )}
            {recipe.servings != null && (
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: COLORS.secondary + '20' }]}>
                  <Ionicons color={COLORS.warning} name="people-outline" size={20} />
                </View>
                <Text style={styles.statValue}>{recipe.servings}</Text>
                <Text style={styles.statLabel}>Servings</Text>
              </View>
            )}
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: COLORS.accent + '15' }]}>
                <Ionicons color={COLORS.accent} name="flame-outline" size={20} />
              </View>
              <Text style={styles.statValue}>Easy</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
          </View>

          {recipe.ingredients.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              <View style={styles.listCard}>
                {recipe.ingredients.map((ingredient, index) => (
                  <View
                    key={`ing-${index}`}
                    style={[
                      styles.listItem,
                      index === recipe.ingredients.length - 1 && styles.noBorder,
                    ]}
                  >
                    <View style={styles.ingredientDot} />
                    <Text style={styles.ingredientText}>
                      <Text style={styles.ingredientAmount}>
                        {ingredient.amount}{ingredient.unit}
                      </Text>
                      {' '}{ingredient.name}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {recipe.instructions.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Instructions</Text>
              <View style={styles.listCard}>
                {recipe.instructions.map((step, index) => (
                  <View
                    key={`step-${index}`}
                    style={[
                      styles.listItem,
                      styles.alignStart,
                      index === recipe.instructions.length - 1 && styles.noBorder,
                    ]}
                  >
                    <View style={styles.stepBadge}>
                      <Text style={styles.stepNumber}>{index + 1}</Text>
                    </View>
                    <Text style={styles.instructionText}>{step}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton title="Start Cooking" onPress={() => {}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centeredFullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  heroContainer: {
    height: 320,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  heroActions: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentSection: {
    backgroundColor: COLORS.background,
    marginTop: -30,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  recipeTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 32,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  listCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  alignStart: {
    alignItems: 'flex-start',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  ingredientDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginRight: 12,
  },
  ingredientText: {
    fontSize: 15,
    color: COLORS.text,
    flex: 1,
  },
  ingredientAmount: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumber: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 13,
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  notFoundContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.background,
  },
  notFoundTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 8,
  },
  notFoundText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
});

export default RecipeDetailScreen;
