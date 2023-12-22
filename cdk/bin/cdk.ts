#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { APIStack } from "../lib/stacks/api-stack";
import { ContentDeliveryStack } from "../lib/stacks/content-delivery-stack";
import { DataPersistenceStack } from "../lib/stacks/data-persistence-stack";

const app = new cdk.App();

const dataPersistenceStack = new DataPersistenceStack(
    app,
    "OnePot-Counter-DBStack",
    {}
);
const apiStack = new APIStack(app, "OnePot-Counter-APIStack", {
    counterTableName: dataPersistenceStack.table.tableName,
    counterTableArn: dataPersistenceStack.table.tableArn,
});
new ContentDeliveryStack(app, "OnePot-Counter-ContentDeliveryStack", {
    enableLogging: false,
    api: apiStack.api,
});
