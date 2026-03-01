import mongoose, { Schema, Document } from "mongoose";
 
// TypeScript interface representing a Video document
export interface IVideo extends Document {
    title: string;
    description: string;
    releaseYear: number;
    durationMinutes: number;
    genres: string[];
    createdAt: Date;
    migratedAt: Date;
    sourceUpdatedAt?: Date;
}

// Canonical Mongo document model for migrated video metadata.
const VideoSchema: Schema = new Schema<IVideo>({
    title: { type: String, required: true },
    genres: { type: [String], required: true },
    durationMinutes: { type: Number, required: true },
    description: { type: String, required: true},
    releaseYear: { type: Number, required: true},
    createdAt: { type: Date, required: true},
    sourceUpdatedAt: { type: Date, required: false },
    migratedAt: { type: Date, required: true }
});

// Index based on unique components from legacy db.
VideoSchema.index({ title: 1, releaseYear: 1 }, { unique: true });

// Model binding schema to the "Video" collection
export const Video = mongoose.model<IVideo>("Video", VideoSchema);
