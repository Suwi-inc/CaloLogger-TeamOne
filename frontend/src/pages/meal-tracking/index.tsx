import Container from "../../components/container";
import MealList from "./meal-list";
import MealForm from "./meal-form";

const MealTracking = () => (
    <Container>
        <h1 className="text-2xl font-bold my-10">Meals Tracking</h1>
        <div className="flex-col grid grid-cols-1 md:grid-cols-2 gap-5 order-2 md:order-1">
            <div className="flex flex-col gap-5">
                <MealList />
            </div>
            <div className="flex flex-col gap-5">
                <MealForm />
            </div>
        </div>
    </Container>
);

export default MealTracking;
