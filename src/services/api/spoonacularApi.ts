import { SPOONACULAR_API_KEY } from '../../config/env';
import type { RecipeDetail, RecipeItem } from '../../types';

const BASE_URL = 'https://api.spoonacular.com';

/**
 * Search recipes by a list of ingredient names.
 * Returns a lightweight list suitable for RecipeCard.
 */
export const searchByIngredients = async (
  ingredients: string[],
): Promise<RecipeItem[]> => {
  const joined = ingredients.map((i) => encodeURIComponent(i.trim())).join(',');
  const url =
    `${BASE_URL}/recipes/findByIngredients` +
    `?ingredients=${joined}` +
    `&number=20` +
    `&ranking=1` +
    `&ignorePantry=true` +
    `&apiKey=${SPOONACULAR_API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Spoonacular search failed (${response.status}): ${text}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any[] = await response.json();

  return data.map((item) => ({
    id: item.id as number,
    title: item.title as string,
    image: item.image as string,
    missedIngredientCount: (item.missedIngredientCount as number) ?? 0,
    usedIngredientCount: (item.usedIngredientCount as number) ?? 0,
    // readyInMinutes and servings come from the detail endpoint only
    readyInMinutes: null,
    servings: null,
  }));
};

/**
 * Fetch full recipe information including ingredients and instructions.
 */
export const getRecipeDetail = async (id: number): Promise<RecipeDetail> => {
  const url =
    `${BASE_URL}/recipes/${id}/information` +
    `?includeNutrition=false` +
    `&apiKey=${SPOONACULAR_API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Spoonacular detail failed (${response.status}): ${text}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await response.json();

  const ingredients = ((data.extendedIngredients as any[]) ?? []).map(
    (ing: any) => ({
      name: (ing.name ?? ing.nameClean ?? '') as string,
      amount: ing.amount as number,
      unit: (ing.unit ?? '') as string,
    }),
  );

  const instructions: string[] = (
    (data.analyzedInstructions?.[0]?.steps as any[]) ?? []
  ).map((step: any) => step.step as string);

  const fallbackInstructions: string[] =
    instructions.length === 0 && data.instructions
      ? (data.instructions as string)
          .replace(/<[^>]+>/g, '')
          .split(/\n+/)
          .map((s: string) => s.trim())
          .filter(Boolean)
      : instructions;

  return {
    id: data.id as number,
    title: data.title as string,
    image: data.image as string,
    readyInMinutes: (data.readyInMinutes as number) ?? null,
    servings: (data.servings as number) ?? null,
    sourceUrl: (data.sourceUrl as string) ?? null,
    missedIngredientCount: 0,
    usedIngredientCount: 0,
    ingredients,
    instructions: fallbackInstructions,
  };
};
