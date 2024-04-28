import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  BarElement,
  Title,
  Legend,
  Tooltip,
  CategoryScale,
} from "chart.js";
import { BACKEND_URL } from "../../constants";
import { getMeals } from "../../api/meals";
import { Meal } from "../../types";
import useSWR from "swr";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const MealChart = () => {
  const {
    data: meals,
    error,
    isLoading,
  } = useSWR<Meal[]>(`${BACKEND_URL}/meals`, getMeals);

  if (isLoading) return <p>Loading...</p>;
  if (error || !meals) return <p>Error: {error.message}</p>;

  // Grouping meals by date and calculating total calories for each date
  const groupedData = meals.reduce(
    (acc, meal) => {
      const date = new Date(meal.date).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += meal.nutritions.calories;
      return acc;
    },
    {} as { [key: string]: number },
  );

  // Extracting dates and total calories from the grouped data
  const dates = Object.keys(groupedData);
  const totalCalories = Object.values(groupedData);

  // Creating chart data
  const data = {
    labels: dates,
    datasets: [
      {
        label: "Total Calories Consumed",
        data: totalCalories,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl font-bold text-gray-800">Meal Calories Chart</h2>
      <Bar data={data} />
    </div>
  );
};

export default MealChart;
