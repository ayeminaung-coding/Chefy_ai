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
import { Colors, useAppTheme } from '../../../core/theme';
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
  const { colors, isDark } = useAppTheme();
  const s = makeStyles(colors);
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
      <View style={s.centeredFullScreen}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={s.loadingText}>Loading recipe…</Text>
      </View>
    );
  }

  if (error || !recipe) {
    return (
      <SafeAreaView style={s.notFoundContainer}>
        <Ionicons name="alert-circle-outline" size={52} color={colors.error} />
        <Text style={s.notFoundTitle}>Recipe not found</Text>
        <Text style={s.notFoundText}>
          {error ?? "We couldn't load that recipe. Please go back and try again."}
        </Text>
        <PrimaryButton onPress={() => navigation.goBack()} title="Go Back" />
      </SafeAreaView>
    );
  }

  const bookmarked = isFavorite(recipe.id);

  return (
    <View style={s.screen}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.heroContainer}>
          <Image source={{ uri: recipe.image }} style={s.heroImage} />
          <View style={s.overlay} />

          <SafeAreaView style={s.heroActions}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={s.iconButton}
            >
              <Ionicons color={colors.text} name="chevron-back" size={24} />
            </Pressable>

            <Animated.View style={{ transform: [{ scale: bookmarkScale }] }}>
              <Pressable onPress={handleBookmarkToggle} style={s.iconButton}>
                <Ionicons
                  color={bookmarked ? colors.primary : colors.text}
                  name={bookmarked ? 'heart' : 'heart-outline'}
                  size={24}
                />
              </Pressable>
            </Animated.View>
          </SafeAreaView>
        </View>

        <View style={s.contentSection}>
          <Text style={s.recipeTitle}>{recipe.title}</Text>

          <View style={s.statsContainer}>
            {recipe.readyInMinutes != null && (
              <View style={s.statItem}>
                <View style={[s.statIcon, { backgroundColor: colors.primary + '10' }]}>
                  <Ionicons color={colors.primary} name="time-outline" size={20} />
                </View>
                <Text style={s.statValue}>{recipe.readyInMinutes}m</Text>
                <Text style={s.statLabel}>Time</Text>
              </View>
            )}
            {recipe.servings != null && (
              <View style={s.statItem}>
                <View style={[s.statIcon, { backgroundColor: colors.secondary + '20' }]}>
                  <Ionicons color={colors.warning} name="people-outline" size={20} />
                </View>
                <Text style={s.statValue}>{recipe.servings}</Text>
                <Text style={s.statLabel}>Servings</Text>
              </View>
            )}
            <View style={s.statItem}>
              <View style={[s.statIcon, { backgroundColor: colors.accent + '15' }]}>
                <Ionicons color={colors.accent} name="flame-outline" size={20} />
              </View>
              <Text style={s.statValue}>Easy</Text>
              <Text style={s.statLabel}>Level</Text>
            </View>
          </View>

          {recipe.ingredients.length > 0 && (
            <>
              <Text style={s.sectionTitle}>Ingredients</Text>
              <View style={s.listCard}>
                {recipe.ingredients.map((ingredient, index) => (
                  <View
                    key={`ing-${index}`}
                    style={[
                      s.listItem,
                      index === recipe.ingredients.length - 1 && s.noBorder,
                    ]}
                  >
                    <View style={s.ingredientDot} />
                    <Text style={s.ingredientText}>
                      <Text style={s.ingredientAmount}>
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
              <Text style={s.sectionTitle}>Instructions</Text>
              <View style={s.listCard}>
                {recipe.instructions.map((step, index) => (
                  <View
                    key={`step-${index}`}
                    style={[
                      s.listItem,
                      s.alignStart,
                      index === recipe.instructions.length - 1 && s.noBorder,
                    ]}
                  >
                    <View style={s.stepBadge}>
                      <Text style={s.stepNumber}>{index + 1}</Text>
                    </View>
                    <Text style={s.instructionText}>{step}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <View style={s.footer}>
        <PrimaryButton title="Start Cooking" onPress={() => {}} />
      </View>
    </View>
  );
};

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    centeredFullScreen: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
      gap: 12,
    },
    loadingText: {
      fontSize: 15,
      color: colors.textSecondary,
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
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    contentSection: {
      backgroundColor: colors.background,
      marginTop: -30,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      paddingHorizontal: 24,
      paddingTop: 32,
    },
    recipeTitle: {
      fontSize: 26,
      fontWeight: '800',
      color: colors.text,
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
      backgroundColor: colors.white,
      borderRadius: 20,
      paddingVertical: 16,
      marginHorizontal: 4,
      borderWidth: 1,
      borderColor: colors.border,
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
      color: colors.text,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: '600',
      marginTop: 2,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 16,
    },
    listCard: {
      backgroundColor: colors.white,
      borderRadius: 24,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 24,
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
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
      backgroundColor: colors.primary,
      marginRight: 12,
    },
    ingredientText: {
      fontSize: 15,
      color: colors.text,
      flex: 1,
    },
    ingredientAmount: {
      fontWeight: '700',
      color: colors.primary,
    },
    stepBadge: {
      width: 26,
      height: 26,
      borderRadius: 8,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
      marginTop: 2,
    },
    stepNumber: {
      color: colors.white,
      fontWeight: '700',
      fontSize: 13,
    },
    instructionText: {
      flex: 1,
      fontSize: 15,
      color: colors.text,
      lineHeight: 22,
    },
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.white,
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 32,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    notFoundContainer: {
      flex: 1,
      padding: 24,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 12,
      backgroundColor: colors.background,
    },
    notFoundTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      marginTop: 8,
    },
    notFoundText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 8,
      lineHeight: 22,
    },
  });

export default RecipeDetailScreen;
