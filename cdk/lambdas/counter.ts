import { APIGatewayProxyHandler } from "aws-lambda";
import { myCounterHandler } from "./my-counter";
import { publicCounterHandler } from "./public-counter";

export const handler: APIGatewayProxyHandler = async (event, context) => {
    console.log(event.httpMethod, event.path);

    try {
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
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            body,
        };
    } catch (error) {
        console.error(error);

        const errorMessage =
            error instanceof Error ? error.message : "Internal Server Error";

        const statusCode = errorMessage === "Path Not Found" ? 405 : 500;

        return {
            statusCode: 405,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: errorMessage }),
        };
    }
};
