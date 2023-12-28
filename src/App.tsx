import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import { useEffect, useState } from "react";
import "./App.css";
import amplifyConfig from "./amplifyConfig";
import { useAuth } from "./hooks/useAuth";
import { getCounter, incrementCounter } from "./services/apiService";

Amplify.configure(amplifyConfig);

const App = () => {
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
        <div className="App">
            <header className="App-header">
                <h1>Hello, World!</h1>
                <p>Daily Counter: {counter}</p>
                <button
                    onClick={handleIncrement}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-lg"
                >
                    Count Up
                </button>
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
            </header>
        </div>
    );
};

export default App;
