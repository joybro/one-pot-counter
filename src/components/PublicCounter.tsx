import { useEffect, useState } from "react";
import {
    getPublicCounter,
    incrementPublicCounter,
} from "../services/apiService";

const PublicCounter = () => {
    const [counter, setCounter] = useState(0);

    // Fetch the current counter value from the backend when the component mounts
    useEffect(() => {
        const fetchCounter = async () => {
            try {
                const count = await getPublicCounter();
                setCounter(count);
            } catch (error) {
                // Handle error (e.g., show a message to the user)
            }
        };

        fetchCounter();
    }, []);

    const handleIncrement = async () => {
        try {
            await incrementPublicCounter();
            setCounter((prev) => prev + 1);
        } catch (error) {
            // Handle error (e.g., show a message to the user)
        }
    };

    return (
        <div>
            <p>Shared Counter: {counter}</p>
            <button
                onClick={handleIncrement}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-lg"
            >
                Count Up
            </button>
        </div>
    );
};

export default PublicCounter;
