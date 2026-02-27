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

import { Colors, useAppTheme } from '../../../core/theme';
import useFavoritesStore from '../../../store/favoritesStore';
import useRecipeStore from '../../../store/recipeStore';
import { RootStackParamList } from '../../../types';
import RecipeList from '../components/RecipeList';

type Props = NativeStackScreenProps<RootStackParamList, 'RecipeResults'>;

const RecipeResultsScreen = ({ route, navigation }: Props) => {
  const { ingredients = [] } = route.params ?? {};
  const { colors } = useAppTheme();
  const s = makeStyles(colors);

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
    <View style={s.container}>
      <SafeAreaView style={s.header}>
        <View style={s.headerContent}>
          <Pressable onPress={() => navigation.goBack()} style={s.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>
          <View style={s.titleContainer}>
            <Text style={s.title}>Recommended</Text>
            <Text style={s.subtitle}>
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
        <View style={s.centeredState}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={s.stateText}>Finding the best recipes…</Text>
        </View>
      ) : error ? (
        <View style={s.centeredState}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
          <Text style={s.errorTitle}>Something went wrong</Text>
          <Text style={s.stateText}>{error}</Text>
          <Pressable
            onPress={() => searchRecipes(ingredients)}
            style={s.retryButton}
          >
            <Text style={s.retryText}>Try Again</Text>
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

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border },
    headerContent: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
    backButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
    titleContainer: { marginLeft: 16 },
    title: { fontSize: 20, fontWeight: '800', color: colors.text },
    subtitle: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
    centeredState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 12 },
    stateText: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },
    errorTitle: { fontSize: 20, fontWeight: '700', color: colors.text, marginTop: 4 },
    retryButton: { marginTop: 8, paddingHorizontal: 28, paddingVertical: 14, backgroundColor: colors.primary, borderRadius: 16 },
    retryText: { color: colors.white, fontWeight: '700', fontSize: 15 },
  });

export default RecipeResultsScreen;
