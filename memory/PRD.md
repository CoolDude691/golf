# MiniGolf USA Directory – PRD

## Original Problem Statement
Pixel-perfect clone of https://www.minigolfusa.online/ (design, layout, colors, fonts, images, structure) plus a dynamic admin panel to manage all content.

## User Choices
- JWT-based custom auth for admin (username/password), not Google OAuth
- Seed DB with ~120-150 realistic sample courses across all 50 states
- Frontend-first workflow with mock, then backend integration

## Architecture
- Frontend: React + TailwindCSS + React Router, `src/api.js` (axios, Bearer token from localStorage `admin_token`), `src/constants.js` (STATES, helpers)
- Backend: FastAPI `/app/backend/server.py`, seed generator `/app/backend/seed_data.py`, MongoDB (motor)
- Collections: `courses` (uuid id, name, city, citySlug, state, rating, reviewCount, featured, image, address, phone, website, priceRange, description, hours, createdAt), `users` (admin), `site_content` (key=main), `login_attempts`
- Contracts: `/app/contracts.md`

## Implemented (2026-06)
- Public pages: Home (hero, SEO intro, featured, stats, why, popular cities, browse by state, top rated, share), StatesIndex, StatePage (+city filter), CoursePage, TopRated (load more), header live search
- Backend: `/api/states`, `/api/courses` (filters state/city/featured/sort/q/limit), `/api/courses/{id}`, `/api/popular-cities`, `/api/content`
- Admin: JWT login (`/api/auth/login`, `/api/auth/me`), brute-force lockout (5 fails/15 min), course CRUD, featured toggle, homepage content editor (`PUT /api/content`)
- Seeding on startup: admin from env (`ADMIN_USERNAME`/`ADMIN_PASSWORD`), 151 courses across 50 states, default site content
- Testing: iteration_1 – backend 23/23, frontend 100%
- Admin link: visible "Admin" pill in header nav (desktop + mobile menu) and "Admin Login" button in footer → /admin
- Deployment: `/app/vercel.json` added (builds /frontend, SPA rewrites) after user hit Vercel "No entrypoint" error; CI=true build verified (iteration_2). Backend cannot run on Vercel — recommended Emergent Deploy.

## Backlog
- P1: Blog page (header link `#blog` is a placeholder)
- P1: Image upload for courses (object storage) instead of URL field
- P2: Styled delete-confirmation modal instead of window.confirm
- P2: Pagination/server-side search for large directories
- P2: Explicit CORS origins for production
