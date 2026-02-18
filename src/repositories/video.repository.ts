import { Video, IVideo } from "../models/video.model";

export class VideoRepository {
  async create(data: Partial<IVideo>): Promise<IVideo> {
    const video = new Video(data); 
    return await video.save();
  }

  async findAll(filters: Partial<IVideo> = {}): Promise<IVideo[]> {
    return Video.find(filters as any);
  }
}