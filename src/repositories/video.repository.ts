import { Video, IVideo, VideoQueryOptions, PaginatedVideos } from "../models/video.model";

export class VideoRepository {

  // Persists a new video document to MongoDB
  async create(data: Partial<IVideo>): Promise<IVideo> {
    const video = new Video(data);
    return await video.save();
  }

  // Retrieves video documents based on query options.
  async findAll(parameters: Partial<VideoQueryOptions>): Promise<PaginatedVideos> {
    let skipped = (parameters.page- 1) * parameters.limit;
    let dataset = {
      data: [],
      page: 0,
      limit: 0,
      total: 0,
      totalPages: 0
    };
      dataset.data = await Video.find().skip(skipped).limit(parameters.limit).sort({[parameters.sortBy]: parameters.order});
      dataset.page = parameters.page;
      dataset.limit = parameters.limit;
      dataset.total = await Video.countDocuments();
      dataset.totalPages = await Video.countDocuments();

    return dataset;
  }

  async findOne(id: string): Promise<IVideo|null> {
    return Video.findById(id);
  }
}