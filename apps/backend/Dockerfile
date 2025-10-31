# Dockerfile for Backend (NestJS)
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY apps/backend/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY apps/backend/ ./

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY apps/backend/package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3001

# Start application
CMD ["npm", "run", "start:prod"]
