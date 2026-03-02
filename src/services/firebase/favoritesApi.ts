/**
 * Firebase Firestore API for user-scoped favorites.
 *
 * Data path:  users/{uid}/favorites/{recipeId}
 *
 * Security rules (set in Firebase Console → Firestore → Rules):
 *
 *   rules_version = '2';
 *   service cloud.firestore {
 *     match /databases/{database}/documents {
 *       match /users/{userId}/favorites/{recipeId} {
 *         allow read, write: if request.auth != null && request.auth.uid == userId;
 *       }
 *     }
 *   }
 */

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from 'firebase/firestore';

import type { RecipeItem } from '../../types';
import { db } from './firebaseClient';

// ─── Path helpers ─────────────────────────────────────────────────────────────

const favoritesCol = (uid: string) =>
  collection(db, 'users', uid, 'favorites');

const favoriteDoc = (uid: string, recipeId: number) =>
  doc(db, 'users', uid, 'favorites', String(recipeId));

// ─── CRUD operations ─────────────────────────────────────────────────────────

/**
 * Fetch all favorited recipes for a given user.
 */
export async function fetchFavorites(uid: string): Promise<RecipeItem[]> {
  const snapshot = await getDocs(favoritesCol(uid));
  return snapshot.docs.map((d) => d.data() as RecipeItem);
}

/**
 * Save a recipe to the user's favorites in Firestore.
 */
export async function addFavorite(uid: string, recipe: RecipeItem): Promise<void> {
  await setDoc(favoriteDoc(uid, recipe.id), recipe);
}

/**
 * Remove a recipe from the user's favorites in Firestore.
 */
export async function removeFavorite(uid: string, recipeId: number): Promise<void> {
  await deleteDoc(favoriteDoc(uid, recipeId));
}
