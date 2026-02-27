import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Alert,
    LayoutAnimation,
    Platform,
    StyleSheet,
    UIManager,
    View,
} from 'react-native';

import IngredientChip from './IngredientChip';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface IngredientSelectorProps {
  ingredients: string[];
  maxSelection?: number;
  onSelectionChange: (selected: string[]) => void;
  initialSelection?: string[];
}

const EMPTY_ARRAY: string[] = [];

function areArraysEqual<T>(first: T[], second: T[]): boolean {
  if (first === second) {
    return true;
  }
  if (first.length !== second.length) {
    return false;
  }
  for (let i = 0; i < first.length; i += 1) {
    if (first[i] !== second[i]) {
      return false;
    }
  }
  return true;
}

const IngredientSelector = ({
  ingredients,
  maxSelection = 5,
  onSelectionChange,
  initialSelection,
}: IngredientSelectorProps) => {
  const ingredientList = useMemo(
    () => (Array.isArray(ingredients) ? ingredients : EMPTY_ARRAY),
    [ingredients],
  );

  const initialItems = useMemo(
    () => (Array.isArray(initialSelection) ? initialSelection : EMPTY_ARRAY),
    [initialSelection],
  );

  const sanitizedInitialSelection = useMemo(() => {
    const allowed = new Set(ingredientList);
    return initialItems
      .filter(name => allowed.has(name))
      .slice(0, maxSelection);
  }, [ingredientList, initialItems, maxSelection]);

  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(
    sanitizedInitialSelection,
  );

  useEffect(() => {
    setSelectedIngredients(prev =>
      areArraysEqual(prev, sanitizedInitialSelection)
        ? prev
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
    (ingredientName: string) => {
      const isCurrentlySelected = selectedIngredients.includes(ingredientName);

      if (!isCurrentlySelected && selectedIngredients.length >= maxSelection) {
        showMaxSelectionAlert();
        return;
      }

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      setSelectedIngredients(prev => {
        if (prev.includes(ingredientName)) {
          return prev.filter(name => name !== ingredientName);
        }
        return [...prev, ingredientName];
      });
    },
    [maxSelection, selectedIngredients, showMaxSelectionAlert],
  );

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {ingredientList.map(item => {
          const isSelected = selectedIngredients.includes(item);
          const isDisabled =
            !isSelected && selectedIngredients.length >= maxSelection;

          return (
            <View key={item} style={styles.itemContainer}>
              <IngredientChip
                disabled={isDisabled}
                isSelected={isSelected}
                label={item}
                onPress={() => toggleIngredient(item)}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  itemContainer: {
    width: '50%',
    padding: 4,
  },
});

export default IngredientSelector;
