# BOCRA Website - Deployment Checklist

## Before Deploying to Vercel

### Supabase Setup

- [ ] Create Supabase account at [supabase.com](https://supabase.com)
- [ ] Create a new project
- [ ] Copy **Project URL** (Settings → API)
  - `VITE_SUPABASE_URL=`
- [ ] Copy **Anon Public Key** (Settings → API → Project API keys)
  - `VITE_SUPABASE_ANON_KEY=`
- [ ] Copy **Database URL** (Settings → Database)
  - `DATABASE_URL=`

### OAuth Setup

- [ ] Decide on OAuth provider (Supabase Auth or custom server)
- [ ] Get OAuth Portal URL
  - `VITE_OAUTH_PORTAL_URL=`
- [ ] Get App ID
  - `VITE_APP_ID=`

### Secrets Generation

- [ ] Generate JWT Secret:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

  - `JWT_SECRET=<generated-value>`

### Local Testing

- [ ] Update `.env.local` with all credentials
- [ ] Run `pnpm dev` successfully
- [ ] Test login functionality works
- [ ] Test API routes work
- [ ] Run tests: `pnpm test`

### Git Preparation

- [ ] All code committed locally
- [ ] No uncommitted changes
- [ ] Push to GitHub: `git push origin main`
- [ ] Verify all changes on GitHub

### Vercel Deployment

- [ ] Create account at [vercel.com](https://vercel.com)
- [ ] Connect GitHub repository
- [ ] Select project
- [ ] Verify build settings:
  - Build Command: `pnpm build`
  - Output Directory: `dist`
- [ ] Add environment variables in Vercel dashboard:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
  - [ ] `VITE_APP_ID`
  - [ ] `VITE_OAUTH_PORTAL_URL`
  - [ ] `JWT_SECRET`
  - [ ] `DATABASE_URL`
  - [ ] `OAUTH_SERVER_URL`
  - [ ] `BUILT_IN_FORGE_API_URL`
  - [ ] `BUILT_IN_FORGE_API_KEY`
- [ ] Click Deploy
- [ ] Wait for deployment to complete
- [ ] Test production URL works

### Team Access

- [ ] Share production URL with team: `https://[your-project].vercel.app`
- [ ] Share PR preview URL workflow with team
- [ ] Set up GitHub branch protection (optional)

## File Checklist

Ensure these files exist in your repo:

- [ ] `vercel.json` - Vercel configuration
- [ ] `.vercelignore` - What to ignore
- [ ] `api/index.ts` - Serverless function handler
- [ ] `package.json` - Updated build scripts
- [ ] `DEPLOYMENT.md` - Deployment guide
- [ ] `.env.local` - Local only (not in git)

## Post-Deployment

- [ ] Test homepage loads
- [ ] Test navigation works
- [ ] Test login with test account
- [ ] Check browser console for errors
- [ ] Check Network tab for failed requests
- [ ] Share URL with team
- [ ] Set up monitoring/alerts (optional)

## Common Issues & Fixes

| Issue                     | Fix                                                 |
| ------------------------- | --------------------------------------------------- |
| Build fails               | Check Vercel build logs                             |
| API not working           | Verify environment variables in Vercel dashboard    |
| Database connection fails | Check DATABASE_URL in Vercel                        |
| Static files 404          | Verify dist/ folder builds correctly                |
| OAuth redirect fails      | Update OAuth provider redirect URL to Vercel domain |

---

## Once Deployed

Your team can:

1. **Create feature branches** locally
2. **Push to GitHub**
3. **Create PRs** - Vercel creates preview deployments
4. **Test preview** before merging
5. **Merge to main** - auto-deploys to production

---

Ready? Let me know when you:

1. Have Supabase credentials
2. Have generated JWT secret
3. Have pushed to GitHub

Then we'll deploy! 🚀
