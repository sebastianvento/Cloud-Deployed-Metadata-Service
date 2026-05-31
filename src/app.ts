import express from "express";
import videoRoutes from "./routes/video.routes";
import { errorHandler } from "./middleware/error.middleware";
import { rateLimiter } from "./middleware/rate.limiter.middleware";

const app = express();

// Parse incoming JSON request bodies.
app.use(express.json());

// Health check endpoint for monitoring and container orchestration.
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
});

// Apply rate limiter to video endpoints.
app.use("/videos", rateLimiter);

// Register video-related routes.
app.use("/videos", videoRoutes);


// Centralized error handling middleware.
app.use(errorHandler);

export default app;