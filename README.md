# Mini SaaS Task Management App

A full-stack task management application built with React, Node.js, Express, and JWT authentication.

**This version has no database.** The backend stores account records and tasks in JSON files under `backend/data/`. Passwords are hashed with bcrypt before they are written; plain-text passwords are never saved.

## Features

- User registration and login
- Password hashing with bcrypt
- JWT-protected API routes
- Create, view, complete, and delete tasks
- Per-user task isolation
- JSON-file storage; no PostgreSQL, Supabase, Sequelize, or database service required

## Project structure

```text
mini-saas-task-app/
├── backend/
│   ├── controllers/
│   ├── data/             # Runtime JSON files; do not commit real user data
│   ├── middlewares/
│   ├── routes/
│   ├── storage/          # JSON file storage helpers
│   ├── config.js
│   └── server.js
└── frontend/
    └── src/
```

## Run locally

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
JWT_SECRET=replace_with_a_long_random_secret
```

Start the backend:

```bash
npm start
```

The backend creates `backend/data/users.json` and `backend/data/tasks.json` automatically.

### Frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

## Deploy on Render

Create a **Web Service** for the backend with:

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

Add this environment variable in Render:

```env
JWT_SECRET=<a long random secret>
```

No `DATABASE_URL` is needed. No PostgreSQL/Supabase database needs to be created.

For the frontend hosting service (for example, Vercel), set:

```env
VITE_API_URL=https://YOUR-RENDER-BACKEND-URL.onrender.com/api
```

Use the actual URL of your Render backend, then redeploy the frontend.

### Important storage limitation

JSON files are stored on the backend filesystem. On Render, files on the default filesystem are **not guaranteed to survive service restarts, redeployments, or instance replacement**. To retain users and tasks on Render without a database, attach a persistent disk (if your Render plan supports it) and set `DATA_DIR` to that disk's mount path, for example `/var/data`. Without persistent storage, users and tasks may be lost after a restart or redeploy. This is an unavoidable trade-off of using no database and no persistent disk.

## API routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

## Security notes

- Passwords are bcrypt hashes, not plain text.
- Set a strong `JWT_SECRET` in Render. If it is omitted, the backend generates a temporary secret and existing login tokens become invalid whenever the server restarts.
- Do not commit `backend/data/users.json` or expose it publicly.
