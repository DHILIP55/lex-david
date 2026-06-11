# Lex & David — Full Project Documentation

> **Copy this entire file into Google Docs or paste into Word** — all headings, tables, and code blocks will format automatically.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Environment Variables](#3-environment-variables)
4. [Running the Project](#4-running-the-project)
5. [Project Structure](#5-project-structure)
6. [Database Models](#6-database-models)
7. [API Reference](#7-api-reference)
8. [Frontend Pages](#8-frontend-pages)
9. [Admin CMS Pages](#9-admin-cms-pages)
10. [Authentication](#10-authentication)
11. [File Uploads](#11-file-uploads)
12. [Email Enquiry](#12-email-enquiry)
13. [Dependencies](#13-dependencies)

---

## 1. Project Overview

**Lex & David** is a portfolio/creative studio website consolidated into a single Next.js 16.2.7 application. It replaces three separate processes (React/Vite frontend, Express backend, Next.js admin) with one unified app.

| Zone | URL Prefix | Description |
|---|---|---|
| Public Site | `/`, `/about`, `/work`, `/detail/[slug]` | Portfolio frontend |
| Admin CMS | `/admin/login`, `/admin/dashboard`, `/admin/hero`, … | Content management |
| API | `/api/hero`, `/api/projects`, … | REST API (replaces Express) |

- **Database:** MongoDB `127.0.0.1:27017/lex-david`
- **Static uploads:** Served from `public/uploads/` by Next.js
- **Dev server:** `localhost:3000`

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.7 |
| UI Library | React | 19.2.4 |
| Language | TypeScript | ^5 |
| Database | MongoDB + Mongoose | ^8.4.1 |
| Styling | Tailwind CSS | ^3.4.19 |
| Animations | GSAP + ScrollTrigger | ^3.12.5 |
| Auth | JSON Web Token | ^9.0.2 |
| Password | bcrypt | ^5.1.1 |
| Email | Nodemailer (Gmail) | ^8.0.10 |
| HTTP Client | Axios | ^1.17.0 |
| Build | Turbopack | (bundled with Next 16) |

---

## 3. Environment Variables

File: `admin/.env.local`

```
GMAIL_USER=dhilipflynet@gmail.com
GMAIL_PASS=mwljdxgkgdrfvpsi
ENQUIRY_TO=dhilipflynet@gmail.com
```

| Variable | Value | Description |
|---|---|---|
| `GMAIL_USER` | dhilipflynet@gmail.com | Gmail account used to send enquiry emails |
| `GMAIL_PASS` | mwljdxgkgdrfvpsi | Gmail **App Password** (16 chars, no spaces) |
| `ENQUIRY_TO` | dhilipflynet@gmail.com | Destination inbox for all enquiry form submissions |
| `MONGO_URI` | *(not set — uses default)* | MongoDB connection string. Default: `mongodb://127.0.0.1:27017/lex-david` |
| `JWT_SECRET` | *(not set — uses default)* | JWT signing secret. Default: `lex_david_super_secret_jwt_key_2024` |

> **Production note:** Always set `MONGO_URI` and `JWT_SECRET` explicitly in production environments.

---

## 4. Running the Project

### Prerequisites
- Node.js 18+
- MongoDB running locally on port 27017

### Start Dev Server
```bash
cd admin
npm install
npm run dev
```
Server starts at: **http://localhost:3000**

### Admin Login
- URL: http://localhost:3000/admin/login
- Email: admin@lexdavid.com
- Password: admin123

### Seed Database (first-time setup)
```bash
cd admin
npx ts-node scripts/seed.ts
```

---

## 5. Project Structure

```
admin/
├── app/
│   ├── page.tsx                         # Home page (Server Component wrapper)
│   ├── about/page.tsx                   # About/Community page
│   ├── work/page.tsx                    # Projects gallery
│   ├── detail/[slug]/page.tsx           # Project detail (GSAP animations)
│   ├── admin/
│   │   ├── (auth)/login/page.tsx        # CMS login
│   │   └── (cms)/
│   │       ├── layout.tsx               # Auth guard + sidebar
│   │       ├── dashboard/page.tsx
│   │       ├── hero/page.tsx
│   │       ├── community/page.tsx
│   │       ├── services/page.tsx
│   │       ├── faq/page.tsx
│   │       ├── social/page.tsx
│   │       ├── navigation/page.tsx
│   │       └── projects/
│   │           ├── page.tsx             # Projects list
│   │           ├── new/page.tsx         # Create project
│   │           ├── [id]/page.tsx        # Edit project
│   │           └── [id]/detail/page.tsx # Edit project detail
│   ├── api/
│   │   ├── auth/login/route.ts
│   │   ├── auth/me/route.ts
│   │   ├── hero/route.ts
│   │   ├── community/route.ts
│   │   ├── services/route.ts
│   │   ├── services/reorder/route.ts
│   │   ├── services/[id]/route.ts
│   │   ├── faq/route.ts
│   │   ├── faq/reorder/route.ts
│   │   ├── faq/[id]/route.ts
│   │   ├── social/route.ts
│   │   ├── projects/route.ts
│   │   ├── projects/[slug]/route.ts
│   │   ├── projects/[slug]/detail/route.ts
│   │   ├── upload/route.ts
│   │   ├── nav/route.ts
│   │   └── enquire/route.ts
│   ├── globals.css
│   └── layout.tsx                       # Root layout (fonts, metadata)
├── components/
│   ├── site/
│   │   ├── HomeClient.tsx               # Home page client component
│   │   ├── layout/
│   │   │   ├── Navbar.tsx               # Hero navbar (transparent, absolute)
│   │   │   ├── StickyNavbar.tsx         # Sticky white navbar
│   │   │   └── Footer.tsx               # Site footer
│   │   └── sections/
│   │       ├── Hero.tsx
│   │       ├── Community.tsx
│   │       ├── OurService.tsx
│   │       ├── FaqSection.tsx
│   │       └── SocialSection.tsx
│   └── (admin components)
├── lib/
│   ├── db.ts                            # MongoDB singleton connection
│   ├── auth.ts                          # JWT sign + verify helpers
│   └── models/
│       ├── Admin.ts
│       ├── Hero.ts
│       ├── Nav.ts
│       ├── Community.ts
│       ├── Service.ts
│       ├── Faq.ts
│       ├── Social.ts
│       ├── Project.ts
│       └── ProjectDetail.ts
├── utils/
│   ├── api.ts                           # fetchApi helper (relative paths)
│   └── spx.ts                           # Fluid spacing utility
├── public/
│   ├── uploads/                         # User-uploaded images
│   └── assets/                          # Static site assets (logo, hero bg, etc.)
├── .env.local                           # Environment variables
├── next.config.ts
├── tailwind.config.js
└── package.json
```

---

## 6. Database Models

MongoDB database: **lex-david**

### Admin
Collection: `admins`

| Field | Type | Notes |
|---|---|---|
| email | String | Required, unique |
| passwordHash | String | bcrypt hash |
| createdAt | Date | Auto |
| updatedAt | Date | Auto |

---

### Hero
Collection: `heroes` — **Singleton** (`_id: "hero"`)

| Field | Type | Notes |
|---|---|---|
| _id | String | Fixed: `"hero"` |
| words | String[] | Animated words in hero section |
| backgroundImageUrl | String | URL to hero background image |

---

### Nav
Collection: `navs` — **Singleton** (`_id: "nav"`)

| Field | Type | Notes |
|---|---|---|
| _id | String | Fixed: `"nav"` |
| logoUrl | String | URL to site logo image |
| items | NavItem[] | Desktop + mobile nav links |
| mobileFooterLinks | FooterLink[] | Links at bottom of mobile menu |

**NavItem sub-schema:**

| Field | Type | Notes |
|---|---|---|
| order | Number | Sort order |
| prefixLabel | String | Optional italic prefix (e.g. arrow symbol ↑) |
| label | String | Required, main nav text |
| type | `"link"` \| `"scroll"` | Page link or scroll-to-section |
| target | String | Route path or section ID |

---

### Community
Collection: `communities` — **Singleton** (`_id: "community"`)

| Field | Type | Notes |
|---|---|---|
| _id | String | Fixed: `"community"` |
| aboutTitle | String | Page/section heading |
| aboutSubtitle | String | Subtitle (e.g. "Studio / Chennai") |
| aboutBody | String | Main body paragraph |
| establishedYear | String | e.g. "Est. 2024" |
| cards | Card[] | Scroll-pinned info cards |

**Card sub-schema:**

| Field | Type | Notes |
|---|---|---|
| index | String | e.g. "01", "02" |
| title | String | Card heading |
| bgClass | String | Tailwind bg class e.g. `bg-[var(--orange-color-1)]` |
| body | String | Card body text |

---

### Service
Collection: `services`

| Field | Type | Notes |
|---|---|---|
| order | Number | Sort order, default 0 |
| index | String | e.g. "01", "02" |
| title | String | Required |
| tags | String[] | Pill tags shown in accordion |
| description | String | Expanded description text |
| isVisible | Boolean | Whether shown on site, default true |
| createdAt | Date | Auto |
| updatedAt | Date | Auto |

---

### Faq (Category)
Collection: `faqs`

| Field | Type | Notes |
|---|---|---|
| categoryName | String | Required, category heading |
| order | Number | Sort order, default 0 |
| items | FaqItem[] | Q&A pairs |
| createdAt | Date | Auto |
| updatedAt | Date | Auto |

**FaqItem sub-schema:**

| Field | Type | Notes |
|---|---|---|
| question | String | Question text |
| answer | String | Answer text |
| order | Number | Sort order within category |

---

### Social
Collection: `socials` — **Singleton** (`_id: "social"`)

| Field | Type | Notes |
|---|---|---|
| _id | String | Fixed: `"social"` |
| items | SocialItem[] | Social/contact links |

**SocialItem sub-schema:**

| Field | Type | Notes |
|---|---|---|
| label | String | e.g. "Instagram" |
| value | String | Handle or URL |
| order | Number | Sort order |

---

### Project
Collection: `projects`

| Field | Type | Notes |
|---|---|---|
| title | String | Required |
| slug | String | Required, unique, URL-safe |
| coverImageUrl | String | Cover photo URL |
| gridLayout | String | `"full"`, `"half-left"`, `"half-right"`, `"half-pair"` |
| order | Number | Sort order, default 0 |
| isPublished | Boolean | Shown on public site, default false |
| category | String | Project category tag |
| description | String | Short description |
| createdAt | Date | Auto |
| updatedAt | Date | Auto |

---

### ProjectDetail
Collection: `projectdetails`

| Field | Type | Notes |
|---|---|---|
| projectSlug | String | Required, unique, links to Project.slug |
| heading | String | Detail page large heading |
| subheading | String | Detail page subheading |
| bodyText | String | Main body copy |
| images | ProjectImage[] | Gallery images |
| createdAt | Date | Auto |
| updatedAt | Date | Auto |

**ProjectImage sub-schema:**

| Field | Type | Notes |
|---|---|---|
| url | String | Image URL |
| layout | `"full"` \| `"half"` | Full-width or half-width display |
| order | Number | Sort order |

---

## 7. API Reference

### Authentication Header
All protected endpoints require:
```
Authorization: Bearer <jwt_token>
```

---

### Auth Endpoints

#### POST /api/auth/login
Login as admin.

**Request Body:**
```json
{ "email": "admin@lexdavid.com", "password": "admin123" }
```

**Response 200:**
```json
{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

**Response 401:**
```json
{ "message": "Invalid credentials" }
```

---

#### GET /api/auth/me
Get current admin info. **Auth required.**

**Response 200:**
```json
{ "_id": "...", "email": "admin@lexdavid.com", "createdAt": "..." }
```

---

### Hero Endpoints

#### GET /api/hero
Fetch hero section data.

**Response 200:**
```json
{
  "_id": "hero",
  "words": ["Creative", "Studio", "Chennai"],
  "backgroundImageUrl": "/uploads/hero-bg.jpg"
}
```

---

#### PUT /api/hero
Update hero section. **Auth required.**

**Request Body:**
```json
{
  "words": ["Creative", "Studio", "Chennai"],
  "backgroundImageUrl": "/uploads/hero-bg.jpg"
}
```

**Response 200:** Updated hero object.

---

### Navigation Endpoints

#### GET /api/nav
Fetch navigation config.

**Response 200:**
```json
{
  "_id": "nav",
  "logoUrl": "/uploads/logo.png",
  "items": [
    { "order": 0, "prefixLabel": "", "label": "HOME", "type": "scroll", "target": "hero" },
    { "order": 1, "prefixLabel": "↑", "label": "ABOUT", "type": "link", "target": "/about" }
  ],
  "mobileFooterLinks": [
    { "label": "INSTAGRAM", "order": 0 }
  ]
}
```

---

#### PUT /api/nav
Update navigation config. **Auth required.**

**Request Body:** Same shape as GET response.

**Response 200:** Updated nav object.

---

### Community/About Endpoints

#### GET /api/community
Fetch about/community section.

**Response 200:**
```json
{
  "_id": "community",
  "aboutTitle": "About Us",
  "aboutSubtitle": "Studio / Chennai",
  "aboutBody": "Lex & David is a Chennai-based creative studio...",
  "establishedYear": "Est. 2024",
  "cards": [
    { "index": "01", "title": "What We Do", "bgClass": "bg-[var(--orange-color-1)]", "body": "..." }
  ]
}
```

---

#### PUT /api/community
Update about/community section. **Auth required.**

**Request Body:** Same shape as GET response.

---

### Services Endpoints

#### GET /api/services
Fetch all services.

**Response 200:**
```json
[
  {
    "_id": "abc123",
    "order": 0,
    "index": "01",
    "title": "Brand Design",
    "tags": ["Identity", "Logo", "Brand Strategy"],
    "description": "We craft...",
    "isVisible": true
  }
]
```

---

#### POST /api/services
Create a new service. **Auth required.**

**Request Body:**
```json
{
  "title": "New Service",
  "order": 3,
  "index": "04",
  "tags": [],
  "description": "",
  "isVisible": true
}
```

**Response 201:** Created service object.

---

#### PUT /api/services/[id]
Update a service. **Auth required.**

**Request Body:** Any service fields to update.

**Response 200:** Updated service object.

---

#### DELETE /api/services/[id]
Delete a service. **Auth required.**

**Response 200:**
```json
{ "ok": true }
```

---

#### PUT /api/services/reorder
Reorder services by sending ordered ID array. **Auth required.**

**Request Body:**
```json
{ "ids": ["id1", "id2", "id3"] }
```

**Response 200:**
```json
{ "ok": true }
```

---

### FAQ Endpoints

#### GET /api/faq
Fetch all FAQ categories with their Q&A items.

**Response 200:**
```json
[
  {
    "_id": "abc123",
    "categoryName": "General",
    "order": 0,
    "items": [
      { "question": "What do you do?", "answer": "We design...", "order": 0 }
    ]
  }
]
```

---

#### POST /api/faq
Create a FAQ category. **Auth required.**

**Request Body:**
```json
{ "categoryName": "New Category", "order": 2, "items": [] }
```

**Response 201:** Created category object.

---

#### PUT /api/faq/[id]
Update a FAQ category. **Auth required.**

**Request Body:** Any category fields including updated `items` array.

**Response 200:** Updated category object.

---

#### DELETE /api/faq/[id]
Delete a FAQ category. **Auth required.**

**Response 200:**
```json
{ "ok": true }
```

---

#### PUT /api/faq/reorder
Reorder FAQ categories. **Auth required.**

**Request Body:**
```json
{ "ids": ["id1", "id2", "id3"] }
```

---

### Social Endpoints

#### GET /api/social
Fetch social/contact links.

**Response 200:**
```json
{
  "items": [
    { "label": "Instagram", "value": "@lexanddavid", "order": 0 },
    { "label": "YouTube", "value": "youtube.com/lexdavid", "order": 1 }
  ]
}
```

---

#### PUT /api/social
Update social links. **Auth required.**

**Request Body:**
```json
{
  "items": [
    { "label": "Instagram", "value": "@lexanddavid", "order": 0 }
  ]
}
```

---

### Projects Endpoints

#### GET /api/projects
Fetch projects.

**Query Params:**
- `?published=true` — return only published projects (for public site)
- *(no param)* — return all projects (for CMS)

**Response 200:**
```json
[
  {
    "_id": "abc123",
    "title": "Brand Identity — Studio X",
    "slug": "studio-x",
    "coverImageUrl": "/uploads/cover.jpg",
    "gridLayout": "full",
    "order": 0,
    "isPublished": true,
    "category": "Branding",
    "description": "A full brand identity project..."
  }
]
```

---

#### POST /api/projects
Create a new project. **Auth required.**

**Request Body:**
```json
{
  "title": "New Project",
  "slug": "new-project",
  "coverImageUrl": "",
  "gridLayout": "full",
  "category": "Branding",
  "description": "",
  "isPublished": false,
  "order": 0
}
```

**Response 201:** Created project object.

---

#### GET /api/projects/[slug]
Fetch a single project by slug.

**Response 200:** Project object.
**Response 404:** `{ "message": "Not found" }`

---

#### PUT /api/projects/[slug]
Update a project. **Auth required.**

**Request Body:** Any project fields to update.

**Response 200:** Updated project object.

---

#### DELETE /api/projects/[slug]
Delete a project. **Auth required.**

**Response 200:**
```json
{ "ok": true }
```

---

### Project Detail Endpoints

#### GET /api/projects/[slug]/detail
Fetch the detail page content for a project.

**Response 200:**
```json
{
  "projectSlug": "studio-x",
  "heading": "Studio X Identity",
  "subheading": "Brand Design 2024",
  "bodyText": "A deep dive into the visual language...",
  "images": [
    { "url": "/uploads/img1.jpg", "layout": "full", "order": 0 },
    { "url": "/uploads/img2.jpg", "layout": "half", "order": 1 }
  ]
}
```

---

#### PUT /api/projects/[slug]/detail
Update (or create) project detail. **Auth required.**

**Request Body:** Same shape as GET response (upsert).

**Response 200:** Updated detail object.

---

### Upload Endpoint

#### POST /api/upload
Upload an image file. **Auth required.**

**Request:** `multipart/form-data` with field `file` (image file).

**Response 200:**
```json
{ "url": "/uploads/1749123456789.jpg" }
```

> Images are saved to `public/uploads/` and served statically at `/uploads/filename`.

**Supported types:** JPEG, PNG, WebP, GIF, SVG

---

### Enquiry Endpoint

#### POST /api/enquire
Submit a contact enquiry. **No auth required** (public endpoint).

**Request Body:**
```json
{
  "email": "client@example.com",
  "subject": "Brand Design Project",
  "message": "Hi, we'd like to discuss a branding project..."
}
```

**Response 200:**
```json
{ "ok": true }
```

**Response 400:**
```json
{ "error": "All fields are required." }
```

**Side effect:** Sends an HTML email to `dhilipflynet@gmail.com` via Gmail SMTP with `replyTo` set to the sender's email.

---

## 8. Frontend Pages

### / — Home Page
- **File:** `app/page.tsx` → `components/site/HomeClient.tsx`
- **Data fetched by child sections:**
  - Hero: `GET /api/hero`
  - Community: `GET /api/community`
  - Services: `GET /api/services`
  - FAQ: `GET /api/faq`
  - Social: `GET /api/social`
  - Nav: `GET /api/nav` (by Navbar + StickyNavbar)
- **Features:** Enquire side-tab, enquire modal with email submission, smooth scroll between sections

---

### /about — About Page
- **File:** `app/about/page.tsx`
- **Data:** `GET /api/community`
- **Features:** GSAP scroll-pinned cards (desktop), responsive mobile layout, "Scroll" indicator
- **Loading state:** Skeleton with pulsing placeholder bars

---

### /work — Work Gallery
- **File:** `app/work/page.tsx`
- **Data:** `GET /api/projects?published=true`
- **Features:** Dynamic grid layout (full-width and half-pair cards), "Show More" links
- **Loading state:** Skeleton grid cards

---

### /detail/[slug] — Project Detail
- **File:** `app/detail/[slug]/page.tsx`
- **Data:** `GET /api/projects/[slug]` + `GET /api/projects/[slug]/detail`
- **Features:** GSAP split-panel animation on desktop (heading rotates 90°, left panel collapses), full/half image gallery, responsive mobile layout
- **Loading state:** Split-panel skeleton (desktop + mobile)

---

## 9. Admin CMS Pages

All CMS routes are protected by `AuthGuard` — unauthenticated users are redirected to `/admin/login`.

| Route | Page | Description |
|---|---|---|
| `/admin/login` | Login | Email + password login |
| `/admin/dashboard` | Dashboard | Quick links to all CMS sections |
| `/admin/hero` | Hero | Edit hero words + background image |
| `/admin/community` | Community | Edit about page text + scroll cards |
| `/admin/services` | Services | CRUD for service accordion items |
| `/admin/faq` | FAQ | CRUD for FAQ categories + Q&A pairs |
| `/admin/social` | Social | Edit social/contact link rows |
| `/admin/navigation` | Navigation | Edit logo, nav items, mobile footer links |
| `/admin/projects` | Projects | List all projects, publish/draft toggle |
| `/admin/projects/new` | New Project | Create new project with cover image |
| `/admin/projects/[id]` | Edit Project | Edit project metadata |
| `/admin/projects/[id]/detail` | Edit Detail | Edit detail page heading, body, image gallery |

### Navigation CMS Features
- Upload site logo (shown in both navbars)
- Add/reorder/delete nav items
- Per nav item: prefix label (with arrow symbol picker ↑ ↗ → etc.), label, type (link/scroll), target
- Add/delete mobile footer links

---

## 10. Authentication

### Flow
1. User POSTs credentials to `POST /api/auth/login`
2. Server verifies email + bcrypt password hash
3. Server returns a signed JWT (7-day expiry)
4. Frontend stores token in `localStorage` as `adminToken`
5. All subsequent admin API calls include `Authorization: Bearer <token>`
6. Server's `verifyAuth()` validates token on every protected route

### JWT Configuration
- **Secret:** `lex_david_super_secret_jwt_key_2024` *(set `JWT_SECRET` env var in production)*
- **Expiry:** 7 days
- **Algorithm:** HS256

### AuthGuard
The CMS layout (`app/admin/(cms)/layout.tsx`) wraps all CMS pages in `<AuthGuard>` which:
- Reads `localStorage.adminToken`
- Calls `GET /api/auth/me` to verify token is still valid
- Redirects to `/admin/login` if missing or expired

---

## 11. File Uploads

- **Endpoint:** `POST /api/upload`
- **Auth:** Required (Bearer token)
- **Form field:** `file`
- **Save path:** `public/uploads/<timestamp>.<ext>`
- **Public URL:** `/uploads/<timestamp>.<ext>`
- **Used in:** Hero background, project cover images, project detail images, site logo

**Example using fetch:**
```javascript
const formData = new FormData();
formData.append("file", fileInput.files[0]);

const res = await fetch("/api/upload", {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` },
  body: formData,
});
const { url } = await res.json();
// url = "/uploads/1749123456789.jpg"
```

---

## 12. Email Enquiry

### Configuration
- **SMTP:** Gmail via Nodemailer
- **Sender:** `dhilipflynet@gmail.com` (Gmail App Password: `mwljdxgkgdrfvpsi`)
- **Recipient:** `dhilipflynet@gmail.com`
- **Reply-To:** Set to the enquirer's email — reply directly in Gmail

### Email Format Sent
```
From:    Lex & David Enquiry <dhilipflynet@gmail.com>
To:      dhilipflynet@gmail.com
ReplyTo: client@example.com
Subject: Enquiry: Brand Design Project

New Enquiry
-----------
From:    client@example.com
Subject: Brand Design Project
---
Hi, we'd like to discuss a branding project...
```

### Frontend Form (EnquireModal)
Fields: Email, Subject, Message
States: idle → sending (disabled button) → sent (success message + auto-close) | error (retry)

---

## 13. Dependencies

### Production

| Package | Version | Purpose |
|---|---|---|
| `next` | 16.2.7 | Full-stack React framework |
| `react` | 19.2.4 | UI library |
| `react-dom` | 19.2.4 | React DOM renderer |
| `mongoose` | ^8.4.1 | MongoDB ODM |
| `bcrypt` | ^5.1.1 | Password hashing |
| `jsonwebtoken` | ^9.0.2 | JWT auth tokens |
| `nodemailer` | ^8.0.10 | Email via Gmail SMTP |
| `gsap` | ^3.12.5 | Animations + ScrollTrigger |
| `axios` | ^1.17.0 | HTTP client (CMS admin pages) |

### Development

| Package | Version | Purpose |
|---|---|---|
| `typescript` | ^5 | Type safety |
| `tailwindcss` | ^3.4.19 | Utility CSS framework |
| `postcss` | ^8.5.3 | CSS processing |
| `autoprefixer` | ^10.4.21 | CSS vendor prefixes |
| `ts-node` | ^10.9.2 | Run TypeScript scripts (seed) |
| `eslint` | ^9 | Code linting |
| `eslint-config-next` | 16.2.7 | Next.js lint rules |
| `@types/bcrypt` | ^5.0.2 | bcrypt types |
| `@types/jsonwebtoken` | ^9.0.6 | JWT types |
| `@types/nodemailer` | ^8.0.0 | Nodemailer types |
| `@types/node` | ^20 | Node.js types |
| `@types/react` | ^19 | React types |
| `@types/react-dom` | ^19 | React DOM types |

---

## Quick Reference — Key Files

| File | Purpose |
|---|---|
| `lib/db.ts` | MongoDB singleton connection (caches across hot-reloads) |
| `lib/auth.ts` | `signToken()` + `verifyAuth()` JWT helpers |
| `utils/api.ts` | `fetchApi(path)` — fetch wrapper with relative paths |
| `app/layout.tsx` | Root layout: Google Fonts (Poppins, Playfair Display, IBM Plex Mono), CSS variables |
| `app/globals.css` | Tailwind directives + design tokens (--font-primary, --font-secondary, fluid type scale) |
| `tailwind.config.js` | Custom fontSize (text-head, text-subhead, etc.), fontFamily, maxWidth.site |
| `next.config.ts` | `serverExternalPackages: ["mongoose","bcrypt"]`, `turbopack: { root: __dirname }` |
| `scripts/seed.ts` | Database seed script (admin user + default content) |
| `.env.local` | Gmail credentials, MongoDB URI, JWT secret |

---

*Documentation generated for Lex & David — Single Next.js App (admin/)*
