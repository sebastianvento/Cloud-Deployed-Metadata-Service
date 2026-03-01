import { VideoRepository } from "../repositories/video.repository";
import { IVideo } from "../models/video.model";

// Typescript interface representing pagination-related attributes
export interface PaginatedVideos {
    data: IVideo[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// TypeScript interface representing query options
export interface VideoQueryOptions {
    page: number;
    limit: number;
    sortBy: string;
    order: "asc" | "desc";
}

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

    // Retrieves video by id
    async findOne (id: string): Promise<IVideo|null> {
      return this.videoRepository.findOne(id);
    }
}
