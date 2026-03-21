/**
 * Supabase client initialization
 * Uses environment variables for configuration
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase environment variables not configured. Dynamic content will not be available.',
    { supabaseUrl: !!supabaseUrl, supabaseAnonKey: !!supabaseAnonKey }
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

/**
 * Helper to check if Supabase is properly configured
 */
export function isSupabaseConfigured(): boolean {
  return !!supabaseUrl && !!supabaseAnonKey;
}

/**
 * Helper to fetch news from Supabase
 */
export async function fetchNews(limit = 3) {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, returning empty news');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

/**
 * Helper to fetch a single news article by slug
 */
export async function fetchNewsBySlug(slug: string) {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching news article:', error);
    return null;
  }
}

/**
 * Helper to fetch publications
 */
export async function fetchPublications(limit = 10) {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, returning empty publications');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('publications')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching publications:', error);
    return [];
  }
}

/**
 * Helper to fetch events
 */
export async function fetchEvents(limit = 5) {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, returning empty events');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

/**
 * Helper to fetch active consultations
 */
export async function fetchConsultations(limit = 3) {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, returning empty consultations');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('status', 'open')
      .order('end_date', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching consultations:', error);
    return [];
  }
}

/**
 * Helper to submit a contact form
 */
export async function submitContactForm(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }

  try {
    const { error } = await supabase
      .from('contact_submissions')
      .insert([{ ...data, status: 'new' }]);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
}

/**
 * Helper to search domains
 */
export async function searchDomains(domainName: string) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }

  try {
    const { data, error } = await supabase
      .from('domains')
      .select('*')
      .ilike('domain_name', `%${domainName}%`)
      .limit(10);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching domains:', error);
    throw error;
  }
}
