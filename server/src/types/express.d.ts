declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string | null;
                display_name: string | null;
            };
        }
    }
}

export {};
