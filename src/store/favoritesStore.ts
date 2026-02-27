import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    setDoc,
} from 'firebase/firestore';
import { create } from 'zustand';
import { db } from '../services/firebase/firebaseClient';
import type { RecipeItem } from '../types';

const COLLECTION = 'favorites';

interface FavoritesState {
  favorites: RecipeItem[];
  loadingFavorites: boolean;
  loadFavorites: () => Promise<void>;
  toggleFavorite: (recipe: RecipeItem) => Promise<void>;
  isFavorite: (id: number) => boolean;
}

const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  loadingFavorites: false,

  /** Load all favorited recipes from Firestore into local state. */
  loadFavorites: async () => {
    set({ loadingFavorites: true });
    try {
      const snapshot = await getDocs(collection(db, COLLECTION));
      const items = snapshot.docs.map((d) => d.data() as RecipeItem);
      set({ favorites: items, loadingFavorites: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.warn('[Favorites] Failed to load from Firestore:', message);
      set({ loadingFavorites: false });
    }
  },

  /**
   * Add or remove a recipe from favorites, keeping Firestore in sync.
   * Uses optimistic updates with rollback on failure.
   */
  toggleFavorite: async (recipe: RecipeItem) => {
    const { favorites } = get();
    const alreadyFavorited = favorites.some((f) => f.id === recipe.id);

    if (alreadyFavorited) {
      // Optimistic local removal
      set({ favorites: favorites.filter((f) => f.id !== recipe.id) });
      try {
        await deleteDoc(doc(db, COLLECTION, String(recipe.id)));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.warn('[Favorites] Failed to remove from Firestore:', message);
        // Rollback on failure
        set({ favorites: [...get().favorites, recipe] });
      }
    } else {
      // Optimistic local add
      set({ favorites: [...favorites, recipe] });
      try {
        await setDoc(doc(db, COLLECTION, String(recipe.id)), recipe);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.warn('[Favorites] Failed to save to Firestore:', message);
        // Rollback on failure
        set({ favorites: get().favorites.filter((f) => f.id !== recipe.id) });
      }
    }
  },

  /** Returns true if a recipe ID is currently in favorites. */
  isFavorite: (id: number) => get().favorites.some((f) => f.id === id),
}));

export default useFavoritesStore;
