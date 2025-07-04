# Multi-stage build for both frontend and backend
FROM node:20 AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM python:3.12-slim AS backend-builder
WORKDIR /app/backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .

# Final image
FROM node:20-slim
WORKDIR /app

# Install Python and dependencies
RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*

# Copy frontend build
COPY --from=frontend-builder /app/.next /app/.next
COPY --from=frontend-builder /app/public /app/public
COPY --from=frontend-builder /app/package*.json /app/
COPY --from=frontend-builder /app/next.config.mjs /app/

# Copy backend
COPY --from=backend-builder /app/backend /app/backend
COPY start.sh /app/

# Install dependencies
RUN npm install --production
RUN pip3 install --no-cache-dir -r /app/backend/requirements.txt

# Make start script executable
RUN chmod +x /app/start.sh

EXPOSE 12000 12001
CMD ["/app/start.sh"]
