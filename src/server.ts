import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";

// Load environment variables from .env file
dotenv.config();

// Resolve runtime configuration
const PORT = Number(process.env.PORT) || 3000;
const MONGO_URI = process.env.MONGO_URI || "";

// Initializes database connection and starts HTTP server
async function startServer() {
  try {
    // Ensure required database configuration is provided
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables.");
    }

    // Establish MongoDB connection
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Start Express application
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    // Fail fast on startup errors
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Application entry point
startServer();
