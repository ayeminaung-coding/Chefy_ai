import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../../core/theme';
import useFavoritesStore from '../../../store/favoritesStore';
import { RootStackParamList, TabParamList } from '../../../types';
import RecipeList from '../../recipes/components/RecipeList';

type FavoritesNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Favorites'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: FavoritesNavProp;
}

const FavoritesScreen = ({ navigation }: Props) => {
  const { favorites, loadFavorites } = useFavoritesStore();

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Your Favorites</Text>
          <Text style={styles.subtitle}>
            {favorites.length} {favorites.length === 1 ? 'recipe' : 'recipes'} saved
          </Text>
        </View>
      </SafeAreaView>

      <RecipeList
        recipes={favorites}
        onRecipePress={id => navigation.navigate('RecipeDetail', { recipeId: id })}
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
