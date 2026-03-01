import { fetchAllLegacyVideos } from "../db/legacyVideo.repository"
import { transformLegacyRows } from "./transformLegacyVideos";
import { Video } from "../models/video.model";

// Orchestrates SQL → Mongo migration using idempotent upsert strategy.
export async function runMigration() {
    console.log("Starting migration...");
    const start = Date.now();
    const rows = await fetchAllLegacyVideos();
    console.log(`Rows fetched: ${rows.length}`);
    const transformed = transformLegacyRows(rows);
    console.log(`Unique videos after transform: ${transformed.length}`);
    
    let inserted = 0;
    let updated = 0;

    for (const video of transformed) {
        // Idempotent upsert: update content, set migratedAt only on first insert.
        const result = await Video.updateOne(
        {
            title: video.title, releaseYear: video.releaseYear
        },
        {
            $set: {
            title: video.title,
            genres: video.genres,
            durationMinutes: video.durationMinutes,
            description: video.description,
            releaseYear: video.releaseYear,
            createdAt: video.createdAt,
            },
            $setOnInsert: { 
            migratedAt: video.migratedAt
            }
        },
        { upsert: true }
        );
        if (result.upsertedCount > 0) {
            inserted = inserted + result.upsertedCount;
        }
        if (result.modifiedCount > 0) {
            updated = updated + result.modifiedCount;
        }
    }
    console.log(`Inserted: ${inserted}`);
    console.log(`Updated: ${updated}`);
    const duration = Date.now() - start;
    console.log(`Duration: ${duration} ms`);
    console.log("Migration completed successfully.");
}
