# 🚀 Deployment Guide - AnimeNexus

Complete guide to deploy your AnimeNexus application to production.

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Option 1: Render (Recommended)](#option-1-render-recommended)
3. [Option 2: Vercel + Railway](#option-2-vercel--railway)
4. [Option 3: AWS / DigitalOcean](#option-3-aws--digitalocean)
5. [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
6. [Environment Variables](#environment-variables)
7. [Post-Deployment](#post-deployment)
8. [Troubleshooting](#troubleshooting)

---

## ✅ Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] GitHub repository with your code
- [ ] MongoDB Atlas account (for production database)
- [ ] OpenRouter API key
- [ ] All environment variables documented
- [ ] Tested app locally
- [ ] Updated CORS settings for production URLs
- [ ] Generated strong JWT secret
- [ ] Removed console.logs (optional)
- [ ] Set NODE_ENV to production

---

## 🎯 Option 1: Render (Recommended)

**Why Render?**
- Free tier available
- Easy deployment from GitHub
- Automatic HTTPS
- Environment variable management
- Good for full-stack apps

### Step 1: Deploy Backend

1. **Go to [Render.com](https://render.com) and sign up**

2. **Click "New +" → "Web Service"**

3. **Connect your GitHub repository**
   - Authorize Render to access your repos
   - Select your AnimeNexus repository

4. **Configure the service:**
   ```
   Name: animenexus-backend
   Region: Choose closest to your users
   Branch: main
   Root Directory: anime-nexus/backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

5. **Add environment variables:**
   Click "Advanced" → "Add Environment Variable"
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_strong_random_secret
   OPENROUTER_API_KEY=your_openrouter_key
   FRONTEND_URL=https://your-frontend-url.onrender.com
   PORT=8000
   ```

6. **Select plan:**
   - Free tier: Good for testing
   - Starter ($7/month): Better performance

7. **Click "Create Web Service"**
   - Render will build and deploy your backend
   - Wait 5-10 minutes for first deployment
   - Note your backend URL: `https://animenexus-backend.onrender.com`

### Step 2: Deploy Frontend

1. **Click "New +" → "Static Site"**

2. **Connect same GitHub repository**

3. **Configure the site:**
   ```
   Name: animenexus-frontend
   Branch: main
   Root Directory: anime-nexus/frontend
   Build Command: npm install && npm run build
   Publish Directory: anime-nexus/frontend/dist
   ```

4. **Add environment variable:**
   ```
   VITE_API_URL=https://animenexus-backend.onrender.com/api
   ```

5. **Click "Create Static Site"**
   - Wait 5-10 minutes for deployment
   - Your app will be live at: `https://animenexus-frontend.onrender.com`

### Step 3: Update Backend CORS

1. Go back to your backend service on Render
2. Update `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL=https://animenexus-frontend.onrender.com
   ```
3. Service will automatically redeploy

### Step 4: Test Your Deployment

1. Visit your frontend URL
2. Register a new account
3. Test all features:
   - Login/Logout
   - Browse anime
   - Add to library
   - AI features
   - Profile page

---

## 🎯 Option 2: Vercel + Railway

**Why Vercel + Railway?**
- Vercel: Best for React/Next.js frontends
- Railway: Good for Node.js backends
- Both have free tiers
- Fast deployments

### Step 1: Deploy Backend to Railway

1. **Go to [Railway.app](https://railway.app) and sign up**

2. **Click "New Project" → "Deploy from GitHub repo"**

3. **Select your repository**

4. **Configure:**
   - Railway will auto-detect Node.js
   - Set root directory: `anime-nexus/backend`

5. **Add environment variables:**
   Go to "Variables" tab:
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_jwt_secret
   OPENROUTER_API_KEY=your_api_key
   FRONTEND_URL=https://your-app.vercel.app
   PORT=8000
   ```

6. **Generate domain:**
   - Go to "Settings" → "Networking"
   - Click "Generate Domain"
   - Note your URL: `https://animenexus-backend.up.railway.app`

### Step 2: Deploy Frontend to Vercel

1. **Go to [Vercel.com](https://vercel.com) and sign up**

2. **Click "Add New" → "Project"**

3. **Import your GitHub repository**

4. **Configure:**
   ```
   Framework Preset: Vite
   Root Directory: anime-nexus/frontend
   Build Command: npm run build
   Output Directory: dist
   ```

5. **Add environment variable:**
   ```
   VITE_API_URL=https://animenexus-backend.up.railway.app/api
   ```

6. **Click "Deploy"**
   - Wait 2-3 minutes
   - Your app will be live at: `https://your-app.vercel.app`

### Step 3: Update Railway CORS

1. Go back to Railway
2. Update `FRONTEND_URL` to your Vercel URL
3. Redeploy

---

## 🎯 Option 3: AWS / DigitalOcean

**For Advanced Users**

### AWS Deployment

**Backend (EC2 + PM2):**
1. Launch EC2 instance (Ubuntu)
2. Install Node.js and MongoDB
3. Clone repository
4. Install dependencies
5. Use PM2 for process management
6. Configure Nginx as reverse proxy
7. Set up SSL with Let's Encrypt

**Frontend (S3 + CloudFront):**
1. Build frontend: `npm run build`
2. Upload `dist` folder to S3 bucket
3. Configure S3 for static website hosting
4. Set up CloudFront distribution
5. Configure custom domain

### DigitalOcean Deployment

**Using App Platform:**
1. Create new app
2. Connect GitHub repository
3. Configure build settings
4. Add environment variables
5. Deploy

---

## 💾 Database Setup (MongoDB Atlas)

**Required for all deployment options**

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create new cluster (Free tier: M0)

### Step 2: Configure Database

1. **Create Database User:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `animenexus`
   - Password: Generate strong password
   - Role: "Read and write to any database"

2. **Whitelist IP Addresses:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add specific IPs for better security

3. **Get Connection String:**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy connection string:
   ```
   mongodb+srv://animenexus:<password>@cluster0.xxxxx.mongodb.net/animenexus?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password

### Step 3: Update Environment Variables

Add the connection string to your deployment platform's environment variables as `MONGODB_URI`.

---

## 🔐 Environment Variables

### Backend Production Variables

```env
# Server
NODE_ENV=production
PORT=8000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/animenexus

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-domain.com

# JWT Secret (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your_64_character_random_string_here

# AI Service
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx
```

### Frontend Production Variables

```env
# API URL
VITE_API_URL=https://your-backend-domain.com/api
```

---

## ✅ Post-Deployment Checklist

After deployment, verify:

- [ ] Frontend loads without errors
- [ ] Backend API is accessible
- [ ] User registration works
- [ ] Login/logout works
- [ ] Anime search works
- [ ] Add to library works
- [ ] AI features work (summary, similar, chat)
- [ ] Profile page loads
- [ ] Images load correctly
- [ ] Mobile responsive
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Database connected
- [ ] No console errors

---

## 🐛 Troubleshooting

### Common Issues

**1. CORS Error**
```
Access to fetch at 'https://backend.com/api' from origin 'https://frontend.com' has been blocked by CORS
```
**Solution:** Update `FRONTEND_URL` in backend environment variables

**2. Database Connection Failed**
```
MongooseServerSelectionError: connect ECONNREFUSED
```
**Solution:** 
- Check MongoDB Atlas IP whitelist
- Verify connection string
- Ensure database user has correct permissions

**3. AI Features Not Working**
```
Error: AI request failed
```
**Solution:**
- Verify OpenRouter API key
- Check API key has credits
- Ensure rate limits not exceeded

**4. Build Fails**
```
npm ERR! code ELIFECYCLE
```
**Solution:**
- Check Node.js version (v18+)
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall

**5. Environment Variables Not Working**
```
undefined is not a function
```
**Solution:**
- Restart deployment after adding env vars
- Check variable names (VITE_ prefix for frontend)
- Verify no typos in variable names

**6. Images Not Loading**
```
404 Not Found
```
**Solution:**
- Check image paths are relative
- Verify public folder is included in build
- Check CORS for external images

---

## 📊 Monitoring

### Recommended Tools

**Application Monitoring:**
- [Sentry](https://sentry.io/) - Error tracking
- [LogRocket](https://logrocket.com/) - Session replay
- [New Relic](https://newrelic.com/) - Performance monitoring

**Uptime Monitoring:**
- [UptimeRobot](https://uptimerobot.com/) - Free uptime monitoring
- [Pingdom](https://www.pingdom.com/) - Website monitoring

**Analytics:**
- [Google Analytics](https://analytics.google.com/) - User analytics
- [Plausible](https://plausible.io/) - Privacy-friendly analytics

---

## 🔄 Continuous Deployment

### Automatic Deployments

**Render:**
- Automatically deploys on git push to main branch
- Configure in dashboard: Settings → Build & Deploy

**Vercel:**
- Automatically deploys on git push
- Preview deployments for pull requests

**Railway:**
- Automatically deploys on git push
- Configure branch in settings

---

## 💰 Cost Estimation

### Free Tier (Good for testing)
- **Render Free:** Backend + Frontend = $0/month
- **MongoDB Atlas M0:** Free forever
- **OpenRouter:** Pay per use (~$1-5/month for moderate use)
- **Total:** ~$1-5/month

### Production Tier (Recommended)
- **Render Starter:** $7/month (backend)
- **Render Static:** Free (frontend)
- **MongoDB Atlas M10:** $9/month
- **OpenRouter:** ~$10-20/month
- **Total:** ~$26-36/month

### Enterprise Tier
- **AWS/DigitalOcean:** $50-100/month
- **MongoDB Atlas M30:** $60/month
- **OpenRouter:** $50+/month
- **Total:** $160-210/month

---

## 📞 Support

If you encounter issues:

1. Check this troubleshooting guide
2. Review deployment platform docs
3. Check GitHub issues
4. Contact support:
   - Render: support@render.com
   - Vercel: support@vercel.com
   - Railway: team@railway.app

---

## 🎉 Success!

Your AnimeNexus app is now live! Share it with the world! 🌍

**Next Steps:**
- Set up custom domain
- Configure SSL certificate
- Set up monitoring
- Add analytics
- Share with users

---

**Happy Deploying! 🚀**
