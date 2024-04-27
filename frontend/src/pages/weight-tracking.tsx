import Container from "../components/container";
import { getDateMedium, getTimeShort } from "../../utils/parse-time";
import { Weight } from "../types";
import { useEffect, useRef, useState } from "react";
import { getWeights, addWeight } from "../api/weight";
import useSWR from "swr";

const AddWeightModal = ({
  openModal,
  setShowModal,
}: {
  openModal: boolean;
  setShowModal: (showModal: boolean) => void;
}) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [openModal]);

  const validateForm = ({ weight, date, time }: any) => {
    if (!weight || !date || !time) {
      alert("Please fill all fields");
      return false;
    }

    if (isNaN(weight)) {
      alert("Weight must be a number");
      return false;
    }

    if (weight <= 0) {
      alert("Weight must be greater than 0");
      return false;
    }

    return true;
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const { weight, date, time } = Object.fromEntries(formData.entries());

    if (!validateForm({ weight, date, time })) {
      return;
    }

    const datetime = `${date}T${time}:00.000Z`;

    await addWeight(Number(weight), datetime);
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
        <h3 className="text-3xl font-bold mb-5 text-center"> Add Weight </h3>
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="weight" className="text-sm">
              Weight (KG)
            </label>
            <input
              type="number"
              name="weight"
              id="weight"
              min={0}
              required
              className="p-2 border border-gray-200 rounded-md min-w-unset md:min-w-[300px]"
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

const WeightItem = ({ weight_entry }: { weight_entry: Weight }) => {
  const { id, date, weight } = weight_entry;

  const deleteWeight = async () => {
    try {
      // await deleteWeightApi(id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col p-5 border border-gray-200 rounded-md gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-500 mb-2">
            {getDateMedium(date)} at {getTimeShort(date)}
          </p>
          <div className="flex gap-2 items-end">
            <p className="text-5xl">{weight}</p>
            <p className="text-md text-gray-500">KG</p>
          </div>
        </div>
      </div>
      <button
        className="bg-red-500 text-sm text-white py-2 px-5 rounded-md w-fit self-end"
        onClick={deleteWeight}
      >
        Delete
      </button>
    </div>
  );
};

const WeightList = () => {
  const { data, isLoading, error } = useSWR<Weight[]>("/weights", getWeights);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error || !data) {
    return <p>Error: {error.message}</p>;
  }

  if (data.length === 0) {
    return <p>No weight entries</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {data.map((weight_entry) => (
        <WeightItem key={weight_entry.id} weight_entry={weight_entry} />
      ))}
    </div>
  );
};

const WeightTracking = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <Container>
      <div className="flex flex-col gap-5 py-10">
        <div>
          <h1 className="text-3xl">Weight Tracking</h1>
          <p className="text-lg text-gray-500">
            Keep track of your weight changes
          </p>
        </div>
        <button
          className="bg-blue-500 text-sm text-white py-2 px-4 rounded-md w-fit"
          onClick={() => setShowModal(true)}
        >
          Add Weight
        </button>
      </div>
      <WeightList />
      <AddWeightModal openModal={showModal} setShowModal={setShowModal} />
    </Container>
  );
};

export default WeightTracking;
