import PropTypes from 'prop-types';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  chip: {
    minHeight: 44,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  unselectedChip: {
    backgroundColor: '#ededfb',
    borderColor: COLORS.primary,
  },
  selectedChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  pressedChip: {
    opacity: 0.78,
    transform: [{ scale: 0.97 }],
  },
  disabledChip: {
    opacity: 0.38,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  unselectedLabel: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  selectedLabel: {
    color: COLORS.white,
    fontWeight: '700',
  },
  hitSlopSize: {
    top: 2,
    right: 2,
    bottom: 2,
    left: 2,
  },
});

export default IngredientChip;
