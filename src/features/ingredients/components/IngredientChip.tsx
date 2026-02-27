import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, useAppTheme } from '../../../core/theme';

interface IngredientChipProps {
  label: string;
  isSelected?: boolean;
  onPress: () => void;
  disabled?: boolean;
}

const IngredientChip: React.FC<IngredientChipProps> = ({
  label,
  isSelected = false,
  onPress,
  disabled = false,
}) => {
  const { colors } = useAppTheme();
  const s = makeStyles(colors);

  return (
    <View style={s.touchTargetWrapper}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ selected: isSelected, disabled }}
        disabled={disabled}
        hitSlop={s.hitSlopSize}
        onPress={onPress}
        style={({ pressed }) => [
          s.chip,
          isSelected ? s.selectedChip : s.unselectedChip,
          disabled && s.disabledChip,
          pressed && !disabled && s.pressedChip,
        ]}
      >
        <Text
          style={[s.label, isSelected ? s.selectedLabel : s.unselectedLabel]}
        >
          {label}
        </Text>
      </Pressable>
    </View>
  );
};

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    touchTargetWrapper: { margin: 4 },
    chip: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
    },
    unselectedChip: { backgroundColor: colors.white, borderColor: colors.border },
    selectedChip: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      ...Platform.select({
        ios: {
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
        },
        android: { elevation: 0 },
      }),
    },
    pressedChip: { opacity: 0.85, transform: [{ scale: 0.96 }] },
    disabledChip: { opacity: 0.3 },
    label: { fontSize: 14, fontWeight: '600', letterSpacing: 0.2 },
    unselectedLabel: { color: colors.text },
    selectedLabel: { color: colors.white },
    hitSlopSize: { top: 4, right: 4, bottom: 4, left: 4 },
  });

export default IngredientChip;
