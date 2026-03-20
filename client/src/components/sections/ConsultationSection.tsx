import { motion } from 'framer-motion';
import { Clock, FileText, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import { fetchConsultations } from '@/lib/supabase';
import type { Consultation } from '@/types';
import { format, differenceInDays } from 'date-fns';

export default function ConsultationSection() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConsultations = async () => {
      try {
        const data = await fetchConsultations(3);
        setConsultations(data);
      } catch (error) {
        console.error('Error loading consultations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConsultations();
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-white py-14 md:py-20">
        <div className="container">
          <Skeleton className="h-10 w-64 mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (consultations.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white py-14 md:py-20">
      <div className="container">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-bocra-text-primary">Public Consultations</h2>
          <a
            href="/consultations"
            className="inline-flex items-center gap-2 text-bocra-teal font-semibold hover:gap-3 transition-all"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {consultations.map((consultation, index) => {
            const daysRemaining = differenceInDays(new Date(consultation.end_date), new Date());
            const isClosingSoon = daysRemaining <= 7 && daysRemaining > 0;

            return (
              <motion.div
                key={consultation.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow p-6 border-l-4 border-bocra-forest-green">
                  {/* Status Badge */}
                  {isClosingSoon && (
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-bocra-dark-maroon">
                        Closing Soon
                      </span>
                    </div>
                  )}

                  <h3 className="font-semibold text-lg text-bocra-text-primary mb-3 line-clamp-2 flex-1">
                    {consultation.title}
                  </h3>

                  <p className="text-bocra-text-secondary text-sm mb-4 line-clamp-3">
                    {consultation.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-bocra-text-muted">
                      <Clock className="w-4 h-4 text-bocra-forest-green" />
                      <span>Ends: {format(new Date(consultation.end_date), 'MMM dd, yyyy')}</span>
                    </div>
                    {consultation.document_url && (
                      <a
                        href={consultation.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-bocra-teal hover:text-bocra-forest-green transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        View Document
                      </a>
                    )}
                  </div>

                  <Button
                    className="w-full bg-bocra-forest-green hover:bg-bocra-forest-green/90 text-white"
                    onClick={() => (window.location.href = `/consultations/${consultation.id}`)}
                  >
                    Participate
                  </Button>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
