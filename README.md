# 🌍 RoamIQ — The Operating System for Digital Nomads

<div align="center">

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)
![Supabase](https://img.shields.io/badge/Supabase-Auth%2BRealtime-3ECF8E?logo=supabase)
![YC W25](https://img.shields.io/badge/YC-W25%20Applicant-black?logo=ycombinator)
![Stars](https://img.shields.io/github/stars/pranavgawasproject/Nomads_Travel?style=social)
![Contributors](https://img.shields.io/github/contributors/pranavgawasproject/Nomads_Travel)
![Last Commit](https://img.shields.io/github/last-commit/pranavgawasproject/Nomads_Travel)

**One platform for digital nomads to live, work, and thrive anywhere.**

[🌐 Live Demo](https://roamiq.io) · [📄 YC Application](PITCH.md) · [🗺️ Roadmap](ROADMAP.md) · [🐛 Report Bug](https://github.com/pranavgawasproject/Nomads_Travel/issues)

</div>

---

## 🎯 The Problem

**35 million digital nomads** face a fragmented experience with no single tool that works:

| Pain Point | Impact |
|---|---|
| ❌ Visa rules scattered across 100+ government sites | Weeks of research per trip |
| ❌ Generic job boards not built for remote work | Wasted applications, wrong roles |
| ❌ No tool tracks visas + trips + expenses together | Manual spreadsheets, missed deadlines |
| ❌ Finding nomad-friendly cities is manual research | 10–20 hours/month navigating fragmented tools |
| ❌ Loneliness — hard to find community in new cities | Isolation, fewer connections |

> **We estimate digital nomads waste 10–20 hours/month navigating fragmented tools. RoamIQ is the OS that fixes this.**

---

## 💡 Our Solution

**RoamIQ** is the operating system for digital nomads — one platform for everything nomads need:

| Feature | What It Does |
|---|---|
| 🛂 **AI Visa Intelligence** | Personalized visa recommendations by passport, skills & goals |
| 💼 **Remote Job Board** | Curated 100% remote positions, updated daily |
| 🗺️ **Global Listings** | 500+ cities with cost-of-living, WiFi, weather, safety data |
| 💰 **Savings Calculator** | Compare real costs across 500+ cities side-by-side |
| 🏢 **Company Directory** | Verified remote-first companies hiring globally |
| 📅 **Workation Planner** | Plan and book workations with co-living/co-working partners |
| 📞 **Expert Consultations** | Book 1:1 with visa agents, tax experts, relocation specialists |
| 🎉 **Events & Community** | Discover nomad meetups, find nearby digital nomads |
| 📝 **Trip Tracker** | Track all your trips, visas, and workations in one place |
| ⭐ **World Rankings** | Community-driven rankings of best cities for remote work |
| 💬 **Forum** | Q&A with nomads — visas, taxes, destinations, gear |

---

## 🏗️ Tech Stack

```
Frontend (React 19 + Vite)
├── Redux Toolkit + React Query (state)
├── Tailwind CSS + MUI (design system)
├── Supabase (auth, listings, forum, trips)
├── Google Maps API (location features)
├── Lucide Icons + React Icons
└── Motion / Framer Motion (animations)

Backend (Node.js + Express)
├── MongoDB Atlas + Mongoose ODM
├── JWT + Refresh Tokens (auth)
├── AWS S3 (file uploads)
├── Nodemailer (email)
├── Multer + Sharp (image processing)
└── Yup (validation)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB (local or [MongoDB Atlas](https://mongodb.com/atlas))
- Supabase project ([create free](https://supabase.com))
- AWS S3 bucket (for media uploads)
- Google Maps API key

### 1. Clone & Install

```bash
git clone https://github.com/pranavgawasproject/Nomads_Travel.git
cd Nomads_Travel
```

### 2. Backend

```bash
cd backend
cp .env.example .env    # Fill in your credentials
npm install
npm run dev             # → http://localhost:3000
```

### 3. Frontend

```bash
cd ../frontend
cp .env.example .env    # Fill in your API keys
npm install
npm run dev             # → http://localhost:5173
```

### 4. Supabase Setup

Run the schema in your Supabase SQL editor:

```bash
# In Supabase SQL editor (Project → SQL Editor)
# Paste contents of supabase_schema.sql and run
# Then seed sample data:
psql -h <host> -U postgres -d postgres < supabase_seed_data.sql
```

### 5. Docker (optional)

```bash
docker-compose up -d
```

---

## 📁 Project Structure

```
Nomads_Travel/
├── frontend/                    # React 19 application
│   └── src/
│       ├── pages/               # 55+ page components
│       ├── components/          # Reusable UI components
│       ├── services/            # Supabase + API service layer
│       ├── context/             # Auth contexts (MongoDB + Supabase)
│       ├── hooks/               # Custom React hooks
│       ├── features/            # Redux slices
│       └── utils/               # Helpers, validators, axios
│
├── backend/                     # Express.js API
│   ├── controllers/             # Business logic (30+ controllers)
│   ├── models/                  # Mongoose schemas (20+ models)
│   ├── routes/                  # Express route definitions
│   ├── middlewares/             # JWT auth, error handling
│   ├── config/                  # DB, S3, Mailer, CORS
│   ├── __tests__/               # Unit tests
│   └── server.js                # Express server entry
│
├── supabase_schema.sql          # Supabase schema + RLS policies
├── supabase_seed_data.sql       # Sample data
├── docker-compose.yml           # Local development
├── docker-compose.prod.yml      # Production deployment
├── Makefile                     # Dev shortcuts
├── PITCH.md                     # YC pitch deck
├── ROADMAP.md                   # Feature roadmap
└── CONTRIBUTING.md              # Contributor guidelines
```

---

## 💼 Business Model

| Tier | Price | Features |
|---|---|---|
| **Free** | $0 | Browse listings, job board, basic search, forum |
| **Pro** | $9/mo | AI recommendations, trip tracker, priority support |
| **Business** | $29/mo | Company listings, recruitment tools, analytics |

> **Unit Economics**: CAC ~$15 (organic + content), LTV ~$280 (18-mo Pro), LTV/CAC = **18.7x**

---

## 📈 Traction & Milestones

| Metric | Value |
|---|---|
| GitHub repositories | 17+ across the org |
| Features built | 55+ pages, 30+ API endpoints |
| Remote job listings | Daily updated |
| City data coverage | 500+ cities worldwide |
| Forum posts | Community-driven Q&A |

---

## 🤝 Contributing

We welcome contributors! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting PRs.

```bash
# Fork → Clone → Branch → Code → Test → PR
git checkout -b feature/your-feature-name
npm test   # Run tests
git push origin feature/your-feature-name
```

Good first issues are tagged [`good first issue`](https://github.com/pranavgawasproject/Nomads_Travel/labels/good%20first%20issue).

---

## 📞 Contact

- **GitHub**: [@pranavgawasproject](https://github.com/pranavgawasproject)
- **Email**: hello@roamiq.io
- **YC Application**: [PITCH.md](PITCH.md)

---

## 📜 License

[MIT](LICENSE) © 2024–2026 Pranav Gawas

---

<p align="center">
  <strong>Built for the 35 million digital nomads who deserve better tools.</strong>
  <br>
  🌍 Remote work. Any country. One platform.
</p>