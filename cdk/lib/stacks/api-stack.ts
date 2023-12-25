import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as iam from "aws-cdk-lib/aws-iam";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";

interface APIStackProps extends cdk.StackProps {
    counterTableName: string;
    counterTableArn: string;
    userPool: cognito.UserPool;
}

export class APIStack extends cdk.Stack {
    public readonly api: apigateway.RestApi;

    constructor(scope: Construct, id: string, props: APIStackProps) {
        super(scope, id, props);

        // Define the Lambda function
        const lambdaFunction = new NodejsFunction(this, `${id}-Handler`, {
            entry: path.resolve(__dirname, "../../lambdas/counter.ts"),
            environment: {
                TABLE_NAME: props.counterTableName,
            },
        });
        lambdaFunction.addToRolePolicy(
            new iam.PolicyStatement({
                actions: ["dynamodb:GetItem", "dynamodb:UpdateItem"],
                resources: [props.counterTableArn],
            })
        );

        // Define the API Gateway
        this.api = new apigateway.RestApi(this, `${id}-ApiGateway`, {
            restApiName: `${id}-Api`,
            defaultCorsPreflightOptions: {
                allowOrigins: apigateway.Cors.ALL_ORIGINS,
                allowMethods: apigateway.Cors.ALL_METHODS,
            },
        });

        // Add Cognito User Pool Authorizer to API Gateway
        const authorizer = new apigateway.CognitoUserPoolsAuthorizer(
            this,
            "UserPoolAuthorizer",
            {
                cognitoUserPools: [props.userPool],
            }
        );

        // Define the resources
        const apiResource = this.api.root.addResource("api");
        const counterResource = apiResource.addResource("counter");

        // Add methods to the resource
        ["GET", "POST"].forEach((method) => {
            counterResource.addMethod(
                method,
                new apigateway.LambdaIntegration(lambdaFunction),
                {
                    authorizationType: apigateway.AuthorizationType.COGNITO,
                    authorizer,
                }
            );
        });
    }
}
