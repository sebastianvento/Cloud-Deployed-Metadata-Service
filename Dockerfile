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

# Build TypeScript
RUN npm install -g typescript
RUN tsc

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/server.js"]