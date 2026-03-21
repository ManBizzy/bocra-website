import { useEffect, useState } from 'react';
import {
  fetchConsultationById,
  fetchConsultations,
} from '@/lib/supabase';
import type { Consultation } from '@/types';

type ConsultationStatus = Consultation['status'] | 'all';

export function useConsultations(
  limit?: number,
  status: ConsultationStatus = 'open'
) {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConsultations = async () => {
      try {
        setLoading(true);
        const data = await fetchConsultations(limit, status);
        setConsultations(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load consultations'
        );
        setConsultations([]);
      } finally {
        setLoading(false);
      }
    };

    loadConsultations();
  }, [limit, status]);

  return { consultations, loading, error };
}

export function useConsultation(id: string) {
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadConsultation = async () => {
      try {
        setLoading(true);
        const data = await fetchConsultationById(id);
        setConsultation(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load consultation'
        );
        setConsultation(null);
      } finally {
        setLoading(false);
      }
    };

    loadConsultation();
  }, [id]);

  return { consultation, loading, error };
}
