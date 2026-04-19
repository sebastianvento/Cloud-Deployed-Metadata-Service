import { Request, Response, NextFunction } from "express";
import { VideoService } from "../services/video.service";
import { Types } from "mongoose";

// Initialize the business logic service
const videoService = new VideoService();

export class VideoController {
    // Handles the creation of a new video resource
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const duration = Number(req.body.durationMinutes);
            const year = Number(req.body.releaseYear);
             if (!Array.isArray(req.body.genres) || !Number.isFinite(duration) ||
                 !Number.isFinite(year)
            ) {
                res.status(400).json({ message: "Invalid parameter type"});
                return;
            }
            if (req.body.genres.length == 0 || req.body.durationMinutes <= 0 || 
                req.body.releaseYear <= 0
            ) {
                res.status(400).json({ message: "Invalid parameter" });
                return;
            }
            const video = await videoService.create(req.body);
            res.status(201).json(video);
        } catch (error) {
            next(error);
        }
   }

   // Retrieves a paginated list of video resources
    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let page = 1;
            let limit = 10;
            let sortBy = "createdAt";
            let order: "asc" | "desc" = "desc";
            let filters: Record<string, any> = {};

            if (typeof req.query.page === "string") {
                const parsed = Number(req.query.page);
                if (!Number.isNaN(parsed) && parsed > 0) {
                    page = parsed;
                }
            }

            if (typeof req.query.limit === "string") {
                const parsed = Number(req.query.limit);
                if (!Number.isNaN(parsed) && parsed > 0 && parsed <= 100) {
                   limit = parsed;
                }
            }

            if (typeof req.query.sortBy === "string") {
                sortBy = req.query.sortBy;
           }

            if (req.query.order === "asc" || req.query.order === "desc") {
                order = req.query.order;
            }

            if (typeof req.query.genres === "string") {
                filters.genres = req.query.genres;
            }

            if (typeof req.query.durationMin === "string") {
                const parsed = Number(req.query.durationMin);
                if (!Number.isNaN(parsed) && parsed > 0) {
                    filters.durationMin = parsed;
                }
            }

            if (typeof req.query.durationMax === "string") {
                const parsed = Number(req.query.durationMax);
                if (!Number.isNaN(parsed) && parsed > 0) {
                    filters.durationMax = parsed;
                }
            }

            if (typeof req.query.releaseYear === "string") {
                const parsed = Number(req.query.releaseYear);
                if (!Number.isNaN(parsed) && parsed > 0) {
                    filters.releaseYear = parsed;
                }
            }

            if (typeof req.query.titleSearch === "string") {
                filters.titleSearch = req.query.titleSearch;
            }

            const videos = await videoService.findAll({
                page,
                limit,
                sortBy,
                order,
                filters
            });

            res.status(200).json(videos);

      } catch (error) {
            next(error);
      }
    }
  
    // Retrieves a single video resource by its unique identifier
    async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;

            if (typeof id !== "string") {
                res.status(400).json({ message: "Invalid id parameter" });
            return;
            }
            if (id.length === 0) {
                res.status(400).json({ message: "Missing id parameter" });
            return;
            }
            if (!Types.ObjectId.isValid(id)) {
                res.status(400).json({ message: "Invalid id parameter" });
            return;
            }

            const video = await videoService.findOne(id);

            if (video === null) {
                res.status(404).json({ message: "Video not found" });
                return;
            }

            res.status(200).json(video);

        } catch (error) {
            next(error);
        }
    }

    // Retrieve counts of genres
    async genres(req: Request, res: Response, next: NextFunction): Promise<any[]> {
        try {
            const counts = await videoService.genres();

            res.status(200).json({ data: counts });

        } catch (error) {
            next(error);
        }
    }
}