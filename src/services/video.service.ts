import { VideoRepository } from "../repositories/video.repository";
import { IVideo, VideoQueryOptions, PaginatedVideos } from "../models/video.model";

export class VideoService {

  // Repository dependency responsible for data access
  private readonly videoRepository: VideoRepository;

  constructor() {
    this.videoRepository = new VideoRepository();
  }

  // Coordinates creation of a new video entity
  async create(data: Partial<IVideo>): Promise<IVideo> {
    return this.videoRepository.create(data);
  }

  // Retrieves video entities
  async findAll(parameters: Partial<VideoQueryOptions>): Promise<PaginatedVideos> {
    return this.videoRepository.findAll(parameters);
  }

  async findOne (id: string): Promise<IVideo|null> {
    return this.videoRepository.findOne(id);
  }
}
