# 🌍 Nomads_Travel

> A full-stack travel platform for digital nomads — discover visa rules, plan workations, find jobs, book consultations, and connect with a global community of remote workers.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node](https://img.shields.io/badge/Node.js-Express-green)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248)](https://mongodb.com)

## ✨ Features

- 🛂 **Visa Rule Engine** — state-wise visa information, weight calculation, and rule updates
- 💼 **Job Board** — categories, listings, and contributor applications
- 🏢 **Company Setup** — onboard partner companies with full profile management
- 🗓️ **Workation Planner** — browse and book workation experiences
- 📝 **Blog & News** — editorial system with caching for performance
- 📞 **Consultations** — book sessions with travel/visa experts
- 🎉 **Events** — discover and RSVP to nomad meetups
- ⭐ **Reviews & Ratings** — world ranking of destinations
- 🔐 **Auth** — JWT + refresh tokens, role-based access
- ☁️ **S3 Uploads** — AWS S3 for media storage

## 🛠️ Tech Stack

**Frontend:** React, Vite, Emotion, HeadlessUI, Google Maps
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Multer, AWS S3, Nodemailer
**Realtime / Tooling:** Socket-ready, CORS-configured, CSV parsing for bulk data

## 📁 Project Structure

```
.
├── backend/
│   ├── config/        # db, mailer, multer, s3, cors
│   ├── controllers/   # auth, blog, jobs, visa, events, ...
│   ├── middlewares/   # jwt, errorHandler, credentials
│   ├── models/        # Mongoose schemas
│   └── server.js
└── frontend/          # React app (Vite)
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)
- AWS S3 bucket (for uploads)
- Google Maps API key (for maps)

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, AWS_*, SMTP_*
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`, backend on `http://localhost:5000`.

## 📜 License

[MIT](LICENSE) © 2026 Pranav Gawas
