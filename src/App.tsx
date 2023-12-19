import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
    const [counter, setCounter] = useState(0);

    // Fetch the current counter value from the backend when the component mounts
    useEffect(() => {
        fetchCurrentCounter().then((data) => setCounter(data.counter));
    }, []);

    // Placeholder function to fetch current counter - replace with actual API call
    const fetchCurrentCounter = async () => {
        // Replace this with actual API call to fetch counter
        return { counter: 0 }; // Mock response
    };

    // Placeholder function to increment the counter - replace with actual API call
    const incrementCounter = async () => {
        // Replace this with actual API call to increment counter
        const updatedCounter = counter + 1;
        setCounter(updatedCounter);
        return updatedCounter;
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Hello, World!</h1>
                <p>Daily Counter: {counter}</p>
                <button
                    onClick={incrementCounter}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-lg"
                >
                    Count Up
                </button>
            </header>
        </div>
    );
}

export default App;
