import {
    DynamoDBDocumentClient,
    GetCommand,
    UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyResult } from "aws-lambda";
import { mockClient } from "aws-sdk-client-mock";
import "aws-sdk-client-mock-jest";
import { handler } from "../lambdas/counter";

describe("Counter Handler", () => {
    const ddbMock = mockClient(DynamoDBDocumentClient);
    const mockContext = {} as any;
    const mockCallback = jest.fn();

    beforeAll(() => {
        // Initialize the mock for all tests
        process.env.TABLE_NAME = "TestTable";
    });

    beforeEach(() => {
        // Initialize the mock for each test
        ddbMock.reset();
        jest.clearAllMocks();
    });

    test("GET request should return current counter", async () => {
        ddbMock.on(GetCommand).resolves({
            Item: { user: "public", greeting_counter: 5 },
        });

        const event = { httpMethod: "GET", path: "/api/public-counter" } as any;
        const response = (await handler(
            event,
            mockContext,
            mockCallback
        )) as APIGatewayProxyResult;

        expect(ddbMock).toHaveReceivedCommand(GetCommand);
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.body);
        console.log(body);
        expect(body.greeting_counter).toBe(5);
    });

    test("POST request should increment and return counter", async () => {
        ddbMock.on(UpdateCommand).resolves({
            Attributes: { greeting_counter: 6 },
        });

        const event = {
            httpMethod: "POST",
            path: "/api/public-counter",
        } as any;
        const response = (await handler(
            event,
            mockContext,
            mockCallback
        )) as APIGatewayProxyResult;

        expect(ddbMock).toHaveReceivedCommand(UpdateCommand);
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.body);
        expect(body.greeting_counter).toBe(6);
    });
});
