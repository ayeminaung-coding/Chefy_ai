module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // All three class-transform plugins must share loose:true or Babel
    // emits a conflicting-mode warning when processing Firebase packages.
    ['@babel/plugin-transform-private-methods', { loose: true }],
    // Load .env variables and expose them via `import { VAR } from '@env'`
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: false,
      },
    ],
  ],
};