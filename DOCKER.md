# 🐳 Docker Setup for RoamIQ

This guide helps you run RoamIQ using Docker and Docker Compose.

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (version 20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0+)
- [Docker Hub account](https://hub.docker.com/) (optional, for image storage)

---

## Quick Start

### 1. Clone and Configure

```bash
git clone https://github.com/pranavgawasproject/Nomads_Travel.git
cd Nomads_Travel

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 2. Edit Environment Variables

Edit `backend/.env`:

```env
PORT=3000
NODE_ENV=development
MONGO_URL=mongodb://mongo:27017/roamiq
JWT_ACCESS_SECRET=your-secure-access-secret
JWT_REFRESH_SECRET=your-secure-refresh-secret
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=us-east-1
AWS_BUCKET_NAME=roamiq-uploads
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CLIENT_URL=http://localhost:5173
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

---

## Running with Docker Compose

### Option A: Development Mode (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

This will start:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **MongoDB**: localhost:27017

### Option B: Production Mode

```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## Manual Docker Commands

If you prefer running containers individually:

### Backend

```bash
# Build image
cd backend
docker build -t roamiq-backend .

# Run container
docker run -d \
  --name roamiq-backend \
  -p 3000:3000 \
  --env-file backend/.env \
  roamiq-backend
```

### Frontend

```bash
# Build image
cd frontend
docker build -t roamiq-frontend .

# Run container
docker run -d \
  --name roamiq-frontend \
  -p 5173:80 \
  roamiq-frontend
```

---

## Docker Compose File

Create `docker-compose.yml` in the project root:

```yaml
version: '3.8'

services:
  # MongoDB Database
  mongo:
    image: mongo:7
    container_name: roamiq-mongo
    restart: unless-stopped
    environment:
      MONGO_INITDB_DATABASE: roamiq
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"
    networks:
      - roamiq-network

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: roamiq-backend
    restart: unless-stopped
    env_file:
      - ./backend/.env
    ports:
      - "3000:3000"
    depends_on:
      - mongo
    volumes:
      - ./backend:/app
      - /app/node_modules
    networks:
      - roamiq-network

  # Frontend (NGINX)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: roamiq-frontend
    restart: unless-stopped
    ports:
      - "5173:80"
    depends_on:
      - backend
    networks:
      - roamiq-network

volumes:
  mongo_data:

networks:
  roamiq-network:
    driver: bridge
```

---

## Backend Dockerfile

Create `backend/Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/auth/health || exit 1

# Start server
CMD ["npm", "start"]
```

---

## Frontend Dockerfile

Create `frontend/Dockerfile`:

```dockerfile
# Build stage
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ARG VITE_API_URL
ARG VITE_GOOGLE_MAPS_API_KEY

RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

---

## NGINX Configuration

Create `frontend/nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # React Router (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend
    location /api {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## Useful Commands

### Check Container Status

```bash
docker-compose ps
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Rebuild After Changes

```bash
docker-compose up -d --build
```

### Clean Up

```bash
# Stop and remove containers
docker-compose down

# Remove volumes (WARNING: deletes database data)
docker-compose down -v

# Remove images
docker system prune -a
```

### Access MongoDB

```bash
docker exec -it roamiq-mongo mongosh
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :3000
lsof -i :5173

# Kill process
kill -9 <PID>
```

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
docker-compose logs mongo

# Restart MongoDB
docker-compose restart mongo
```

### Frontend Can't Connect to Backend

```bash
# Check backend is running
docker-compose logs backend

# Verify network
docker network inspect roamiq-network
```

---

## Deployment

### Deploy to AWS ECS

1. Push images to ECR:
```bash
aws ecr get-login-password | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com
docker tag roamiq-backend:latest <account>.dkr.ecr.<region>.amazonaws.com/roamiq-backend:latest
docker push <account>.dkr.ecr.<region>.amazonaws.com/roamiq-backend:latest
```

2. Update `docker-compose.prod.yml` with ECR images

3. Deploy using ECS CLI or CloudFormation

### Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
cd backend && railway up
cd frontend && railway up
```

### Deploy to Render

1. Connect GitHub repo to Render
2. Create Web Services for backend and frontend
3. Configure environment variables
4. Deploy!

---

## Environment Variables Reference

See [.env.example](backend/.env.example) for full reference.

---

<p align="center">
  <strong>Happy dockering! 🐳</strong>
</p>
