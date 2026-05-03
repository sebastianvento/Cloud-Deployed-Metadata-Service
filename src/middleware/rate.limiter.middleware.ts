import { Request, Response, NextFunction } from "express";

// Rate limiter disabled for now

export function rateLimiter(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (rateMap.has(req.ip!)) {
        let current = rateMap.get(req.ip!)!;
        let currentTime = Date.now();
        let calc = 5;
        let diffInMillis = 60000;

        for (let index = current.length - 1; index >= 0; index--) {
            calc--;
            if (calc == 0) {
                diffInMillis = currentTime-current[index];
            }
            if (currentTime-current[index] > 60000) {
                current.splice(index, 1);
            }
        }
        if (diffInMillis < 60000) {
            return res.status(429).json({
                message: "Too many requests"
            });
        }
        else {
            current.push(currentTime); 
            next();
        }
    }
    else {
        let current = [Date.now()];
        rateMap.set(req.ip!, current);
        next();
    }
}

let rateMap: Map<string, number[]> = new Map();