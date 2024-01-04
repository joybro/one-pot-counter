import React from "react";
import { useAuth } from "../hooks/useAuth";

const TopBar: React.FC = () => {
    const { user, signInWithGoogle, signOut } = useAuth();

    return (
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">OnePot Counter</h1>
            <div className="flex items-center">
                {user ? (
                    <>
                        <span className="mr-4">Hi, {user.given_name}</span>
                        <img
                            src={user.picture}
                            alt="Profile"
                            className="h-8 w-8 rounded-full mr-4"
                        />
                        <button
                            onClick={signOut}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                        >
                            Sign Out
                        </button>
                    </>
                ) : (
                    <button
                        onClick={signInWithGoogle}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                    >
                        Sign In With Google
                    </button>
                )}
            </div>
        </div>
    );
};

export default TopBar;
