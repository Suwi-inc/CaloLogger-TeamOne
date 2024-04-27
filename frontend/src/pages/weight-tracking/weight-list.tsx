import { getDateMedium, getTimeShort } from "../../../utils/parse-time";
import { Weight } from "../../types";
import { getWeights, deleteWeight } from "../../api/weight";
import { BACKEND_URL } from "../../constants";
import useSWRMutation from "swr/mutation";
import useSWR from "swr";

const WeightItem = ({ weight_entry }: { weight_entry: Weight }) => {
  const { id, date, weight } = weight_entry;
  const deleteURL = new URL(
    `${BACKEND_URL}/weights/${decodeURIComponent(id.toString())}`
  ).toString();
  const { trigger, isMutating } = useSWRMutation(deleteURL, deleteWeight);

  const deleteWeightHandler = async () => {
    try {
      await trigger();
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to delete weight");
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
        className="bg-red-500 text-sm text-white py-2 px-5 rounded-md w-fit self-end disabled:opacity-50"
        onClick={deleteWeightHandler}
        disabled={isMutating}
      >
        {isMutating ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
};

const WeightList = () => {
  const { data, isLoading, error } = useSWR<Weight[]>(
    `${BACKEND_URL}/weights`,
    getWeights
  );

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {data.map((weight_entry) => (
        <WeightItem key={weight_entry.id} weight_entry={weight_entry} />
      ))}
    </div>
  );
};

export default WeightList;
