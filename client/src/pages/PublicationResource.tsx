import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft,
  ArrowUpRight,
  Download,
  ExternalLink,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import { format } from 'date-fns';
import { SITE_DESCRIPTION } from '@/const';
import { usePublication } from '@/hooks/usePublication';
import { formatCategoryLabel } from '@/content/internalResources';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const FILE_BADGES = {
  pdf: 'border-transparent bg-bocra-dark-maroon text-white',
  doc: 'border-transparent bg-bocra-teal text-white',
  docx: 'border-transparent bg-bocra-teal text-white',
  xlsx: 'border-transparent bg-bocra-forest-green text-white',
  pptx: 'border-transparent bg-bocra-golden-yellow text-bocra-text-primary',
} as const;

const FILE_ICONS = {
  pdf: FileText,
  doc: FileText,
  docx: FileText,
  xlsx: FileSpreadsheet,
  pptx: FileText,
} as const;

interface PublicationResourceProps {
  slug: string;
}

export default function PublicationResource({
  slug,
}: PublicationResourceProps) {
  const { publication, loading, error } = usePublication(slug);

  return (
    <>
      <Helmet>
        <title>
          {publication ? `${publication.title} | BOCRA` : 'Resource | BOCRA'}
        </title>
        <meta
          name="description"
          content={publication?.description || SITE_DESCRIPTION}
        />
      </Helmet>

      <div className="bg-bocra-light-grey">
        <section className="border-b border-bocra-border bg-white">
          <div className="container py-12 md:py-16">
            <a
              href="/publications"
              className="inline-flex items-center gap-2 text-sm font-medium text-bocra-text-secondary transition-colors hover:text-bocra-teal"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to publications
            </a>

            {loading ? (
              <div className="mt-6 space-y-4">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-14 w-full max-w-3xl" />
                <Skeleton className="h-24 w-full max-w-2xl" />
              </div>
            ) : publication ? (
              <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                <div className="space-y-4">
                  <Badge
                    variant="outline"
                    className={FILE_BADGES[publication.file_type]}
                  >
                    {publication.file_type.toUpperCase()}
                  </Badge>
                  <h1 className="text-4xl font-bold text-bocra-text-primary md:text-5xl">
                    {publication.title}
                  </h1>
                  <p className="max-w-3xl text-lg text-bocra-text-secondary">
                    {publication.description}
                  </p>
                  <div className="flex flex-wrap gap-3 text-sm text-bocra-text-muted">
                    <span>{formatCategoryLabel(publication.category)}</span>
                    <span>Published {format(new Date(publication.published_at), 'dd MMM yyyy')}</span>
                  </div>
                </div>

                <Card className="border-0 bg-bocra-deep-teal p-6 text-white shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-white/10 p-3">
                      {(() => {
                        const Icon = FILE_ICONS[publication.file_type];
                        return <Icon className="h-6 w-6" />;
                      })()}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                        Resource Viewer
                      </p>
                      <p className="mt-1 text-lg font-semibold">
                        Mirrored in Supabase
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button
                      className="bg-white text-bocra-deep-teal hover:bg-white/90"
                      asChild
                    >
                      <a
                        href={publication.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open file
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                      asChild
                    >
                      <a href={publication.file_url} download>
                        Download
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>

                  {publication.source_url && (
                    <a
                      href={publication.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
                    >
                      View original BOCRA source
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </Card>
              </div>
            ) : (
              <Card className="mt-6 p-8">
                <h1 className="text-3xl font-bold text-bocra-text-primary">
                  Resource unavailable
                </h1>
                <p className="mt-3 text-bocra-text-secondary">
                  {error || 'The requested resource could not be found.'}
                </p>
              </Card>
            )}
          </div>
        </section>

        {publication && (
          <section className="container py-8 md:py-10">
            {publication.file_type === 'pdf' ? (
              <Card className="overflow-hidden border-0 bg-white shadow-lg">
                <iframe
                  src={`${publication.file_url}#view=FitH`}
                  title={publication.title}
                  className="h-[75vh] w-full"
                />
              </Card>
            ) : (
              <Card className="border-0 bg-white p-8 shadow-lg">
                <h2 className="text-2xl font-semibold text-bocra-text-primary">
                  This file opens in a new tab
                </h2>
                <p className="mt-3 max-w-2xl text-bocra-text-secondary">
                  The BOCRA resource is mirrored and ready, but this format is
                  better handled in the browser or spreadsheet application
                  directly.
                </p>
                <a
                  href={publication.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 font-semibold text-bocra-dark-maroon"
                >
                  Open file
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Card>
            )}
          </section>
        )}
      </div>
    </>
  );
}
