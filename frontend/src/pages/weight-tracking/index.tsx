import { useState } from "react";
import Container from "../../components/container";
import WeightList from "./weight-list";
import AddWeightModal from "./add-weight";

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
            {showModal ? <AddWeightModal setShowModal={setShowModal} /> : <></>}
        </Container>
    );
};

export default WeightTracking;
