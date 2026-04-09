# Chefy AI

Chefy AI is a React Native mobile app that helps users decide what to cook using ingredients they already have.

The app is designed for a mini project presentation and focuses on practical value:
- Reduce food waste by cooking with available ingredients.
- Give fast recipe recommendations with dietary filtering.
- Keep favorite recipes in one place.

## Project Summary

Users select ingredients on the Home screen, apply preferences (Vegetarian and Halal), and receive recipe recommendations from Spoonacular.

The app uses a clean feature-based structure with Zustand stores, a dedicated API service layer, Firebase favorites persistence, and app-wide theme support.

## Main Features

1. Ingredient-based recipe search
- Select 2 to 5 ingredients.
- Recipe recommendations are fetched from Spoonacular.

2. Dietary preferences
- Vegetarian option uses Spoonacular diet filter.
- Halal option is approximated by excluding non-halal ingredients (pork, bacon, ham, lard, gelatin, alcohol, wine, beer).
- Preferences are persisted locally.

3. Favorites
- Users can bookmark and unbookmark recipes.
- Favorites are persisted in Firebase Firestore.

4. Theme support
- Light and dark mode are supported across screens.
- Theme choice is persisted in local storage.

5. Ingredient search resilience
- Ingredient lookup is API-first.
- If the ingredient endpoint is unavailable or limited, the app gracefully falls back to local ingredient data so search still works.

6. Recipe detail UI
- Recipe details include hero image, stats, ingredients, and steps.
- Back/Favorite controls are fixed at the top and status-bar-safe.
- Start Cooking action is intentionally disabled for the mini project scope.

## Demo Flow (For Presentation)

1. Open Home and select ingredients.
2. Type in ingredient search to show dynamic filtering.
3. Go to Settings and toggle Vegetarian/Halal and Dark Mode.
4. Return and fetch recipes.
5. Open a recipe detail and bookmark it.
6. Show the Favorites tab to confirm persistence.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.78 (CLI), TypeScript |
| Navigation | React Navigation 7 (Stack + Bottom Tabs) |
| State Management | Zustand 5 |
| Recipe API | Spoonacular (`complexSearch`, recipe information, ingredient search) |
| Remote Persistence | Firebase Firestore |
| Local Persistence | @react-native-async-storage/async-storage |
| Icons | react-native-vector-icons |
| Theming | React Context + custom theme palette |

## Architecture Overview

```text
UI Screens/Components
   -> ThemeContext (useAppTheme)
   -> Zustand Stores (recipe, settings, favorites)
   -> Service Layer (spoonacularApi, firebaseClient)
   -> External APIs (Spoonacular, Firestore)
```

### Key Design Decisions

1. Theme-first styling
- Screens use useAppTheme and style factories to avoid hardcoded color values.

2. Store-driven async logic
- Async recipe actions read settings from store getState to stay hook-safe.

3. Service separation
- API logic is isolated in service files to keep UI code simple and testable.

4. Graceful degradation
- Ingredient search has fallback behavior if API constraints occur.

## Project Structure

```text
Chefy_ai/
|- android/
|- src/
|  |- config/
|  |- core/
|  |  |- components/
|  |  \- theme/
|  |- features/
|  |  |- ingredients/
|  |  |- recipes/
|  |  |- favorites/
|  |  \- settings/
|  |- navigation/
|  |- services/
|  |  |- api/
|  |  \- firebase/
|  |- store/
|  \- types/
|- App.tsx
|- package.json
\- README.md
```

## Setup

### Prerequisites

- Node.js 18+
- Java 17
- Android Studio with emulator (or Android device)
- Spoonacular API key
- Firebase project with Firestore enabled

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

Create src/config/env.ts:

```ts
export const SPOONACULAR_API_KEY = 'your_key_here';
```

Place google-services.json in android/app/.

### 3) Run the app

```bash
# Terminal 1: Metro
npm start

# Terminal 2: Android build + launch
npm run android
```

For first run after clone, always run npm run android to compile native modules.

## Troubleshooting

| Problem | Fix |
|---|---|
| PowerShell script policy issue | Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass |
| Metro cache issue | npm start -- --reset-cache |
| Emulator not detected | Start AVD first, then run npm run android |
| Ingredient API lookup fails | App falls back to local ingredient list |
| White screen/theme context issue | Ensure ThemeProvider wraps the app root |

## Mini Project Scope Notes

- Authentication screens exist but are not the main focus.
- Start Cooking button is intentionally disabled.
- Core scope: ingredient selection, recipe discovery, dietary filters, favorites, and presentation-ready UI.

## Credits

- Recipe data: Spoonacular API
- Persistence: Firebase Firestore

