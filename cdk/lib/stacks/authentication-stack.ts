// authentication-stack.ts
import * as cdk from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

interface AuthenticationStackProps extends cdk.StackProps {
    googleClientId: string;
    googleClientSecret: cdk.SecretValue;

    // Note that if you change the prefix after deploying the stack, it will result in
    // a deployment failure with an "User pool already has a domain configured" error.
    // Changing or updating Cognito User Pool domains once they are associated with
    // a user pool is not a straightforward process. To change the domain prefix, you
    // will need to delete the existing domain in the AWS Console and redeploy the stack.
    cognitoDomainPrefix: string;
    oauthRedirectUrls?: string[];
    oauthLogoutUrls?: string[];
}
export class AuthenticationStack extends cdk.Stack {
    public readonly userPool: cognito.UserPool;

    constructor(scope: Construct, id: string, props: AuthenticationStackProps) {
        super(scope, id, props);

        // Create a Cognito User Pool
        this.userPool = new cognito.UserPool(this, "UserPool", {
            signInAliases: {
                email: true,
            },
        });

        this.userPool.addDomain("CognitoDomain", {
            cognitoDomain: {
                domainPrefix: props.cognitoDomainPrefix,
            },
        });

        // Get the domain name of the user pool
        const userPoolDomain = `${props.cognitoDomainPrefix}.auth.${this.region}.amazoncognito.com`;

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

        const oauthRedirectUrls = props.oauthRedirectUrls || [];
        const oauthLogoutUrls = props.oauthLogoutUrls || [];

        // Create a Cognito User Pool Client
        const userPoolClient = new cognito.UserPoolClient(
            this,
            "UserPoolClient",
            {
                userPool: this.userPool,
                supportedIdentityProviders: [
                    cognito.UserPoolClientIdentityProvider.GOOGLE,
                ],
                oAuth: {
                    callbackUrls: [
                        ...oauthRedirectUrls,
                        "http://localhost:3000",
                    ],
                    logoutUrls: [...oauthLogoutUrls, "http://localhost:3000"],
                },
            }
        );
        // This UserPool client can be created only after the Google provider is created
        userPoolClient.node.addDependency(googleProvider);

        // Outputs for accessing the user pool and client
        new cdk.CfnOutput(this, "region", {
            value: this.region,
        });

        new cdk.CfnOutput(this, "UserPoolId", {
            value: this.userPool.userPoolId,
        });

        new cdk.CfnOutput(this, "UserPoolClientId", {
            value: userPoolClient.userPoolClientId,
        });

        new cdk.CfnOutput(this, "UserPoolDomain", {
            value: userPoolDomain,
        });
    }
}
