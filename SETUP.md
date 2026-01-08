# Complete Setup Guide

**Business Lead Finder** - Step-by-step instructions to get everything running

---

## Overview

This guide will walk you through:
1. ✅ Cloning the repository (5 min)
2. ✅ Setting up Google Cloud & Places API (10 min)
3. ✅ Configuring Supabase database (5 min)
4. ✅ Installing dependencies & running the code (2 min)

**Total time: ~25 minutes**

---

## Part 1: Clone the Repository

```bash
# In your terminal
cd ~/Documents  # or wherever you keep projects
git clone https://github.com/yabidavidoff-sudo/business-lead-finder.git
cd business-lead-finder
```

---

## Part 2: Google Cloud Setup

### Step 1: Complete Billing Setup (Required)

**Why?** Google requires a payment method for API usage, even with the free trial.

**Don't worry:** You get $300 free credit + Places API has $200/month free tier = plenty for this project!

1. **Go to Google Cloud Console:** https://console.cloud.google.com
2. **Click "Start free"** (top-right banner)
3. **Step 1: Accept Terms**
   - Check "I agree to Google Cloud Platform Terms of Service"
   - Click "Agree & continue"

4. **Step 2: Add Payment Method**
   - Enter your credit card information
   - Complete identity verification
   - Click "Start my free trial"

✅ **Result:** You now have $300 in free credit for 90 days

### Step 2: Enable Places API

1. **In Google Cloud Console**, search for "Places API" in the top search bar
2. Click **"Places API (New)"**
3. Click the blue **"Enable"** button
4. Wait ~30 seconds for it to activate

### Step 3: Create API Key

1. **Go to:** [Credentials Page](https://console.cloud.google.com/apis/credentials?project=ai-ecosystem-apis)
2. Click **"Create Credentials"** → **"API Key"**
3. **Copy the API key** (looks like `AIzaSyB...`)
4. **(Optional but recommended)** Click "Restrict Key":
   - API restrictions → Select "Places API (New)"
   - Save

✅ **Save this key!** You'll need it in the next step.

---

## Part 3: Supabase Database Setup

### Step 1: Get Your Supabase Credentials

You already have these from your **ai-ecosystem** project!

1. **Go to:** https://supabase.com/dashboard
2. **Select your ai-ecosystem project**
3. **Click Settings → API**
4. **Copy:**
   - Project URL (looks like `https://xxx.supabase.co`)
   - `anon` `public` key (starts with `eyJhbGci...`)

### Step 2: Create the Database Table

1. **In Supabase**, click **"SQL Editor"** (left sidebar)
2. **Paste this SQL** and click **"Run"**:

```sql
CREATE TABLE IF NOT EXISTS business_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  address TEXT,
  city TEXT,
  phone TEXT,
  website TEXT,
  has_website BOOLEAN DEFAULT false,
  email TEXT,
  latitude FLOAT,
  longitude FLOAT,
  rating FLOAT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_business_leads_status ON business_leads(status);
CREATE INDEX IF NOT EXISTS idx_business_leads_city ON business_leads(city);
```

✅ **Result:** You now have a `business_leads` table in your ai-ecosystem database

---

## Part 4: Configure Environment Variables

### Step 1: Create .env File

```bash
cp .env.example .env
```

### Step 2: Edit .env File

Open `.env` in your editor and fill in:

```bash
# Google Maps API (from Part 2, Step 3)
GOOGLE_MAPS_API_KEY=AIzaSyB...your_key_here

# Supabase (from your ai-ecosystem project)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...your_key_here

# Groq API (from your ai-ecosystem)
GROQ_API_KEY=gsk_...your_key_here

# Resend (optional - skip for now)
# RESEND_API_KEY=re_...
# FROM_EMAIL=hello@yourdomain.com
```

---

## Part 5: Install & Run

### Install Dependencies

```bash
npm install
```

This installs:
- `@supabase/supabase-js` - Database connection
- `@google/maps` - Google Maps API client  
- `groq-sdk` - AI content generation
- TypeScript & build tools

### Run the Lead Collector

```bash
npm run lead-collector
```

**You should see:**
```
🔍 Searching for businesses without websites...
Found 15 potential leads
✅ Saved 15 leads to ai-ecosystem database
```

### View Your Leads

1. **Go to Supabase** → **Table Editor**
2. **Click `business_leads` table**
3. **See your leads!** Names, addresses, coordinates, etc.

---

## Part 6: Customize the Search

Edit `src/leadCollector.ts` (around line 103):

```typescript
// Change location
const location = { 
  lat: 49.2827,  // Vancouver
  lng: -123.1207 
};

// Change what to search for
const keyword = 'plumber';  // Try: 'salon', 'restaurant', 'contractor'

// Change search radius (meters)
const radius = 5000;  // 5km = ~3 miles
```

Then run again:
```bash
npm run lead-collector
```

---

## Troubleshooting

### "Billing required" error
- Make sure you completed the billing setup in Google Cloud
- Verify your credit card was accepted
- Try refreshing the API credentials page

### "Failed to save leads" error
- Check your Supabase URL and key in `.env`
- Verify the `business_leads` table exists in Supabase
- Check the SQL Editor for any error messages

### "Google Places API error"
- Verify your API key is correct in `.env`
- Make sure Places API is enabled in Google Cloud
- Check if you hit any rate limits (unlikely on free tier)

### No leads found
- Try a different keyword or location
- Increase the search radius
- Some areas/business types may not have many results

---

## Next Steps

Once you have leads flowing into your database, you can:

1. **Build the website generator** - Create sites from templates
2. **Set up email automation** - Send outreach with Resend
3. **Add AI content generation** - Use Groq to write copy
4. **Create a dashboard** - View and manage leads

---

## Cost Estimates

**Google Maps Places API:**
- First $200/month: FREE
- After that: $17 per 1,000 requests
- **Your usage:** ~10-50 requests = FREE

**Supabase:**
- FREE tier: 500MB database, 2GB bandwidth
- **Your usage:** ~1MB = FREE

**Total monthly cost: $0** ✅

---

## Getting Help

- **Check the code:** All functions have comments
- **Read the README:** https://github.com/yabidavidoff-sudo/business-lead-finder
- **Google Cloud docs:** https://cloud.google.com/maps-platform/places
- **Supabase docs:** https://supabase.com/docs

---

**Built by Yabi Davidoff for the ai-ecosystem** 🚀