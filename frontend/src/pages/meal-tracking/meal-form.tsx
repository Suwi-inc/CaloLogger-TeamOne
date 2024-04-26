import { useRef, useState, useEffect } from "react";
import { SearchResult } from "../../types";

const SaveMealModel = ({
  meal_entry,
  openModal,
  setShowModal,
}: {
  meal_entry: SearchResult;
  openModal: boolean;
  setShowModal: (showModal: boolean) => void;
}) => {
  const { ingredients } = meal_entry;
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [openModal]);

  const validateForm = ({ date, time, ingredients }: any) => {
    if (!date || !time || !ingredients) {
      alert("Please fill all fields");
      return false;
    }
    return true;
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const { date, time, ingredients } = Object.fromEntries(formData.entries());

    if (!validateForm({ date, time, ingredients })) {
      return;
    }

    const datetime = `${date}T${time}:00`;
    console.log(datetime, ingredients);
  };

  return (
    <dialog
      ref={ref}
      onCancel={() => setShowModal(false)}
      onClick={() => setShowModal(false)}
      className="p-5 border border-gray-200 rounded-md"
    >
      <div
        className="flex flex-col justify-end p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-3xl font-bold mb-5 text-center">Save Meal</h3>
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="ingredients" className="text-sm">
              Ingredients
            </label>
            <textarea
              id="ingredients"
              name="ingredients"
              className="w-full p-5 border border-gray-200 rounded-md"
              defaultValue={ingredients}
            />
          </div>
          <label htmlFor="date" className="text-sm mt-3">
            Date & Time
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              name="date"
              className="p-5 border border-gray-200 rounded-md"
              placeholder="Date"
            />
            <input
              type="time"
              name="time"
              className="p-5 border border-gray-200 rounded-md"
              placeholder="Time"
            />
          </div>
          <button
            type="submit"
            className="p-2 px-4 bg-blue-500 text-white rounded-md"
          >
            Save
          </button>
        </form>
      </div>
    </dialog>
  );
};

const MealResultItem = ({ meal_entry }: { meal_entry: SearchResult }) => {
  const [showModal, setShowModal] = useState(false);
  const { name, ingredients } = meal_entry;

  return (
    <div className="flex flex-col p-5 border border-gray-200 rounded-md gap-5">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg">{name}</h1>
        <p className="text-sm">{ingredients}</p>
      </div>
      <SaveMealModel
        meal_entry={meal_entry}
        openModal={showModal}
        setShowModal={setShowModal}
      />
      <button
        className="bg-blue-500 text-sm text-white py-2 px-4 rounded-md w-fit"
        onClick={() => setShowModal(!showModal)}
      >
        {showModal ? "Show less" : "Show more"}
      </button>
    </div>
  );
};

const MealResultsList = () => {
  const meal_entries: SearchResult[] = [
    {
      name: "Spaghetti",
      ingredients: "Pasta, tomato sauce, basil, garlic",
    },
    {
      name: "Chicken Salad",
      ingredients: "Chicken, lettuce, tomato, cucumber",
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      {meal_entries.map((meal_entry) => (
        <MealResultItem key={meal_entry.name} meal_entry={meal_entry} />
      ))}
    </div>
  );
};

const MealForm = () => (
  <div className="flex flex-col gap-5">
    <form className="flex flex-col gap-5">
      <div className="flex gap-2">
        <input
          type="text"
          className="w-full p-5 border border-gray-200 rounded-md"
          placeholder="Meal name"
        />
        <button
          type="submit"
          className="p-2 px-4 bg-blue-500 text-white rounded-md"
        >
          Search
        </button>
      </div>
    </form>
    <MealResultsList />
  </div>
);

export default MealForm;
