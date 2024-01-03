import { useAuthenticator } from "@aws-amplify/ui-react";
import {
    fetchAuthSession,
    fetchUserAttributes,
    signInWithRedirect,
} from "aws-amplify/auth";
import { useEffect, useState } from "react";

type User = {
    email: string;
    family_name: string;
    given_name: string;
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
                const [userAttr, authSession] = await Promise.all([
                    fetchUserAttributes(),
                    fetchAuthSession(),
                ]);

                const { accessToken, idToken } = authSession.tokens ?? {};
                if (accessToken === undefined || idToken === undefined) {
                    throw new Error("The tokens are undefined.");
                }

                if (
                    !userAttr.email ||
                    !userAttr.family_name ||
                    !userAttr.given_name ||
                    !userAttr.picture
                ) {
                    throw new Error("The user attributes are undefined.");
                }

                setUser({
                    email: userAttr.email,
                    family_name: userAttr.family_name,
                    given_name: userAttr.given_name,
                    picture: userAttr.picture,
                    accessToken: accessToken.toString(),
                    idToken: idToken.toString(),
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
