import { Request, Response, NextFunction } from "express";

// Centralized error-handling middleware
// Catches propagated errors and returns a generic 500 response
export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    // Log error for diagnostics (can be replaced with structured logging)
    console.error(err);

    res.status(500).json({
        message: "Internal server error"
    });
}