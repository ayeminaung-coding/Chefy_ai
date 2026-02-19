import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../core/theme';
import RecipeCard from './RecipeCard';

const RecipeList = ({
  recipes,
  onRecipePress,
  emptyMessage,
  ListHeaderComponent,
}) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const renderItem = useCallback(
    ({ item }) => (
      <RecipeCard
        onPress={() => onRecipePress(item.id)}
        recipe={item}
        style={styles.cardOverride}
      />
    ),
    [onRecipePress],
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
        ListHeaderComponent={ListHeaderComponent || null}
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

RecipeList.propTypes = {
  recipes: PropTypes.arrayOf(PropTypes.object).isRequired,
  onRecipePress: PropTypes.func.isRequired,
  emptyMessage: PropTypes.string,
  ListHeaderComponent: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]),
};

RecipeList.defaultProps = {
  emptyMessage: "Try selecting different ingredients to find the perfect recipe.",
  ListHeaderComponent: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 100,
  },
  emptyContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  cardOverride: {
    marginBottom: 20,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyStateText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
});

export default RecipeList;

