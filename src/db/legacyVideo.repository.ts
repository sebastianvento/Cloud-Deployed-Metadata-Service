import pool from "./postgres";

// Extracts raw relational rows from legacy PostgreSQL schema.
export async function fetchAllLegacyVideos() {
    const text = 'SELECT videos.id, videos.title, videos.description, videos.release_year, videos.created_at, videos.duration_minutes, genres.name FROM videos INNER JOIN video_genres ON videos.id = video_genres.video_id INNER JOIN genres ON video_genres.genre_id = genres.id';
    const res = await pool.query(text);
    const rows = res.rows;
    return rows;
}