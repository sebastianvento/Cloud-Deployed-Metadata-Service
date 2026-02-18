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
      const videos = await videoService.findAll(req.query as any);
      res.status(200).json(videos);
    } catch (error) {
      next(error);
    }
  }
}