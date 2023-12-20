import { APIGatewayProxyHandler, APIGatewayProxyEvent } from "aws-lambda";

export const handler: APIGatewayProxyHandler = async (event) => {
    switch (event.httpMethod) {
        case "GET":
            return handleGetRequest(event);
        case "POST":
            return handlePostRequest(event);
        default:
            return {
                statusCode: 405,
                body: JSON.stringify({ message: "Method Not Allowed" }),
            };
    }
};

const handleGetRequest = (event: APIGatewayProxyEvent) => {
    // Handle your GET request logic here
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "GET request processed" }),
    };
};

const handlePostRequest = (event: APIGatewayProxyEvent) => {
    // Handle your POST request logic here
    // You can access the body of the request with event.body
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "POST request processed" }),
    };
};
