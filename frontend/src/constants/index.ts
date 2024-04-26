import { Meal, Weight } from "../types";

export const MOCK_MEALS_RESPONSE: Meal[] = [
  {
    id: 1,
    name: "Breakfast",
    ingredients: "Eggs, bacon, toast",
    date: "2024-04-26T08:00:00+0000",
    user_id: 1,
    nutritions: {
      calories: 350,
      fat_total_g: 20,
      fat_saturated_g: 8,
      protein_g: 25,
      sodium_mg: 500,
      potassium_mg: 300,
      cholesterol_mg: 250,
      carbohydrates_total_g: 15,
      fiber_g: 2,
      sugar_g: 3,
    },
  },
  {
    id: 2,
    name: "Lunch",
    ingredients: "Chicken salad",
    date: "2024-04-26T12:30:00+0000",
    user_id: 1,
    nutritions: {
      calories: 400,
      fat_total_g: 15,
      fat_saturated_g: 5,
      protein_g: 30,
      sodium_mg: 600,
      potassium_mg: 350,
      cholesterol_mg: 200,
      carbohydrates_total_g: 20,
      fiber_g: 5,
      sugar_g: 4,
    },
  },
  {
    id: 3,
    name: "Dinner",
    ingredients: "Grilled salmon, rice, vegetables",
    date: "2024-04-26T18:00:00+0000",
    user_id: 1,
    nutritions: {
      calories: 500,
      fat_total_g: 25,
      fat_saturated_g: 10,
      protein_g: 35,
      sodium_mg: 700,
      potassium_mg: 400,
      cholesterol_mg: 180,
      carbohydrates_total_g: 30,
      fiber_g: 8,
      sugar_g: 5,
    },
  },
];

export const MOCK_WEIGHT_RESPONSE: Weight[] = [
  { id: 1, weight: 70, date: "2024-04-26T08:00:00+0000", user_id: 1 },
  { id: 2, weight: 71, date: "2024-04-27T08:00:00+0000", user_id: 1 },
  { id: 3, weight: 72, date: "2024-04-28T08:00:00+0000", user_id: 1 },
];
