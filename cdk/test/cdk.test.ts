import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { APIStack } from "../lib/stacks/api-stack";
import { AuthenticationStack } from "../lib/stacks/authentication-stack";
import { FrontendHostingStack } from "../lib/stacks/frontend-hosting-stack";

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
            cognitoDomainPrefix: "onepot-counter",
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
    const stack = new FrontendHostingStack(
        app,
        "OnePot-Counter-ContentDeliveryStack",
        {
            enableLogging: false,
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

    // Check if the stack has the resource with "public-counter" path that does not require authentication
    template.hasResourceProperties("AWS::ApiGateway::Resource", {
        PathPart: "public-counter",
    });
    template.hasResourceProperties("AWS::ApiGateway::Method", {
        HttpMethod: "GET",
        AuthorizationType: "NONE",
    });

    // Check if the stack has the resource with "my-counter" path that requires authentication
    template.hasResourceProperties("AWS::ApiGateway::Resource", {
        PathPart: "my-counter",
    });
    template.hasResourceProperties("AWS::ApiGateway::Method", {
        HttpMethod: "GET",
        AuthorizationType: "COGNITO_USER_POOLS",
    });
});
