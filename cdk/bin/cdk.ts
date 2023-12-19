#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { WebHostingStack } from "../lib/web-hosting-stack";
import { ContentDeliveryStack } from "../lib/content-delivery-stack";

const app = new cdk.App();
const webAssetStack = new WebHostingStack(
    app,
    "OnePot-Counter-WebHostingStack",
    {
        /* If you have specific stack props, they go here */
    }
);
new ContentDeliveryStack(app, "OnePot-Counter-ContentDeliveryStack", {
    contentBucket: webAssetStack.assetBucket,
    enableLogging: false,
});
