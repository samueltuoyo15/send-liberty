import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("Jwt secret key is missing");

export const ACCESS_TOKEN_MAX_AGE = 1 * 24 * 60 * 60 * 1000;
export const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export const generateAccessToken = (id: string, email: string, display_name: string | null): string => {
    return jwt.sign({ id, email, display_name }, JWT_SECRET!, { expiresIn: "1d" });
};

export const generateRefreshToken = (id: string, email: string, display_name: string | null): string => {
    return jwt.sign({ id, email, display_name }, JWT_SECRET, { expiresIn: "7d" });
};

export const generateMailToken = (id: string, email: string, display_name: string | null): string => {
    return jwt.sign({ id, email, display_name }, JWT_SECRET, { expiresIn: "30m" });
};