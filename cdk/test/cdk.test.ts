import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { APIStack } from "../lib/stacks/api-stack";
import { ContentDeliveryStack } from "../lib/stacks/content-delivery-stack";

test("ContentDeliveryStack has the correct resources", () => {
    const app = new cdk.App();

    // Create a mock stack and mock bucket
    const mockStack = new cdk.Stack(app, "MockStack");

    // Add a mock API with a mock method
    const mockApi = new RestApi(mockStack, "MockApi");
    mockApi.root.addMethod("GET");

    // Initialize the stack
    const stack = new ContentDeliveryStack(
        app,
        "OnePot-Counter-ContentDeliveryStack",
        {
            enableLogging: false,
            api: mockApi,
        }
    );

    // Convert stack to a template
    const template = Template.fromStack(stack);

    // Check if the stack has the correct resources
    template.hasResourceProperties("AWS::S3::Bucket", {});
    template.hasResourceProperties("AWS::CloudFront::Distribution", {});
});

test("APIStack has the correct resources", () => {
    const app = new cdk.App();

    // Initialize the stack
    const stack = new APIStack(app, "OnePot-Counter-APIStack", {});

    // Convert stack to a template
    const template = Template.fromStack(stack);

    // Check if the stack has the correct resources
    template.hasResourceProperties("AWS::ApiGateway::RestApi", {});
    template.hasResourceProperties("AWS::Lambda::Function", {});
});
