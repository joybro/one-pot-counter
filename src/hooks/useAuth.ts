import { useAuthenticator } from "@aws-amplify/ui-react";
import { fetchAuthSession, signInWithRedirect } from "aws-amplify/auth";
import { useEffect, useState } from "react";

type User = {
    email: string;
    family_name?: string;
    given_name?: string;
    picture?: string;
    accessToken: string;
    idToken: string;
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
        // If the user is signed in...
        if (cognitoUser) {
            (async () => {
                const { accessToken, idToken } =
                    (await fetchAuthSession()).tokens ?? {};
                console.log(`The accessToken: ${accessToken}`);
                console.log(`The idToken: ${idToken}`);

                if (accessToken === undefined || idToken === undefined) {
                    throw new Error("The tokens are undefined.");
                }

                setUser({
                    email: "",
                    accessToken: accessToken?.toString(),
                    idToken: idToken?.toString(),
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
export type { User };
