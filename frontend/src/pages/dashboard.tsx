import Container from "../components/container";
import MealChart from "../components/meal-chart";
import WeightChart from "../components/weight-chart";

const Dashboard = () => {
  return (
    <div className="py-10">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <WeightChart />
          <MealChart />
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;
