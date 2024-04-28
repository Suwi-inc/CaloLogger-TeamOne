import { getTimeISO } from "../../utils/parse-time";
import { addWeight } from "../../api/weight";
import { BACKEND_URL } from "../../constants";
import useSWRMutation from "swr/mutation";

type WeigthForm = {
    weight: string;
    date: string;
    time: string;
};

const AddWeightModal = ({
    setShowModal,
}: {
    setShowModal: (showModal: boolean) => void;
}) => {
    const { trigger, isMutating } = useSWRMutation(
        `${BACKEND_URL}/weights`,
        addWeight
    );

    /**
     * Validates the weight form.
     * @param {WeigthForm} form - The weight form object containing weight, date, and time.
     * @returns {boolean} - Returns true if the form is valid, false otherwise.
     */
    const validateForm = ({ weight, date, time }: WeigthForm): boolean => {
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

    /**
     * Handles the form submission event.
     *
     * @param e - The form submission event.
     */
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const { weight, date, time } = Object.fromEntries(
            formData.entries()
        ) as WeigthForm;

        if (!validateForm({ weight, date, time })) {
            alert("Invalid form data");
            return;
        }

        const datetime = getTimeISO(date, time);
        await trigger({ weight: Number(weight), date: datetime });
        setShowModal(false);
    };

    const handleEscapeKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Escape") {
            setShowModal(false);
        }
    };
    return (
        <div
            onClick={() => setShowModal(false)}
            onKeyUp={(e) => e.stopPropagation()}
            role="button"
            className="p-5 border border-gray-200 flex items-center justify-center rounded-md fixed top-0 left-0 right-0 bottom-0 min-h-screen bg-black backdrop:bg-black bg-opacity-50 z-50"
            aria-modal="true"
            tabIndex={0} // Add tabIndex to make the div focusable
            onKeyDown={handleEscapeKey} // Add keyboard listener for 'Escape' key
        >
            <div
                className="flex flex-col justify-end p-10 w-fit bg-white rounded-md shadow-lg"
                onClick={(e) => e.stopPropagation()}
                onKeyUp={(e) => e.stopPropagation()}
                role="button"
            >
                <h3 className="text-3xl font-bold mb-5 text-center">
                    Add Weight
                </h3>
                <form
                    onSubmit={handleFormSubmit}
                    className="flex flex-col gap-2"
                >
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
        </div>
    );
};

export default AddWeightModal;
