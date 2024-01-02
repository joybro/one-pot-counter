import axios from "axios";
import { CounterApiResponse } from "../../shared/counterTypes";
import { ApiStack } from "../cdkExports";

const API_BASE_URL = process.env.REACT_APP_API_URL || ApiStack.ApiUrl + "api";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

const getPublicCounter = async () => {
    try {
        const response = await apiClient.get("/public-counter");
        const data: CounterApiResponse = response.data;
        return data.greeting_counter || 0;
    } catch (error) {
        // Handle or throw error
        console.error("Error fetching counter data:", error);
        throw error;
    }
};

const incrementPublicCounter = async () => {
    try {
        const response = await apiClient.post("/public-counter");
        const data: CounterApiResponse = response.data;
        return data.greeting_counter;
    } catch (error) {
        // Handle or throw error
        console.error("Error incrementing counter:", error);
        throw error;
    }
};

const getMyCounter = async (accessToken: string) => {
    try {
        const response = await apiClient.get("/my-counter", {
            headers: { Authorization: `${accessToken}` },
        });
        const data: CounterApiResponse = response.data;
        return data.greeting_counter || 0;
    } catch (error) {
        // Handle or throw error
        console.error("Error fetching counter data:", error);
        throw error;
    }
};

const incrementMyCounter = async (accessToken: string) => {
    try {
        const response = await apiClient.post("/my-counter", undefined, {
            headers: { Authorization: `${accessToken}` },
        });
        const data: CounterApiResponse = response.data;
        return data.greeting_counter;
    } catch (error) {
        // Handle or throw error
        console.error("Error incrementing counter:", error);
        throw error;
    }
};

export {
    getMyCounter,
    getPublicCounter,
    incrementMyCounter,
    incrementPublicCounter,
};
