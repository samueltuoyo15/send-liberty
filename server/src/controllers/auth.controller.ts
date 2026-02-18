import type { NextFunction, Request, Response } from "express";
import { register, login } from "../services/auth.service";
import { ACCESS_TOKEN_MAX_AGE, REFRESH_TOKEN_MAX_AGE } from "../common/utils/generate.token";

export const singup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, display_name } = req.body;
        await register(email, password, display_name)

        res.status(201).json({ success: true, message: "User registered successfully" })
    } catch (error) {
        next(error)
    }
}

export const signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const { access_token, refresh_token } = await login(email, password)

        res.cookie("access_token", access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: ACCESS_TOKEN_MAX_AGE,
            sameSite: "strict"
        })

        res.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: REFRESH_TOKEN_MAX_AGE,
            sameSite: "strict"
        })

        res.status(200).json({ success: true, message: "User loggedin successful!" })
    } catch (error) {
        next(error)
    }
}