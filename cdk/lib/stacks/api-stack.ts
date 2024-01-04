import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as iam from "aws-cdk-lib/aws-iam";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as logs from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import * as path from "path";

type APIStackProps = cdk.StackProps & {
    counterTableName: string;
    counterTableArn: string;
    userPool: cognito.UserPool;
    enableInfoLogging?: boolean;
};

export class APIStack extends cdk.Stack {
    public readonly api: apigateway.RestApi;

    constructor(scope: Construct, id: string, props: APIStackProps) {
        super(scope, id, props);

        let stageOptions = {};

        if (props.enableInfoLogging) {
            // Create a Log Group in CloudWatch
            const logGroup = new logs.LogGroup(
                this,
                `${id}-ApiGatewayLogGroup`,
                {
                    logGroupName: `/aws/apigateway/${id}`,
                    removalPolicy: cdk.RemovalPolicy.DESTROY,
                }
            );

            // Create an IAM Role for API Gateway to access CloudWatch Logs
            const apiGatewayRole = new iam.Role(
                this,
                `${id}-ApiGatewayCloudWatchRole`,
                {
                    assumedBy: new iam.ServicePrincipal(
                        "apigateway.amazonaws.com"
                    ),
                }
            );
            apiGatewayRole.addToPolicy(
                new iam.PolicyStatement({
                    actions: [
                        "logs:CreateLogGroup",
                        "logs:CreateLogStream",
                        "logs:PutLogEvents",
                    ],
                    resources: [logGroup.logGroupArn],
                })
            );

            // Enable Access Logging on the API Gateway Stage
            stageOptions = {
                accessLogDestination: new apigateway.LogGroupLogDestination(
                    logGroup
                ),
                accessLogFormat:
                    apigateway.AccessLogFormat.jsonWithStandardFields(),
                loggingLevel: apigateway.MethodLoggingLevel.INFO,
                dataTraceEnabled: true, // Enable full request/response logging
            };
        }

        // Define the API Gateway
        this.api = new apigateway.RestApi(this, `${id}-ApiGateway`, {
            restApiName: `${id}-Api`,
            deployOptions: stageOptions,
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

        // Define the resources
        const apiResource = this.api.root.addResource("api");

        // Define the public counter resource
        const publicCounterResource = apiResource.addResource("public-counter");
        ["GET", "POST"].forEach((method) => {
            publicCounterResource.addMethod(
                method,
                new apigateway.LambdaIntegration(lambdaFunction)
            );
        });

        // Define the private counter resource
        const myCounterResource = apiResource.addResource("my-counter");
        ["GET", "POST"].forEach((method) => {
            myCounterResource.addMethod(
                method,
                new apigateway.LambdaIntegration(lambdaFunction),
                {
                    authorizationType: apigateway.AuthorizationType.COGNITO,
                    authorizer,
                }
            );
        });

        // Outputs for frontend
        new cdk.CfnOutput(this, "ApiUrl", {
            value: this.api.url,
        });
    }
}
