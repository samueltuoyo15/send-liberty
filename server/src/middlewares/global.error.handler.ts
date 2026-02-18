import type { ErrorRequestHandler } from "express";

export class AppError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;

        Object.setPrototypeOf(this, new.target.prototype);
    }
}


const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    console.log(err.stack);

    if (err instanceof AppError) {
        return res.status(err.status).json({ message: err.message });
    }

    res.status(500).json({ message: "Internal Server Error" });
};

export default globalErrorHandler;
