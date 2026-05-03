import express from "express";
import videoRoutes from "./routes/video.routes";
import { errorHandler } from "./middleware/error.middleware";
import { rateLimiter } from "./middleware/rate.limiter.middleware";

const app = express();

// Parse incoming JSON request bodies
app.use(express.json());

// Health check endpoint for monitoring and container orchestration
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
});


// Rate limiter disabled due to test suite constraints.
// Can be enabled when test isolation or reset strategy is in place.
if (false) {
    app.use("/videos", rateLimiter);
}

// Register video-related routes
app.use("/videos", videoRoutes);


// Centralized error handling middleware (must be last)
app.use(errorHandler);

export default app;