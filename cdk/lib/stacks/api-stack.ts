// File: lib/my-api-stack.ts
import * as cdk from "aws-cdk-lib";
import * as path from "path";
import { Construct } from "constructs";
import { ApiGatewayLambdaConstruct } from "../constructs/apigateway-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export class APIStack extends cdk.Stack {
    public readonly api: apigateway.RestApi;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // TODO - Remove this once the dependency is removed
        // Instantiate the ApiGatewayLambdaConstruct
        const oldApi = new ApiGatewayLambdaConstruct(this, "Counter", {
            lambdaPath: path.resolve(__dirname, "../../lambdas/counter.ts"),
            resourceName: "counter",
            methods: ["GET", "POST"],
        });
        // Temporarily export the API Gateway ID and stage name to avoid deployment errors
        // This will be removed once the dependency is removed.
        this.exportValue(oldApi.api.restApiId);
        this.exportValue(oldApi.api.deploymentStage.stageName);

        // Define the Lambda function
        const lambdaFunction = new NodejsFunction(this, `${id}-Handler`, {
            entry: path.resolve(__dirname, "../../lambdas/counter.ts"),
        });

        // Define the API Gateway
        this.api = new apigateway.RestApi(this, `${id}-ApiGateway`, {
            restApiName: `${id}-Api`,
        });

        // Define the resources
        const apiResource = this.api.root.addResource("api");
        const counterResource = apiResource.addResource("counter");

        // Add methods to the resource
        ["GET", "POST"].forEach((method) => {
            counterResource.addMethod(
                method,
                new apigateway.LambdaIntegration(lambdaFunction)
            );
        });
    }
}
