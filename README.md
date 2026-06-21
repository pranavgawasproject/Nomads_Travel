# 🌍 RoamIQ - The Operating System for Digital Nomads

> **YC W25 Applicant** | The all-in-one platform for remote workers to live, work, and thrive anywhere in the world.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node](https://img.shields.io/badge/Node.js-Express-green)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248)](https://mongodb.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## 🎯 The Problem

**35 million digital nomads** worldwide face a fragmented experience:
- ❌ Visa rules are scattered across 100+ government websites
- ❌ Finding nomad-friendly cities requires weeks of research
- ❌ Job boards are generic, not built for location-independent work
- ❌ No tool tracks your workation history, visa status, and expenses together
- ❌ Lonely: hard to find community in new cities

**We're building the OS that fixes this.**

---

## 💡 Our Solution

**RoamIQ** is the operating system for digital nomads — one platform for everything:

| Feature | What It Does |
|---------|-------------|
| 🛂 **AI Visa Intelligence** | Smart visa recommendations based on your passport, skills & goals |
| 💼 **Remote Job Board** | Curated jobs from 100% remote companies, updated daily |
| 🗺️ **Global Listings** | Explore nomad-friendly cities with cost-of-living, wifi, weather |
| 💰 **Savings Calculator** | Compare real costs across 500+ cities |
| 🏢 **Company Directory** | Verified remote-first companies hiring globally |
| 📅 **Workation Planner** | Plan and book workations with co-living/co-working partners |
| 📞 **Expert Consultations** | Book 1:1 with visa agents, tax experts, relocation specialists |
| 🎉 **Events & Community** | Discover nomad meetups, find nearby digital nomads |
| 📝 **Trip Tracker** | Track all your trips, visas, and workations in one place |
| ⭐ **World Rankings** | Community-driven rankings of best cities for remote work |

---

## 🚀 Traction

- **17 repositories** across our GitHub organization
- **Full-stack MERN application** with 55+ pages
- **Production-ready** with JWT auth, S3 uploads, real-time features
- **AI-powered** search and recommendations
- **Google Maps** integration for location features

---

## 🏗️ Tech Stack

```
Frontend                    Backend                    Infrastructure
─────────────────────────────────────────────────────────────────────
React 19 + Vite      →     Node.js + Express    →    MongoDB Atlas
Redux Toolkit              JWT + Refresh Tokens       AWS S3
React Query                 Multer (file uploads)     Google Maps API
Tailwind CSS               Nodemailer                 Vercel/Render
MUI Components             Sharp (image processing)   
React Three Fiber          Socket.io (ready)
Lucide Icons               Yup (validation)
```

---

## 📁 Project Structure

```
RoamIQ/
├── backend/                    # Express.js API
│   ├── config/                 # DB, S3, Mailer, CORS
│   ├── controllers/            # Business logic (30+ controllers)
│   ├── middlewares/            # JWT auth, error handling
│   ├── models/                 # Mongoose schemas (20+ models)
│   └── server.js               # Express server entry
│
├── frontend/                   # React 19 application
│   ├── src/
│   │   ├── pages/              # 55+ page components
│   │   ├── components/         # Reusable UI components
│   │   ├── features/           # Redux slices
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API service layer
│   │   └── lib/                # Utilities and helpers
│   └── index.html
│
├── supabase_schema.sql         # Supabase migration (optional)
└── vercel.json                 # Deploy configuration
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (local or [MongoDB Atlas](https://mongodb.com/atlas))
- AWS S3 bucket (for media uploads)
- Google Maps API key

### 1. Clone the Repository

```bash
git clone https://github.com/pranavgawasproject/Nomads_Travel.git
cd Nomads_Travel
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env    # Fill in your credentials
npm install
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env   # Fill in your API keys
npm install
npm run dev
```

### 4. Open the App

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

---

## 🐳 Quick Start with Docker

```bash
docker-compose up -d
```

See [DOCKER.md](DOCKER.md) for detailed setup.

---

## 🔐 Environment Variables

### Backend (.env)

```env
PORT=3000
MONGO_URL=mongodb://localhost:27017/roamiq
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=us-east-1
AWS_BUCKET_NAME=roamiq-uploads
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## 🤝 Contributing

We welcome contributors! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📈 Roadmap

See [ROADMAP.md](ROADMAP.md) for planned features:
- [ ] Mobile app (React Native)
- [ ] AI chat assistant
- [ ] Marketplace for nomad services
- [ ] Payment integration for consultations
- [ ] Multi-language support
- [ ] Community forums

---

## 💼 Business Model

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | Browse listings, job board, basic search |
| **Pro** | $9/mo | AI recommendations, advanced filters, trip tracker |
| **Business** | $29/mo | Company listings, recruitment tools, analytics |

---

## 📞 Contact

- **GitHub**: [@pranavgawasproject](https://github.com/pranavgawasproject)
- **Email**: hello@roamiq.io
- **Website**: https://roamiq.io (coming soon)

---

## 📜 License

[MIT](LICENSE) © 2026 Pranav Gawas

---

<p align="center">
  <strong>Built for the 35 million digital nomads who deserve better tools.</strong>
  <br>
  🌍 Remote work. Any country. One platform.
</p>
