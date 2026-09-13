# CivicConnect — Crowdsourced Civic Issue Reporting System

A full-stack platform for citizens to report civic issues (road damage, garbage,
water leakage, streetlights, etc.), track them through a public status timeline,
vote and comment, and for local-authority admins to triage, assign, and resolve them.

**Status: Phase 1 — working foundation, not yet feature-complete.** This is a solid,
runnable skeleton across all three layers (MySQL, Spring Boot, React) with the core
flows wired end-to-end. It is a starting point to build on, not a finished production
system — see [Roadmap](#roadmap--whats-left) below for what's stubbed vs. real.

## Tech stack
- **Frontend:** React 18, React Router, Bootstrap 5, Axios, Leaflet (react-leaflet), Chart.js, i18next (EN/TA)
- **Backend:** Java 17, Spring Boot 3, Spring Security + JWT, Spring Data JPA, Maven
- **Database:** MySQL 8

## Project structure
```
civic-issue-system/
├── database/
│   └── schema.sql              # full DDL: tables, keys, relationships, seed data
├── backend/                    # Spring Boot API (Maven)
│   └── src/main/java/com/civicissue/
│       ├── entity/             # JPA entities (User, Issue, Vote, Comment, ...)
│       ├── repository/         # Spring Data repositories
│       ├── service / service/impl
│       ├── controller/         # REST controllers
│       ├── dto/                # request/response payloads
│       ├── security/           # JWT filter, JwtUtil, CurrentUser helper
│       ├── config/             # SecurityConfig, DataSeeder
│       └── exception/          # global exception handling
├── frontend/                   # React app (Create React App)
│   └── src/
│       ├── pages/ (+ pages/admin/)
│       ├── components/         # Navbar, MapView (Leaflet), IssueCard, badges
│       ├── context/AuthContext.js
│       ├── services/api.js     # Axios instance with JWT interceptor
│       └── i18n/                # English + Tamil strings
└── docs/
    └── postman_collection.json
```

## Getting started

### 1. Database
```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend
```bash
cd backend
# edit src/main/resources/application.yml with your MySQL password and JWT secret
mvn spring-boot:run
```
The API starts on `http://localhost:8080`. On first boot it seeds the `roles` table
and creates a default admin: **admin@civicissue.local / Admin@123** — change this
password immediately in a real deployment.

### 3. Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm start
```
Opens on `http://localhost:3000`, talking to the API at the URL in `.env`.

Maps use Leaflet + OpenStreetMap tiles, so no API key is required.

## What's implemented end-to-end
- Register / login with JWT, BCrypt password hashing, role-based access (citizen vs admin)
- Report an issue: title, description, category, map-pin location, address, photos, priority, anonymous option
- Issue list with filtering (category, status, city, priority) and search, plus a live Leaflet map
- Upvoting with duplicate-vote prevention, trending issues
- Comments (threaded replies supported in the data model and API)
- Status timeline (Pending → Verified → Assigned → In Progress → Resolved/Closed) with history log
- In-app notifications on status change
- Admin dashboard: stats, all-reports table, status updates, delete
- Basic analytics charts (category-wise, status distribution, resolution rate) from live data
- Profile edit, photo upload, password change
- Dark mode toggle, English/Tamil language toggle, responsive Bootstrap layout
- File uploads (local disk storage) for issue photos and profile photos
- Postman collection for the core APIs

## Roadmap / what's left
This phase intentionally prioritized breadth (every layer wired and runnable) over
depth on every one of the original 15 deliverables. Not yet built:
- Email sending (forgot-password currently generates a token but doesn't email it — wire up `spring-boot-starter-mail`, already a dependency)
- Assignment-to-department workflow UI (backend entity + repo exist; needs controller + admin UI)
- PDF/Excel export (itext7 and Apache POI are in `pom.xml`; export endpoints not yet written)
- Real-time (WebSocket) notifications — currently poll-based
- Image compression on upload
- JPA `Specification`-based filtering for issues at scale (current filter is in-memory; fine for a demo, not for production data volumes)
- Formal SRS document, ER diagram image, and deployment guide (Docker/CI)
- Automated tests (unit + integration)

Happy to build out any of these next — say which one and I'll pick up from here.
