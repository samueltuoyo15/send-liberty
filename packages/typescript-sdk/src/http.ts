import axios, { AxiosError } from "axios";
import { SendLibertyError } from "./error";

const FRONTEND_URL = "http://localhost:3000";

let cachedServerUrl: string = "";

const getServerUrl = async (): Promise<string> => {
    if (cachedServerUrl) {
        return cachedServerUrl;
    }

    try {
        const response = await axios.get(`${FRONTEND_URL}/api/get-server-url`);
        cachedServerUrl = response.data.domain || "http://localhost:8080";
        return cachedServerUrl;
    } catch {
        return "http://localhost:8080";
    }
};

type RequestOptions = {
    method: string;
    path: string;
    apiKey: string;
    body?: unknown;
};

export const request = async <T>(opts: RequestOptions): Promise<T> => {
    const serverUrl = await getServerUrl();
    
    try {
        const response = await axios({
            method: opts.method,
            url: `${serverUrl}${opts.path}`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${opts.apiKey}`,
            },
            data: opts.body,
        });

        return response.data as T;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<any>;
            throw new SendLibertyError(
                axiosError.response?.data?.message ?? "Request failed",
                axiosError.response?.status ?? 500,
                axiosError.response?.data?.code
            );
        }
        throw new SendLibertyError("Unexpected error occurred", 500);
    }
};
