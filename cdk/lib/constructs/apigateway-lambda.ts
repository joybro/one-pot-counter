import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

interface ApiGatewayLambdaConstructProps {
    lambdaPath: string;
    lambdaHandlerName?: string;
    resourceName: string;
    methods: string[];
}

export class ApiGatewayLambdaConstruct extends Construct {
    public readonly api: apigateway.RestApi;
    public readonly lambdaFunction: NodejsFunction;

    constructor(
        scope: Construct,
        id: string,
        props: ApiGatewayLambdaConstructProps
    ) {
        super(scope, id);

        // Define the Lambda function
        this.lambdaFunction = new NodejsFunction(this, `${id}-Handler`, {
            entry: props.lambdaPath,
            handler: props.lambdaHandlerName || "handler",
        });

        // Define the API Gateway
        this.api = new apigateway.RestApi(this, `${id}-ApiGateway`, {
            restApiName: `${id}-Api`,
        });

        // Define the resource based on the provided resource name
        const resource = this.api.root.addResource(props.resourceName);

        // Add methods to the resource
        props.methods.forEach((method) => {
            resource.addMethod(
                method,
                new apigateway.LambdaIntegration(this.lambdaFunction)
            );
        });
    }
}
