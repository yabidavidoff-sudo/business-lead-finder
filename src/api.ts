import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Business Lead Finder API v1.0',
    version: '1.0.0'
  });
});

// Get all leads
app.get('/api/leads', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('business_leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    res.json({
      success: true,
      count: data.length,
      leads: data
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get stats
app.get('/api/stats', async (req: Request, res: Response) => {
  try {
    const { data: leads, error } = await supabase
      .from('business_leads')
      .select('has_website');

    if (error) throw error;

    const total = leads.length;
    const withoutWebsite = leads.filter((l: any) => !l.has_website).length;

    res.json({
      success: true,
      stats: {
        total_leads: total,
        without_website: withoutWebsite,
        with_website: total - withoutWebsite,
        conversion_rate: total > 0 ? ((withoutWebsite / total) * 100).toFixed(2) + '%' : '0%'
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Business Lead Finder API running on port ${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  console.log(`📈 Stats: http://localhost:${PORT}/api/stats`);
});

export default app;
