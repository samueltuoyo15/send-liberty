import type { NextFunction, Request, Response } from "express";
import { getProfile, updateProfile, switchMode } from "../services/user.service";

export const getMeHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const profile = await getProfile(userId);
        res.status(200).json({ success: true, data: profile });
    } catch (error) {
        next(error);
    }
};

export const updateMeHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const { display_name, avatar, default_reply_to } = req.body;
        const updated = await updateProfile(userId, { display_name, avatar, default_reply_to });
        res.status(200).json({ success: true, message: "Profile updated", data: updated });
    } catch (error) {
        next(error);
    }
};

export const switchModeHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const { mode } = req.body;
        const updated = await switchMode(userId, mode);
        res.status(200).json({ success: true, message: `Switched to ${updated.mode}`, data: updated });
    } catch (error) {
        next(error);
    }
};
