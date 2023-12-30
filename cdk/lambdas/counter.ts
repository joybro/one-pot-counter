import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    GetCommand,
    UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyHandler } from "aws-lambda";
import { CounterApiResponse } from "../../shared/counterTypes";

const ddbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const tableName = process.env.TABLE_NAME;

export const handler: APIGatewayProxyHandler = async (event) => {
    console.log(event.httpMethod, event.path);

    try {
        let response: CounterApiResponse;
        switch (event.httpMethod) {
            case "GET":
                response = await handleGetRequest();
                break;
            case "POST":
                response = await handlePostRequest();
                break;
            default:
                throw new Error("Method Not Allowed");
        }

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(response),
        };
    } catch (error) {
        console.error(error);

        const errorMessage =
            error instanceof Error ? error.message : "Internal Server Error";
        const statusCode = errorMessage === "Method Not Allowed" ? 405 : 500;

        return {
            statusCode,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: errorMessage }),
        };
    }
};

const getToday = () => new Date().toISOString().split("T")[0];

const handleGetRequest = async (): Promise<CounterApiResponse> => {
    const today = getToday();

    console.log(today);

    const result = await ddbClient.send(
        new GetCommand({
            TableName: tableName,
            Key: { date: today },
        })
    );

    return {
        date: today,
        greeting_counter: result.Item?.greeting_counter || 0,
    };
};

const handlePostRequest = async (): Promise<CounterApiResponse> => {
    const today = getToday();

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
        date: today,
        greeting_counter: result.Attributes?.greeting_counter,
    };
};
