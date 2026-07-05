# SolveHive 🐝

A full-stack MERN community Q&A platform where anyone can post real-world questions and get answers — earning reputation and badges in return.

---

## Prerequisites

- **Node.js** v18+ ([download](https://nodejs.org))
- **MongoDB** — choose one:
  - **Local**: [MongoDB Community](https://www.mongodb.com/try/download/community) → Install and start the service
  - **Cloud**: [MongoDB Atlas](https://www.mongodb.com/atlas) → Create a free cluster (M0) and get your connection string

---

## Quick Start

### 1. Set up the database connection

Edit `server/.env` and replace `MONGO_URI` with your connection string:

```bash
# Atlas (recommended for quick start):
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/solvehive?retryWrites=true&w=majority

# OR local MongoDB:
MONGO_URI=mongodb://localhost:27017/solvehive
```

### 2. Start the backend

```powershell
cd server
npm install        # already done
npm run seed       # seeds the 8 categories into MongoDB
npm run dev        # starts on http://localhost:5000
```

### 3. Start the frontend

Open a second terminal:

```powershell
cd client
npm run dev        # starts on http://localhost:5173
```

### 4. Open your browser

Navigate to **http://localhost:5173** 🎉

---

## Project Structure

```
SolveHive/
├── server/              # Node.js + Express API
│   ├── config/          # MongoDB connection
│   ├── middleware/       # JWT auth, Multer file uploads
│   ├── models/          # User, Category, Query, Answer
│   ├── routes/          # REST API endpoints
│   ├── seeds/           # Category seed script
│   ├── uploads/         # Uploaded files (auto-created)
│   └── index.js         # Express entry point
│
└── client/              # Vite + React + Tailwind CSS
    └── src/
        ├── api/         # Axios modules per resource
        ├── components/  # Reusable UI components
        ├── context/     # Auth context (JWT in localStorage)
        └── pages/       # Route-level page components
```

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | — | Register new user |
| POST | `/api/auth/login` | — | Login, get JWT |
| GET | `/api/users/:id` | — | User public profile |
| PUT | `/api/users/profile-setup` | ✅ | Set name/bio/interests |
| GET | `/api/categories` | — | All categories with query counts |
| GET | `/api/categories/:slug/queries` | — | Queries in a category |
| POST | `/api/queries/check-duplicate` | ✅ | Search for similar queries |
| POST | `/api/queries` | ✅ | Create query (multipart/form-data) |
| GET | `/api/queries/:id` | — | Query + answers |
| POST | `/api/answers` | ✅ | Post answer (multipart/form-data) |
| PUT | `/api/answers/:id/accept` | ✅ | Accept answer (+10 pts) |

---

## Features

- 🔐 JWT auth with bcrypt password hashing
- 📂 8 fixed categories (Coding, Electronics, Career, Health, Cooking, DIY, Academics, Other)
- 🔍 Duplicate query detection via MongoDB text search
- 📸 Photo/video uploads (Multer, local disk)
- ✅ Accept answer → award +10 reputation points
- 🏆 Badge tiers: Helper → Pro Helper → Expert
- 📊 Profile page with stats and badge progress bar
- 🌓 Polished SaaS-style design with Inter font, indigo/purple gradients

---

## Badge Tiers

| Badge | Points Required |
|-------|----------------|
| 🌱 Helper | 0–50 pts |
| ⚡ Pro Helper | 51–200 pts |
| 🏆 Expert | 200+ pts |
