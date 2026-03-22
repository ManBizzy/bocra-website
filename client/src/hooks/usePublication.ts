import { useEffect, useState } from 'react';
import { fetchPublicationBySlug } from '@/lib/supabase';
import type { Publication } from '@/types';

export function usePublication(slug: string) {
  const [publication, setPublication] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPublication = async () => {
      try {
        setLoading(true);
        const data = await fetchPublicationBySlug(slug);
        setPublication(data);
        setError(data ? null : 'Publication not found');
      } catch (err) {
        setPublication(null);
        setError(
          err instanceof Error ? err.message : 'Failed to load publication'
        );
      } finally {
        setLoading(false);
      }
    };

    void loadPublication();
  }, [slug]);

  return { publication, loading, error };
}
