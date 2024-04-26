import MealChart from "../components/meal-chart";
import WeightChart from "../components/weight-chart";

const Dashboard = () => {
  return (
    <div>
      <WeightChart />
      <MealChart />
    </div>
  );
};

export default Dashboard;
