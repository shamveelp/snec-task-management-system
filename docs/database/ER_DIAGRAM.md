# Entity-Relationship (ER) Diagram & Database Schema

## 1. Database Entity-Relationship Diagram

```mermaid
erDiagram
    ORGANIZATION ||--o{ USER : "employs"
    ORGANIZATION ||--o{ INVITATION : "issues"
    ORGANIZATION ||--o{ PROJECT : "owns"

    ROLE ||--o{ USER : "assigned_to"
    ROLE ||--o{ ROLE_PERMISSION : "contains"
    ROLE ||--o{ INVITATION : "specifies"

    PERMISSION ||--o{ ROLE_PERMISSION : "granted_through"

    USER ||--o{ PROJECT : "creates"
    USER ||--o{ PROJECT_MEMBER : "participates_in"
    USER ||--o{ TASK : "assigned_as_worker"
    USER ||--o{ TASK : "reported_as_creator"
    USER ||--o{ TASK_COMMENT : "authors"
    USER ||--o{ TASK_ATTACHMENT : "uploads"

    PROJECT ||--o{ PROJECT_MEMBER : "includes"
    PROJECT ||--o{ TASK : "organizes"

    TASK ||--o{ TASK_COMMENT : "has"
    TASK ||--o{ TASK_ATTACHMENT : "attaches"

    ORGANIZATION {
        string id PK
        string name
        string email UK
        string mobile
        string category
        datetime createdAt
        datetime updatedAt
    }

    USER {
        string id PK
        string name
        string username UK
        string email UK
        string password
        string mobile
        string bio
        string profilePicture
        enum status
        string roleId FK
        string organizationId FK
        datetime createdAt
        datetime updatedAt
    }

    ROLE {
        string id PK
        string name UK
        string description
        datetime createdAt
        datetime updatedAt
    }

    PERMISSION {
        string id PK
        string name UK
        string module
        string description
        datetime createdAt
        datetime updatedAt
    }

    ROLE_PERMISSION {
        string roleId PK,FK
        string permissionId PK,FK
    }

    OTP {
        string id PK
        string email UK
        string otp
        datetime expiresAt
        datetime createdAt
    }

    INVITATION {
        string id PK
        string email
        string roleId FK
        string organizationId FK
        string token UK
        enum status
        datetime expiresAt
        datetime createdAt
        datetime updatedAt
    }

    PROJECT {
        string id PK
        string name
        string description
        datetime startDate
        datetime endDate
        enum priority
        enum status
        string organizationId FK
        string createdById FK
        datetime createdAt
        datetime updatedAt
    }

    PROJECT_MEMBER {
        string id PK
        string projectId FK
        string userId FK
        enum role
        datetime createdAt
        datetime updatedAt
    }

    TASK {
        string id PK
        string title
        string description
        string projectId FK
        string assigneeId FK
        string reporterId FK
        enum priority
        enum status
        datetime dueDate
        float estimatedHours
        float actualHours
        datetime createdAt
        datetime updatedAt
    }

    TASK_COMMENT {
        string id PK
        string taskId FK
        string userId FK
        string content
        datetime createdAt
        datetime updatedAt
    }

    TASK_ATTACHMENT {
        string id PK
        string taskId FK
        string userId FK
        string fileUrl
        string fileName
        int fileSize
        datetime createdAt
        datetime updatedAt
    }
```

---

## 2. Schema Dictionary

### 2.1 Enums

| Enum Name | Values |
|---|---|
| `UserStatus` | `ACTIVE`, `INACTIVE` |
| `InvitationStatus` | `PENDING`, `ACCEPTED`, `REJECTED` |
| `ProjectRole` | `PROJECT_MANAGER`, `TEAM_LEAD`, `DEVELOPER` |
| `ProjectPriority` | `LOW`, `MEDIUM`, `HIGH` |
| `ProjectStatus` | `PLANNING`, `ACTIVE`, `ON_HOLD`, `COMPLETED` |
| `TaskPriority` | `LOW`, `MEDIUM`, `HIGH`, `URGENT` |
| `TaskStatus` | `TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE` |

---

## 3. Key Relationships & Cascades

- **`Project` → `ProjectMember`**: `onDelete: Cascade` (Deleting a project removes its member assignments).
- **`Project` → `Task`**: `onDelete: Cascade` (Deleting a project removes associated tasks).
- **`Task` → `TaskComment`**: `onDelete: Cascade` (Deleting a task removes comments).
- **`Task` → `TaskAttachment`**: `onDelete: Cascade` (Deleting a task removes attachment records).
- **`Task` → `Assignee (User)`**: `onDelete: SetNull` (Deleting a user leaves task unassigned without deleting task history).
