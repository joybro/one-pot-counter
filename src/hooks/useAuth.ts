import { useAuthenticator } from "@aws-amplify/ui-react";
import { getCurrentUser, signInWithRedirect } from "aws-amplify/auth";
import { useEffect, useState } from "react";

type User = {
    email: string;
    family_name?: string;
    given_name?: string;
    picture?: string;
};

type UseAuthReturn = {
    user?: User; // available only when signed in
    signInWithGoogle: () => void;
    signOut: () => void;
};

const signInWithGoogle = async () => {
    await signInWithRedirect({
        provider: "Google",
    });
};

const useAuth = (): UseAuthReturn => {
    const [user, setUser] = useState<User | undefined>(undefined);
    const { user: cognitoUser, signOut } = useAuthenticator((context) => [
        context.user,
        context.signOut,
    ]);

    useEffect(() => {
        if (cognitoUser) {
            (async () => {
                const { username, userId, signInDetails } =
                    await getCurrentUser();
                console.log(`The username: ${username}`);
                console.log(`The userId: ${userId}`);
                console.log(`The signInDetails: ${signInDetails}`);

                setUser({
                    email: "",
                });
            })();
        }
    }, [cognitoUser]);

    return {
        user,
        signInWithGoogle,
        signOut,
    };
};

export { useAuth };
