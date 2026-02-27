module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // All three class-transform plugins must share loose:true or Babel
    // emits a conflicting-mode warning when processing Firebase packages.
    ['@babel/plugin-transform-private-methods', { loose: true }],
  ],
};