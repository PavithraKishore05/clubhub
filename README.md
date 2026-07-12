# ClubHub

A campus event management platform where admins publish events and students discover, filter, and bookmark them.

---

## Stack

- **Frontend** — React, Vite, Tailwind CSS, Axios
- **Backend** — Node.js, Express, MongoDB (Mongoose), JWT (httpOnly cookies)
- **Deployed on** — Vercel (monorepo, two services)

---

## What It Does

| Who | Can |
|---|---|
| Anyone | Browse events, search by title/description, filter by venue type and registration status |
| Signed-in users | Bookmark events (persisted in localStorage), view profile |
| Admins | Create, edit, delete events via a dedicated dashboard |

Registration deadlines are enforced automatically — events display as closed once the deadline day passes.

---

## Project Structure

```
clubhub/
  backend/
    config/db.js          # MongoDB connection
    controllers/          # auth + event logic
    middleware/           # JWT protect, role guard
    models/               # User, Event schemas
    routes/               # /auth and /api/events
    utils/generateToken.js
  frontend/src/
    api/                  # Axios instance + event/auth calls
    components/           # ProtectedRoute, AdminRoute
    context/AuthContext.jsx
    pages/                # Home, AllEvents, Login, Signup, Profile, AdminDashboard
    utils/                # eventStatus.js, starredEvents.js
```

---

## Getting Started

**1. Install dependencies**
```bash
npm run install:all
```

**2. Create `backend/.env`**
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**3. Seed the admin account**
```bash
npm run seed:admin --prefix backend
```

**4. Run both servers**
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:5000`.

---

## Auth

JWT is stored in an httpOnly cookie set on login/signup and cleared on logout. On page load, the frontend calls `/auth/me` to restore session silently. Admin accounts log in with a username; regular users use email.

---

## API

```
POST   /auth/signup
POST   /auth/login
GET    /auth/me          (protected)
POST   /auth/logout

GET    /api/events       (public)
POST   /api/events       (admin)
PUT    /api/events/:id   (admin)
DELETE /api/events/:id   (admin)
```

---

## Deployment

Vercel reads `vercel.json` and deploys the frontend and backend as separate services. Set all env variables in the Vercel dashboard. Leave `VITE_API_URL` empty in production — the frontend automatically proxies to `/_/backend`.
