import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect } from 'react';
import {
    ActivityIndicator,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { COLORS } from '../../../core/theme';
import useFavoritesStore from '../../../store/favoritesStore';
import useRecipeStore from '../../../store/recipeStore';
import { RootStackParamList } from '../../../types';
import RecipeList from '../components/RecipeList';

type Props = NativeStackScreenProps<RootStackParamList, 'RecipeResults'>;

const RecipeResultsScreen = ({ route, navigation }: Props) => {
  const { ingredients = [] } = route.params ?? {};

  const { recipes, loading, error, searchRecipes } = useRecipeStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (ingredients.length > 0) {
      searchRecipes(ingredients);
    }
  }, []); // intentionally runs once on mount

  const handleRecipePress = useCallback(
    (id: number) => navigation.navigate('RecipeDetail', { recipeId: id }),
    [navigation],
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <View style={styles.headerContent}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </Pressable>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Recommended</Text>
            <Text style={styles.subtitle}>
              {loading
                ? 'Searching…'
                : error
                ? 'No results'
                : `${recipes.length} recipe${recipes.length !== 1 ? 's' : ''} found`}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      {loading ? (
        <View style={styles.centeredState}>
          <ActivityIndicator color={COLORS.primary} size="large" />
          <Text style={styles.stateText}>Finding the best recipes…</Text>
        </View>
      ) : error ? (
        <View style={styles.centeredState}>
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.stateText}>{error}</Text>
          <Pressable
            onPress={() => searchRecipes(ingredients)}
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        </View>
      ) : (
        <RecipeList
          recipes={recipes}
          onRecipePress={handleRecipePress}
          onBookmark={toggleFavorite}
          getIsBookmarked={isFavorite}
          emptyMessage="We couldn't find any recipes with those ingredients. Try adding more!"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
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
  titleContainer: { marginLeft: 16 },
  title: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  stateText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 4,
  },
  retryButton: {
    marginTop: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
  },
  retryText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
});

export default RecipeResultsScreen;
