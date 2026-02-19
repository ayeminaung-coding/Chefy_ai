import PropTypes from 'prop-types';
import { Pressable, StyleSheet, Text, View, Platform } from 'react-native';

import { COLORS } from '../../../core/theme';

const IngredientChip = ({ label, isSelected, onPress, disabled }) => {
  return (
    <View style={styles.touchTargetWrapper}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ selected: isSelected, disabled }}
        disabled={disabled}
        hitSlop={styles.hitSlopSize}
        onPress={onPress}
        style={({ pressed }) => [
          styles.chip,
          isSelected ? styles.selectedChip : styles.unselectedChip,
          disabled && styles.disabledChip,
          pressed && !disabled && styles.pressedChip,
        ]}
      >
        <Text
          style={[
            styles.label,
            isSelected ? styles.selectedLabel : styles.unselectedLabel,
          ]}
        >
          {label}
        </Text>
      </Pressable>
    </View>
  );
};

IngredientChip.propTypes = {
  label: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

IngredientChip.defaultProps = {
  isSelected: false,
  disabled: false,
};

const styles = StyleSheet.create({
  touchTargetWrapper: {
    margin: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  unselectedChip: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
  },
  selectedChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  pressedChip: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  disabledChip: {
    opacity: 0.3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  unselectedLabel: {
    color: COLORS.text,
  },
  selectedLabel: {
    color: COLORS.white,
  },
  hitSlopSize: {
    top: 4,
    right: 4,
    bottom: 4,
    left: 4,
  },
});

export default IngredientChip;
