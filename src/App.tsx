import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import amplifyConfig from "./amplifyConfig";
import MyCounter from "./components/MyCounter";
import PublicCounter from "./components/PublicCounter";
import TopBar from "./components/TopBar";

Amplify.configure(amplifyConfig);

const App = () => {
    return (
        <div className="flex flex-col min-h-screen text-center">
            <TopBar />
            <main className="flex-1 bg-gray-700 flex flex-col items-center justify-center text-white text-[calc(10px+2vmin)]">
                {/* Introductory Section */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-center mb-4">
                        Welcome to OnePot Counter!
                    </h1>
                    <p className="text-center">
                        Explore our counters showcasing various setups and
                        use-cases. Click on each counter to see them in action!
                    </p>
                </div>

                {/* Grid of Counters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-300 p-6 rounded-xl">
                        <PublicCounter />
                    </div>
                    <div className="border border-gray-300 p-6 rounded-xl">
                        <MyCounter />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
