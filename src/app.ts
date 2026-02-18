import express from "express";
import videoRoutes from "./routes/video.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

// Parse incoming JSON request bodies
app.use(express.json());

// Health check endpoint for monitoring and container orchestration
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Register video-related routes
app.use("/videos", videoRoutes);

// Centralized error handling middleware (must be last)
app.use(errorHandler);

export default app;