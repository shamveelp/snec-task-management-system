# API Documentation

## Base URL
- **Local**: `http://localhost:5000`
- **Docker**: `http://backend:5000` or `http://localhost:5000`

## Authentication
All endpoints (except Public Auth and OTP routes) require a JWT Bearer Token in the HTTP Authorization header:
```http
Authorization: Bearer <accessToken>
```

---

## 1. Authentication Endpoints

### 1.1 Register User
- **POST** `/auth/register`
- **Body**:
```json
{
  "name": "Jane Doe",
  "username": "janedoe",
  "email": "jane@example.com",
  "password": "Password@123"
}
```

### 1.2 User Login
- **POST** `/auth/login`
- **Body**:
```json
{
  "email": "jane@example.com",
  "password": "Password@123"
}
```
- **Response `200 OK`**:
```json
{
  "accessToken": "eyJhbG...",
  "refreshToken": "eyJhbG...",
  "user": {
    "id": "uuid",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": { "name": "Member" }
  }
}
```

### 1.3 Refresh Token
- **POST** `/auth/refresh`
- **Body**: `{ "refreshToken": "..." }`

### 1.4 Change Password
- **POST** `/auth/change-password`
- **Headers**: `Bearer <token>`
- **Body**:
```json
{
  "oldPassword": "Password@123",
  "newPassword": "NewPassword@123"
}
```

### 1.5 Forgot Password (OTP)
- **POST** `/auth/forgot-password`
- **Body**: `{ "email": "user@example.com" }`

### 1.6 Reset Password (OTP)
- **POST** `/auth/reset-password`
- **Body**:
```json
{
  "email": "user@example.com",
  "token": "123456",
  "newPassword": "NewPassword@123"
}
```

### 1.7 Google OAuth2
- **GET** `/auth/google` (Initiates Google Sign-In)
- **GET** `/auth/google/callback` (OAuth callback redirect)

---

## 2. Organization Endpoints

### 2.1 Send Organization Registration OTP
- **POST** `/organizations/send-otp`
- **Body**: `{ "email": "contact@acme.com" }`

### 2.2 Register Organization
- **POST** `/organizations/register`
- **Body**:
```json
{
  "name": "Acme Corp",
  "username": "acmecorp",
  "email": "contact@acme.com",
  "mobile": "+1234567890",
  "category": "Technology",
  "password": "AdminPassword@123",
  "otp": "123456"
}
```

### 2.3 List Organization Members
- **GET** `/organizations/members`
- **Headers**: `Bearer <token>`

### 2.4 Search Developers / Members
- **GET** `/organizations/search-developers?q=jane`
- **Headers**: `Bearer <token>`

### 2.5 Organization Settings
- **GET** `/organization/settings`
- **PUT** `/organization/settings`
- **Headers**: `Bearer <token>`
- **Body** (PUT):
```json
{
  "name": "Updated Org Name",
  "mobile": "+1987654321",
  "category": "Healthcare"
}
```

### 2.6 Invitations
- **POST** `/invitations` (Send invite to email)
- **GET** `/invitations/:token` (Verify token)
- **POST** `/invitations/:token/accept` (Accept invitation and join organization)

### 2.7 Reports & Audit Logs
- **GET** `/organization/reports/project-progress`
- **GET** `/organization/reports/user-productivity`
- **GET** `/organization/reports/task-completion`
- **GET** `/organization/reports/overdue-tasks`
- **GET** `/organization/audit-logs`

---

## 3. Project Endpoints

### 3.1 Get Organization Projects
- **GET** `/projects/organization`
- **Headers**: `Bearer <token>`

### 3.2 Get User's Projects
- **GET** `/projects/me`
- **Headers**: `Bearer <token>`

### 3.3 Get Project by ID
- **GET** `/projects/:id`
- **Headers**: `Bearer <token>`

### 3.4 Create Project
- **POST** `/projects`
- **Headers**: `Bearer <token>`
- **Body**:
```json
{
  "name": "Mobile App V2",
  "description": "Rebuilding the core Flutter application",
  "startDate": "2026-09-01",
  "endDate": "2026-12-31",
  "priority": "HIGH",
  "status": "PLANNING",
  "memberIds": ["user-uuid-1", "user-uuid-2"]
}
```

### 3.5 Add Project Member
- **POST** `/projects/:projectId/members`
- **Body**:
```json
{
  "userId": "user-uuid",
  "role": "DEVELOPER"
}
```

### 3.6 Update Project Member Role
- **PUT** `/projects/:projectId/members/:userId`
- **Body**:
```json
{
  "role": "TEAM_LEAD"
}
```

### 3.7 Remove Project Member
- **DELETE** `/projects/:projectId/members/:userId`

---

## 4. Task Management Endpoints

### 4.1 Get Tasks by Project
- **GET** `/tasks/project/:projectId`

### 4.2 Get User Project Role
- **GET** `/tasks/project/:projectId/my-role`
- **Response**: `{ "role": "PROJECT_MANAGER" }`

### 4.3 Get Task by ID
- **GET** `/tasks/:id`

### 4.4 Create Task
- **POST** `/tasks`
- **Body**:
```json
{
  "title": "Implement OAuth2 Flow",
  "description": "Integrate Google & GitHub logins",
  "projectId": "project-uuid",
  "assigneeId": "user-uuid",
  "priority": "URGENT",
  "status": "TODO",
  "dueDate": "2026-09-15",
  "estimatedHours": 8
}
```

### 4.5 Update Task
- **PUT** `/tasks/:id`
- **Body**:
```json
{
  "status": "IN_PROGRESS",
  "actualHours": 4
}
```

### 4.6 Add Task Comment
- **POST** `/tasks/:id/comments`
- **Body**:
```json
{
  "content": "Reviewed the pull request and left comments on line 42."
}
```

### 4.7 Upload Task Attachment
- **POST** `/tasks/:id/attachments`
- **Content-Type**: `multipart/form-data`
- **Form Field**: `file` (binary)

### 4.8 Delete Task Attachment
- **DELETE** `/tasks/attachments/:attachmentId`

---

## 5. Super Admin Endpoints

### 5.1 Admin Organization Management
- **GET** `/admin/organizations` (List all organizations)
- **GET** `/admin/organizations/:id` (Get organization details)
- **POST** `/admin/organizations` (Create organization)
- **PUT** `/admin/organizations/:id` (Update organization status/details)
- **DELETE** `/admin/organizations/:id` (Delete organization)
- **Headers**: `Bearer <token>` (Must have Super Admin role)
