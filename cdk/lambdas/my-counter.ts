import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { CounterApiResponse } from "../../shared/counterTypes";
import { getCounter, increaseCounter } from "./counter-db-service";

export const myCounterHandler = async (
    event: APIGatewayProxyEvent,
    context: Context
): Promise<string> => {
    console.log(context);

    const userEmail = event.requestContext.authorizer?.claims.email;
    if (!userEmail) {
        throw new Error("user email is undefined");
    }

    let response: CounterApiResponse;
    switch (event.httpMethod) {
        case "GET":
            response = await handleGetRequest(userEmail);
            break;
        case "POST":
            response = await handlePostRequest(userEmail);
            break;
        default:
            throw new Error("Method Not Allowed");
    }

    return JSON.stringify(response);
};

const handleGetRequest = async (email: string): Promise<CounterApiResponse> => {
    const count = await getCounter(email);

    return {
        greeting_counter: count,
    };
};

const handlePostRequest = async (
    email: string
): Promise<CounterApiResponse> => {
    const count = await increaseCounter(email);

    return {
        greeting_counter: count,
    };
};
