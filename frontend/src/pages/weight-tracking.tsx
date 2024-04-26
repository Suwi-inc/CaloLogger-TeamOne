const MOCK_WEIGHT_RESPONSE = [
  { id: 0, value: 66, date: "2024-04-26T18:37:47+0000" },
  { id: 1, value: 77, date: "2024-04-26T18:37:47+0000" },
  { id: 2, value: 88, date: "2024-04-26T18:37:47+0000" },
];

const WeightTracking = () => {
  return (
    <div className="flex-col">
      {MOCK_WEIGHT_RESPONSE.map((weight_entry) => (
        <div key={weight_entry.id}>
          <div>
            {weight_entry.value}, {weight_entry.date}
          </div>
          <button>Delete</button>
        </div>
      ))}
      <button>Add</button>
    </div>
  );
};

export default WeightTracking;
