// authentication-stack.ts
import * as cdk from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

interface AuthenticationStackProps extends cdk.StackProps {
    googleClientId: string;
    googleClientSecret: cdk.SecretValue;
}
export class AuthenticationStack extends cdk.Stack {
    public readonly userPool: cognito.UserPool;

    constructor(scope: Construct, id: string, props: AuthenticationStackProps) {
        super(scope, id, props);

        // Create a Cognito User Pool
        this.userPool = new cognito.UserPool(this, "UserPool", {
            selfSignUpEnabled: true,
            userVerification: {
                emailSubject: "Verify your email for our app!",
                emailBody:
                    "Thanks for signing up! Your verification code is {####}",
                emailStyle: cognito.VerificationEmailStyle.CODE,
            },
            signInAliases: {
                email: true,
            },
        });

        console.log(props.googleClientId);
        // Add Google as an identity provider
        const googleProvider = new cognito.UserPoolIdentityProviderGoogle(
            this,
            "GoogleProvider",
            {
                clientId: props.googleClientId,
                clientSecretValue: props.googleClientSecret,
                userPool: this.userPool,
                scopes: ["profile", "email", "openid"],
                attributeMapping: {
                    email: cognito.ProviderAttribute.GOOGLE_EMAIL,
                    givenName: cognito.ProviderAttribute.GOOGLE_GIVEN_NAME,
                    familyName: cognito.ProviderAttribute.GOOGLE_FAMILY_NAME,
                },
            }
        );

        // Create a Cognito User Pool Client
        const userPoolClient = new cognito.UserPoolClient(
            this,
            "UserPoolClient",
            {
                userPool: this.userPool,
                supportedIdentityProviders: [
                    cognito.UserPoolClientIdentityProvider.GOOGLE,
                ],
            }
        );
        // This UserPool client can be created only after the Google provider is created
        userPoolClient.node.addDependency(googleProvider);

        // Outputs for accessing the user pool and client
        new cdk.CfnOutput(this, "UserPoolId", {
            value: this.userPool.userPoolId,
        });
    }
}
