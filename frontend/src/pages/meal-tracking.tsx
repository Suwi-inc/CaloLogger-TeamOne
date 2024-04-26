import Container from "../components/container";
import { getDateMedium, getTimeShort } from "../../utils/parse-time";
import { MOCK_MEALS_RESPONSE } from "../constants";
import { Meal } from "../types";
import { useState } from "react";

const MealEntry = ({ meal_entry }: { meal_entry: Meal }) => {
  const [expanded, setExpanded] = useState(false);

  const { name, date, ingredients, nutritions } = meal_entry;

  const nutritions_key_Mapping = {
    calories: "Calories",
    fat_total_g: "Total Fat",
    fat_saturated_g: "Saturated Fat",
    protein_g: "Protein",
    sodium_mg: "Sodium",
    potassium_mg: "Potassium",
    cholesterol_mg: "Cholesterol",
    carbohydrates_total_g: "Total Carbohydrates",
    fiber_g: "Fiber",
    sugar_g: "Sugar",
  };

  return (
    <div className="flex flex-col p-5 border border-gray-200 rounded-md gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg">{name}</h1>
          <p className="text-sm text-gray-500">
            {getDateMedium(date)} at {getTimeShort(date)}
          </p>
        </div>
        <p className="text-sm">{ingredients}</p>
      </div>
      {expanded && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <h1 className="text-md font-bold">Nutritions</h1>
            {Object.entries(nutritions).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <p className="text-sm text-gray-900">
                  {
                    nutritions_key_Mapping[
                      key as keyof typeof nutritions_key_Mapping
                    ]
                  }
                </p>
                <p>{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex gap-2">
        <button
          className="bg-blue-500 text-sm text-white py-2 px-4 rounded-md w-fit"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Hide" : "Show"} Nutritions
        </button>
        <button className="bg-red-500 text-sm text-white py-2 px-4 rounded-md w-fit">
          Delete
        </button>
      </div>
    </div>
  );
};

const MealList = () => {
  return (
    <div className="flex flex-col gap-5">
      {MOCK_MEALS_RESPONSE.map((meal_entry) => (
        <MealEntry key={meal_entry.id} meal_entry={meal_entry} />
      ))}
    </div>
  );
};

const MealTracking = () => {
  return (
    <Container>
      <div className="flex-col py-10 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-5">
          <h1 className="text-2xl font-bold">Meals</h1>
          <MealList />
        </div>
      </div>
    </Container>
  );
};

export default MealTracking;
