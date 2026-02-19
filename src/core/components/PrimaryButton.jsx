import PropTypes from 'prop-types';
import { ActivityIndicator, Pressable, StyleSheet, Text, Vibration } from 'react-native';

import { COLORS } from '../theme';

const PrimaryButton = ({ title, onPress, disabled, loading, style }) => {
  const isDisabled = disabled || loading;

  const handlePress = () => {
    if (isDisabled) {
      return;
    }

    Vibration.vibrate(10);
    onPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        isDisabled ? styles.disabledButton : styles.enabledButton,
        pressed && !isDisabled && styles.pressedButton,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.white} size="small" />
      ) : (
        <Text style={styles.title}>{title}</Text>
      )}
    </Pressable>
  );
};

PrimaryButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

PrimaryButton.defaultProps = {
  disabled: false,
  loading: false,
  style: undefined,
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enabledButton: {
    backgroundColor: COLORS.primary,
  },
  disabledButton: {
    backgroundColor: COLORS.disabled,
  },
  pressedButton: {
    opacity: 0.8,
  },
  title: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default PrimaryButton;
