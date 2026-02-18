import { VideoRepository } from "../repositories/video.repository";
import { IVideo } from "../models/video.model";

export class VideoService {
  private readonly videoRepository: VideoRepository;

  constructor() {
    this.videoRepository = new VideoRepository();
  }

  async create(data: Partial<IVideo>): Promise<IVideo> {
    return this.videoRepository.create(data);
  }

  async findAll(filters: Partial<IVideo> = {}): Promise<IVideo[]> {
    return this.videoRepository.findAll(filters);
  }
}