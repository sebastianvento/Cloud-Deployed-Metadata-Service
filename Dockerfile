# Use official Node image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy source code
COPY . .

# Install all dependencies (including dev for build)
RUN npm install

# Build TypeScript
RUN npm run build

# Remove dev dependencies for smaller production image
RUN npm prune --omit=dev

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/server.js"]