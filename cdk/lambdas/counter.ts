import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    GetCommand,
    UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyHandler } from "aws-lambda";

const ddbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const tableName = process.env.TABLE_NAME;

export const handler: APIGatewayProxyHandler = async (event) => {
    switch (event.httpMethod) {
        case "GET":
            return handleGetRequest();
        case "POST":
            return handlePostRequest();
        default:
            return {
                statusCode: 405,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ message: "Method Not Allowed" }),
            };
    }
};

const handleError = (error: any) => {
    console.error(error);
    return {
        statusCode: 500,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(error.message),
    };
};

const handleGetRequest = async () => {
    const today = new Date().toISOString().split("T")[0];

    try {
        const result = await ddbClient.send(
            new GetCommand({
                TableName: tableName,
                Key: { date: today },
            })
        );

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: result.Item?.greeting_counter.toString() || "0",
        };
    } catch (error) {
        return handleError(error);
    }
};

const handlePostRequest = async () => {
    const today = new Date().toISOString().split("T")[0];

    try {
        const result = await ddbClient.send(
            new UpdateCommand({
                TableName: tableName,
                Key: { date: today },
                UpdateExpression:
                    "SET greeting_counter = if_not_exists(greeting_counter, :zero) + :incr",
                ExpressionAttributeValues: { ":incr": 1, ":zero": 0 },
                ReturnValues: "UPDATED_NEW",
            })
        );

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: result.Attributes?.greeting_counter.toString(),
        };
    } catch (error) {
        return handleError(error);
    }
};
