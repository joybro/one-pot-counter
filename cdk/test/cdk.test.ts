import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { APIStack } from "../lib/stacks/api-stack";
import { AuthenticationStack } from "../lib/stacks/authentication-stack";
import { ContentDeliveryStack } from "../lib/stacks/content-delivery-stack";

test("AuthenticationStack has the correct resources", () => {
    const app = new cdk.App();

    // Initialize the stack
    const stack = new AuthenticationStack(
        app,
        "OnePot-Counter-AuthenticationStack",
        {
            googleClientId: "mockClientId",
            googleClientSecret: cdk.SecretValue.secretsManager(
                "onepot-counter-google-client-secret"
            ),
        }
    );

    // Convert stack to a template
    const template = Template.fromStack(stack);

    // Check if the stack has the UserPool and UserPoolClient resources
    template.hasResourceProperties("AWS::Cognito::UserPool", {});
    template.hasResourceProperties("AWS::Cognito::UserPoolClient", {});
});

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

    // Create a mock stack and mock userpool
    const mockStack = new cdk.Stack(app, "MockStack");
    const mockUserPool = new UserPool(mockStack, "MockUserPool");

    // Initialize the stack
    const stack = new APIStack(app, "OnePot-Counter-APIStack", {
        counterTableName: "TestTable",
        counterTableArn:
            "arn:aws:dynamodb:us-east-1:123456789012:table/TestTable",
        userPool: mockUserPool,
    });

    // Convert stack to a template
    const template = Template.fromStack(stack);

    // Check if the stack has the correct resources
    template.hasResourceProperties("AWS::ApiGateway::RestApi", {});
    template.hasResourceProperties("AWS::Lambda::Function", {});
});
