// Note that this file is created by the CDK after the backend stack is deployed.
import { AuthUserPoolConfig } from "@aws-amplify/core";
import { ResourcesConfig } from "aws-amplify";
import cdkExports from "./cdk-exports.json";

const AuthenticationStack = cdkExports["OnePot-Counter-AuthenticationStack"];

const amplifyConfig: ResourcesConfig = {
    Auth: {
        region: AuthenticationStack.region,
        Cognito: {
            userPoolId: AuthenticationStack.UserPoolId,
            userPoolClientId: AuthenticationStack.UserPoolClientId,
            loginWith: {
                oauth: {
                    domain: AuthenticationStack.UserPoolDomain,
                    redirectSignIn: [window.location.origin],
                    redirectSignOut: [window.location.origin],
                    scopes: [
                        "openid",
                        "profile",
                        "aws.cognito.signin.user.admin",
                        "email",
                    ],
                    responseType: "code" as const,
                    providers: ["Google" as const],
                },
            },
        },
    } as AuthUserPoolConfig,
};

export default amplifyConfig;
