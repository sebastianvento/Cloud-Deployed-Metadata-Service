
// Transforms relational legacy rows into canonical Mongo document shape.
// Handles grouping, normalization, deduplication and migration metadata.
export function transformLegacyRows(rows: any[]) {
    // Single migration timestamp to ensure consistent migratedAt across run.
    const migrationTimestamp = new Date();
    let rowsCleanedGenres = new Map<number, any>();

    for (const v of rows) {
        let normalizedGenre = v.name.trim().toLowerCase();

        if (rowsCleanedGenres.has(v.id)) {
            let videoCopy = rowsCleanedGenres.get(v.id);
            if (!videoCopy.genres.includes(normalizedGenre)) {
                videoCopy.genres.push(normalizedGenre);
            }
        }
        else {
            let video: any = {
            title: "",
            description: "",
            releaseYear: 0,
            durationMinutes: 0,
            genres: [],
            createdAt: new Date(v.created_at),
            migratedAt: migrationTimestamp
            };
            video.title = v.title;
            video.description = v.description;
            video.releaseYear = v.release_year;
            video.durationMinutes = v.duration_minutes;
            video.genres = [normalizedGenre];
            rowsCleanedGenres.set(v.id, video);
        }
    }

    return Array.from(rowsCleanedGenres.values());
}
