# Deploying to Render.com

This guide will help you deploy the Peboli app to Render.com.

## Prerequisites

1. A Render.com account (sign up at https://render.com)
2. Your GitHub repository connected to Render
3. A PostgreSQL database (Render provides managed PostgreSQL)

## Step 1: Create PostgreSQL Database on Render

1. Go to your Render dashboard
2. Click "New +" → "PostgreSQL"
3. Configure:
   - Name: `peboli-db`
   - Database: `peboli`
   - User: (auto-generated)
   - Region: Choose closest to your users
4. Copy the **Internal Database URL** (you'll need this)

## Step 2: Deploy Web Service

### Option A: Using render.yaml (Recommended)

1. Go to Render dashboard
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Select the repository: `iCreativate/peboli`
5. Render will detect `render.yaml` automatically
6. Review the configuration and click "Apply"

### Option B: Manual Setup

1. Go to Render dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `peboli`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Starter (or higher)

## Step 3: Configure Environment Variables

In your Render service settings, add these environment variables:

### Required Variables

```
NODE_ENV=production
DATABASE_URL=<your-postgres-internal-url>
NEXTAUTH_URL=https://your-app-name.onrender.com
NEXTAUTH_SECRET=<generate-a-random-secret>
```

### OAuth Variables (if using Google/Facebook login)

```
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
FACEBOOK_CLIENT_ID=<your-facebook-client-id>
FACEBOOK_CLIENT_SECRET=<your-facebook-client-secret>
```

### Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

## Step 4: Run Database Migrations

After deployment, you need to run Prisma migrations:

1. Go to your Render service
2. Click "Shell" tab
3. Run:
```bash
npx prisma migrate deploy
```

Or add this as a build command:
```bash
npm install && npx prisma generate && npx prisma migrate deploy && npm run build
```

## Step 5: Deploy

1. Click "Manual Deploy" → "Deploy latest commit"
2. Wait for the build to complete
3. Your app will be available at: `https://your-app-name.onrender.com`

## Important Notes

- **Free tier**: Render free tier spins down after 15 minutes of inactivity. First request may take 30-60 seconds.
- **Database**: Use the **Internal Database URL** for better performance (no external connection overhead)
- **Custom Domain**: You can add a custom domain in Render settings
- **Auto-Deploy**: Render automatically deploys on every push to main branch

## Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Ensure all environment variables are set
- Verify `package.json` scripts are correct

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Use Internal Database URL (not External)
- Check if database is running

### App Crashes
- Check runtime logs in Render dashboard
- Verify all required environment variables are set
- Check if Prisma migrations have been run

## Updating the App

Simply push to your main branch:
```bash
git push origin main
```

Render will automatically:
1. Detect the new commit
2. Build the app
3. Deploy the new version

## Need Help?

- Render Docs: https://render.com/docs
- Render Support: https://render.com/support

