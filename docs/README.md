# FlowTask (SNEC Task Management System) Documentation Suite

Welcome to the comprehensive technical documentation for the **SNEC Task Management System**.

## 📑 Documentation Index

- **[System Architecture](architecture/ARCHITECTURE.md)**: High-level diagrams, technical stack, modular breakdown, and security workflow.
- **[Database & ER Diagrams](database/ER_DIAGRAM.md)**: Entity-Relationship diagram, Prisma schema definitions, enums, and foreign key cascades.
- **[API Reference](api/API_DOCUMENTATION.md)**: REST endpoints for Authentication, Organizations, Projects, Tasks, Comments, and Attachments.
- **[Postman Collection](api/postman_collection.json)**: Ready-to-import Postman v2.1 collection with preset variables and authorization headers.
- **[Docker Deployment Guide](docker/DOCKER_GUIDE.md)**: Docker Compose orchestration, multi-stage Dockerfiles, and production container guidelines.

---

## 🚀 Quick Repository Structure

```
SNEC Task Management System/
├── backend/                  # NestJS TypeScript REST API
│   ├── prisma/               # Prisma schema & migrations
│   ├── src/                  # Modules (Auth, Orgs, Projects, Tasks, etc.)
│   ├── Dockerfile            # Multi-stage production Dockerfile
│   └── .env.example          # Sample environment variables
├── frontend/                 # Next.js 16 (React 19, Turbopack, TailwindCSS)
│   ├── src/                  # App Router, UI Components, State Store
│   ├── Dockerfile            # Optimized Next.js standalone runner
│   └── .env.example          # Sample environment variables
├── docs/                     # Technical specifications & diagrams
│   ├── architecture/         # System design & diagrams
│   ├── database/             # ER diagrams & schema dictionary
│   ├── api/                  # API docs & Postman collection
│   └── docker/               # Docker configuration guides
├── docker-compose.yml        # Full-stack Docker orchestration
└── README.md                 # Primary root setup and execution guide
```
