# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start dev server (Vite)
npm run build      # tsc type-check + Vite production build
npm run lint       # ESLint
npm run preview    # preview production build locally
```

There are no tests in this project.

## Stack

- **React 19** + **TypeScript** via Vite
- **Tailwind CSS v3** for styling
- **React Router DOM v7** for routing (`BrowserRouter`)
- **GSAP + ScrollTrigger** for scroll animations (Community section)

## Routes

| Path | Component |
|------|-----------|
| `/` | `pages/Home.tsx` |
| `/work` | `pages/Work.tsx` |
| `/detail` | `pages/ProjectDetail.tsx` |

`App.tsx` wraps all routes in `<BrowserRouter>` and renders `<Footer>` globally outside `<Routes>`. `<ScrollToTop>` resets scroll position on route change.

## Design Token System

All font sizes and spacing tokens are CSS custom properties defined in **one consolidated `@layer base` block** in `src/index.css`. There are exactly **4 breakpoints**:

| Breakpoint | Purpose |
|---|---|
| base | Mobile |
| `768px` | Tablet |
| `1024px` | Laptop |
| `1440px` | Large screen |

**To change any font size at a specific breakpoint, edit only `src/index.css`.** The Tailwind config (`tailwind.config.js`) references these vars — never hardcode sizes in components.

### Semantic Tailwind font-size tokens

`text-navbar` · `text-hero` · `text-head` · `text-subhead` · `text-sectionhead` · `text-body` · `text-power` · `text-vertical`

### Font utility classes

| Class | Font | Use |
|---|---|---|
| `font-primary` | Poppins | Headings, nav, display text |
| `font-secondary` | DM Sans | Body copy, descriptions, labels |
| `font-mono` | IBM Plex Mono | Monospace/code |

To swap a font globally: update `--font-primary` / `--font-secondary` in `src/index.css` **and** the Google Fonts import in `index.html`.

## Layout Conventions

- **Hero section has no max-width** — it is always full-bleed.
- **All other sections** constrain their inner content with `max-w-site mx-auto` (`max-w-site` = `1440px`, defined in `tailwind.config.js`).
- The `Navbar` component (inside Hero) is `position: absolute`. The `StickyNavbar` component is `position: sticky top-0` and appears after the Hero section in `Home.tsx`.

## Home Page Section Order

```
Hero (with Navbar)
StickyNavbar
Community      #community
OurService     #ourservice
FaqSection     #faqsection
SocialSection  #social
Footer (global)
```

The `#courses` section/route exists but is currently commented out in `Home.tsx`. "Work" nav items link to `/work` (not a scroll anchor).

## Known Stale References

`Work.tsx` and `App.tsx` still use `font-poppins` / `font-roboto` class names (pre-refactor). These should be updated to `font-primary` / `font-secondary` when touching those files.
