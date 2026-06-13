# RoamIQ

AI-Powered Travel Intelligence Platform — discover, explore, and navigate the world with smart insights.

## Tech Stack

- **Frontend:** React 19 + Vite + Tailwind CSS + Redux Toolkit
- **Backend:** Node.js + Express 5 + MongoDB + AWS S3

## Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

## Environment Variables

### Frontend (.env)
- `VITE_PROD_LINK` — API base URL
- `VITE_GOOGLE_API_KEY` — Google Maps API key
- `VITE_GOOGLE_MAPS_API_KEY` — Google Maps API key (alt)
- `VITE_AI_SCORE_RANGE_MIN` — AI score range config

### Backend (.env)
- `MONGO_URL` — MongoDB connection string
- `PORT` — Server port
- `ACCESS_TOKEN_SECRET` — JWT access token secret
- `REFRESH_TOKEN_SECRET` — JWT refresh token secret
- `EMAIL_USER` — Email account for sending
- `EMAIL_PASS` — Email app password
- `FRONTEND_PROD_LINK` — Production frontend URL
- `FRONTEND_DEV_LINK` — Dev frontend URL
- `PROJECT_AWS_REGION` — AWS S3 region
- `PROJECT_AWS_ACCESS_KEY` — AWS access key
- `PROJECT_AWS_SECRET_KEY` — AWS secret key
- `PROJECT_S3_BUCKET_NAME` — S3 bucket name
