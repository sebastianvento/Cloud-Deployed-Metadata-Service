import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { Video } from "../models/video.model";

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

// ETL-style import script: reads JSON data and upserts into MongoDB
async function run() {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI not defined");
  }

  // Establish database connection
  await mongoose.connect(MONGO_URI);

  // Resolve data file path relative to compiled output
  const filePath = path.resolve(__dirname, "../../data/videos.json");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const videos = JSON.parse(fileContent);

  console.log(`Importing ${videos.length} videos...`);

  for (const video of videos) {
    // Idempotent upsert based on unique title
    await Video.updateOne(
      { title: video.title },
      { $set: video },
      { upsert: true }
    );

    console.log(`Processed: ${video.title}`);
  }

  console.log("Import completed");

  // Clean shutdown after import
  await mongoose.disconnect();
  process.exit(0);
}

// Fail fast on unexpected errors
run().catch((error) => {
  console.error(error);
  process.exit(1);
});