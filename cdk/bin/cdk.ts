#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { WebHostingStack } from "../lib/web-hosting-stack";
import { ContentDeliveryStack } from "../lib/content-delivery-stack";

const app = new cdk.App();

// Separating WebHostingStack and ContentDeliveryStack for efficient deployment management.
// WebHostingStack is redeployed with frontend updates, while ContentDeliveryStack remains unchanged.
const webHostingStack = new WebHostingStack(
    app,
    "OnePot-Counter-WebHostingStack",
    {
        /* If you have specific stack props, they go here */
    }
);
new ContentDeliveryStack(app, "OnePot-Counter-ContentDeliveryStack", {
    contentBucket: webHostingStack.assetBucket,
    enableLogging: false,
});
