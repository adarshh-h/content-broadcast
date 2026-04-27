# Content Broadcasting System

A backend system for schools where teachers upload subject-based content, principals approve it, and students view live content via a public API.

---

## Problem Statement

In modern educational environments, teachers distribute subject-based content (like question papers, announcements, or materials) directly to students smartphones instead of using physical copies. Teachers upload content (e.g., Maths, Science), and once approved by the Principal, it is broadcasted via a public API endpoint that students can access.

---

## Tech Stack

| Technology | Usage |
|------------|-------|
| Node.js | Runtime |
| Express.js | Web Framework |
| PostgreSQL (Neon) | Database |
| JWT | Authentication |
| bcrypt | Password Hashing |
| Multer | File Upload |
| dotenv | Environment Variables |

---

## User Roles

| Role | Permissions |
|------|-------------|
| Principal | View all content, approve/reject content |
| Teacher | Upload content, view own content status |
| Student | Hit public API to see live content (no login) |

---

## Content Lifecycle

```
uploaded → pending → approved / rejected
```

- If rejected → rejection reason is stored and visible to teacher
- If approved → content shown only within scheduled time window
- Without start_time/end_time → content never shown to students

---

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
# Edit .env with your values
```

`.env` file:
```
PORT=3000
DATABASE_URL=your_neon_postgresql_url
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

### 3. Setup Database
```bash
node setup-db.js
```

### 4. Run the Server
```bash
npm run dev    # development
npm start      # production
```

Server runs on: `http://localhost:3000`

---

## API Endpoints

### Auth (Public)
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/auth/register` | Register user (principal/teacher) |
| POST | `/auth/login` | Login and get JWT token |

### Teacher Routes (JWT required)
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/content/upload` | Upload content with image file |
| GET | `/content/my` | View own content and status |

### Principal Routes (JWT required)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/approval/all` | View all content |
| GET | `/approval/pending` | View pending content |
| PATCH | `/approval/:id/approve` | Approve content |
| PATCH | `/approval/:id/reject` | Reject content with reason |

### Public Routes (No auth - Students)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/content/live/:teacherId` | Get currently active live content |

---

## Upload API Details

**POST /content/upload** (form-data)

| Field | Required | Description |
|-------|----------|-------------|
| title | ✅ | Content title |
| subject | ✅ | Subject name (maths, science, etc.) |
| file | ✅ | Image file (JPG/PNG/GIF, max 10MB) |
| description | ❌ | Optional description |
| start_time | ❌ | When content becomes visible (e.g. 2026-04-28T10:00:00) |
| end_time | ❌ | When content stops being visible |
| duration | ❌ | Minutes per rotation (default: 5) |

---

## Scheduling Logic

- Each subject has its own independent rotation
- Content rotates based on duration in minutes
- System uses current time to determine active content
- Multiple subjects run simultaneously and independently

Example:
```
Maths: Paper A (5min) → Paper B (5min) → loops
Science: Q1 (3min) → Q2 (3min) → Q3 (3min) → loops
Both run at the same time independently!
```

---

## Edge Cases Handled

| Case | Response |
|------|----------|
| No approved content | "No content available" |
| Approved but outside time window | "No content available" |
| Invalid teacher ID | "No content available" |
| Pending/rejected content | Never shown to students |
| Already approved → approve again | Error message |
| Already rejected → reject again | Error message |

---

## API Documentation

Import `postman-collection.json` in Postman to test all APIs.

### Steps to Import:
1. Open Postman
2. Click "Import" button
3. Select `postman-collection.json` from project folder
4. All APIs will be loaded with descriptions

---

## Assumptions

- `start_time` and `end_time` are full datetime values (e.g. 2026-04-28T10:00:00)
- Content without `start_time`/`end_time` will never be shown to students
- Default rotation duration is 5 minutes if not provided
- Subject names are stored in lowercase for consistency
- Invalid teacher ID returns "No content available" (not 404 error)
- Only PENDING content can be approved or rejected
