import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { ContentDeliveryStack } from "../lib/content-delivery-stack";
import { WebHostingStack } from "../lib/web-hosting-stack";
import { Bucket } from "aws-cdk-lib/aws-s3";

test("WebHostingStack has the correct resources", () => {
    const app = new cdk.App();
    // Initialize the stack
    const stack = new WebHostingStack(app, "OnePot-Counter-WebHostingStack", {
        // Include any necessary stack props here
    });

    // Convert stack to a template
    const template = Template.fromStack(stack);

    // Example assertion: checks if an S3 bucket is created
    template.hasResourceProperties("AWS::S3::Bucket", {});
});

test("ContentDeliveryStack has the correct resources", () => {
    const app = new cdk.App();

    // Create a mock stack and mock bucket
    const mockStack = new cdk.Stack(app, "MockStack");
    const mockBucket = new Bucket(mockStack, "MockBucket");

    // Initialize the stack
    const stack = new ContentDeliveryStack(
        app,
        "OnePot-Counter-ContentDeliveryStack",
        {
            // Mock an S3 bucket or pass necessary properties
            contentBucket: mockBucket,
            enableLogging: false,
        }
    );

    // Convert stack to a template
    const template = Template.fromStack(stack);

    // Example assertion: checks if a CloudFront distribution is created
    template.hasResourceProperties("AWS::CloudFront::Distribution", {});
});
