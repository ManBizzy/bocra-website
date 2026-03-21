import { ArrowLeft, ArrowRight, CalendarDays, Clock3, FileText } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { differenceInDays, format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useConsultation, useConsultations } from '@/hooks/useConsultations';
import type { Consultation } from '@/types';

const STATUS_STYLES: Record<
  Consultation['status'],
  { label: string; badge: string }
> = {
  open: { label: 'Open', badge: 'bg-bocra-forest-green text-white' },
  closed: { label: 'Closed', badge: 'bg-bocra-dark-maroon text-white' },
  archived: { label: 'Archived', badge: 'bg-bocra-text-muted text-white' },
};

export default function ConsultationDetail({ id }: { id: string }) {
  const { consultation, loading, error } = useConsultation(id);
  const { consultations: relatedConsultations } = useConsultations(undefined, 'all');

  const relatedItems = relatedConsultations
    .filter((item) => item.id !== id)
    .slice(0, 3);
  const paragraphs =
    consultation?.description
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean) ?? [];

  return (
    <>
      <Helmet>
        <title>
          {consultation
            ? `${consultation.title} | BOCRA Consultations`
            : 'Consultation | BOCRA'}
        </title>
        {consultation && (
          <>
            <meta name="description" content={consultation.description} />
            <meta
              property="og:title"
              content={`${consultation.title} | BOCRA Consultations`}
            />
            <meta property="og:description" content={consultation.description} />
            <meta property="og:type" content="article" />
            <meta
              property="og:url"
              content={`${window.location.origin}/consultations/${consultation.id}`}
            />
          </>
        )}
      </Helmet>

      <div className="bg-bocra-light-grey">
        {loading ? (
          <div className="container py-12 md:py-16">
            <Skeleton className="mb-6 h-6 w-40" />
            <Skeleton className="mb-4 h-12 w-full max-w-4xl" />
            <Skeleton className="mb-3 h-6 w-56" />
            <Skeleton className="mb-10 h-72 w-full" />
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <Skeleton key={item} className="h-6 w-full" />
              ))}
            </div>
          </div>
        ) : error || !consultation ? (
          <div className="container py-12 md:py-16">
            <Card className="p-8">
              <h1 className="text-3xl font-bold text-bocra-text-primary">
                Consultation not found
              </h1>
              <p className="mt-3 text-bocra-text-secondary">
                {error ?? 'The requested consultation could not be found.'}
              </p>
              <a
                href="/consultations"
                className="mt-6 inline-flex items-center gap-2 font-semibold text-bocra-forest-green"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Consultations
              </a>
            </Card>
          </div>
        ) : (
          <>
            <section className="border-b border-bocra-border bg-white">
              <div className="container py-12 md:py-16">
                <a
                  href="/consultations"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-bocra-forest-green transition-colors hover:text-bocra-teal"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Consultations
                </a>

                <div className="mt-6 max-w-4xl">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[consultation.status].badge}`}
                  >
                    {STATUS_STYLES[consultation.status].label}
                  </span>

                  <h1 className="mt-5 text-4xl font-bold text-bocra-text-primary md:text-5xl">
                    {consultation.title}
                  </h1>

                  <div className="mt-5 flex flex-wrap gap-4 text-sm text-bocra-text-muted">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-bocra-forest-green" />
                      <span>
                        Opens{' '}
                        {format(new Date(consultation.start_date), 'dd MMMM yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-bocra-forest-green" />
                      <span>
                        Closes{' '}
                        {format(new Date(consultation.end_date), 'dd MMMM yyyy')}
                      </span>
                    </div>
                  </div>

                  <p className="mt-6 text-xl leading-relaxed text-bocra-text-secondary">
                    {consultation.description}
                  </p>
                </div>
              </div>
            </section>

            <section className="container py-10 md:py-14">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
                <article className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
                  <div className="prose max-w-none prose-p:text-bocra-text-secondary prose-headings:text-bocra-text-primary">
                    {paragraphs.length > 0 ? (
                      paragraphs.map((paragraph, index) => (
                        <p
                          key={`${consultation.id}-paragraph-${index}`}
                          className="mb-5 whitespace-pre-wrap text-base leading-8 text-bocra-text-secondary"
                        >
                          {paragraph}
                        </p>
                      ))
                    ) : (
                      <p className="whitespace-pre-wrap text-base leading-8 text-bocra-text-secondary">
                        {consultation.description}
                      </p>
                    )}
                  </div>
                </article>

                <aside className="space-y-6">
                  <Card className="bg-white p-6">
                    <h2 className="text-xl font-semibold text-bocra-text-primary">
                      Timeline
                    </h2>
                    <div className="mt-4 space-y-4 text-sm text-bocra-text-secondary">
                      <p>
                        <strong className="text-bocra-text-primary">Status:</strong>{' '}
                        {STATUS_STYLES[consultation.status].label}
                      </p>
                      <p>
                        <strong className="text-bocra-text-primary">Start date:</strong>{' '}
                        {format(new Date(consultation.start_date), 'dd MMM yyyy')}
                      </p>
                      <p>
                        <strong className="text-bocra-text-primary">End date:</strong>{' '}
                        {format(new Date(consultation.end_date), 'dd MMM yyyy')}
                      </p>
                      <p className="rounded-xl bg-bocra-light-grey p-4">
                        {differenceInDays(
                          new Date(consultation.end_date),
                          new Date()
                        ) > 0
                          ? `${differenceInDays(
                              new Date(consultation.end_date),
                              new Date()
                            )} days remain in the public consultation window.`
                          : 'This consultation window has closed. Review the published material for reference.'}
                      </p>
                    </div>
                  </Card>

                  <Card className="bg-white p-6">
                    <h2 className="text-xl font-semibold text-bocra-text-primary">
                      Supporting Material
                    </h2>
                    <div className="mt-5 space-y-4">
                      {consultation.document_url ? (
                        <a
                          href={consultation.document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-bocra-forest-green px-4 py-3 font-semibold text-white transition-colors hover:bg-bocra-forest-green/90"
                        >
                          <FileText className="h-4 w-4" />
                          Open Consultation Document
                        </a>
                      ) : (
                        <p className="text-sm text-bocra-text-secondary">
                          No supporting document has been attached to this
                          consultation yet.
                        </p>
                      )}

                      <p className="text-sm text-bocra-text-secondary">
                        Please follow the consultation document for response
                        instructions and submission requirements.
                      </p>
                    </div>
                  </Card>

                  <Card className="bg-white p-6">
                    <h2 className="text-xl font-semibold text-bocra-text-primary">
                      More Consultations
                    </h2>
                    <div className="mt-5 space-y-5">
                      {relatedItems.length > 0 ? (
                        relatedItems.map((item) => (
                          <div
                            key={item.id}
                            className="border-b border-bocra-border pb-5 last:border-b-0 last:pb-0"
                          >
                            <p className="text-xs font-semibold uppercase tracking-wide text-bocra-forest-green">
                              {STATUS_STYLES[item.status].label}
                            </p>
                            <h3 className="mt-2 text-base font-semibold text-bocra-text-primary">
                              {item.title}
                            </h3>
                            <a
                              href={`/consultations/${item.id}`}
                              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-bocra-forest-green"
                            >
                              View Consultation
                              <ArrowRight className="h-4 w-4" />
                            </a>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-bocra-text-secondary">
                          No related consultations are available yet.
                        </p>
                      )}
                    </div>
                  </Card>
                </aside>
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}
