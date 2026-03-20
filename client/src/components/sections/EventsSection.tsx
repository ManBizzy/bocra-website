import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import { fetchEvents } from '@/lib/supabase';
import type { Event } from '@/types';
import { format } from 'date-fns';

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents(3);
        setEvents(data);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-bocra-light-grey py-14 md:py-20">
        <div className="container">
          <Skeleton className="h-10 w-48 mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-bocra-light-grey py-14 md:py-20">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-bocra-text-primary mb-12">Upcoming Events</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                {event.image_url && (
                  <div className="w-full h-40 bg-bocra-teal overflow-hidden">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-semibold text-lg text-bocra-text-primary mb-3 line-clamp-2">
                    {event.title}
                  </h3>

                  <p className="text-bocra-text-secondary text-sm mb-4 line-clamp-2 flex-1">
                    {event.description}
                  </p>

                  <div className="space-y-2 text-sm text-bocra-text-muted">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-bocra-teal" />
                      <time>{format(new Date(event.event_date), 'MMM dd, yyyy')}</time>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-bocra-teal" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
