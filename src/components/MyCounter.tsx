import { useEffect, useState } from "react";
import { User, useAuth } from "../hooks/useAuth";
import { getMyCounter, incrementMyCounter } from "../services/apiService";

type MyCounterSignedInProps = {
    user: User;
    signOut: () => void;
};

const MyCounterSignedIn: React.FC<MyCounterSignedInProps> = ({
    user,
    signOut,
}) => {
    const [counter, setCounter] = useState(0);

    // Fetch the current counter value from the backend when the component mounts
    useEffect(() => {
        const fetchCounter = async () => {
            try {
                const count = await getMyCounter(user.accessToken);
                setCounter(count);
            } catch (error) {
                // Handle error (e.g., show a message to the user)
            }
        };

        fetchCounter();
    }, []);

    const handleIncrement = async () => {
        try {
            await incrementMyCounter();
            setCounter((prev) => prev + 1);
        } catch (error) {
            // Handle error (e.g., show a message to the user)
        }
    };

    return (
        <div>
            <h1>Hello, World!</h1>
            <p>Daily Counter: {counter}</p>
            <button
                onClick={handleIncrement}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-lg"
            >
                Count Up
            </button>
            <button
                onClick={signOut}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-lg"
            >
                Sign Out
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
    const { user, signInWithGoogle, signOut } = useAuth();

    return (
        <div>
            {user ? (
                <MyCounterSignedIn user={user} signOut={signOut} />
            ) : (
                <MyCounterSignedOut signIn={signInWithGoogle} />
            )}
        </div>
    );
};

export default MyCounter;
