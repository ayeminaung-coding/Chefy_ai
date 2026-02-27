/**
 * Minimal stub for react-native-reanimated on web.
 *
 * react-native-gesture-handler imports reanimated inside a try-catch and
 * checks for `useSharedValue` to decide whether to use it.  By exporting an
 * empty object, that check fails and gesture-handler falls back to its default
 * (non-reanimated) implementation — which is all we need for a web build.
 */
module.exports = {};
