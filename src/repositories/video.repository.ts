import { Video, IVideo, VideoQueryOptions, PaginatedVideos } from "../models/video.model";

export class VideoRepository {

  async create(data: Partial<IVideo>): Promise<IVideo> {
    const video = new Video(data);
    return await video.save();
  }

  async findAll(parameters: Partial<VideoQueryOptions>): Promise<PaginatedVideos> {
    const page = parameters.page ?? 1;
    const limit = parameters.limit ?? 10;
    const sortBy = parameters.sortBy ?? "createdAt";
    const order = parameters.order ?? "desc";

    const skipped = (page - 1) * limit;

    const total = await Video.countDocuments();

    const data = await Video.find()
      .skip(skipped)
      .limit(limit)
      .sort({ [sortBy]: order });

    const dataset: PaginatedVideos = {
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    };

    return dataset;
  }

  async findOne(id: string): Promise<IVideo | null> {
    return Video.findById(id);
  }
}