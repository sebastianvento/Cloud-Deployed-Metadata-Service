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
        const filters = { ...parameters.filters };

        if (Object.prototype.hasOwnProperty.call(filters, "genres")) {
            filters.genres = { $in: [filters.genres] };
        }

        if (Object.prototype.hasOwnProperty.call(filters, "durationMin")) {
            if (Object.prototype.hasOwnProperty.call(filters, "durationMax")) {
                filters.durationMinutes = { $lte: filters.durationMax, $gte: filters.durationMin };
                delete filters.durationMin;
                delete filters.durationMax;
            }
            else {
                filters.durationMinutes = { $gte: filters.durationMin };
                delete filters.durationMin;
            }
        }
        else if (Object.prototype.hasOwnProperty.call(filters, "durationMax")) {
            filters.durationMinutes = { $lte: filters.durationMax };
            delete filters.durationMax;
        }

        if (Object.prototype.hasOwnProperty.call(filters, "titleSearch")) {
            filters.title = { $regex: filters.titleSearch, $options: "i" };
            delete filters.titleSearch;
        }

        const skipped = (page - 1) * limit;

        const total = await Video.countDocuments();

        const direction = order === "asc" ? 1 : -1;

        const data = await Video.find(filters)
        .sort({ [sortBy]: direction })
        .skip(skipped)
        .limit(limit);
 
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