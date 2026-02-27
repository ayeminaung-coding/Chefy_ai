# Chefy AI

**Chefy AI** is a React Native mobile app that helps users discover recipes based on ingredients they already have at home. Users can apply dietary filters, save their favourite recipes, and enjoy a fully dark-mode-aware UI.

---

## Features

- **Ingredient-based recipe search** — type in what's in your kitchen and get matched recipes via the Spoonacular API
- **Dietary filters** — Vegetarian and Halal toggles that are applied to every search (persisted across app restarts)
- **Save to Favourites** — bookmark recipes; persisted to Firebase Firestore
- **Dark mode** — full dark/light theme toggle that immediately re-renders the entire UI
- **Animated interactions** — bookmark pulse animation, pressable scale feedback, hero image parallax

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.78 (CLI), TypeScript |
| State management | Zustand 5 |
| Remote persistence | Firebase Firestore |
| Local persistence | `@react-native-async-storage/async-storage` |
| Recipe API | Spoonacular `complexSearch` endpoint |
| Navigation | React Navigation 7 (Stack + Bottom Tabs) |
| Icons | `react-native-vector-icons` (Ionicons) |
| Theme | React Context (`ThemeProvider` + `useAppTheme` hook) |

---

## Architecture

```
Presentation Layer (screens / components)
        │  useAppTheme()       makeStyles(colors)
        ▼
  ThemeContext  ◄── useSettingsStore (darkMode)
        │
        ▼
  Zustand Stores
  ┌─────────────────┐  ┌──────────────────┐  ┌───────────────────┐
  │  recipeStore    │  │  favoritesStore  │  │  settingsStore    │
  │  (search state) │  │  (Firestore)     │  │  (AsyncStorage)   │
  └────────┬────────┘  └──────────────────┘  └───────────────────┘
           │
           ▼
     Service Layer
  ┌─────────────────────┐   ┌──────────────────┐
  │  spoonacularApi.ts  │   │  firebaseClient  │
  │  complexSearch +    │   │  (Firestore CRUD) │
  │  diet/exclude params│   └──────────────────┘
  └─────────────────────┘
```

### Key design decisions

- **`useAppTheme` + `makeStyles(colors)`** — every component calls `useAppTheme()` to get the active colour palette, then passes it into a `makeStyles` factory that returns a `StyleSheet`. This means zero hardcoded colours anywhere in the component tree.
- **Settings are read via `getState()`** inside async store actions (not as hooks) to avoid hook rules violations when `searchRecipes` reads `settingsStore`.
- **Halal filter** is approximated by excluding `pork, bacon, ham, lard, gelatin, alcohol, wine, beer` from the Spoonacular query.
- **Firestore favourites** are toggled atomically — add if not present, delete if present — keyed by Spoonacular recipe ID.

---

## Folder Structure

```
Chefy_ai/
├── android/                    # Android native project
├── src/
│   ├── config/                 # Environment variables (API keys, Firebase config)
│   ├── core/
│   │   ├── components/         # Shared UI components
│   │   │   └── PrimaryButton.tsx
│   │   └── theme/
│   │       ├── colors.ts       # COLORS (light) + DARK_COLORS (dark) + Colors type
│   │       ├── ThemeContext.tsx # ThemeProvider + useAppTheme hook
│   │       └── index.ts        # Barrel export
│   ├── features/               # Feature-sliced modules
│   │   ├── ingredients/
│   │   │   ├── components/     # IngredientChip, IngredientSelector
│   │   │   └── screens/        # HomeScreen (ingredient picker)
│   │   ├── recipes/
│   │   │   ├── components/     # RecipeCard, RecipeList
│   │   │   └── screens/        # RecipeResultsScreen, RecipeDetailScreen
│   │   ├── favorites/
│   │   │   └── screens/        # FavoritesScreen
│   │   └── settings/
│   │       └── screens/        # SettingsScreen (dietary filters + dark mode)
│   ├── navigation/
│   │   ├── AppNavigator.tsx    # Root stack navigator
│   │   └── TabNavigator.tsx    # Bottom tab navigator (Home / Favourites / Settings)
│   ├── services/
│   │   ├── api/
│   │   │   └── spoonacularApi.ts   # Spoonacular complexSearch integration
│   │   └── firebase/
│   │       └── firebaseClient.ts   # Firebase app initialisation
│   ├── store/
│   │   ├── recipeStore.ts      # Recipe search state (Zustand)
│   │   ├── favoritesStore.ts   # Favourites state → Firestore
│   │   └── settingsStore.ts    # Dietary prefs + dark mode → AsyncStorage
│   └── types/
│       └── index.ts            # Shared TypeScript interfaces & navigation types
├── App.tsx                     # Entry point — ThemeProvider + loadSettings
├── app.json
├── babel.config.js
├── metro.config.js
├── tsconfig.json
└── package.json
```

---

## Setup & Running

### Prerequisites

- Node.js ≥ 18
- Java 17 (JDK)
- Android Studio with an AVD (emulator) or a physical Android device with USB debugging enabled
- A Spoonacular API key → [spoonacular.com/food-api](https://spoonacular.com/food-api)
- A Firebase project with Firestore enabled

### 1. Install dependencies

```bash
npm install
```

### 2. Add environment config

Create `src/config/env.ts`:

```ts
export const SPOONACULAR_API_KEY = 'your_key_here';
```

Add your `google-services.json` (from Firebase console) to `android/app/`.

### 3. Run the app

```bash
# Start Metro bundler
npm start

# In a second terminal, build & launch on Android
npm run android
```

> **First run after cloning**: always use `npm run android` (full native build) rather than just reloading Metro, because native modules (`AsyncStorage`, Firebase) must be compiled.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| PowerShell script disabled error | Run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` as Admin |
| `VIBRATE` permission crash on Android | Ensure `<uses-permission android:name="android.permission.VIBRATE" />` is in `android/app/src/main/AndroidManifest.xml` |
| White screen / context undefined | Make sure `<ThemeProvider>` wraps the entire app in `App.tsx` |
| Metro cache issues | Run `npm start -- --reset-cache` |
| Emulator not detected | Start an AVD in Android Studio before running `npm run android` |

