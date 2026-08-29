# FlowTask — SNEC Task Management System

A multi-tenant Enterprise Project & Task Management platform built with **NestJS 10**, **Next.js 16 (Turbopack, React 19)**, **Prisma ORM**, **PostgreSQL**, and **TailwindCSS**.

---

## 🌟 Key Features

- **Multi-Tenant Architecture**: Organization-scoped projects, teams, invitations, and workspace controls.
- **Dual-Tier Role-Based Access Control (RBAC)**:
  - **Organization Level**: `Organization Admin`, `Member`.
  - **Project Level**: `Project Manager`, `Team Lead`, `Developer`.
- **Interactive Kanban Board**: Drag-and-drop task progression (`TODO` → `IN_PROGRESS` → `IN_REVIEW` → `DONE`).
- **Rich Task Details Panel**:
  - Live priority & status manipulation.
  - Multi-user comment stream.
  - Cloudinary-backed file attachment upload & preview.
- **Organization & Team Management**:
  - Email OTP authentication for organization onboarding.
  - Member invitation flow.
- **Modern Responsive UI**: Dark/Light aesthetic, glassmorphism, Google Geist typography, accessible modal date pickers with calendar integration.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 16.3.2, React 19, TypeScript, TailwindCSS 4, Zustand, Axios, Lucide Icons, Framer Motion |
| **Backend** | NestJS 10, TypeScript, Prisma ORM (v7), Passport.js, JWT, Multer, Winston Logger, Bcrypt |
| **Database** | PostgreSQL (Neon serverless with connection pooling) |
| **Cloud Storage** | Cloudinary CDN for attachments |
| **Email Gateway** | Nodemailer SMTP (OTP & Invitations) |
| **DevOps & Containers** | Docker, Docker Compose, Multi-stage Alpine builds |

---

## 📁 Repository Structure

```
SNEC Task Management System/
├── backend/                   # NestJS REST API
│   ├── prisma/                # Schema, seed script & SQL migrations
│   ├── src/                   # NestJS modules & domain services
│   ├── Dockerfile             # Multi-stage production container
│   ├── .env.example           # Sample backend environment
│   └── package.json
├── frontend/                  # Next.js Web Application
│   ├── src/                   # App Router, UI components, Zustand stores
│   ├── Dockerfile             # Optimized standalone Next.js container
│   ├── .env.example           # Sample frontend environment
│   └── package.json
├── docs/                      # Full Project Documentation
│   ├── architecture/          # Architecture diagrams (Mermaid & text)
│   ├── database/              # ER Diagram & Schema dictionary
│   ├── api/                   # REST API documentation & Postman JSON
│   └── docker/                # Docker deployment guide
├── docker-compose.yml         # Full-stack Docker orchestration
└── README.md                  # This file
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher
- **PostgreSQL**: (or a free cloud database like [Neon](https://neon.tech))
- **Docker & Docker Compose** (Optional for containerized run)

---

### 2. Environment Setup

#### Backend Configuration (`backend/.env`):
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/snec_db?schema=public"

JWT_SECRET="SNEC_Secret_Key_2026"
JWT_REFRESH_SECRET="SNEC_Refresh_Key_2026"

ADMIN_EMAIL="admin-snec@gmail.com"
ADMIN_PASS="Admin@123"

APP_EMAIL="your_email@gmail.com"
APP_PASSWORD="your_app_password"

CLOUDINARY_CLOUD_NAME="your_cloudinary_name"
CLOUDINARY_API_KEY="your_cloudinary_key"
CLOUDINARY_API_SECRET="your_cloudinary_secret"
CLOUDINARY_UPLOAD_PRESET="snec-task"
```

#### Frontend Configuration (`frontend/.env`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

### 3. Local Development (Step-by-Step)

#### Step 3.1: Setup & Run Backend
```bash
cd backend

# Install dependencies
npm install

# Apply database migrations
npx prisma migrate deploy

# Seed initial Super Admin and Core Roles (Optional)
npm run seed

# Start NestJS development server (runs on port 5000)
npm run start:dev
```

#### Step 3.2: Setup & Run Frontend
```bash
cd ../frontend

# Install dependencies
npm install

# Start Next.js development server (runs on port 3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 4. Running with Docker Compose

To launch the complete platform in isolated containers:

```bash
# In the root directory:
docker-compose up --build -d

# Verify services:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:5000
# - PostgreSQL: localhost:5432
```

To stop containers:
```bash
docker-compose down
```

---

## 🛡️ Role-Based Access Control (RBAC) Matrix

| Action | Org Admin | Project Manager | Team Lead | Developer |
|---|:---:|:---:|:---:|:---:|
| **Create Project** | ✅ | ❌ | ❌ | ❌ |
| **Manage Org Members** | ✅ | ❌ | ❌ | ❌ |
| **Assign Roles in Project** | ✅ (All) | ✅ (TL, Dev) | ❌ | ❌ |
| **Create Tasks** | ✅ | ✅ | ❌ | ❌ |
| **Assign Tasks** | ✅ | ✅ | ✅ | ❌ |
| **Update Task Status** | ✅ | ✅ | ✅ | ✅ |
| **Comments & Attachments** | ✅ | ✅ | ✅ | ✅ |

---

## 📚 Detailed Documentation Links

- 🏛️ **[System Architecture Documentation](docs/architecture/ARCHITECTURE.md)**
- 🗄️ **[Entity-Relationship (ER) Diagram & Schema](docs/database/ER_DIAGRAM.md)**
- 🔌 **[REST API Specifications](docs/api/API_DOCUMENTATION.md)**
- 📮 **[Postman Collection (Importable JSON)](docs/api/postman_collection.json)**
- 🐳 **[Docker Deployment Guide](docs/docker/DOCKER_GUIDE.md)**
