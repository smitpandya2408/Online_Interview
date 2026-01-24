# Railway Deployment Login Fix

## Problem
After deploying to Railway, users cannot log in - the login page doesn't redirect after entering correct credentials.

## Root Cause
The `NEXTAUTH_URL` environment variable was not properly configured on Railway, which is required for NextAuth to correctly set authentication cookies and handle redirects in production.

## Solution

### Step 1: Update Railway Environment Variables

1. Go to your Railway project dashboard: https://railway.app
2. Click on your project
3. Go to the **Settings** tab
4. Scroll down to **Environment** section
5. Add or update these environment variables:

```
NEXTAUTH_URL=https://online-interview.up.railway.app
NEXTAUTH_SECRET=test-secret-key-for-development-only-change-in-production
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=admin123
```

**Important:** Replace the URLs and credentials with your actual values.

### Step 2: Verify Other Required Variables

Make sure these are also set in Railway:
- `MONGODB_URI` - Your MongoDB connection string
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
- `NODE_ENV=production`

### Step 3: Redeploy Your Application

After setting the environment variables:

1. Go to **Deployments** tab in Railway
2. Click the **Deploy** button or push a new commit to trigger a redeploy
3. Wait for the deployment to complete

### Step 4: Test the Login

1. Visit https://online-interview.up.railway.app/login
2. Enter your admin credentials:
   - Email: `admin@gmail.com`
   - Password: `admin123`
3. You should now be redirected to the dashboard

## Changes Made to Your Code

### 1. **Login Page** (`app/login/page.tsx`)
- Added a 500ms delay after successful signin to ensure cookies are properly set
- Changed the session verification to warn instead of blocking the redirect
- The redirect will now work even if the session verification takes time

### 2. **Auth Configuration** (`lib/auth.ts`)
- Added `trustHost: true` to handle Railway's reverse proxy correctly
- Added fallback logic to detect `RAILWAY_PUBLIC_DOMAIN` environment variable
- Added better debug logging for development
- Improved error handling for edge cases

## How It Works Now

1. User enters email and password
2. NextAuth validates credentials via the authorize function
3. If valid, NextAuth sets secure JWT cookie
4. Code waits 500ms for cookies to be established
5. Page redirects to dashboard

## If It Still Doesn't Work

**Check these things:**

1. **Verify NEXTAUTH_URL format**
   - Must be: `https://online-interview.up.railway.app` (with protocol)
   - NOT: `online-interview.up.railway.app` (without protocol)

2. **Check MongoDB Connection**
   - Ensure `MONGODB_URI` is correct and the database is accessible
   - Try logging in with the bootstrap admin credentials set in env vars

3. **Check Browser Cookies**
   - Open DevTools (F12) → Application → Cookies
   - After login attempt, you should see `next-auth.jwt` cookie
   - If not, check browser console for errors

4. **Check Server Logs on Railway**
   - Go to Railway dashboard → Logs
   - Look for any authentication errors
   - Share any error messages you find

5. **Clear Browser Cache and Cookies**
   - Close all tabs for your site
   - Clear cookies (DevTools → Application → Clear Site Data)
   - Try logging in again

## Additional Notes

- The app now supports auto-detection of Railway's environment
- If you add custom domain, update `NEXTAUTH_URL` to match
- Keep `NEXTAUTH_SECRET` consistent across deployments (don't change it or all sessions will be invalidated)
