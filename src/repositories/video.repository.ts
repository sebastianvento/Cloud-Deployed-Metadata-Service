import { Video, IVideo} from "../models/video.model";
import { VideoQueryOptions, PaginatedVideos } from "../services/video.service";

export class VideoRepository {
    // Creates a new video
    async create(data: Partial<IVideo>): Promise<IVideo> {
        const video = new Video(data);
        return await video.save();
    }
  
    // Retrieve video entities
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

    // Retrieves video by id
    async findOne(id: string): Promise<IVideo | null> {
        return Video.findById(id);
    }
}