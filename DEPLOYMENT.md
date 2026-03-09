# ElevateX — Free Deployment Guide

> Using **GitHub Student Pack** benefits for $0/month hosting

---

## Overview

This guide deploys ElevateX using entirely free services:

| Component | Service | Free Tier |
|-----------|---------|-----------|
| **Database** | MongoDB Atlas | 512MB free forever |
| **Backend** | Railway | $5/month credit (Student Pack) |
| **Frontend** | Vercel | Unlimited hobby deployments |
| **Video Storage** | Cloudinary | 25GB storage + 25GB bandwidth/month |
| **Domain** | Namecheap (.me) | Free 1-year domain (Student Pack) |

---

## Step 1: MongoDB Atlas (Database)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and sign up
2. Create a **free shared cluster** (M0 Sandbox)
3. Choose your region (closest to your backend deployment)
4. Under **Database Access**, create a user with password
5. Under **Network Access**, add `0.0.0.0/0` to allow all IPs (for Railway)
6. Click **Connect** → **Connect your application** → Copy the connection string

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/elevatex?retryWrites=true&w=majority
```

**Important:** Replace `<username>`, `<password>` with your actual credentials.

---

## Step 2: Cloudinary (Video & Image Storage)

1. Sign up at [cloudinary.com](https://cloudinary.com) (free plan: 25GB)
2. From the **Dashboard**, note:
   - Cloud Name
   - API Key
   - API Secret
3. These go in your Railway environment variables

---

## Step 3: Railway (Backend)

### 3a. Why Railway?

GitHub Student Pack gives you **$5/month** of Railway credits — more than enough for a Node.js backend.

### 3b. Deploy

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **New Project** → **Deploy from GitHub Repo**
3. Select your `ElevateX` repository
4. Railway will detect the project — configure it:

**Root Directory:** `server`  
**Build Command:** `npm install`  
**Start Command:** `node index.js`

### 3c. Environment Variables

In Railway dashboard → your service → **Variables** tab, add:

```env
PORT=3001
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/elevatex?retryWrites=true&w=majority
JWT_SECRET=your-secure-random-secret-at-least-32-chars
CLIENT_URL=https://your-app.vercel.app
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

> **Generate a secure JWT secret:**
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### 3d. Custom Domain (Optional)

Railway provides a `*.railway.app` URL automatically. You can also add a custom domain.

**Railway Backend URL:** `https://elevatex-production.up.railway.app` (example)

---

## Step 4: Vercel (Frontend)

### 4a. Deploy

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project** → Import your `ElevateX` repo
3. Configure:

**Framework Preset:** Vite  
**Root Directory:** `.` (root of repo)  
**Build Command:** `npm run build`  
**Output Directory:** `dist`

### 4b. Environment Variables

In Vercel dashboard → your project → **Settings** → **Environment Variables**:

```env
VITE_API_URL=https://elevatex-production.up.railway.app/api
VITE_SOCKET_URL=https://elevatex-production.up.railway.app
```

### 4c. Rewrites for SPA

Create `vercel.json` in the root:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

This ensures client-side routing works (no 404s on page refresh).

### 4d. Deploy

Push to `main` branch → Vercel auto-deploys.

**Vercel Frontend URL:** `https://elevatex.vercel.app` (example)

---

## Step 5: Free Domain (GitHub Student Pack → Namecheap)

1. Go to [education.github.com/pack](https://education.github.com/pack)
2. Find **Namecheap** → Claim your **free .me domain** for 1 year
3. In Namecheap DNS settings, add:
   - **CNAME record** → `@` → `cname.vercel-dns.com` (for Vercel frontend)
   - Or add A records per Vercel's custom domain instructions
4. In Vercel → Settings → Domains → Add your domain

---

## Step 6: Update CORS

After deployment, update Railway env var:

```env
CLIENT_URL=https://yourdomain.me
```

---

## Post-Deployment Checklist

- [ ] MongoDB Atlas cluster is running and accessible
- [ ] Railway backend health check: `curl https://your-backend.railway.app/health`
- [ ] Admin seed works: Try logging in as `admin@elevatex.com` / `admin123`
- [ ] Demo data seeded: 8 startups visible on explore page
- [ ] Frontend loads at your Vercel URL
- [ ] API calls work (register a test account)
- [ ] Socket.IO connects (check browser console for socket events)
- [ ] Video upload works via Cloudinary
- [ ] Custom domain resolves correctly

---

## Cost Summary

| Service | Monthly Cost |
|---------|-------------|
| MongoDB Atlas M0 | **$0** |
| Railway (Student Pack) | **$0** (covered by $5 credit) |
| Vercel Hobby | **$0** |
| Cloudinary Free | **$0** |
| Namecheap .me (Year 1) | **$0** (Student Pack) |
| **Total** | **$0/month** |

---

## Alternative Free Deployment (Render)

If you prefer Render over Railway:

1. Go to [render.com](https://render.com)
2. **New Web Service** → Connect GitHub → Select repo
3. **Root Directory:** `server`
4. **Build Command:** `npm install`
5. **Start Command:** `node index.js`
6. **Instance Type:** Free (spins down after 15 min inactivity)
7. Add the same environment variables

> **Note:** Render free tier has cold starts (~30s). Railway with Student Pack credits avoids this.

---

## CI/CD

Both Railway and Vercel auto-deploy on `git push` to `main`. No additional CI/CD setup needed.

```bash
git add -A
git commit -m "feat: deploy to production"
git push origin main
# Railway + Vercel both auto-deploy
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Ensure `CLIENT_URL` in Railway matches your Vercel/domain URL exactly |
| Socket.IO failing | Check `VITE_SOCKET_URL` points to Railway backend URL |
| Videos not uploading | Verify Cloudinary env vars are set correctly |
| 404 on page refresh | Add `vercel.json` with SPA rewrites |
| MongoDB connection timeout | Check Atlas Network Access allows `0.0.0.0/0` |
| Admin not seeded | Check Railway logs for seed output messages |
