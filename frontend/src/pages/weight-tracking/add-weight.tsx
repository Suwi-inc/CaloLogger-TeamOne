import { getTimeISO } from "../../utils/parse-time";
import { useRef } from "react";
import { addWeight } from "../../api/weight";
import { BACKEND_URL } from "../../constants";
import useSWRMutation from "swr/mutation";

type WeigthForm = {
  weight: string;
  date: string;
  time: string;
};

const AddWeightModal = ({
  openModal,
  setShowModal,
}: {
  openModal: boolean;
  setShowModal: (showModal: boolean) => void;
}) => {
  const ref = useRef<HTMLDialogElement>(null);
  const { trigger, isMutating } = useSWRMutation(
    `${BACKEND_URL}/weights`,
    addWeight,
  );

  const validateForm = ({ weight, date, time }: WeigthForm) => {
    if (!weight || !date || !time) {
      alert("Please fill all fields");
      return false;
    }

    if (Number(weight) <= 0) {
      alert("Weight must be greater than 0");
      return false;
    }

    return true;
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const { weight, date, time } = Object.fromEntries(
      formData.entries(),
    ) as WeigthForm;

    if (!validateForm({ weight, date, time })) {
      alert("Invalid form data");
      return;
    }

    const datetime = getTimeISO(date, time);
    await trigger({ weight: Number(weight), date: datetime });
    setShowModal(false);
  };

  return (
    <dialog
      ref={ref}
      open={openModal}
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
              id="date"
              name="date"
              className="p-5 border border-gray-200 rounded-md"
              placeholder="Date"
            />
            <input
              type="time"
              id="time"
              name="time"
              className="p-5 border border-gray-200 rounded-md"
              placeholder="Time"
            />
          </div>
          <button
            type="submit"
            className="p-2 px-4 bg-blue-500 text-white rounded-md disabled:opacity-50 self-end mt-5"
            disabled={isMutating}
          >
            {isMutating ? "Adding..." : "Add"}
          </button>
        </form>
      </div>
    </dialog>
  );
};

export default AddWeightModal;
