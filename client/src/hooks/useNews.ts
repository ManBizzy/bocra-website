import { useEffect, useState } from 'react';
import { fetchNews, fetchNewsBySlug } from '@/lib/supabase';
import type { News } from '@/types';

export function useNews(limit?: number) {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const data = await fetchNews(limit);
        setNews(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load news');
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [limit]);

  return { news, loading, error };
}

export function useNewsArticle(slug: string) {
  const [article, setArticle] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const loadArticle = async () => {
      try {
        setLoading(true);
        const data = await fetchNewsBySlug(slug);
        setArticle(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load article');
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [slug]);

  return { article, loading, error };
}
