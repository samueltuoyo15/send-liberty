export class SendLibertyError extends Error {
    readonly status: number;
    readonly code?: string;

    constructor(message: string, status: number, code?: string) {
        super(message);
        this.name = "SendLibertyError";
        this.status = status;
        this.code = code;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
