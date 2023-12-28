#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { APIStack } from "../lib/stacks/api-stack";
import { AuthenticationStack } from "../lib/stacks/authentication-stack";
import { ContentDeliveryStack } from "../lib/stacks/content-delivery-stack";
import { DataPersistenceStack } from "../lib/stacks/data-persistence-stack";

const app = new cdk.App();

// Backend stacks
const dataPersistenceStack = new DataPersistenceStack(
    app,
    "OnePot-Counter-DBStack",
    {}
);

const googleClientId = app.node.tryGetContext("googleClientId");
if (!googleClientId) {
    throw new Error("Failed to get googleClientId context value.");
}
const cloudFrontDomain = app.node.tryGetContext("cloudFrontDomain");

const authStack = new AuthenticationStack(
    app,
    "OnePot-Counter-AuthenticationStack",
    {
        googleClientId,
        googleClientSecret: cdk.SecretValue.secretsManager(
            "onepot-counter-google-client-secret"
        ),
        cognitoDomainPrefix: "onepot-counter",
        oauthRedirectUrls: [cloudFrontDomain],
        oauthLogoutUrls: [cloudFrontDomain],
    }
);
const apiStack = new APIStack(app, "OnePot-Counter-APIStack", {
    counterTableName: dataPersistenceStack.table.tableName,
    counterTableArn: dataPersistenceStack.table.tableArn,
    userPool: authStack.userPool,
});

// Frontend stack
new ContentDeliveryStack(app, "OnePot-Counter-ContentDeliveryStack", {
    enableLogging: false,
});
