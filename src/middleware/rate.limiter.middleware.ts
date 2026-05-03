import { Request, Response, NextFunction } from "express";

export function rateLimiter(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const raw = req.headers["x-forwarded-for"];
    const ip = typeof raw === "string" ? raw : req.ip!;
    if (rateMap.has(ip)) {
        let current = rateMap.get(ip);
        let currentTime = Date.now();
        let calc = 60;
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
        rateMap.set(ip, current);
        next();
    }
}

let rateMap: Map<string, number[]> = new Map();