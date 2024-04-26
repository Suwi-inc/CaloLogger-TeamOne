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
import { MOCK_MEALS_RESPONSE } from "../constants";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MealChart = () => {
  // Grouping meals by date and calculating total calories for each date
  const groupedData = MOCK_MEALS_RESPONSE.reduce((acc, meal) => {
    const date = new Date(meal.date).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += meal.nutritions.calories;
    return acc;
  }, {} as { [key: string]: number });

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
    <div>
      <h2>Meal Calories Chart</h2>
      <Bar data={data} />
    </div>
  );
};

export default MealChart;
