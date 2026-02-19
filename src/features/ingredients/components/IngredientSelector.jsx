import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';

import { COLORS } from '../../../core/theme';
import IngredientChip from './IngredientChip';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const EMPTY_ARRAY = [];

const areArraysEqual = (first, second) => {
  if (first === second) {
    return true;
  }

  if (first.length !== second.length) {
    return false;
  }

  for (let index = 0; index < first.length; index += 1) {
    if (first[index] !== second[index]) {
      return false;
    }
  }

  return true;
};

const IngredientSelector = ({
  ingredients,
  maxSelection = 5,
  onSelectionChange,
  initialSelection,
}) => {
  const ingredientList = useMemo(
    () => (Array.isArray(ingredients) ? ingredients : EMPTY_ARRAY),
    [ingredients],
  );
  const initialItems = useMemo(
    () => (Array.isArray(initialSelection) ? initialSelection : EMPTY_ARRAY),
    [initialSelection],
  );

  const sanitizedInitialSelection = useMemo(() => {
    const allowedIngredients = new Set(ingredientList);

    return initialItems
      .filter(name => allowedIngredients.has(name))
      .slice(0, maxSelection);
  }, [ingredientList, initialItems, maxSelection]);

  const [selectedIngredients, setSelectedIngredients] = useState(
    sanitizedInitialSelection,
  );

  useEffect(() => {
    setSelectedIngredients(prevSelected =>
      areArraysEqual(prevSelected, sanitizedInitialSelection)
        ? prevSelected
        : sanitizedInitialSelection,
    );
  }, [sanitizedInitialSelection]);

  useEffect(() => {
    onSelectionChange(selectedIngredients);
  }, [onSelectionChange, selectedIngredients]);

  const showMaxSelectionAlert = useCallback(() => {
    Alert.alert(
      'Selection limit reached',
      `You can select up to ${maxSelection} ingredients.`,
    );
  }, [maxSelection]);

  const toggleIngredient = useCallback(
    ingredientName => {
      const isCurrentlySelected = selectedIngredients.includes(ingredientName);

      if (!isCurrentlySelected && selectedIngredients.length >= maxSelection) {
        showMaxSelectionAlert();
        return;
      }

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      setSelectedIngredients(prevSelected => {
        if (prevSelected.includes(ingredientName)) {
          return prevSelected.filter(name => name !== ingredientName);
        }

        return [...prevSelected, ingredientName];
      });
    },
    [maxSelection, selectedIngredients, showMaxSelectionAlert],
  );

  const renderIngredient = useCallback(
    ({ item }) => {
      const isSelected = selectedIngredients.includes(item);
      const isDisabled = !isSelected && selectedIngredients.length >= maxSelection;

      return (
        <View style={styles.itemContainer}>
          <IngredientChip
            disabled={isDisabled}
            isSelected={isSelected}
            label={item}
            onPress={() => toggleIngredient(item)}
          />
        </View>
      );
    },
    [maxSelection, selectedIngredients, toggleIngredient],
  );

  return (
    <View style={styles.container}>
      <FlatList
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        data={ingredientList}
        keyExtractor={item => item}
        numColumns={2}
        renderItem={renderIngredient}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />

      <Text style={styles.counterText}>
        {`${selectedIngredients.length} / ${maxSelection} ingredients selected`}
      </Text>
    </View>
  );
};

IngredientSelector.propTypes = {
  ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
  maxSelection: PropTypes.number,
  onSelectionChange: PropTypes.func.isRequired,
  initialSelection: PropTypes.arrayOf(PropTypes.string),
};

IngredientSelector.defaultProps = {
  maxSelection: 5,
  initialSelection: [],
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  listContent: {
    paddingBottom: 8,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemContainer: {
    width: '48%',
  },
  counterText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default IngredientSelector;
