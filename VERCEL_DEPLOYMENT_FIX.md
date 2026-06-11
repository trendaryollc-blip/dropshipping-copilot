# Vercel Deployment Troubleshooting Guide

## Common Issues and Solutions

### 1. **Vercel Stuck on Old Deployment**

**Symptoms:**
- Deployment shows as "Building" indefinitely
- No failure or success message
- Changes not reflected even after manual redeploy

**Solutions:**

#### A. Clear Vercel Cache

```bash
# Clear Vercel cache for your project
npx vercel@latest env pull .env.development
npx vercel@latest --prod --force
```

#### B. Force Clean Deployment

```bash
# Remove all cache and node_modules, then redeploy
rm -rf .vercel
rm -rf node_modules
rm -rf .next
npm install
npx vercel@latest --prod --force
```

#### C. Check Vercel Project Settings

1. **Go to your Vercel project dashboard**
2. **Navigate to Settings > Git**
3. **Ensure "Automatic Deployments" is enabled**
4. **Check that the correct branch (main) is selected**
5. **Verify GitHub connection is active**

#### D. Manual Deployment via Vercel CLI

```bash
# Install Vercel CLI if not installed
npm install -g vercel

# Login to Vercel
npx vercel@latest login

# Link project (if not already linked)
npx vercel@latest link

# Force production deployment
npx vercel@latest --prod --force
```

### 2. **Build Process Issues**

**Common Build Errors:**

#### A. Missing Environment Variables

Check that all required environment variables from `vercel-env.txt` are set in:
- Vercel Project Settings > Environment Variables
- Especially check: `FIREBASE_SERVICE_ACCOUNT_KEY`, `NEXT_PUBLIC_FIREBASE_*` variables

#### B. Missing Firebase Service Account

```bash
# Ensure firebase service account is properly set
# Copy contents from secrets/service-account.json and add to Vercel as FIREBASE_SERVICE_ACCOUNT_KEY
```

#### C. Build Command Issues

Update `vercel.json` to specify build command:

```json
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "installCommand": "npm install",
  "crons": [
    {
      "path": "/api/cron/sync-prices",
      "schedule": "0 */2 * * *"
    },
    {
      "path": "/api/cron/check-low-stock",
      "schedule": "0 */6 * * *"
    },
    {
      "path": "/api/cron/check-automation-rules",
      "schedule": "*/30 * * * *"
    }
  ]
}
```

### 3. **Advanced Troubleshooting**

#### A. Check Vercel Build Logs

1. Go to your Vercel project
2. Click on the latest deployment
3. Check the "Build" tab for detailed logs
4. Look for any error messages or warnings

#### B. Common Fixes

**Issue: Build hangs indefinitely**
```bash
# Try deploying with debug flags
DEBUG=* npx vercel@latest --prod
```

**Issue: Missing dependencies**
```bash
# Ensure all dependencies are installed
rm -rf node_modules package-lock.json
npm install
```

**Issue: Next.js configuration**
```bash
# Check next.config.ts for any issues
# Ensure no experimental features that might cause problems
```

### 4. **Vercel Deployment Commands**

```bash
# Check current Vercel status
npx vercel@latest

# List all deployments
npx vercel@latest ls

# Redeploy specific deployment
npx vercel@latest redeploy <deployment-id>

# Promote preview to production
npx vercel@latest promote <deployment-id>

# Rollback to previous deployment
npx vercel@latest rollback <deployment-id>
```

### 5. **Final Checks**

1. **Verify GitHub Webhook**
   - Go to GitHub repo > Settings > Webhooks
   - Ensure Vercel webhook is active and has recent deliveries

2. **Check Vercel Ignored Files**
   - Ensure `vercel.json` doesn't have ignored files that are needed
   - Check `.vercelignore` if it exists

3. **Test Local Build**
   ```bash
   npm run build
   ```

4. **Check Vercel System Status**
   - Visit https://status.vercel.com/ for any outages

### 6. **Contact Vercel Support**

If all else fails:
1. Go to Vercel dashboard
2. Click "Help" > "Contact Support"
3. Provide:
   - Project ID
   - Deployment ID
   - Detailed description of issue
   - Screenshots of error messages