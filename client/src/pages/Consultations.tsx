import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  FileText,
  Search,
} from 'lucide-react';
import { differenceInDays, format, isAfter, isBefore } from 'date-fns';
import { useConsultations } from '@/hooks/useConsultations';
import { SITE_DESCRIPTION } from '@/const';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import type { Consultation } from '@/types';

const STATUS_STYLES: Record<
  Consultation['status'],
  { label: string; badge: string; accent: string }
> = {
  open: {
    label: 'Open',
    badge: 'bg-bocra-forest-green text-white',
    accent: 'border-bocra-forest-green',
  },
  closed: {
    label: 'Closed',
    badge: 'bg-bocra-dark-maroon text-white',
    accent: 'border-bocra-dark-maroon',
  },
  archived: {
    label: 'Archived',
    badge: 'bg-bocra-text-muted text-white',
    accent: 'border-bocra-text-muted',
  },
};

export default function Consultations() {
  const { consultations, loading, error } = useConsultations(undefined, 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState<
    'all' | Consultation['status']
  >('all');

  const filteredConsultations = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return consultations.filter((consultation) => {
      const matchesStatus =
        activeStatus === 'all' || consultation.status === activeStatus;
      const matchesSearch =
        normalizedQuery.length === 0 ||
        consultation.title.toLowerCase().includes(normalizedQuery) ||
        consultation.description.toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesSearch;
    });
  }, [activeStatus, consultations, searchQuery]);

  const featuredConsultation = filteredConsultations[0] ?? null;
  const secondaryConsultations = featuredConsultation
    ? filteredConsultations.slice(1)
    : [];
  const statusTabs = [
    { key: 'all', label: 'All' },
    { key: 'open', label: 'Open' },
    { key: 'closed', label: 'Closed' },
    { key: 'archived', label: 'Archived' },
  ] as const;

  return (
    <>
      <Helmet>
        <title>Public Consultations | BOCRA</title>
        <meta
          name="description"
          content="Review BOCRA public consultations, timelines, and consultation documents."
        />
        <meta property="og:title" content="Public Consultations | BOCRA" />
        <meta
          property="og:description"
          content="Review BOCRA public consultations, timelines, and consultation documents."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`${window.location.origin}/consultations`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Public Consultations | BOCRA" />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />
      </Helmet>

      <div className="bg-bocra-light-grey">
        <section className="border-b border-bocra-border bg-white">
          <div className="container py-12 md:py-16">
            <div className="max-w-3xl space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bocra-forest-green">
                Stakeholder Engagement
              </p>
              <h1 className="text-4xl font-bold text-bocra-text-primary md:text-5xl">
                Public Consultations
              </h1>
              <p className="text-lg text-bocra-text-secondary">
                Follow ongoing consultation windows, review supporting
                documents, and track BOCRA regulatory engagement activity.
              </p>
            </div>
          </div>
        </section>

        <section className="container py-8 md:py-10">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bocra-text-muted" />
              <Input
                type="search"
                placeholder="Search consultations"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {statusTabs.map((status) => (
                <Button
                  key={status.key}
                  type="button"
                  variant={activeStatus === status.key ? 'default' : 'outline'}
                  className={
                    activeStatus === status.key
                      ? 'bg-bocra-forest-green text-white hover:bg-bocra-forest-green/90'
                      : ''
                  }
                  onClick={() => setActiveStatus(status.key)}
                >
                  {status.label}
                </Button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="space-y-8">
              <Skeleton className="h-[320px] w-full" />
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <Skeleton key={item} className="h-80 w-full" />
                ))}
              </div>
            </div>
          ) : error ? (
            <Card className="p-8">
              <h2 className="text-2xl font-semibold text-bocra-text-primary">
                Consultations are temporarily unavailable
              </h2>
              <p className="mt-3 text-bocra-text-secondary">{error}</p>
            </Card>
          ) : filteredConsultations.length === 0 ? (
            <Card className="p-8">
              <h2 className="text-2xl font-semibold text-bocra-text-primary">
                No consultations matched your search
              </h2>
              <p className="mt-3 text-bocra-text-secondary">
                Adjust the status or search filters to find another
                consultation.
              </p>
            </Card>
          ) : (
            <div className="space-y-8">
              {featuredConsultation && (
                <Card className="overflow-hidden border-0 bg-white shadow-lg">
                  <div className="grid gap-8 p-8 md:grid-cols-[1.15fr_0.85fr] md:p-10">
                    <div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${STATUS_STYLES[featuredConsultation.status].badge}`}
                      >
                        {STATUS_STYLES[featuredConsultation.status].label}
                      </span>
                      <h2 className="mt-5 text-3xl font-bold text-bocra-text-primary md:text-4xl">
                        {featuredConsultation.title}
                      </h2>
                      <p className="mt-4 max-w-2xl text-bocra-text-secondary">
                        {featuredConsultation.description}
                      </p>

                      <div className="mt-6 grid gap-3 text-sm text-bocra-text-muted sm:grid-cols-2">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-bocra-forest-green" />
                          <span>
                            Opens{' '}
                            {format(
                              new Date(featuredConsultation.start_date),
                              'dd MMM yyyy'
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock3 className="h-4 w-4 text-bocra-forest-green" />
                          <span>
                            Closes{' '}
                            {format(
                              new Date(featuredConsultation.end_date),
                              'dd MMM yyyy'
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="mt-8 flex flex-wrap gap-3">
                        <a
                          href={`/consultations/${featuredConsultation.id}`}
                          className="inline-flex items-center gap-2 rounded-md bg-bocra-forest-green px-5 py-3 font-semibold text-white transition-colors hover:bg-bocra-forest-green/90"
                        >
                          View Consultation
                          <ArrowRight className="h-4 w-4" />
                        </a>
                        {featuredConsultation.document_url && (
                          <a
                            href={featuredConsultation.document_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-md border border-bocra-border px-5 py-3 font-semibold text-bocra-text-primary transition-colors hover:bg-bocra-light-grey"
                          >
                            <FileText className="h-4 w-4" />
                            Open Document
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-bocra-deep-teal p-6 text-white">
                      <h3 className="text-lg font-semibold">
                        Consultation Window
                      </h3>
                      <div className="mt-5 space-y-4">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-white/70">
                            Status
                          </p>
                          <p className="mt-1 text-xl font-semibold">
                            {STATUS_STYLES[featuredConsultation.status].label}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-white/70">
                            Starts
                          </p>
                          <p className="mt-1 text-base font-semibold">
                            {format(
                              new Date(featuredConsultation.start_date),
                              'dd MMMM yyyy'
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-white/70">
                            Ends
                          </p>
                          <p className="mt-1 text-base font-semibold">
                            {format(
                              new Date(featuredConsultation.end_date),
                              'dd MMMM yyyy'
                            )}
                          </p>
                        </div>
                        <p className="rounded-xl bg-white/10 p-4 text-sm text-white/80">
                          {differenceInDays(
                            new Date(featuredConsultation.end_date),
                            new Date()
                          ) > 0
                            ? `${differenceInDays(
                                new Date(featuredConsultation.end_date),
                                new Date()
                              )} days remaining in the current response window.`
                            : 'The response window has closed. Review the consultation summary for reference.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {secondaryConsultations.map((consultation) => {
                  const startsAt = new Date(consultation.start_date);
                  const endsAt = new Date(consultation.end_date);
                  const now = new Date();
                  const statusCopy = STATUS_STYLES[consultation.status];
                  const timingLabel = isBefore(now, startsAt)
                    ? `Opens ${format(startsAt, 'dd MMM yyyy')}`
                    : isAfter(now, endsAt)
                      ? `Closed ${format(endsAt, 'dd MMM yyyy')}`
                      : `Closes ${format(endsAt, 'dd MMM yyyy')}`;

                  return (
                    <Card
                      key={consultation.id}
                      className={`flex h-full flex-col overflow-hidden border-l-4 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg ${statusCopy.accent}`}
                    >
                      <span
                        className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusCopy.badge}`}
                      >
                        {statusCopy.label}
                      </span>

                      <h3 className="mt-4 text-xl font-semibold text-bocra-text-primary">
                        {consultation.title}
                      </h3>
                      <p className="mt-3 flex-1 text-sm text-bocra-text-secondary">
                        {consultation.description}
                      </p>

                      <div className="mt-5 space-y-3 text-sm text-bocra-text-muted">
                        <div className="flex items-center gap-2">
                          <Clock3 className="h-4 w-4 text-bocra-forest-green" />
                          <span>{timingLabel}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-bocra-forest-green" />
                          <span>
                            {format(startsAt, 'dd MMM yyyy')} to{' '}
                            {format(endsAt, 'dd MMM yyyy')}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <a
                          href={`/consultations/${consultation.id}`}
                          className="inline-flex items-center gap-2 font-semibold text-bocra-forest-green transition-all hover:gap-3"
                        >
                          View Consultation
                          <ArrowRight className="h-4 w-4" />
                        </a>
                        {consultation.document_url && (
                          <a
                            href={consultation.document_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-medium text-bocra-text-secondary transition-colors hover:text-bocra-forest-green"
                          >
                            <FileText className="h-4 w-4" />
                            Document
                          </a>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
