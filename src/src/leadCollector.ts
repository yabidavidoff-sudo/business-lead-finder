/**
 * Lead Collector - Finds local businesses without websites using Google Maps API
 * Stores leads in Supabase (ai-ecosystem database)
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import type { BusinessLead } from './types.js';

// Initialize Supabase client (connects to your ai-ecosystem)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

interface PlacesSearchResult {
  place_id: string;
  name: string;
  vicinity?: string;
  website?: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types?: string[];
  rating?: number;
}

/**
 * Check if a website URL is a real website (not social media)
 */
function hasRealWebsite(website?: string): boolean {
  if (!website) return false;
  const socialHosts = ['facebook.com', 'instagram.com', 'tiktok.com', 'twitter.com', 'linkedin.com'];
  return !socialHosts.some(host => website.includes(host));
}

/**
 * Search for businesses using Google Places API
 */
export async function searchBusinesses(
  location: { lat: number; lng: number },
  keyword: string,
  radiusMeters = 5000
): Promise<BusinessLead[]> {
  const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
  url.searchParams.set('key', process.env.GOOGLE_MAPS_API_KEY!);
  url.searchParams.set('location', `${location.lat},${location.lng}`);
  url.searchParams.set('radius', radiusMeters.toString());
  url.searchParams.set('keyword', keyword);

  const response = await fetch(url.toString());
  const data = await response.json();
    if (!data) throw new Error('Invalid API response');
    

  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(`Google Places API error: ${data.status} - ${data.error_message || ''}`);
  }

  const results: PlacesSearchResult[] = data.results || [];
  
  // Filter for businesses without real websites
  const leads: BusinessLead[] = results
    .filter(place => !hasRealWebsite(place.website))
    .map(place => ({
      placeId: place.place_id,
      name: place.name,
      address: place.vicinity || '',
      city: '', // Extract from address if needed
      category: place.types?.[0],
      website: place.website,
      hasWebsite: false,
      latitude: place.geometry?.location.lat,
      longitude: place.geometry?.location.lng,
      rating: place.rating,
      status: 'new' as const,
    }));

  return leads;
}

/**
 * Save leads to Supabase (ai-ecosystem database)
 */
export async function saveLeads(leads: BusinessLead[]): Promise<void> {
  const { data, error } = await supabase
    .from('business_leads')
    .upsert(leads, { onConflict: 'placeId' });

  if (error) {
    throw new Error(`Failed to save leads: ${error.message}`);
  }

  console.log(`✅ Saved ${leads.length} leads to ai-ecosystem database`);
}

/**
 * Main function - Run lead collection
 */
export async function collectLeads() {
  // Example: Search for plumbers in Vancouver
  const vancouver = { lat: 49.2827, lng: -123.1207 };
  
  console.log('🔍 Searching for businesses without websites...');
  const leads = await searchBusinesses(vancouver, 'plumber', 5000);
  
  console.log(`Found ${leads.length} potential leads`);
  
  if (leads.length > 0) {
    await saveLeads(leads);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  collectLeads().catch(console.error);
}