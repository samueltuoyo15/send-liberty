import axios, { AxiosError } from "axios";
import { SendLibertyError } from "./error";


type RequestOptions = {
    method: string;
    path: string;
    apiKey: string;
    baseUrl?: string;
    body?: unknown;
};

export const request = async <T>(opts: RequestOptions): Promise<T> => {
    const serverUrl = opts.baseUrl || DEFAULT_BASE_URL;

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
