import { create } from 'zustand';

import { auth } from '../services/firebase/firebaseClient';
import {
  addFavorite,
  fetchFavorites,
  removeFavorite,
} from '../services/firebase/favoritesApi';
import type { RecipeItem } from '../types';

interface FavoritesState {
  favorites: RecipeItem[];
  loadingFavorites: boolean;
  loadFavorites: () => Promise<void>;
  toggleFavorite: (recipe: RecipeItem) => Promise<void>;
  isFavorite: (id: number) => boolean;
  clearFavorites: () => void;
}

const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  loadingFavorites: false,

  /** Load the signed-in user's favorited recipes from Firestore. */
  loadFavorites: async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) { return; }

    set({ loadingFavorites: true });
    try {
      const items = await fetchFavorites(uid);
      set({ favorites: items, loadingFavorites: false });
    } catch (err) {
      console.warn('[Favorites] Failed to load:', err instanceof Error ? err.message : err);
      set({ loadingFavorites: false });
    }
  },

  /**
   * Add or remove a recipe from the signed-in user's favorites.
   * Optimistic update with rollback on Firestore failure.
   */
  toggleFavorite: async (recipe: RecipeItem) => {
    const uid = auth.currentUser?.uid;
    if (!uid) { return; }

    const { favorites } = get();
    const alreadyFavorited = favorites.some((f) => f.id === recipe.id);

    if (alreadyFavorited) {
      set({ favorites: favorites.filter((f) => f.id !== recipe.id) });
      try {
        await removeFavorite(uid, recipe.id);
      } catch (err) {
        console.warn('[Favorites] Failed to remove:', err instanceof Error ? err.message : err);
        set({ favorites: [...get().favorites, recipe] });
      }
    } else {
      set({ favorites: [...favorites, recipe] });
      try {
        await addFavorite(uid, recipe);
      } catch (err) {
        console.warn('[Favorites] Failed to add:', err instanceof Error ? err.message : err);
        set({ favorites: get().favorites.filter((f) => f.id !== recipe.id) });
      }
    }
  },

  /** Returns true if a recipe ID is currently in favorites. */
  isFavorite: (id: number) => get().favorites.some((f) => f.id === id),

  /** Clear local favorites state (called on logout). */
  clearFavorites: () => set({ favorites: [] }),
}));

export default useFavoritesStore;

