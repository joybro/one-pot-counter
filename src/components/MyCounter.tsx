import { useEffect, useState } from "react";
import { User, useAuth } from "../hooks/useAuth";
import { getMyCounter, incrementMyCounter } from "../services/apiService";

type MyCounterSignedInProps = {
    user: User;
};

const MyCounterSignedIn: React.FC<MyCounterSignedInProps> = ({ user }) => {
    const [counter, setCounter] = useState(0);

    // Fetch the current counter value from the backend when the component mounts
    useEffect(() => {
        const fetchCounter = async () => {
            try {
                const count = await getMyCounter(user.idToken);
                setCounter(count);
            } catch (error) {
                // Handle error (e.g., show a message to the user)
            }
        };

        fetchCounter();
    }, [user.idToken]);

    const handleIncrement = async () => {
        try {
            await incrementMyCounter(user.idToken);
            setCounter((prev) => prev + 1);
        } catch (error) {
            // Handle error (e.g., show a message to the user)
        }
    };

    return (
        <div>
            <p>Your Counter: {counter}</p>
            <button
                onClick={handleIncrement}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-lg"
            >
                Count Up
            </button>
        </div>
    );
};

type MyCounterSignedOutProps = {
    signIn: () => void;
};

const MyCounterSignedOut: React.FC<MyCounterSignedOutProps> = ({ signIn }) => {
    return (
        <button onClick={signIn} className="your-button-class">
            Sign In with Google
        </button>
    );
};

const MyCounter = () => {
    const { user, signInWithGoogle } = useAuth();

    return (
        <div>
            {user ? (
                <MyCounterSignedIn user={user} />
            ) : (
                <MyCounterSignedOut signIn={signInWithGoogle} />
            )}
        </div>
    );
};

export default MyCounter;
