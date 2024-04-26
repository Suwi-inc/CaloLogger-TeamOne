export const MOCK_MEALS_RESPONSE = [
  {
    id: 0,
    name: "PIZZA",
    ingredients: "1 dough 2 chicken 3 pineapple",
    total_calories: 500,
    date: "2024-04-26T18:37:47+0000",
  },
  {
    id: 1,
    name: "PASTA",
    ingredients: "1 pasta 2 chicken 3 milk",
    total_calories: 400,
    date: "2024-04-26T18:37:47+0000",
  },
  {
    id: 2,
    name: "SHAWARMA",
    ingredients: "1 khobz 2 chicken 3 toom",
    total_calories: 600,
    date: "2024-04-26T18:37:47+0000",
  },
  {
    id: 3,
    name: "SHAWARMA",
    ingredients: "1 khobz 2 chicken 3 toom",
    total_calories: 600,
    date: "2024-04-27T18:37:47+0000",
  },
];

const MealTracking = () => {
  return (
    <div className="flex-col">
      {MOCK_MEALS_RESPONSE.map((meal_entry) => (
        <div key={meal_entry.id}>
          <div>
            {meal_entry.name}, {meal_entry.date}, {meal_entry.ingredients}
          </div>
          <button>Delete</button>
        </div>
      ))}
      <button>Add</button>
    </div>
  );
};

export default MealTracking;
