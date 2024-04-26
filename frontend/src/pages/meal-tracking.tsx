import Container from "../components/container";
import { getDateMedium, getTimeShort } from "../../utils/parse-time";

interface MealEntry {
  id: number;
  name: string;
  ingredients: string;
  total_calories: number;
  date: string;
}

const MealEntry = ({ meal_entry }: { meal_entry: MealEntry }) => {
  return (
    <div className="flex flex-col p-5 border border-gray-200 rounded-md gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg">{meal_entry.name}</h1>
          <p className="text-sm text-gray-500">
            {getDateMedium(meal_entry.date)} at {getTimeShort(meal_entry.date)}
          </p>
        </div>
        <p className="text-sm">{meal_entry.ingredients}</p>
      </div>
      <button className="bg-red-500 text-sm text-white py-2 px-4 rounded-md w-fit">
        Delete
      </button>
    </div>
  );
};

const MealList = () => {
  const meal_entries = [
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

  return (
    <div className="flex flex-col gap-5">
      {meal_entries.map((meal_entry) => (
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
