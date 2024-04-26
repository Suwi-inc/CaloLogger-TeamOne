import { MOCK_MEALS_RESPONSE } from "../constants";

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
