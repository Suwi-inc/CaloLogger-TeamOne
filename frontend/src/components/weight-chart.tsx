import { Line } from "react-chartjs-2";
import { MOCK_WEIGHT_RESPONSE } from "../pages/weight-tracking";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  Tooltip,
  CategoryScale,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WeightChart = () => {
  // Extracting dates and weight values from the provided data
  const dates = MOCK_WEIGHT_RESPONSE.map((entry) =>
    new Date(entry.date).toLocaleDateString()
  );
  const weights = MOCK_WEIGHT_RESPONSE.map((entry) => entry.value);

  // Creating chart data
  const data = {
    labels: dates,
    datasets: [
      {
        label: "Weight",
        data: weights,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl font-bold text-gray-800">
        Weight Tracking Chart
      </h2>
      <Line data={data} />
    </div>
  );
};

export default WeightChart;
