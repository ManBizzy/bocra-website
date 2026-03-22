import { useEffect, useState } from 'react';
import { fetchPublications } from '@/lib/supabase';
import type { Publication } from '@/types';

export function usePublications(limit?: number) {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPublications = async () => {
      try {
        setLoading(true);
        const data = await fetchPublications(limit);
        setPublications(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load publications'
        );
        setPublications([]);
      } finally {
        setLoading(false);
      }
    };

    loadPublications();
  }, [limit]);

  return { publications, loading, error };
}
