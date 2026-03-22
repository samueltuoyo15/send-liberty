import axios, { AxiosError } from "axios";
import { SendLibertyError } from "./error";

const FRONTEND_URL = "https://send-liberty.vercel.app";

type RequestOptions = {
    method: string;
    path: string;
    apiKey: string;
    baseUrl?: string;
    body?: unknown;
};

let cachedBackendUrl: string | null = null;

async function getBackendUrl(): Promise<string> {
    if (cachedBackendUrl) {
        return cachedBackendUrl;
    }

    try {
        const response = await axios.get(`${FRONTEND_URL}/api/get-server-url`);
        const domain = response.data.domain;
        
        if (!domain || typeof domain !== 'string') {
            throw new SendLibertyError("Invalid backend URL received from frontend", 500);
        }
        
export const request = async <T>(opts: RequestOptions): Promise<T> => {
    let serverUrl = opts.baseUrl;

    if (!serverUrl) {
        serverUrl = await getBackendUrl();
    }   throw new SendLibertyError("Unexpected error while fetching backend URL", 500);
    }
}

export const request = async <T>(opts: RequestOptions): Promise<T> => {
    let serverUrl = opts.baseUrl;

      if (!serverUrl) {
        serverUrl = await getBackendUrl();
    }

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
