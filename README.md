# Mental Wellness Journal

Mental Wellness Journal is a full-stack MERN application that gives users a private digital space to track daily mood, reflect on thoughts, record wellbeing habits, and receive lightweight mental health recommendations in real time.

## Project Overview

This project extends the starter authentication template into a real-world wellbeing platform. It demonstrates:

- Backend development with Node.js, Express, and MongoDB
- Frontend development with React.js and Tailwind CSS utilities
- Authentication and authorisation using JWT
- CRUD operations for journal entries
- GitHub branching strategy and collaborative development workflow
- CI/CD preparation using GitHub Actions

## Features

- User registration and login
- Protected profile management
- Persistent authentication using local storage
- Create, read, update, and delete private mental wellness journal entries
- Mood tracking, feelings tags, sleep and stress monitoring
- Auto-generated wellbeing recommendations based on entry data
- Dashboard summary with latest insight and quick metrics
- Entry filtering by mood and date range

## Tech Stack

- Frontend: React, React Router, Axios, Tailwind CSS
- Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt
- DevOps: GitHub, GitHub Actions

## Folder Structure

```text
Mental-Wellness-Journal/
+-- backend/
+-- frontend/
+-- .github/workflows/
+-- package.json
+-- README.md
```

## Local Setup

### 1. Install dependencies

```bash
npm run install-all
```

### 2. Configure environment variables

Create these files from the provided examples:

- `backend/.env.example` -> `backend/.env`
- `frontend/.env.example` -> `frontend/.env`

Backend variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_secure_secret
PORT=5001
CLIENT_URL=http://localhost:3000
```

Frontend variables:

```env
REACT_APP_API_URL=http://localhost:5001
```

### 3. Run the application

```bash
npm run dev
```

Frontend runs on `http://localhost:3000` and backend runs on `http://localhost:5001`.

## PM2 Production Setup

Use `pm2` when you deploy the backend to an AWS EC2 instance or another VM-based server.

### 1. Install PM2 on the server

```bash
npm install -g pm2
```

### 2. Start the backend with PM2

```bash
cd backend
pm2 start ecosystem.config.js
```

### 3. Restart after updates

```bash
cd backend
pm2 restart ecosystem.config.js --update-env
```

### 4. Save the running process list

```bash
pm2 save
```

### 5. Useful PM2 commands

```bash
pm2 list
pm2 logs mental-wellness-journal-api
pm2 restart mental-wellness-journal-api
pm2 stop mental-wellness-journal-api
```

## API Endpoints

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`

### Journal Entries

- `GET /api/journals`
- `GET /api/journals/summary`
- `POST /api/journals`
- `PUT /api/journals/:id`
- `DELETE /api/journals/:id`

## Journal Entry Data Model

Each journal entry stores:

- `title`
- `note`
- `mood`
- `feelings[]`
- `gratitude`
- `selfCareActivity`
- `sleepHours`
- `stressLevel`
- `entryDate`
- `recommendation`

## Authentication and Authorisation

- Passwords are hashed with `bcrypt`
- JWT tokens are issued on login and profile update
- Protected routes use Bearer token middleware
- Frontend private routes redirect unauthenticated users to `/login`
- Journal reflections are private and scoped to the authenticated user only

## GitHub Version Control and Branching Strategy

Recommended branch model:

- `main`: production-ready code
- `develop`: integration branch for completed features
- `feature/<feature-name>`: new features such as `feature/journal-crud`
- `bugfix/<issue-name>`: defect fixes
- `hotfix/<issue-name>`: urgent production fixes

Suggested workflow:

1. Create a new branch from `develop`
2. Commit small focused changes
3. Open a pull request into `develop`
4. Run CI checks before merge
5. Merge `develop` into `main` for releases

Example commits:

- `feat: add mental wellness journal CRUD`
- `feat: protect profile and journal routes`
- `ci: add github actions pipeline`
- `docs: rewrite README for project delivery`

## CI/CD Pipeline Setup

The project includes a GitHub Actions workflow at `.github/workflows/ci-cd.yml`.

Current pipeline steps:

- Install root, backend, and frontend dependencies
- Build the React frontend
- Run frontend tests
- Deploy the project to AWS EC2 over SSH
- Restart the backend service with PM2

### Required GitHub Secrets for EC2 deployment

Add these repository secrets before using the deployment job:

- `EC2_HOST`
- `EC2_USERNAME`
- `EC2_SSH_KEY`
- `EC2_PROJECT_PATH`

### Example EC2 deployment flow

1. Push code to `main`
2. GitHub Actions connects to the EC2 server
3. The workflow runs `git pull origin main`
4. Dependencies are installed with `npm ci`
5. The backend is restarted using `pm2 startOrRestart ecosystem.config.js --update-env`

## Assessment Alignment

This implementation now covers the requested tasks:

- Backend Development: CRUD endpoints, MongoDB models, protected APIs
- Frontend Development: React pages, forms, dashboard, filtering, profile management
- Authentication & Authorisation: JWT middleware, private routes, persistent sessions
- GitHub Version Control & Branching Strategy: documented in README
- CI/CD Pipeline Setup: GitHub Actions workflow added
- README.md: rewritten with setup, architecture, and delivery guidance

## Future Improvements

- Add backend integration tests with a test database
- Add admin or therapist review roles if the project scope expands
- Add charts for mood trends over time
- Add reminder notifications for daily check-ins
