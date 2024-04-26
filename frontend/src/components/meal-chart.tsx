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

  const groupedData = meal_entries.reduce((acc, meal) => {
    const date = new Date(meal.date).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += meal.total_calories;
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
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl font-bold text-gray-800">Meal Calories Chart</h2>
      <Bar data={data} />
    </div>
  );
};

export default MealChart;
