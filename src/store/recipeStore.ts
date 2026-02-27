import { create } from 'zustand';
import { searchByIngredients } from '../services/api/spoonacularApi';
import type { RecipeItem } from '../types';
import useSettingsStore from './settingsStore';

interface RecipeState {
  recipes: RecipeItem[];
  loading: boolean;
  error: string | null;
  searchRecipes: (ingredients: string[]) => Promise<void>;
  clearRecipes: () => void;
}

const useRecipeStore = create<RecipeState>((set) => ({
  recipes: [],
  loading: false,
  error: null,

  searchRecipes: async (ingredients: string[]) => {
    const { isVegetarian, isHalal } = useSettingsStore.getState();
    const options = {
      diet: isVegetarian ? 'vegetarian' : undefined,
      excludeIngredients: isHalal
        ? ['pork', 'bacon', 'ham', 'lard', 'gelatin', 'alcohol', 'wine', 'beer']
        : [],
    };
    set({ loading: true, error: null, recipes: [] });
    try {
      const results = await searchByIngredients(ingredients, options);
      set({ recipes: results, loading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      set({ error: message, loading: false });
    }
  },

  clearRecipes: () => set({ recipes: [], error: null, loading: false }),
}));

export default useRecipeStore;
