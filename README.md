# Business Lead Finder

**AI-powered tool to find local businesses without websites, generate sites, and send outreach emails**

This project integrates with your **ai-ecosystem** (Supabase + Groq) to automate lead generation and website building.

## What It Does

1. **Find Leads**: Uses Google Maps API to find local businesses without websites
2. **Store in ai-ecosystem**: Saves leads to your Supabase database  
3. **Generate Sites**: Creates custom websites using reusable component templates
4. **Send Outreach**: Emails businesses with their draft website preview

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Then edit .env with your API keys

# Run lead collector
npm run lead-collector
```

## Setup

### Environment Variables

You need:
- **GOOGLE_MAPS_API_KEY**: Get from [Google Cloud Console](https://console.cloud.google.com/)
- **SUPABASE_URL** & **SUPABASE_ANON_KEY**: Use your existing ai-ecosystem project
- **GROQ_API_KEY**: For AI-powered content generation
- **RESEND_API_KEY**: For email sending

### Create Supabase Table

Run this in your ai-ecosystem Supabase project:

```sql
CREATE TABLE business_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  phone TEXT,
  website TEXT,
  has_website BOOLEAN DEFAULT false,
  email TEXT,
  latitude FLOAT,
  longitude FLOAT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Integration with ai-ecosystem

This connects to your existing Supabase database so your AI agents can:
- Read leads from `business_leads` table
- Generate personalized email copy
- Create website content automatically
- Update lead status

## Legal & Ethics

Uses **official Google Maps Places API** in compliance with Google's ToS.

Remember to:
- Respect API rate limits
- Follow email anti-spam laws
- Provide unsubscribe options

---

**Built by Yabi Davidoff for the ai-ecosystem**