import { Request, Response, NextFunction } from "express";
import { VideoService } from "../services/video.service";

// Service instance encapsulating business logic
const videoService = new VideoService();

export class VideoController {

  // Handles creation of a new video resource
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const video = await videoService.create(req.body);
      res.status(201).json(video);
    } catch (error) {
      // Delegate errors to centralized error middleware
      next(error);
    }
  }

  // Handles retrieval of video resources (supports query-based filtering)
  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Defaults
      let page = 1;
      let limit = 10;
      let sortBy = "createdAt";
      let order: "asc" | "desc" = "desc";

      // page
      if (typeof req.query.page === "string") {
        const parsed = Number(req.query.page);
      if (!Number.isNaN(parsed) && parsed > 0) {
        page = parsed;
      }
      }

    // limit
      if (typeof req.query.limit === "string") {
        const parsed = Number(req.query.limit);
      if (!Number.isNaN(parsed) && parsed > 0 && parsed <= 100) {
        limit = parsed;
      }
      }

      // sortBy
      if (typeof req.query.sortBy === "string") {
        sortBy = req.query.sortBy;
      }

      // order
      if (req.query.order === "asc" || req.query.order === "desc") {
        order = req.query.order;
      }

      const videos = await videoService.findAll({
        page,
        limit,
        sortBy,
        order
      });

    res.status(200).json(videos);

    } catch (error) {
      next(error);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const video = await videoService.findOne(req.params.id);
      if (video === null) {
        res.status(404).json({ message: "Video not found" });
        return;
      }
      res.status(200).json(video);
    }
    catch(error) {
      next(error);
    }
  }
}