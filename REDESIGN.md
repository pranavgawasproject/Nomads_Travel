# RoamIQ — UI Redesign (Next.js)

This branch (`redesign/nextjs-ui`) ships a from-scratch redesign of the RoamIQ
frontend UI, built on a modern Next.js 16 stack.

> The original Vite + React + MUI frontend is preserved in the `main` branch
> history for side-by-side comparison. The backend, Supabase schema, and Docker
> configs on this branch are untouched.

## What changed

| Aspect             | Before (main)                       | After (this branch)                          |
| ------------------ | ----------------------------------- | -------------------------------------------- |
| Framework          | Vite + React 19                     | Next.js 16 (App Router)                      |
| UI library         | MUI + custom components             | shadcn/ui (New York) + Tailwind CSS 4        |
| Styling            | Tailwind + MUI theme                | Tailwind 4 with custom design tokens         |
| Theme              | Dark only (`#0f1117`)               | Light default + dark mode via `next-themes`  |
| Animation          | `motion` (Framer Motion legacy)     | `framer-motion` 12 with scroll-in reveals    |
| Typography         | System fonts                        | Fraunces (serif) + Inter (sans) + Geist Mono |
| Color palette      | Cold dark grey/blue                 | Warm cream / forest / sunset amber           |
| Hero section       | Search input + 6 feature buttons    | Editorial hero with imagery + AI search bar  |
| Destinations       | Text-only cards                     | Image carousel with cost/WiFi/visa metadata  |
| Cost comparison    | None                                | Animated bar charts (Chiang Mai vs Lisbon)   |
| Roadmap            | Static list                         | Vertical timeline with status badges         |
| Testimonials       | None                                | 3 quote cards with avatars                   |
| CTA                | None                                | Bold forest-green panel with email signup    |

## Browse the new code

All new UI lives in [`frontend/src/components/site/`](frontend/src/components/site/),
composed by [`frontend/src/app/page.tsx`](frontend/src/app/page.tsx). See
[`frontend/README.md`](frontend/README.md) for the full structure and design
tokens.

## Run it locally

```bash
cd frontend
npm install
npm run dev    # http://localhost:3000
```

## Integration plan (not yet done)

This redesign is **UI-only**. To wire it into the existing backend:

1. Replace placeholder city data in
   [`destinations.tsx`](frontend/src/components/site/destinations.tsx) with
   calls to the backend's `/api/cities` endpoint.
2. Connect the hero AI search bar to the existing trip planner API.
3. Wire the CTA email form to Supabase auth or your newsletter provider.
4. Replace testimonial placeholders with real data.

## Why a new branch?

The redesign changes the entire frontend stack (Vite → Next.js). Keeping it on
a separate branch lets the team review the visual direction and integration
plan before merging.

---
