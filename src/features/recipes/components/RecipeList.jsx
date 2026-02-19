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
    }, 700);
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

  const renderSeparator = useCallback(() => <View style={styles.separator} />, []);

  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyStateContainer}>
        <Ionicons color="#9CA3AF" name="restaurant-outline" size={28} />
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
        ItemSeparatorComponent={renderSeparator}
        keyExtractor={item => String(item.id)}
        ListEmptyComponent={renderEmpty}
        ListHeaderComponent={ListHeaderComponent || null}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
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
  emptyMessage: 'No recipes found',
  ListHeaderComponent: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  emptyContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  separator: {
    height: 16,
  },
  cardOverride: {
    marginHorizontal: 0,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyStateText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default RecipeList;
