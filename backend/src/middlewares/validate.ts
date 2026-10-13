import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const validate = 
    <T extends z.ZodType>(schema: T) => (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            res.status(401).json({
            message: "Invalid input",
            errors: z.flattenError(result.error).fieldErrors,
        });
        return;
    }
    req.body = result.data;
    next();
};