type Meal = {
  title: string;
  ingredients: string;
  date: string;
  id: number;
  user_id: number;
  nutritions: MealNutritions;
};

type MealNutritions = {
  calories: number;
  fat_total_g: number;
  fat_saturated_g: number;
  protein_g: number;
  sodium_mg: number;
  potassium_mg: number;
  cholesterol_mg: number;
  carbohydrates_total_g: number;
  fiber_g: number;
  sugar_g: number;
};

type CreateMeal = Pick<Meal, "ingredients" | "date"> & { name: string };

type Weight = {
  id: number;
  weight: number;
  date: string;
  user_id: number;
};

type CreateWeight = {
  weight: number;
  date: string;
};

type SearchResult = {
  title: string;
  ingredients: string;
};

export type {
  SearchResult,
  Meal,
  MealNutritions,
  Weight,
  CreateMeal,
  CreateWeight,
};
