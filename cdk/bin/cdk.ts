#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { APIStack } from "../lib/stacks/api-stack";
import { ContentDeliveryStack } from "../lib/stacks/content-delivery-stack";

const app = new cdk.App();

const apiStack = new APIStack(app, "OnePot-Counter-APIStack", {});
new ContentDeliveryStack(app, "OnePot-Counter-ContentDeliveryStack", {
    enableLogging: false,
    api: apiStack.api,
});
