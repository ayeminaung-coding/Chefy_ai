import PropTypes from 'prop-types';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const IngredientChip = ({ label, isSelected, onPress }) => {
  return (
    <View style={styles.touchTargetWrapper}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ selected: isSelected }}
        hitSlop={styles.hitSlopSize}
        onPress={onPress}
        style={({ pressed }) => [
          styles.chip,
          isSelected ? styles.selectedChip : styles.unselectedChip,
          pressed && styles.pressedChip,
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
};

IngredientChip.defaultProps = {
  isSelected: false,
};

const styles = StyleSheet.create({
  touchTargetWrapper: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  chip: {
    minHeight: 40,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  unselectedChip: {
    backgroundColor: '#E5E7EB',
    borderColor: '#9CA3AF',
  },
  selectedChip: {
    backgroundColor: '#16A34A',
    borderColor: 'transparent',
  },
  pressedChip: {
    opacity: 0.82,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
  },
  unselectedLabel: {
    color: '#374151',
    fontWeight: '400',
  },
  selectedLabel: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  hitSlopSize: {
    top: 2,
    right: 2,
    bottom: 2,
    left: 2,
  },
});

export default IngredientChip;
