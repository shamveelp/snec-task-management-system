# Docker & Containerization Deployment Guide

## 1. Prerequisites
- [Docker](https://docs.docker.com/get-docker/) installed (version 24.0+)
- [Docker Compose](https://docs.docker.com/compose/) (version 2.20+)

---

## 2. Quick Start with Docker Compose

```bash
# 1. Clone & navigate to root directory
cd "SNEC Task Management System"

# 2. Copy the sample environment file
cp .env.example .env

# 3. (Optional) Customize your credentials in .env

# 4. Build and start all services in detached mode
docker-compose up --build -d

# 5. View container logs
docker-compose logs -f
```

---

## 3. Services Architecture in Docker

| Container Name | Service | Port Mapping | Description |
|---|---|---|---|
| `snec-postgres` | PostgreSQL 16 | `5432:5432` | Relational database with persistent volume |
| `snec-backend` | NestJS API | `5000:5000` | Core REST API with Prisma client |
| `snec-frontend` | Next.js Frontend | `3000:3000` | SSR / Client Next.js web application |

---

## 4. Multi-Stage Build Strategy

### 4.1 Backend (`backend/Dockerfile`)
- **Stage 1 (`builder`)**: Installs full `devDependencies`, compiles TypeScript, generates Prisma client.
- **Stage 2 (`runner`)**: Alpine-based minimal image running only production dependencies and compiled `/dist`.

### 4.2 Frontend (`frontend/Dockerfile`)
- **Stage 1 (`deps`)**: Caches Node modules.
- **Stage 2 (`builder`)**: Compiles Next.js standalone output with production telemetry disabled.
- **Stage 3 (`runner`)**: Non-root `nextjs` user serving optimized static assets and server build.

---

## 5. Useful Docker Commands

```bash
# Stop all containers
docker-compose down

# Stop and remove persistent database volume (Hard Reset)
docker-compose down -v

# Run database migrations inside running backend container
docker-compose exec backend npx prisma migrate deploy

# Seed database inside backend container
docker-compose exec backend npm run seed
```
