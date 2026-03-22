# BOCRA Website Deployment Guide

## Current Architecture

- Public site: React + Vite static build
- Build output: `dist/public`
- Metadata generation: `pnpm build` now generates `robots.txt` and `sitemap.xml` from `VITE_SITE_URL`
- Demo auth flow: Supabase-backed users and profiles, exposed through the Express server in [`server/_core/index.ts`](./server/_core/index.ts)
- Demo seed: `pnpm demo:seed`

## Important Deployment Reality

The current `vercel.json` configuration deploys the public site as a static app from `dist/public`.

That means:

- Public pages work on Vercel
- Portal and admin demo flows require the Express server from [`server/_core/index.ts`](./server/_core/index.ts) or a future migration to browser-native Supabase auth
- There is no `api/index.ts` requirement in this repo

If you want hosted portal/admin login today, deploy the Node server separately or run the full stack locally with `pnpm dev`.

## Environment Variables

### Frontend / build

```env
VITE_SITE_URL=https://bocra-website-gilt.vercel.app
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

`VITE_SUPABASE_ANON_KEY` is still supported as a fallback, but the preferred key name in this repo is `VITE_SUPABASE_PUBLISHABLE_KEY`.

### Server / demo auth

```env
SUPABASE_SECRET_KEY=sb_secret_...
JWT_SECRET=replace-with-a-long-random-string
```

`SUPABASE_SERVICE_ROLE_KEY` is also accepted as a fallback for the server scripts and auth layer.

### Optional

```env
VITE_SUPABASE_ANON_KEY=...
```

`DATABASE_URL` is not required for the current Supabase-first public content and demo auth flow.

## Build Commands

### Public static build

```bash
pnpm build
```

This does two things:

1. builds the client to `dist/public`
2. generates `dist/public/robots.txt` and `dist/public/sitemap.xml`

### Local full-stack demo

```bash
pnpm dev
```

This runs the Express server plus the Vite app together so `/api/auth/*`, `/api/portal/overview`, and `/api/admin/overview` are available.

## Vercel Settings

Use these project settings:

- Build Command: `pnpm build`
- Install Command: `pnpm install`
- Output Directory: `dist/public`

Set at least these frontend env vars in Vercel:

```env
VITE_SITE_URL=https://bocra-website-gilt.vercel.app
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

## Demo Seed Workflow

Run this before judging:

```bash
pnpm demo:seed
```

Default seeded accounts:

- Admin: `admin.demo@bocra.org.bw`
- Citizen: `citizen.demo@bocra.org.bw`

The script also seeds:

- 4 complaints across `open`, `in_review`, `resolved`, and `closed`
- 2 contact submissions across `new` and `read`

You can override the default accounts with:

```env
DEMO_ADMIN_EMAIL=
DEMO_ADMIN_PASSWORD=
DEMO_CITIZEN_EMAIL=
DEMO_CITIZEN_PASSWORD=
```

## Recommended Demo Setup

For the hackathon, use this split:

1. Deploy the public marketing site to Vercel.
2. Run `pnpm dev` locally for the live portal/admin walkthrough.
3. Run `pnpm demo:seed` shortly before judging.
4. Verify the citizen and admin logins with the seeded accounts.

## Verification

Before demoing, confirm:

```bash
pnpm check
pnpm build
pnpm demo:seed
```

Then verify:

- `/news`
- `/publications`
- `/consultations`
- `/contact`
- `/portal/login`
- `/portal/dashboard`
- `/admin/login`
- `/admin/dashboard`
