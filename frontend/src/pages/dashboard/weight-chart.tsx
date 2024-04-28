import { Line } from "react-chartjs-2";
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
import { BACKEND_URL } from "../../constants";
import { Weight } from "../../types";
import { getWeights } from "../../api/weight";
import useSWR from "swr";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const WeightChart = () => {
  // Extracting dates and weight values from the provided data
  const {
    data: weights,
    isLoading,
    error,
  } = useSWR<Weight[]>(`${BACKEND_URL}/weights`, getWeights);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error || !weights) {
    return <p>Error: {error?.message}</p>;
  }

  const labels = weights.map((entry) =>
    new Date(entry.date).toLocaleDateString(),
  );
  const values = weights.map((entry) => entry.weight);

  // Creating chart data
  const data = {
    labels,
    datasets: [
      {
        label: "Weight",
        data: values,
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
