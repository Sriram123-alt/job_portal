# Job Portal Deployment Guide

Complete guide to deploy your job portal application with backend and two frontends (Seeker & Recruiter).

---

## 📋 Overview

Your application has 3 components:
1. **Backend** (Spring Boot) - Port 8080
2. **Seeker Frontend** (React) - Port 3000
3. **Recruiter Frontend** (React) - Port 3001

---

## 🚀 Recommended Deployment Platforms

### Backend Deployment Options
- **Render** (Recommended - Free tier available)
- **Railway** (Free tier with GitHub integration)
- **Heroku** (Paid)
- **AWS Elastic Beanstalk** (Paid)

### Frontend Deployment Options
- **Vercel** (Recommended - Free tier, best for React)
- **Netlify** (Free tier available)
- **GitHub Pages** (Free, static hosting)

---

## 1️⃣ Deploy Backend to Render

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Create New Web Service
1. Click **New +** → **Web Service**
2. Connect your GitHub repository: `Sriram123-alt/job_portal`
3. Configure:
   - **Name**: `job-portal-backend`
   - **Region**: Select closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Java`
   - **Build Command**: `./mvnw clean install -DskipTests`
   - **Start Command**: `java -jar target/*.jar`

### Step 3: Set Environment Variables
Add these in Render dashboard under **Environment**:

```bash
# Database (Use Render's free PostgreSQL or external MySQL)
DB_URL=jdbc:mysql://your-db-host:3306/job_portal
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password

# CORS - Add your frontend URLs
CORS_ALLOWED_ORIGINS=https://job-seeker-app.vercel.app,https://job-recruiter-app.vercel.app

# JWT Secret (generate a strong random string)
JWT_SECRET=your_strong_random_secret_key_here

# Email Configuration
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

### Step 4: Deploy
1. Click **Create Web Service**
2. Wait for build to complete (5-10 minutes)
3. Your backend URL: `https://job-portal-backend.onrender.com`

> **Note:** Render free tier sleeps after 15 minutes of inactivity. First request may take 30 seconds to wake up.

---

## 2️⃣ Deploy Database

### Option A: Render PostgreSQL (Free)
1. In Render dashboard: **New +** → **PostgreSQL**
2. Name: `job-portal-db`
3. Copy the **Internal Database URL**
4. Update backend `DB_URL` environment variable

### Option B: PlanetScale MySQL (Free)
1. Go to [planetscale.com](https://planetscale.com)
2. Create database
3. Get connection string
4. Update backend environment variables

### Option C: Railway MySQL
1. Add MySQL plugin in Railway
2. Use provided connection details

---

## 3️⃣ Deploy Seeker Frontend to Vercel

### Step 1: Prepare Frontend
Update API URL in your seeker frontend. Create/edit `frontend-seeker/.env.production`:

```env
VITE_API_URL=https://job-portal-backend.onrender.com/api
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend-seeker`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**

### Step 3: Get URL
- Your seeker app URL: `https://job-seeker-app.vercel.app`

---

## 4️⃣ Deploy Recruiter Frontend to Vercel

### Step 1: Prepare Frontend
Create/edit `frontend-recruiter/.env.production`:

```env
VITE_API_URL=https://job-portal-backend.onrender.com/api
```

### Step 2: Deploy to Vercel
1. In Vercel dashboard: **Add New Project**
2. Select same repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend-recruiter`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**

### Step 3: Get URL
- Your recruiter app URL: `https://job-recruiter-app.vercel.app`

---

## 5️⃣ Update CORS Configuration

After deploying frontends, update backend CORS:

### In Render Dashboard:
1. Go to your backend service
2. Navigate to **Environment**
3. Update `CORS_ALLOWED_ORIGINS`:

```bash
CORS_ALLOWED_ORIGINS=https://job-seeker-app.vercel.app,https://job-recruiter-app.vercel.app
```

4. Save and redeploy

**⚠️ IMPORTANT:** Replace the URLs above with your actual Vercel deployment URLs!

---

## 6️⃣ Alternative: Deploy to Railway

### Backend on Railway

1. Go to [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. Select your repository
4. Configure:
   - **Root Directory**: `/backend`
   - **Start Command**: `./mvnw spring-boot:run`
5. Add environment variables (same as Render)
6. Add MySQL database from Railway plugins

### Frontend on Railway

1. **New Project** → Select repository
2. Configure for each frontend:
   - **Root Directory**: `/frontend-seeker` or `/frontend-recruiter`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run preview`

---

## 7️⃣ Environment Variables Reference

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_URL` | Database connection URL | `jdbc:mysql://host:3306/job_portal` |
| `DB_USERNAME` | Database username | `admin` |
| `DB_PASSWORD` | Database password | `password123` |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend URLs (comma-separated) | `https://app1.com,https://app2.com` |
| `JWT_SECRET` | Secret for JWT tokens | Random 64+ character string |
| `EMAIL_USERNAME` | Gmail for sending emails | `your-email@gmail.com` |
| `EMAIL_PASSWORD` | Gmail app password | `xxxx xxxx xxxx xxxx` |

### Frontend Environment Variables

Create `.env.production` in each frontend:

```env
VITE_API_URL=https://your-backend-url.com/api
```

---

## 8️⃣ Testing Deployment

### Test Backend
```bash
curl https://your-backend-url.onrender.com/api/health
```

### Test Seeker Frontend
1. Visit `https://job-seeker-app.vercel.app`
2. Try signup/login
3. Check browser console for errors

### Test Recruiter Frontend
1. Visit `https://job-recruiter-app.vercel.app`
2. Try login
3. Test job posting

---

## 🔧 Troubleshooting

### CORS Errors
- ✅ **Solution**: Ensure `CORS_ALLOWED_ORIGINS` includes both frontend URLs
- ✅ Check URLs have no trailing slashes
- ✅ Use `https://` not `http://` for production

### Database Connection Failed
- ✅ Check `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` are correct
- ✅ Ensure database allows external connections
- ✅ Verify database exists

### 504 Gateway Timeout (Render)
- ✅ First request takes ~30s (cold start on free tier)
- ✅ Upgrade to paid tier for always-on

### Build Failed
- ✅ Check build logs in platform dashboard
- ✅ Ensure dependencies are in `package.json` or `pom.xml`
- ✅ Test build locally first

---

## 📱 Custom Domain Setup

### Vercel Custom Domain
1. Go to project settings
2. **Domains** → Add domain
3. Update DNS records as shown

### Render Custom Domain
1. Settings → Custom Domain
2. Add your domain
3. Update DNS records

---

## 💡 Production Best Practices

### Security Checklist:
- [ ] Use strong JWT_SECRET (64+ characters)
- [ ] Enable HTTPS only
- [ ] Use environment variables (never hardcode secrets)
- [ ] Limit CORS to specific domains (no wildcards)
- [ ] Use app passwords for Gmail (not account password)

### Performance:
- Enable Vercel/Render CDN
- Add database indexes
- Monitor logs for slow queries
- Consider Redis for session management

---

## 🎯 Quick Deployment Checklist

- [ ] Deploy database (Render PostgreSQL/PlanetScale MySQL)
- [ ] Deploy backend to Render/Railway
- [ ] Set all backend environment variables
- [ ] Deploy seeker frontend to Vercel
- [ ] Deploy recruiter frontend to Vercel
- [ ] Update `.env.production` in both frontends
- [ ] Update `CORS_ALLOWED_ORIGINS` with frontend URLs
- [ ] Test signup/login on both frontends
- [ ] Test job posting and application flow
- [ ] Check email notifications work

---

## 📞 Platform Support Links

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **PlanetScale Docs**: https://planetscale.com/docs

---

## 🔄 Continuous Deployment

All platforms support auto-deployment:
- Push to `main` branch
- Platform automatically builds and deploys
- No manual steps needed after initial setup

💡 **Tip:** Create a `dev` branch for testing changes before merging to `main`
