import { create } from 'zustand';
import { searchByIngredients } from '../services/api/spoonacularApi';
import type { RecipeItem } from '../types';

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
    set({ loading: true, error: null, recipes: [] });
    try {
      const results = await searchByIngredients(ingredients);
      set({ recipes: results, loading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      set({ error: message, loading: false });
    }
  },

  clearRecipes: () => set({ recipes: [], error: null, loading: false }),
}));

export default useRecipeStore;
