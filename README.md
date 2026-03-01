# Cloud Deployed Metadata Service – Metadata Service with SQL → MongoDB Migration

Backend metadata service built with TypeScript, Express, PostgreSQL, and MongoDB Atlas.  
Implements a layered architecture and an idempotent ETL migration pipeline from a relational legacy schema to a document-based model.

---

## Overview

This project simulates migration from an on-prem relational metadata system to a cloud-based MongoDB-backed service.

The system consists of:

- PostgreSQL (legacy relational source)
- ETL migration layer (extraction, transformation, load)
- MongoDB Atlas (target document database)
- REST API for accessing migrated metadata
- Dockerized runtime

The focus is on:

- Relational-to-document data modeling
- Deterministic transformation logic
- Idempotent migration design
- Clear architectural separation

---

## Migration Design

The PostgreSQL schema models a normalized metadata structure:

- `videos`
- `genres`
- `video_genres` (many-to-many relation)

The migration pipeline:

1. Extracts relational rows using SQL JOINs.
2. Groups rows by video.
3. Normalizes genre values (trim, lowercase).
4. Deduplicates logical duplicates.
5. Preserves `created_at` from source.
6. Adds migration metadata (`migratedAt`).
7. Performs idempotent upsert into MongoDB.

MongoDB enforces a compound unique index:

- `{ title, releaseYear }`

Upserts use:

- `$set` for content updates
- `$setOnInsert` for `migratedAt`

Running the migration multiple times does not create duplicates.

---

## Architecture

Layered architecture:

Route → Controller → Service → Repository → Database

- Routes define HTTP endpoints
- Controllers handle request/response flow
- Services coordinate business logic
- Repositories encapsulate database access
- Models define MongoDB schema (Mongoose)

The migration layer is isolated in:

src/etl/
transformLegacyVideos.ts
migrateLegacyVideos.ts


---

## Tech Stack

- TypeScript
- Node.js
- Express
- PostgreSQL
- MongoDB Atlas
- Mongoose
- Docker
- GitHub Actions (CI)

---

## Project Structure

src/
app.ts
server.ts
controllers/
services/
repositories/
models/
routes/
middleware/
database/
etl/
Dockerfile
docker-compose.yml

---

## Local Development

Install dependencies:

npm install

Start development server:

npm run dev

Build:

npm run build

---

## Database Setup (Legacy Simulation)

The relational schema is defined in:

src/database/schema.sql

It contains:

- Table definitions
- Seed data with intentionally inconsistent genre values

Apply the schema to PostgreSQL before running migration.

---

## Run Migration

Execute migration:

npm run migrate

The script outputs:

- Rows fetched
- Unique videos after transform
- Inserted count
- Updated count
- Execution duration

---

## Environment Variables

Create a `.env` file:

PORT=3000
MONGO_URI=your_mongodb_connection_string
PGUSER=...
PGPASSWORD=...
PGHOST=...
PGPORT=5432
PGDATABASE=...

---

## Docker

Build image:

docker build -t cloud-deployed-metadata-service .

Run container:

docker run -p 3000:3000 --env-file .env cloud-deployed-metadata-service

---

## Deployment

MongoDB is hosted on MongoDB Atlas.  
The service can be containerized and deployed to Google Cloud Run.

---

## Author

Sebastian Vento  
https://github.com/sebastianvento
