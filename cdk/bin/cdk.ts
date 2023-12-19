#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { WebAssetStack } from "../lib/web-asset-stack";

const app = new cdk.App();
const webAssetStack = new WebAssetStack(app, "OnePot-Counter-WebAssetStack", {
    /* If you have specific stack props, they go here */
});
