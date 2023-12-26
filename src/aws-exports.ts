// Note that this file is created by the CDK after the backend stack is deployed.
import cdkExports from "./cdk-exports.json";

const AuthenticationStack = cdkExports["OnePot-Counter-AuthenticationStack"];

export default {
    aws_project_region: AuthenticationStack.region,
    Auth: {
        region: AuthenticationStack.region,
        Cognito: {
            userPoolId: AuthenticationStack.UserPoolId,
            userPoolWebClientId: AuthenticationStack.UserPoolClientId,
            loginWith: {
                oauth: {
                    domain: AuthenticationStack.UserPoolDomain,
                    redirectSignIn: window.location.origin,
                    redirectSignOut: window.location.origin,
                    scope: [
                        "openid",
                        "profile",
                        "aws.cognito.signin.user.admin",
                        "email",
                    ],
                    responseType: "code",
                },
            },
        },
    },
};
