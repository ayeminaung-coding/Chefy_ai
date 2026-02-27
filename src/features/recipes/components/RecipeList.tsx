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

import { Colors, useAppTheme } from '../../../core/theme';
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
  const { colors } = useAppTheme();
  const s = makeStyles(colors);
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
        style={s.cardOverride}
        onBookmark={onBookmark ? () => onBookmark(item) : undefined}
        isBookmarked={getIsBookmarked ? getIsBookmarked(item.id) : false}
      />
    ),
    [onRecipePress, onBookmark, getIsBookmarked],
  );

  const renderEmpty = useCallback(
    () => (
        <View style={s.emptyStateContainer}>
        <View style={s.emptyIconContainer}>
          <Ionicons color={colors.primary} name="restaurant-outline" size={40} />
        </View>
        <Text style={s.emptyStateTitle}>No Recipes Found</Text>
        <Text style={s.emptyStateText}>{emptyMessage}</Text>
      </View>
    ),
    [emptyMessage],
  );

  return (
    <View style={s.container}>
      <FlatList
        contentContainerStyle={[
          s.contentContainer,
          recipes.length === 0 && s.emptyContentContainer,
        ]}
        data={recipes}
        keyExtractor={item => String(item.id)}
        ListEmptyComponent={renderEmpty}
        ListHeaderComponent={ListHeaderComponent ?? null}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    container: { flex: 1 },
    contentContainer: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 24 },
    emptyContentContainer: { flexGrow: 1, justifyContent: 'center' },
    cardOverride: { marginBottom: 16 },
    emptyStateContainer: { alignItems: 'center', paddingHorizontal: 32 },
    emptyIconContainer: {
      width: 80, height: 80, borderRadius: 40,
      backgroundColor: colors.primary + '15',
      alignItems: 'center', justifyContent: 'center', marginBottom: 16,
    },
    emptyStateTitle: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 8 },
    emptyStateText: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  });

export default RecipeList;
