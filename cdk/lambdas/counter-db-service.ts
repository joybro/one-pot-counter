import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    GetCommand,
    UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const ddbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const tableName = process.env.TABLE_NAME;

const getCounter = async (user: string): Promise<number> => {
    const result = await ddbClient.send(
        new GetCommand({
            TableName: tableName,
            Key: { user },
        })
    );

    return result.Item?.greeting_counter || 0;
};

const increaseCounter = async (user: string): Promise<number> => {
    const result = await ddbClient.send(
        new UpdateCommand({
            TableName: tableName,
            Key: { user },
            UpdateExpression:
                "SET greeting_counter = if_not_exists(greeting_counter, :zero) + :incr",
            ExpressionAttributeValues: { ":incr": 1, ":zero": 0 },
            ReturnValues: "UPDATED_NEW",
        })
    );

    return result.Attributes?.greeting_counter;
};

export { getCounter, increaseCounter };
