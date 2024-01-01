import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { CounterApiResponse } from "../../shared/counterTypes";
import { getCounter, increaseCounter } from "./counter-db-service";

export const myCounterHandler = async (
    event: APIGatewayProxyEvent,
    context: Context
): Promise<string> => {
    console.log("myCounterHandler", event.httpMethod, event.path);
    console.log(context);

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
