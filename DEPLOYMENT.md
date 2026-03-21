# BOCRA Website - Vercel Deployment Guide

## Quick Summary

Your full-stack website will be deployed to Vercel with:

- **Frontend**: React + Vite (served as static files via CDN)
- **Backend**: Express server running as serverless functions (`/api`)
- **Database**: Supabase (PostgreSQL)

---

## Deployment Steps

### 1. Commit Your Changes to GitHub

```bash
git add .
git commit -m "Setup Vercel deployment configuration"
git push origin main
```

### 2. Go to Vercel Dashboard

- Visit [https://vercel.com](https://vercel.com)
- Click **"New Project"**
- Connect your GitHub account if not already connected
- Search for your "bocra-website" repository
- Click **"Import"**

### 3. Configure Project Settings

Once imported, Vercel will show settings:

- **Framework Preset**: Select "Other" (since you have custom setup)
- **Build Command**: `pnpm build` ✓ (should auto-detect)
- **Output Directory**: `dist` ✓ (should auto-detect)
- **Install Command**: `pnpm install --frozen-lockfile` ✓

### 4. Add Environment Variables

Click on **"Environment Variables"** and add:

#### Required Variables:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_ID=your-app-id
VITE_OAUTH_PORTAL_URL=http://localhost:3001  # Or your OAuth server URL
VITE_ANALYTICS_ENDPOINT=https://your-analytics.com  # Optional
VITE_ANALYTICS_WEBSITE_ID=your-analytics-id  # Optional

# Server-side only (not exposed to frontend)
JWT_SECRET=your-jwt-secret-key
DATABASE_URL=postgresql://user:password@your-db-host:5432/bocra_db
OAUTH_SERVER_URL=http://localhost:3001
BUILT_IN_FORGE_API_URL=https://api.example.com
BUILT_IN_FORGE_API_KEY=your-api-key
```

**Note**: Replace placeholder values with your actual Supabase/OAuth credentials.

### 5. Deploy

- Click **"Deploy"**
- Vercel will build and deploy automatically
- You'll get a URL like: `https://bocra-website.vercel.app`

---

## Continuous Deployment (Auto-Deploy on Push)

By default, Vercel is set to auto-deploy:

- Every push to `main` → automatically deploys
- Every pull request → creates preview deployment

Your team can test preview deployments in PRs before merging!

### To disable auto-deploy:

Go to **Project Settings** → **Git** → toggle "Automatic deployments"

---

## Testing Team Collaboration

### Development Workflow:

1. Team member creates a branch: `git checkout -b feature/my-feature`
2. Makes changes and pushes
3. Creates a Pull Request on GitHub
4. Vercel automatically creates a **preview deployment**
5. PR comment shows preview URL (e.g., `bocra-website-preview.vercel.app`)
6. Team tests the preview
7. Once approved, merge to `main`
8. Vercel auto-deploys to production

---

## Troubleshooting

### Build Fails

Check the Vercel build logs:

1. Go to project on Vercel
2. Click **"Deployments"**
3. Click the failed deployment
4. View build logs to see error

### Environment Variables Not Working

- Make sure variables are added in Vercel dashboard
- Redeploy after adding variables
- For client-side variables, they must start with `VITE_`
- Server-side variables don't need prefix

### API Routes Not Working

- Check that `/api/index.ts` exists
- Verify environment variables are set
- Check Vercel function logs

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check that Supabase allows your IP
- For local development, use `.env.local`
- For Vercel, use Vercel dashboard environment variables

---

## File Structure for Vercel

```
bocra-website/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   └── index.html
├── server/                 # Backend (Express)
│   ├── _core/
│   │   └── index.ts
│   └── routers.ts
├── api/                    # ← Vercel serverless functions
│   └── index.ts           # ← API handler
├── dist/                   # ← Built frontend (generated)
├── vite.config.ts         # Frontend build config
├── vercel.json            # ← Vercel config
├── .vercelignore          # ← Vercel ignore file
├── .env.local             # Local development (not deployed)
└── package.json
```

---

## Monitoring & Logs

### View Deployment Logs:

1. Vercel Dashboard → Deployments
2. Click deployment
3. View build/function logs

### Monitor Frontend Errors:

Set up Vercel Analytics (optional but recommended)

### Monitor API Errors:

Check function logs in Vercel dashboard

---

## Key Points

✅ Frontend is served from Vercel's CDN (fast)
✅ Backend API runs as serverless functions (scales automatically)
✅ Database queries happen from serverless functions (not exposed to frontend)
✅ auto-deploys on every push to main
✅ Preview deployments for team testing on PRs
✅ Environment variables secure (not in code)

---

## Next Steps

1. Get Supabase credentials (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
2. Generate JWT_SECRET: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
3. Push code: `git push origin main`
4. Deploy on Vercel dashboard
5. Add environment variables
6. Click Deploy
7. Share URL with team! 🚀

---

## Questions?

For Vercel-specific issues: [Vercel Docs](https://vercel.com/docs)
For Supabase issues: [Supabase Docs](https://supabase.com/docs)
For tRPC issues: [tRPC Docs](https://trpc.io/docs)
