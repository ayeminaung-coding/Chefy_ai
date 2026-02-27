const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

// Packages that contain ES module syntax or JSX and must be transpiled even
// though they live in node_modules.
const TRANSPILE_NATIVE_MODULES = [
  'react-native-vector-icons',
  '@react-navigation',
  'react-native-gesture-handler',
  'react-native-safe-area-context',
  'react-native-screens',
  '@react-native',
  'react-native',
  'react-native-web',
];

const transpileRegex = new RegExp(
  `node_modules/(?!(${TRANSPILE_NATIVE_MODULES.join('|')})/)`
);

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';

  return {
    entry: path.resolve(__dirname, 'index.js'),

    output: {
      path: path.resolve(__dirname, '..', 'web-build'),
      filename: isDev ? 'bundle.js' : 'bundle.[contenthash:8].js',
      publicPath: '/',
      clean: true,
    },

    resolve: {
      // Prefer .web.* variants, then fall back to native
      extensions: [
        '.web.tsx',
        '.web.ts',
        '.web.jsx',
        '.web.js',
        '.tsx',
        '.ts',
        '.jsx',
        '.js',
      ],
      alias: {
        // Force a single React instance — prevents the v19.0 vs v19.2
        // dual-instance crash (React error #527)
        'react': path.resolve(__dirname, '..', 'node_modules', 'react'),
        'react-dom': path.resolve(__dirname, '..', 'node_modules', 'react-dom'),
        // Map react-native → react-native-web
        'react-native$': 'react-native-web',
        // Map icon sets to web shims
        'react-native-vector-icons/Ionicons': path.resolve(
          __dirname,
          'shims/Ionicons.web.js'
        ),
        'react-native-vector-icons/Feather': path.resolve(
          __dirname,
          'shims/Feather.web.js'
        ),
        // Stub out reanimated — gesture-handler imports it inside a try-catch
        // and gracefully falls back when useSharedValue is absent.
        'react-native-reanimated': path.resolve(
          __dirname,
          'shims/react-native-reanimated.web.js'
        ),
      },
    },

    module: {
      rules: [
        // Fix for "resolved as fully specified" Webpack 5 errors in ESM packages
        {
          test: /\.m?js$/,
          resolve: {
            fullySpecified: false,
          },
        },
        // Transpile JS/TS/JSX/TSX (including select node_modules)
        {
          test: /\.(tsx?|jsx?)$/,
          exclude: transpileRegex,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              configFile: false,
              presets: [
                // modules: false → let webpack handle ES module syntax (import/export)
                // directly. If Babel converts them to CJS first, webpack's runtime
                // doesn't inject the `exports` global and you get
                // "ReferenceError: exports is not defined".
                ['@babel/preset-env', { targets: { browsers: ['last 2 versions'] }, modules: false }],
                ['@babel/preset-react', { runtime: 'automatic' }],
                ['@babel/preset-typescript', { allExtensions: true, isTSX: true }],
              ],
              plugins: [
                // All three class-transform plugins must share the same
                // loose:true setting or Babel emits conflicting-mode warnings
                ['@babel/plugin-proposal-class-properties', { loose: true }],
                ['@babel/plugin-transform-private-methods', { loose: true }],
                ['@babel/plugin-transform-private-property-in-object', { loose: true }],
              ],
            },
          },
        },
        // Font files (react-native-vector-icons icon font TTFs)
        {
          test: /\.ttf$/,
          use: [
            {
              loader: 'file-loader',
              options: { name: 'fonts/[name].[ext]', outputPath: 'assets/' },
            },
          ],
        },
        // Images
        {
          test: /\.(png|jpe?g|gif|webp)$/i,
          use: [
            {
              loader: 'url-loader',
              options: { limit: 10240, name: 'images/[name].[contenthash:8].[ext]' },
            },
          ],
        },
        // SVGs as URLs
        {
          test: /\.svg$/,
          use: [
            { loader: 'url-loader', options: { limit: 10240 } },
          ],
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.html'),
        filename: 'index.html',
      }),
      new webpack.DefinePlugin({
        __DEV__: isDev,
      }),
    ],

    devServer: {
      port: 3000,
      historyApiFallback: true,
      hot: true,
      open: true,
    },

    // Suppress 'critical dependency' warnings from react-navigation
    ignoreWarnings: [
      /Critical dependency: the request of a CommonJS require\(\) expression/,
    ],

    // Minimal source maps — fast in dev, none in prod
    devtool: isDev ? 'eval-source-map' : false,

    performance: {
      hints: isDev ? false : 'warning',
      maxEntrypointSize: 1_500_000,
      maxAssetSize: 1_500_000,
    },
  };
};
