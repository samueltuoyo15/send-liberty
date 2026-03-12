import { SendLibertyError } from "./error";

type RequestOptions = {
    method: string;
    path: string;
    apiKey: string;
    baseUrl: string;
    body?: unknown;
};

export const request = async <T>(opts: RequestOptions): Promise<T> => {
    const url = `${opts.baseUrl}${opts.path}`;

    const res = await fetch(url, {
        method: opts.method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${opts.apiKey}`,
        },
        body: opts.body ? JSON.stringify(opts.body) : undefined,
    });

    let json: any;

    try {
        json = await res.json();
    } catch {
        throw new SendLibertyError(
            `Unexpected response from server (status ${res.status})`,
            res.status
        );
    }

    if (!res.ok) {
        throw new SendLibertyError(
            json?.message ?? "Request failed",
            res.status,
            json?.code
        );
    }

    return json as T;
};
