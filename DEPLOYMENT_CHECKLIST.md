# BOCRA Deployment Checklist

## Supabase

- [ ] `VITE_SUPABASE_URL` is set
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY` is set
- [ ] `SUPABASE_SECRET_KEY` or `SUPABASE_SERVICE_ROLE_KEY` is set locally
- [ ] `JWT_SECRET` is set locally
- [ ] `VITE_SITE_URL` is set to the real public URL

## Build

- [ ] `pnpm check` passes
- [ ] `pnpm build` passes
- [ ] `dist/public` contains `index.html`
- [ ] `dist/public/robots.txt` was generated
- [ ] `dist/public/sitemap.xml` was generated

## Public Site

- [ ] Homepage loads cleanly
- [ ] Header search opens with `Ctrl+K`
- [ ] Search returns services, news, publications, and consultations
- [ ] Footer has no dead `#` legal links
- [ ] `/services/domain-registry` reads as informational and links out to the official registry

## Demo Data

- [ ] `pnpm demo:seed` has been run
- [ ] Admin demo user can sign in
- [ ] Citizen demo user can sign in
- [ ] Complaint queue shows seeded records
- [ ] Contact queue shows seeded records

## Hosted Public Deployment

- [ ] Vercel build command is `pnpm build`
- [ ] Vercel output directory is `dist/public`
- [ ] Vercel frontend env vars point to the correct Supabase project

## Full Demo Flow

- [ ] `pnpm dev` is running for portal/admin demo routes
- [ ] `/portal/login` works
- [ ] `/portal/dashboard` shows seeded citizen complaint activity
- [ ] `/admin/login` works
- [ ] `/admin/dashboard` shows seeded complaint and contact queues

## Notes

- The repo does not require `api/index.ts`.
- The current Vercel setup is static-only for the public site.
- The Express server in [`server/_core/index.ts`](./server/_core/index.ts) is the supported path for the current Supabase-backed demo auth flow.
