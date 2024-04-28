import { useRef, useState } from "react";
import { SearchResult } from "../../types";
import { search, addMeal } from "../../api/meals";
import { BACKEND_URL } from "../../constants";
import { getTimeISO } from "../../utils/parse-time";
import useSWRMutation from "swr/mutation";

type MealForm = {
    date: string;
    time: string;
    ingredients: string;
};

export const SaveMealModel = ({
    meal_entry,
    setShowModal,
}: {
    meal_entry: SearchResult;
    setShowModal: (showModal: boolean) => void;
}) => {
    const { ingredients } = meal_entry;
    const { trigger, isMutating } = useSWRMutation(
        `${BACKEND_URL}/meals`,
        addMeal
    );

    /**
     * Validates the meal form.
     * @param {MealForm} form - The meal form object containing the date, time, and ingredients.
     * @returns {boolean} - Returns true if the form is valid, otherwise false.
     */
    const validateForm = ({ date, time, ingredients }: MealForm): boolean => {
        if (!date || !time || !ingredients) {
            alert("Please fill all fields");
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
        const { date, time, ingredients } = Object.fromEntries(
            formData.entries()
        ) as MealForm;

        if (!validateForm({ date, time, ingredients })) {
            return;
        }

        const datetime = getTimeISO(date, time);
        await trigger({
            name: meal_entry.title,
            date: datetime,
            ingredients,
        });
        setShowModal(false);
        window.location.reload();
    };

    return (
        <div
            onClick={() => setShowModal(false)}
            className="p-5 border border-gray-200 flex items-center justify-center rounded-md fixed top-0 left-0 right-0 min-h-screen bg-black backdrop:bg-black bg-opacity-50 z-50"
            role="dialog"
            aria-modal="true"
            onKeyDown={(e) => {
                e.preventDefault();
                console.log(e.key);
                if (e.key === "Escape") {
                    setShowModal(false);
                }
            }}
            tabIndex={10}
        >
            <div
                className="flex flex-col justify-end p-10 w-fit bg-white rounded-md shadow-lg"
                onClick={(e) => e.stopPropagation()}
                onKeyUp={(e) => {
                    if (e.key === "Escape") {
                        setShowModal(false);
                    }
                }}
            >
                <h3 className="text-3xl font-bold mb-5 text-center">
                    Save Meal
                </h3>
                <form
                    onSubmit={handleFormSubmit}
                    className="flex flex-col gap-2"
                >
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
                        className="p-2 px-4 bg-blue-500 text-white rounded-md disabled:opacity-50"
                        disabled={isMutating}
                    >
                        {isMutating ? "Saving..." : "Save"}
                    </button>
                </form>
            </div>
        </div>
    );
};

const MealResultItem = ({ meal_entry }: { meal_entry: SearchResult }) => {
    const [showModal, setShowModal] = useState(false);
    const { title, ingredients } = meal_entry;

    return (
        <div className="flex flex-col p-5 border border-gray-200 rounded-md gap-5">
            <div className="flex flex-col gap-2">
                <h1 className="text-lg">{title}</h1>
                <p className="text-sm">{ingredients}</p>
            </div>
            {showModal && (
                <SaveMealModel
                    meal_entry={meal_entry}
                    setShowModal={setShowModal}
                />
            )}
            <button
                className="bg-blue-500 text-sm text-white py-2 px-4 rounded-md w-fit"
                onClick={() => setShowModal(!showModal)}
            >
                {showModal ? "Show less" : "Show more"}
            </button>
        </div>
    );
};

const MealResultsList = ({ results }: { results: SearchResult[] }) => {
    if (results.length === 0) {
        return <div>No results found! Please try another search.</div>;
    }

    return (
        <div className="flex flex-col gap-5">
            {results.map((meal_entry) => (
                <MealResultItem
                    key={meal_entry.title}
                    meal_entry={meal_entry}
                />
            ))}
        </div>
    );
};

const MealForm = () => {
    const { trigger, isMutating } = useSWRMutation(
        `${BACKEND_URL}/meals/search`,
        search
    );
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const query = formData.get("query") as string;
        if (!query || !query.trim()) {
            alert("Please enter a meal name");
            return;
        }
        const data = await trigger({ query });
        setSearchResults(data);
    };

    return (
        <div className="flex flex-col gap-5">
            <form className="flex flex-col gap-5" onSubmit={handleSearch}>
                <div className="flex gap-2">
                    <input
                        type="text"
                        name="query"
                        className="w-full p-5 border border-gray-200 rounded-md"
                        placeholder="Meal name"
                    />
                    <button
                        type="submit"
                        className="p-2 px-4 bg-blue-500 text-white rounded-md disabled:opacity-50"
                        disabled={isMutating}
                    >
                        {isMutating ? "Searching..." : "Search"}
                    </button>
                </div>
            </form>
            <MealResultsList results={searchResults} />
        </div>
    );
};

export default MealForm;
