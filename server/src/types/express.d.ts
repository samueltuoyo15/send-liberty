declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                display_name: string | null;
            };
        }
    }
}

export {};
