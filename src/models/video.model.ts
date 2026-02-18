import mongoose, { Schema, Document } from "mongoose";

// TypeScript interface representing a Video document
export interface IVideo extends Document {
  title: string;
  genre: string;
  tags: string[];
  duration: number; // in minutes
  rating: number;   // 0–10
  createdAt: Date;
}

// Mongoose schema defining structure and validation rules
const VideoSchema: Schema = new Schema<IVideo>({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  tags: { type: [String], default: [] },
  duration: { type: Number, required: true },
  rating: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Model binding schema to the "Video" collection
export const Video = mongoose.model<IVideo>("Video", VideoSchema);
