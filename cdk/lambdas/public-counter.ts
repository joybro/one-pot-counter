import { APIGatewayProxyEvent } from "aws-lambda";
import createError from "http-errors";
import { CounterApiResponse } from "../../shared/counterTypes";
import { getCounter, increaseCounter } from "./counter-db-service";

export const publicCounterHandler = async (
    event: APIGatewayProxyEvent
): Promise<string> => {
    console.log("publicCounterHandler", event.httpMethod, event.path);

    let response: CounterApiResponse;
    switch (event.httpMethod) {
        case "GET":
            response = await handleGetRequest();
            break;
        case "POST":
            response = await handlePostRequest();
            break;
        default:
            throw new createError.MethodNotAllowed();
    }

    return JSON.stringify(response);
};

const handleGetRequest = async (): Promise<CounterApiResponse> => {
    const count = await getCounter("public");

    return {
        greeting_counter: count,
    };
};

const handlePostRequest = async (): Promise<CounterApiResponse> => {
    const count = await increaseCounter("public");

    return {
        greeting_counter: count,
    };
};
