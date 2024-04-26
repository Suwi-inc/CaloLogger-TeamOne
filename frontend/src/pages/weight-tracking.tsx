import Container from "../components/container";
import { MOCK_WEIGHT_RESPONSE } from "../constants";

const WeightTracking = () => {
  return (
    <Container>
      <div className="flex-col">
        {MOCK_WEIGHT_RESPONSE.map((weight_entry) => (
          <div key={weight_entry.id}>
            <div>
              {weight_entry.weight}, {weight_entry.date}
            </div>
            <button>Delete</button>
          </div>
        ))}
        <button>Add</button>
      </div>
    </Container>
  );
};

export default WeightTracking;
