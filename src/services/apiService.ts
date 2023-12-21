import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "/api";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

const getCounter = async () => {
    try {
        const response = await apiClient.get("/counter");
        const data = response.data;
        return data.counter || 0;
    } catch (error) {
        // Handle or throw error
        console.error("Error fetching counter data:", error);
        throw error;
    }
};

const incrementCounter = async () => {
    try {
        const response = await apiClient.post("/counter");
        return response.data;
    } catch (error) {
        // Handle or throw error
        console.error("Error incrementing counter:", error);
        throw error;
    }
};

export { getCounter, incrementCounter };
