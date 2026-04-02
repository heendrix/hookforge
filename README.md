# HookForge — Deployment Guide

## What's in this project

```
hookforge/
├── index.html                  ← Frontend (the website)
├── netlify.toml                ← Netlify config
├── netlify/
│   └── functions/
│       └── generate.js         ← Backend (keeps API key safe)
└── README.md
```

---

## Deploy to Netlify (Free — takes 5 minutes)

### Step 1 — Get your Anthropic API key
1. Go to https://console.anthropic.com
2. Click **API Keys** → **Create Key**
3. Copy it (you'll need it in Step 4)

### Step 2 — Push to GitHub
1. Go to https://github.com and create a new repository (name it `hookforge`)
2. Upload all files from this folder into the repo

### Step 3 — Connect to Netlify
1. Go to https://netlify.com and sign up free
2. Click **Add new site** → **Import an existing project**
3. Choose GitHub → select your `hookforge` repo
4. Leave build settings blank — click **Deploy site**

### Step 4 — Add your API key (backend secret)
1. In Netlify dashboard → go to **Site configuration** → **Environment variables**
2. Click **Add a variable**
3. Key: `ANTHROPIC_API_KEY`
4. Value: paste your Anthropic API key
5. Click **Save**
6. Go to **Deploys** → click **Trigger deploy** → **Deploy site**

### Step 5 — Your site is live
Netlify gives you a free URL like `hookforge-abc123.netlify.app`

---

## Add a custom domain (optional, ~$10/yr)
1. Buy a domain on Namecheap (e.g. `hookforge.io`)
2. In Netlify → **Domain management** → **Add custom domain**
3. Follow Netlify's DNS instructions — takes ~10 minutes

---

## That's it. Zero monthly cost.
- Hosting: Free (Netlify)
- Functions: Free (125k calls/month free tier)
- Domain: Optional (~$10/yr)
