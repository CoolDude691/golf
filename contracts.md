# API Contracts – MiniGolf USA Directory

## Auth (JWT, Bearer token in `Authorization` header)
- `POST /api/auth/login` `{username, password}` → `{token, user:{id, username, role}}` (401 on bad creds, 429 after 5 fails/15 min)
- `GET /api/auth/me` (auth) → `{id, username, role}`

## Public
- `GET /api/states` → `[{code, name, count, cities:[string]}]`
- `GET /api/courses?state=&city=(slug)&featured=true&sort=top&limit=&q=` → `Course[]`
- `GET /api/courses/{id}` → `Course`
- `GET /api/popular-cities` → `[{city, state, slug, courses, avgRating}]` (top 12 by course count)
- `GET /api/content` → `SiteContent`

## Admin (auth required)
- `POST /api/courses` `CourseIn` → `Course`
- `PUT /api/courses/{id}` `CourseIn` → `Course`
- `DELETE /api/courses/{id}` → `{ok:true}`
- `PUT /api/content` `SiteContent` → `SiteContent`

## Models
```
Course: { id, name, city, citySlug, state(code lowercase), rating(0-5), reviewCount, featured,
          image, address, phone, website, priceRange, description, hours{Mon..Sun}, createdAt }
SiteContent: { heroTitle1, heroTitle2, heroSubtitle, introTitle, introParagraphs[], stats[{title,text}],
               whyTitle, whyParagraphs[], shareTitle, shareText }
```

## Mock → Real mapping
| mock.js export | replacement |
|---|---|
| COURSES / getCoursesByState / getCoursesByCity / getCourse / getFeatured / getTopRated / searchCourses | `/api/courses*` |
| POPULAR_CITIES | `/api/popular-cities` |
| SITE_CONTENT | `/api/content` |
| STATES, stateByCode, slugifyCity, HERO_IMAGE, COURSE_IMAGES | kept as static constants in `src/constants.js` |
| AdminLogin hardcoded admin/admin123 + localStorage | `/api/auth/login` + Bearer token in localStorage |
| AdminDashboard localStorage persistence | real CRUD endpoints |

## Seeding
On startup: seed admin user from env (`ADMIN_USERNAME`/`ADMIN_PASSWORD`), ~150 courses across all 50 states
(only if `courses` empty), and default site content (only if `site_content` empty).
