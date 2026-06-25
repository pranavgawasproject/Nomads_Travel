# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- YC-ready README with strong pitch, stars badge, YC W25 badge
- CONTRIBUTING.md with contribution guidelines
- PITCH.md for investor deck
- ROADMAP.md with future plans
- Docker documentation (DOCKER.md)
- GitHub Actions CI/CD workflow
- GitHub Issue Templates (bug report, feature request)
- GitHub PR template
- backend/__tests__/auth.test.js — JWT + password validation unit tests
- backend/package.json — Jest + Supertest dev deps, proper test scripts
- backend/middlewares/verifyJwt.js — Added `requireAuth` shorthand helper

### Changed
- README.md completely rewritten for YC pitch with demo badge, stars, contributors
- backend/.env.example — Added JWT_ACCESS_SECRET/JWT_REFRESH_SECRET naming + docs
- frontend/.env.example — Created with VITE_ prefixed vars for all required keys
- backend/authControllers.js — ACCESS_TOKEN_SECRET → JWT_ACCESS_SECRET, 15m → 1h expiry
- backend/refreshTokenController.js — ACCESS_TOKEN_SECRET → JWT_ACCESS_SECRET, 15m → 1h
- backend/package.json — Added Jest, Supertest, proper test/lint scripts
- backend/models/NomadUser.js — No functional changes (clean code review passed)

### Fixed
- JWT secret naming consistency across auth controller + refresh controller + verifyJwt middleware
- Token expiry too short (15 min → 1 hour) causing frequent re-logins
- Missing .env documentation preventing fresh clones from running

### Security
- JWT secrets now consistently named JWT_ACCESS_SECRET / JWT_REFRESH_SECRET
- Access token expiry increased from 15 minutes to 1 hour (reduces auth friction while keeping short-lived tokens)
- .env.example updated to recommend `openssl rand -hex 64` for strong secret generation

---


## [1.0.0] - 2024

### Added

#### Backend
- Express.js server with 30+ API endpoints
- MongoDB/Mongoose database models:
  - User authentication (NomadUser)
  - Companies (Company, NewCompanySetup)
  - Jobs (Job, JobCategory)
  - Blogs (Blog, TestBlog)
  - News (News, TestNews)
  - Events (Event)
  - Reviews (Reviews)
  - Consultations (Consultation)
  - Visa support (VisaRule, VisaSupport)
  - Workation (Workation)
  - Points of Contact (PointOfContact)
  - Contributor system (BecomeContributor)
  - State-wise weight calculations
  - World rankings
  - Overall activation support
- JWT authentication with refresh tokens
- AWS S3 integration for file uploads
- Multer for file handling
- Sharp for image processing
- Nodemailer for email notifications
- Cookie-parser for JWT handling
- CSV parser for bulk data imports
- Yup validation
- CORS configuration
- Error handling middleware

#### Frontend
- React 19 application
- Vite build system
- 55+ page components:
  - Home & Landing
  - Authentication (Login, Signup, Password Reset)
  - Search (AI, Compatible, Manual, Savings)
  - Listings (Global, City-based)
  - Job Board
  - Company Directory
  - Blog & News
  - Events
  - Consultations
  - Workations
  - Reviews & Rankings
  - Visa Support
  - Trip Tracker
  - Nearby Nomads
  - Profile Management
  - Various informational pages
- Redux Toolkit for state management
- React Query for server state
- Tailwind CSS styling
- MUI components
- Google Maps integration
- React Three Fiber for 3D elements
- Lucide React icons
- React Hook Form
- React Hot Toast / Sonner notifications
- Redux Persist for local storage
- Country-State-City data
- Date/time utilities

#### Infrastructure
- Vercel deployment configuration
- Supabase schema (optional backend)
- Seed data SQL files
- Listings spreadsheet guide

### Features
- Auto-save forms
- JWT + refresh token authentication
- Role-based access control
- File upload to AWS S3
- Email notifications
- Google Maps integration
- Real-time data updates
- Responsive design
- Dark mode support (implied)

---

## [0.0.1] - 2024-01-01

### Added
- Initial project setup
- Basic MERN stack structure
- User authentication (basic)
- First page templates

---

[Unreleased]: https://github.com/pranavgawasproject/Nomads_Travel/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/pranavgawasproject/Nomads_Travel/releases/tag/v1.0.0
[0.0.1]: https://github.com/pranavgawasproject/Nomads_Travel/releases/tag/v0.0.1
