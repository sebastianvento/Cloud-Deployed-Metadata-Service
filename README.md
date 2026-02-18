# Cloud-Deployed Metadata Service

Cloud-deployed REST API service built with TypeScript, Express, and MongoDB.  
Implements a layered architecture and JSON-based ETL ingestion, containerized with Docker and deployed to Google Cloud Run.

---

## Overview

This project demonstrates a backend metadata service designed with clear separation of concerns and production-oriented structure.

The service provides:

- RESTful API for managing video metadata
- MongoDB persistence (MongoDB Atlas)
- JSON-based data ingestion (ETL-style import script)
- Docker containerization
- Deployment to Google Cloud Run

The focus of the project is architectural clarity, maintainability, and deployment readiness.

---

## Architecture

The application follows a layered architecture:

Route → Controller → Service → Repository → MongoDB

- Routes define HTTP endpoints
- Controllers handle request/response lifecycle
- Services coordinate business logic
- Repositories encapsulate data access
- Models define MongoDB schema via Mongoose

---

## Tech Stack

- TypeScript
- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Docker
- Google Cloud Run

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
  scripts/
data/
Dockerfile

---

## Local Development

Install dependencies:

npm install

Build:

npm run build

Start:

node dist/server.js

Health check:

curl http://localhost:3000/health

---

## Environment Variables

Create a `.env` file:

PORT=3000
MONGO_URI=your_mongodb_connection_string

---

## Data Import (ETL Script)

To import sample data:

npm run build
node dist/scripts/importVideos.js

The script performs idempotent upsert operations based on video title.

---

## Docker

Build image:

docker build -t metadata-service .

Run container:

docker run -p 3000:3000 --env-file .env metadata-service

---

## Deployment

The service is containerized with Docker and deployed to Google Cloud Run.  
MongoDB is hosted on MongoDB Atlas.

---

## Author

Sebastian Vento  
https://github.com/sebastianvento