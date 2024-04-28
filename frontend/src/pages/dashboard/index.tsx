import Container from "../../components/container";
import MealChart from "./meal-chart";
import WeightChart from "./weight-chart";

const Dashboard = () => (
    <div className="py-10">
        <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <WeightChart />
                <MealChart />
            </div>
        </Container>
    </div>
);

export default Dashboard;
