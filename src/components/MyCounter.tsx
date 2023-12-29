import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getCounter, incrementCounter } from "../services/apiService";

const MyCounter = () => {
    const [counter, setCounter] = useState(0);
    const { user, signInWithGoogle, signOut } = useAuth();

    // Fetch the current counter value from the backend when the component mounts
    useEffect(() => {
        const fetchCounter = async () => {
            try {
                const count = await getCounter();
                setCounter(count);
            } catch (error) {
                // Handle error (e.g., show a message to the user)
            }
        };

        fetchCounter();
    }, []);

    const handleIncrement = async () => {
        try {
            await incrementCounter();
            setCounter((prev) => prev + 1);
        } catch (error) {
            // Handle error (e.g., show a message to the user)
        }
    };

    return (
        <div>
            {user ? (
                <button
                    onClick={signOut}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-lg"
                >
                    Sign Out
                </button>
            ) : (
                <button
                    onClick={signInWithGoogle}
                    className="your-button-class"
                >
                    Sign In with Google
                </button>
            )}
        </div>
    );
};

export default MyCounter;
