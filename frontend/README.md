# RoamIQ Frontend (v2 — Next.js Redesign)

A from-scratch redesign of the RoamIQ digital nomad platform UI. This directory
replaces the original Vite + React + MUI frontend with a modern **Next.js 16 +
Tailwind CSS 4 + shadcn/ui** stack.

> **Looking for the original Vite frontend?** It is preserved in the `main`
> branch history.

---

## What's new in this redesign

- **Editorial-style hero** with full-bleed workation imagery, AI search bar
  with example chips, and live trust stats.
- **Warm travel-inspired palette** — cream, deep forest green, sunset amber —
  replacing the original dark MUI theme. Full light/dark mode via `next-themes`.
- **Bento-style features grid** (6 asymmetric cards) replacing the original's
  flat button grid.
- **Trending destinations carousel** with real city imagery, cost / WiFi /
  rating / visa metadata for 8 cities.
- **Interactive cost comparison** — animated bar charts breaking down
  Chiang Mai vs Lisbon line-by-line.
- **Roadmap timeline, testimonials, and a bold CTA panel** the original lacked.
- **Sticky responsive nav** with mobile menu, theme toggle, and a
  comprehensive 4-column footer.
- **Typography**: Fraunces (serif headlines) + Inter (body) + Geist Mono
  (numerics/labels).

## Tech stack

| Layer            | Choice                                  |
| ---------------- | --------------------------------------- |
| Framework        | Next.js 16 (App Router)                 |
| Language         | TypeScript 5                            |
| Styling          | Tailwind CSS 4 + custom design tokens   |
| UI primitives    | shadcn/ui (New York style)              |
| Animation        | Framer Motion                           |
| Theming          | next-themes (light default, dark ready) |
| Icons            | lucide-react                            |

## Getting started

```bash
cd frontend
npm install        # or: bun install / pnpm install
npm run dev        # http://localhost:3000
```

Build for production:

```bash
npm run build
npm start
```

## Project structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── globals.css        # Design tokens + Tailwind layers
│   │   ├── layout.tsx         # Root layout, fonts, ThemeProvider
│   │   └── page.tsx           # Composes all section components
│   └── components/
│       ├── site/              # Redesign sections (10 files)
│       │   ├── nav.tsx
│       │   ├── hero.tsx
│       │   ├── features.tsx
│       │   ├── destinations.tsx
│       │   ├── comparison.tsx
│       │   ├── why-roamiq.tsx
│       │   ├── roadmap.tsx
│       │   ├── testimonials.tsx
│       │   ├── cta.tsx
│       │   └── footer.tsx
│       ├── ui/                # shadcn/ui primitives (48 components)
│       └── hooks/             # use-mobile, use-toast
├── public/                    # Static assets
├── package.json
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── components.json            # shadcn config
└── eslint.config.mjs
```

## Design tokens

All brand colors are defined as CSS variables in `src/app/globals.css`:

| Token        | Light     | Dark      | Usage                         |
| ------------ | --------- | --------- | ----------------------------- |
| `--cream`    | `#FBF7EE` | `#14110D` | Page background               |
| `--sand`     | `#F0E7D3` | `#1F1A14` | Cards, secondary surfaces     |
| `--ink`      | `#1A1411` | `#F5EFE0` | Foreground text               |
| `--forest`   | `#0F3D2E` | `#4FCB95` | Primary (buttons, accents)    |
| `--sunset`   | `#E8804A` | `#FF9D63` | Accent (CTAs, highlights)     |
| `--terracotta` | `#C84B31` | `#E66449` | Tertiary accent             |
| `--clay`     | `#B86B4B` | `#D6926D` | Quaternary accent             |

## Backend integration notes

This redesign is **UI-only**. It does not wire into the existing Express +
MongoDB + Supabase backend in `../backend/`. To integrate:

1. Replace placeholder copy in `src/components/site/destinations.tsx` with
   data fetched from the backend's `/api/cities` endpoint.
2. Wire the hero search bar to the existing AI trip planner API.
3. Replace testimonial avatars and quotes with real data from `/api/testimonials`
   or Supabase.
4. Connect the email signup form in `cta.tsx` to your existing newsletter /
   Supabase auth flow.

## License

MIT — same as the parent project.
