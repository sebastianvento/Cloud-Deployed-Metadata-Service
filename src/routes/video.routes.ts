import { Router } from "express";
import { VideoController } from "../controllers/video.controller";

const router = Router();

// Controller instance handling video-related business logic
const controller = new VideoController();

// Create a new video resource
router.post("/", (req, res, next) =>
  controller.create(req, res, next)
);

// Retrieve video resources (optionally filtered via query parameters)
router.get("/", (req, res, next) =>
  controller.findAll(req, res, next)
);

export default router;