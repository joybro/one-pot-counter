// File: lib/my-api-stack.ts
import * as cdk from "aws-cdk-lib";
import * as path from "path";
import { Construct } from "constructs";
import { ApiGatewayLambdaConstruct } from "../constructs/apigateway-lambda";

export class APIStack extends cdk.Stack {
    api: ApiGatewayLambdaConstruct;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Instantiate the ApiGatewayLambdaConstruct
        this.api = new ApiGatewayLambdaConstruct(this, "Counter", {
            lambdaPath: path.resolve(__dirname, "../../lambdas/counter.ts"),
            resourceName: "counter",
            methods: ["GET", "POST"],
        });
    }
}
