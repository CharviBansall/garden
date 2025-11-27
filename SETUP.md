# Charvi's Garden - Setup Instructions

## Setting up Vercel KV for Persistent Storage

Your garden now uses Vercel KV (Redis) to store flowers persistently! Here's how to set it up:

### 1. Create a Vercel KV Database

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Storage** tab
3. Click **Create Database**
4. Select **KV** (Key-Value Store)
5. Give it a name (e.g., "charvisgarden-kv")
6. Choose a region close to your users
7. Click **Create**

### 2. Connect to Your Project

1. In your KV database page, go to the **Projects** tab
2. Click **Connect Project**
3. Select your `charvisgarden` project
4. The environment variables will be automatically added to your project

### 3. Get Environment Variables (for local development)

1. In your KV database page, click on the **.env.local** tab
2. Copy the environment variables shown
3. Create a `.env.local` file in your project root
4. Paste the variables:

```
KV_REST_API_READ_ONLY_TOKEN="Ak9UAAIgcDLHGsXqm6mumTFPG2v9VgOdwWN13Zwl9bfuG8kmzom-KA"
KV_REST_API_TOKEN="AU9UAAIncDJjMjk5ZTE0OWM1ZjI0ZGQyOGZiOGIyMzVhMGNjNzM4NnAyMjAzMDg"
KV_URL="rediss://default:AU9UAAIncDJjMjk5ZTE0OWM1ZjI0ZGQyOGZiOGIyMzVhMGNjNzM4NnAyMjAzMDg@striking-gibbon-20308.upstash.io:6379"
KV_REDIS_URL="rediss://default:AU9UAAIncDJjMjk5ZTE0OWM1ZjI0ZGQyOGZiOGIyMzVhMGNjNzM4NnAyMjAzMDg@striking-gibbon-20308.upstash.io:6379"
ADMIN_PASSWORD="cbansal"
```

### 4. Set Admin Password (for flower deletion)

To protect flower deletion, set an admin password:

**In Vercel Dashboard:**
1. Go to your project → **Settings** → **Environment Variables**
2. Add: `ADMIN_PASSWORD` = `your_secure_password`
3. Save and redeploy

**For local development:**
Add to your `.env.local`:
```
ADMIN_PASSWORD="your_secure_password"
```

### 5. Restart Your Development Server

```bash
npm run dev
```

### 6. Deploy to Vercel

Once connected, your flowers will persist across deployments! Just push to your repo:

```bash
git add .
git commit -m "Add Vercel KV for persistent storage"
git push
```

## How It Works

- Flowers are now stored in Vercel KV (Redis) instead of memory
- They persist across server restarts and redeployments
- All your friends' drawings will be saved permanently
- Super fast read/write operations with Redis

## Troubleshooting

**Flowers not showing up?**
- Make sure environment variables are set in Vercel project settings
- Check Vercel deployment logs for any errors
- Verify KV database is connected to your project

**Local development not working?**
- Make sure `.env.local` exists with correct variables
- Restart your dev server after adding environment variables

---

Enjoy your persistent garden! 🌸

