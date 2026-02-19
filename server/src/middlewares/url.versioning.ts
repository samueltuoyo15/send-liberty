import type { Request, Response, NextFunction } from "express"

const urlVersioning = (version: string) => (req: Request, res: Response, next: NextFunction) => {
    if (req.url.startsWith(`/api/${version}`)) {
        next()
    } else {
        res.status(404).json({
            success: false,
            error: "API url version not supported"
        })
    }
}

export default urlVersioning