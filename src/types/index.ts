// ─── Shared domain types used across the entire app ─────────────────────────

/** A single ingredient line as returned by the Spoonacular detail endpoint. */
export interface Ingredient {
  name: string;
  amount: number | string;
  unit: string;
}

/** Lightweight recipe shape returned by the findByIngredients search endpoint. */
export interface RecipeItem {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number | null;
  servings: number | null;
  missedIngredientCount: number;
  usedIngredientCount: number;
}

/** Full recipe detail as returned by the Get Recipe Information endpoint. */
export interface RecipeDetail extends RecipeItem {
  sourceUrl: string | null;
  ingredients: Ingredient[];
  instructions: string[];
}

/** User preferences stored in settings. */
export interface UserPreferences {
  isVegetarian: boolean;
  isHalal: boolean;
  darkMode: boolean;
}

/** Mock user shape. */
export interface MockUser {
  username: string;
  avatarUrl: string;
  preferences: UserPreferences;
}

// ─── Navigation param lists ──────────────────────────────────────────────────

/** Root native-stack navigator screens. */
export type RootStackParamList = {
  Tabs: undefined;
  RecipeResults: { ingredients: string[] };
  RecipeDetail: { recipeId: number };
};

/** Bottom-tab navigator screens. */
export type TabParamList = {
  Home: undefined;
  Favorites: undefined;
  Settings: undefined;
};
