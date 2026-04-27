# Content Broadcasting System

A backend system for schools where teachers upload content, principals approve it, and students view live content via a public API.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Auth**: JWT + bcrypt
- **File Upload**: Multer (local storage)

## Setup Instructions

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd content-broadcasting-system
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env with your DB credentials and JWT secret
```

### 3. Setup Database
```bash
# Create database in PostgreSQL
createdb content_broadcasting

# Run schema
psql -d content_broadcasting -f src/config/schema.sql
```

### 4. Run the Server
```bash
npm run dev   # development
npm start     # production
```

Server runs on: `http://localhost:3000`

---

## API Endpoints

### Auth
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/auth/register` | Public | Register user |
| POST | `/auth/login` | Public | Login & get token |

### Teacher (JWT required, role=teacher)
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/content/upload` | Upload content with file |
| GET | `/content/my` | View own content & status |

### Principal (JWT required, role=principal)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/approval/all` | View all content |
| GET | `/approval/pending` | View pending content |
| PATCH | `/approval/:id/approve` | Approve content |
| PATCH | `/approval/:id/reject` | Reject with reason |

### Public (No auth - Students)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/content/live/:teacherId` | Get active live content |

---

## Upload API Details

**POST /content/upload** (form-data)
```
title        - required
subject      - required (maths, science, etc.)
file         - required (JPG/PNG/GIF, max 10MB)
description  - optional
start_time   - optional (e.g. 2026-04-28T10:00:00)
end_time     - optional (e.g. 2026-04-28T12:00:00)
duration     - optional (minutes per rotation, default: 5)
```

---

## Assumptions
- `start_time` and `end_time` are full datetime values (not daily time)
- Content without `start_time`/`end_time` will never be shown to students
- Default rotation duration is 5 minutes if not provided
- Subject names are stored in lowercase
- Invalid teacher ID returns "No content available" (not 404)
