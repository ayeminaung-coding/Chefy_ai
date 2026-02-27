import React, { useCallback, useState } from 'react';
import {
    FlatList,
    ListRenderItemInfo,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { COLORS } from '../../../core/theme';
import { RecipeItem } from '../../../types';
import RecipeCard from './RecipeCard';

interface RecipeListProps {
  recipes: RecipeItem[];
  onRecipePress: (id: number) => void;
  emptyMessage?: string;
  ListHeaderComponent?: React.ComponentType | React.ReactElement | null;
  onBookmark?: (recipe: RecipeItem) => void;
  getIsBookmarked?: (id: number) => boolean;
}

const RecipeList = ({
  recipes,
  onRecipePress,
  emptyMessage = 'Try selecting different ingredients to find the perfect recipe.',
  ListHeaderComponent,
  onBookmark,
  getIsBookmarked,
}: RecipeListProps) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<RecipeItem>) => (
      <RecipeCard
        onPress={() => onRecipePress(item.id)}
        recipe={item}
        style={styles.cardOverride}
        onBookmark={onBookmark ? () => onBookmark(item) : undefined}
        isBookmarked={getIsBookmarked ? getIsBookmarked(item.id) : false}
      />
    ),
    [onRecipePress, onBookmark, getIsBookmarked],
  );

  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyStateContainer}>
        <View style={styles.emptyIconContainer}>
          <Ionicons color={COLORS.primary} name="restaurant-outline" size={40} />
        </View>
        <Text style={styles.emptyStateTitle}>No Recipes Found</Text>
        <Text style={styles.emptyStateText}>{emptyMessage}</Text>
      </View>
    ),
    [emptyMessage],
  );

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={[
          styles.contentContainer,
          recipes.length === 0 && styles.emptyContentContainer,
        ]}
        data={recipes}
        keyExtractor={item => String(item.id)}
        ListEmptyComponent={renderEmpty}
        ListHeaderComponent={ListHeaderComponent ?? null}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  emptyContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  cardOverride: {
    marginBottom: 16,
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default RecipeList;
