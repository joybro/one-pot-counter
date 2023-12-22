#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { APIStack } from "../lib/stacks/api-stack";
import { ContentDeliveryStack } from "../lib/stacks/content-delivery-stack";
import { WebHostingStack } from "../lib/stacks/web-hosting-stack";

const app = new cdk.App();

// Separating WebHostingStack and ContentDeliveryStack for efficient deployment management.
// WebHostingStack is redeployed with frontend updates, while ContentDeliveryStack remains unchanged.
const webHostingStack = new WebHostingStack(
    app,
    "OnePot-Counter-WebHostingStack",
    {}
);
const apiStack = new APIStack(app, "OnePot-Counter-APIStack", {});
new ContentDeliveryStack(app, "OnePot-Counter-ContentDeliveryStack", {
    contentBucket: webHostingStack.assetBucket,
    enableLogging: false,
    api: apiStack.api,
});
