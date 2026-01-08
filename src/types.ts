// Core data types for the business lead finder

export interface BusinessLead {
  id?: string;
  placeId: string;
  name: string;
  category?: string;
  address: string;
  city: string;
  phone?: string;
  website?: string;
  hasWebsite: boolean;
  email?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  status: 'new' | 'emailed' | 'responded' | 'site_built' | 'closed';
  createdAt?: Date;
}

export interface BusinessConfig {
  name: string;
  tagline: string;
  description: string;
  services: Service[];
  address: string;
  phone: string;
  email?: string;
  hours?: BusinessHours[];
  photos?: string[];
  primaryColor?: string;
  accentColor?: string;
  category?: string;
}

export interface Service {
  name: string;
  description?: string;
  priceFrom?: number;
}

export interface BusinessHours {
  day: string;
  open: string;
  close: string;
}

export interface EmailTemplate {
  subject: string;
  body: string;
  previewUrl?: string;
}