# Quick Start with Docker

## Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed
- Docker running in the background

## Start Everything (Backend + Database)
```bash
# From project root
docker-compose up -d
```

**What this does:**
- ✅ Starts MySQL database on port 3306
- ✅ Starts Spring Boot backend on port 8080
- ✅ Creates persistent volumes for data
- ✅ Sets up networking between services

## Check Status
```bash
# See running containers
docker-compose ps

# View backend logs
docker-compose logs -f backend

# View database logs
docker-compose logs -f mysql
```

## Access Services
- **Backend API**: http://localhost:8080
- **MySQL**: localhost:3306 (root/root)

## Update Configuration
1. Edit `docker-compose.yml`
2. Update environment variables:
   - `CORS_ALLOWED_ORIGINS`
   - `EMAIL_USERNAME` and `EMAIL_PASSWORD`
   - `JWT_SECRET` (change for production!)

## Restart After Changes
```bash
# Rebuild and restart
docker-compose up -d --build

# Or restart just backend
docker-compose restart backend
```

## Stop Services
```bash
# Stop containers (keeps data)
docker-compose down

# Stop and remove all data
docker-compose down -v
```

## Troubleshooting

### Port Already in Use
```bash
# Find what's using port 8080
netstat -ano | findstr :8080

# Kill the process (Windows)
taskkill /PID <process-id> /F
```

### Database Connection Error
```bash
# Wait for MySQL to be ready
docker-compose logs -f mysql

# Look for: "ready for connections"
```

### View Backend Errors
```bash
docker-compose logs backend --tail=100
```

## Production Deployment

### Option 1: Docker Hub + VPS
```bash
# Build and push
cd backend
docker build -t yourusername/job-portal-backend .
docker push yourusername/job-portal-backend

# Deploy on server
docker pull yourusername/job-portal-backend
docker run -d -p 8080:8080 \
  -e CORS_ALLOWED_ORIGINS=https://yourapp.com \
  yourusername/job-portal-backend
```

### Option 2: Render/Railway
- Both platforms auto-detect Dockerfile
- Just connect GitHub repo and deploy

## Full Documentation
See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions.
