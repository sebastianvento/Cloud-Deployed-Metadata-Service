import { Request, Response, NextFunction } from "express";
import { VideoService } from "../services/video.service";

const videoService = new VideoService();

export class VideoController {

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const video = await videoService.create(req.body);
      res.status(201).json(video);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let page = 1;
      let limit = 10;
      let sortBy = "createdAt";
      let order: "asc" | "desc" = "desc";

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
      const { id } = req.params;

      if (typeof id !== "string") {
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
}