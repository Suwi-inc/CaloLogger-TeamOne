import { getDateMedium, getTimeShort } from "../../utils/parse-time";
import { Meal } from "../../types";
import { useState } from "react";
import { deleteMeal, getMeals } from "../../api/meals";
import { BACKEND_URL } from "../../constants";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

const MealEntry = ({ meal_entry }: { meal_entry: Meal }) => {
  const [expanded, setExpanded] = useState(false);
  const { trigger, isMutating } = useSWRMutation(
    `${BACKEND_URL}/meals/${decodeURIComponent(meal_entry.id.toString())}`,
    deleteMeal
  );
  const { title, date, ingredients, nutritions } = meal_entry;

  console.log(meal_entry);
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

  const handleDeleteMeal = async () => {
    try {
      await trigger();
      window.location.reload();
    } catch (error) {
      alert("Failed to delete meal");
      console.error("Failed to delete meal", error);
    }
  };

  return (
    <div className="flex flex-col p-5 border border-gray-200 rounded-md gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg">{title}</h1>
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
        <button
          className="bg-red-500 text-sm text-white py-2 px-4 rounded-md w-fit disabled:opacity-50"
          onClick={handleDeleteMeal}
          disabled={isMutating}
        >
          {isMutating ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

const MealList = () => {
  const { data, error, isLoading } = useSWR(`${BACKEND_URL}/meals`, getMeals);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (error || !data) {
    return <p>Failed to load meals</p>;
  }
  if (data.length === 0) {
    return <p>No meals found</p>;
  }

  return (
    <div className="flex flex-col gap-5">
      {data.map((meal_entry) => (
        <MealEntry key={meal_entry.id} meal_entry={meal_entry} />
      ))}
    </div>
  );
};

export default MealList;
