import middy from "@middy/core";
import cors from "@middy/http-cors";
import httpErrorHandler from "@middy/http-error-handler";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import validator from "@middy/validator";
import { transpileSchema } from "@middy/validator/transpile";
import { APIGatewayProxyHandler } from "aws-lambda";
import { myCounterHandler } from "./my-counter";
import { publicCounterHandler } from "./public-counter";

const baseHandler: APIGatewayProxyHandler = async (event, context) => {
    console.log(event.httpMethod, event.path, event.body, event.requestContext);

    let body;
    switch (event.path) {
        case "/api/public-counter":
            body = await publicCounterHandler(event);
            break;
        case "/api/my-counter":
            body = await myCounterHandler(event, context);
            break;
        default:
            throw new Error("Path Not Found");
    }

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
        },
        body,
    };
};

const eventSchema = {
    type: "object",
    required: ["path"],
    properties: {
        path: {
            type: "string",
            pattern: "^/api/[^/]+$",
        },
    },
};

export const handler = middy()
    .use(cors())
    .use(validator({ eventSchema: transpileSchema(eventSchema) }))
    .use(httpErrorHandler({ logger: false, fallbackMessage: "Error: unknown" }))
    .use(httpJsonBodyParser())
    .handler(baseHandler);
