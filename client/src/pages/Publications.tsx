import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Download,
  FileSpreadsheet,
  FileText,
  Search,
} from 'lucide-react';
import { format } from 'date-fns';
import { SITE_DESCRIPTION } from '@/const';
import { usePublications } from '@/hooks/usePublications';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import type { Publication } from '@/types';

const FILE_TYPE_META: Record<
  Publication['file_type'],
  { label: string; badge: string; icon: typeof FileText }
> = {
  pdf: {
    label: 'PDF',
    badge: 'border-transparent bg-bocra-dark-maroon text-white',
    icon: FileText,
  },
  doc: {
    label: 'DOC',
    badge: 'border-transparent bg-bocra-teal text-white',
    icon: FileText,
  },
  docx: {
    label: 'DOCX',
    badge: 'border-transparent bg-bocra-teal text-white',
    icon: FileText,
  },
  xlsx: {
    label: 'XLSX',
    badge: 'border-transparent bg-bocra-forest-green text-white',
    icon: FileSpreadsheet,
  },
  pptx: {
    label: 'PPTX',
    badge: 'border-transparent bg-bocra-golden-yellow text-bocra-text-primary',
    icon: FileText,
  },
};

const ARCHIVE_LANES = [
  {
    title: 'Annual Reports',
    description:
      'Corporate reporting, financial disclosures, and high-level regulatory performance updates.',
  },
  {
    title: 'Guidelines',
    description:
      'Operational guidance, compliance reference material, and public service information packs.',
  },
  {
    title: 'Consultative Papers',
    description:
      'Draft frameworks, discussion papers, and supporting documents for stakeholder review.',
  },
] as const;

function formatCategoryLabel(category: string) {
  return category
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

export default function Publications() {
  const { publications, loading, error } = usePublications();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categoryOptions = useMemo(() => {
    const categories = Array.from(
      new Set(publications.map((publication) => publication.category.trim()))
    )
      .filter(Boolean)
      .sort((left, right) => left.localeCompare(right));

    return [
      { key: 'all', label: 'All' },
      ...categories.map((category) => ({
        key: category,
        label: formatCategoryLabel(category),
      })),
    ];
  }, [publications]);

  const filteredPublications = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return publications.filter((publication) => {
      const matchesCategory =
        activeCategory === 'all' || publication.category === activeCategory;
      const matchesSearch =
        normalizedQuery.length === 0 ||
        publication.title.toLowerCase().includes(normalizedQuery) ||
        publication.description.toLowerCase().includes(normalizedQuery) ||
        publication.category.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, publications, searchQuery]);

  const featuredPublication = filteredPublications[0] ?? null;
  const secondaryPublications = featuredPublication
    ? filteredPublications.slice(1)
    : [];
  const archiveStats = {
    totalDocuments: publications.length,
    categories: new Set(publications.map((publication) => publication.category))
      .size,
    formats: new Set(publications.map((publication) => publication.file_type))
      .size,
  };

  return (
    <>
      <Helmet>
        <title>Publications & Reports | BOCRA</title>
        <meta
          name="description"
          content="Access BOCRA publications, annual reports, guidelines, consultation papers, and regulatory reference documents."
        />
        <meta property="og:title" content="Publications & Reports | BOCRA" />
        <meta
          property="og:description"
          content="Access BOCRA publications, annual reports, guidelines, consultation papers, and regulatory reference documents."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`${window.location.origin}/publications`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Publications & Reports | BOCRA"
        />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />
      </Helmet>

      <div className="bg-bocra-light-grey">
        <section className="border-b border-bocra-border bg-white">
          <div className="container py-12 md:py-16">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div className="max-w-3xl space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bocra-dark-maroon">
                  Reference Library
                </p>
                <h1 className="text-4xl font-bold text-bocra-text-primary md:text-5xl">
                  Publications & Reports
                </h1>
                <p className="text-lg text-bocra-text-secondary">
                  Browse annual reports, guidelines, consultation documents,
                  and public reference material published by BOCRA.
                </p>
              </div>

              <div className="grid gap-4 rounded-3xl bg-bocra-deep-teal p-6 text-white sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                    Documents
                  </p>
                  <p className="mt-3 text-3xl font-semibold">
                    {archiveStats.totalDocuments}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                    Categories
                  </p>
                  <p className="mt-3 text-3xl font-semibold">
                    {archiveStats.categories}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                    Formats
                  </p>
                  <p className="mt-3 text-3xl font-semibold">
                    {archiveStats.formats}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container py-8 md:py-10">
          <div className="mb-6 flex flex-col gap-4">
            <div className="relative w-full md:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bocra-text-muted" />
              <Input
                type="search"
                placeholder="Search publications"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((category) => (
                <Button
                  key={category.key}
                  type="button"
                  variant={activeCategory === category.key ? 'default' : 'outline'}
                  className={
                    activeCategory === category.key
                      ? 'bg-bocra-dark-maroon text-white hover:bg-bocra-dark-maroon/90'
                      : ''
                  }
                  onClick={() => setActiveCategory(category.key)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="space-y-8">
              <Skeleton className="h-[320px] w-full" />
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <Skeleton key={item} className="h-72 w-full" />
                ))}
              </div>
            </div>
          ) : error ? (
            <Card className="p-8">
              <h2 className="text-2xl font-semibold text-bocra-text-primary">
                Publications are temporarily unavailable
              </h2>
              <p className="mt-3 text-bocra-text-secondary">{error}</p>
            </Card>
          ) : publications.length === 0 ? (
            <Card className="border-0 bg-white p-4 shadow-lg sm:p-6 md:p-8">
              <Empty className="border-bocra-border bg-bocra-light-grey">
                <EmptyHeader>
                  <EmptyMedia
                    variant="icon"
                    className="bg-bocra-dark-maroon text-white"
                  >
                    <BookOpen className="size-5" />
                  </EmptyMedia>
                  <EmptyTitle className="text-bocra-text-primary">
                    The publications archive is being prepared
                  </EmptyTitle>
                  <EmptyDescription className="text-bocra-text-secondary">
                    The page is now wired to Supabase and ready for live
                    documents. Add publications in Supabase to populate this
                    archive.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent className="max-w-4xl">
                  <div className="grid w-full gap-4 md:grid-cols-3">
                    {ARCHIVE_LANES.map((lane) => (
                      <div
                        key={lane.title}
                        className="rounded-2xl border border-bocra-border bg-white p-5 text-left"
                      >
                        <h3 className="text-base font-semibold text-bocra-text-primary">
                          {lane.title}
                        </h3>
                        <p className="mt-2 text-sm text-bocra-text-secondary">
                          {lane.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </EmptyContent>
              </Empty>
            </Card>
          ) : filteredPublications.length === 0 ? (
            <Card className="p-8">
              <h2 className="text-2xl font-semibold text-bocra-text-primary">
                No publications matched your search
              </h2>
              <p className="mt-3 text-bocra-text-secondary">
                Adjust the search or category filters to find another document.
              </p>
            </Card>
          ) : (
            <div className="space-y-8">
              {featuredPublication && (
                <Card className="overflow-hidden border-0 bg-white shadow-lg">
                  <div className="grid gap-8 p-8 md:grid-cols-[1.15fr_0.85fr] md:p-10">
                    <div>
                      <Badge
                        variant="outline"
                        className={FILE_TYPE_META[featuredPublication.file_type].badge}
                      >
                        {FILE_TYPE_META[featuredPublication.file_type].label}
                      </Badge>
                      <h2 className="mt-5 text-3xl font-bold text-bocra-text-primary md:text-4xl">
                        {featuredPublication.title}
                      </h2>
                      <p className="mt-4 max-w-2xl text-bocra-text-secondary">
                        {featuredPublication.description}
                      </p>

                      <div className="mt-6 flex flex-wrap gap-3 text-sm text-bocra-text-muted">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-bocra-dark-maroon" />
                          <time dateTime={featuredPublication.published_at}>
                            Published{' '}
                            {format(
                              new Date(featuredPublication.published_at),
                              'dd MMM yyyy'
                            )}
                          </time>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-bocra-dark-maroon" />
                          <span>
                            {formatCategoryLabel(featuredPublication.category)}
                          </span>
                        </div>
                      </div>

                      <a
                        href={featuredPublication.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-8 inline-flex items-center gap-2 rounded-md bg-bocra-dark-maroon px-5 py-3 font-semibold text-white transition-colors hover:bg-bocra-dark-maroon/90"
                      >
                        Open Document
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </div>

                    <div className="rounded-2xl bg-bocra-light-grey p-6">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-white p-3 shadow-sm">
                          {(() => {
                            const Icon =
                              FILE_TYPE_META[featuredPublication.file_type].icon;
                            return (
                              <Icon className="h-7 w-7 text-bocra-dark-maroon" />
                            );
                          })()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bocra-text-muted">
                            Featured document
                          </p>
                          <p className="mt-1 text-lg font-semibold text-bocra-text-primary">
                            Ready for download
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 space-y-4 text-sm text-bocra-text-secondary">
                        <p>
                          Use the BOCRA publications archive for official
                          reports, reference documents, and policy material.
                        </p>
                        <div className="rounded-2xl bg-white p-4">
                          <p className="font-medium text-bocra-text-primary">
                            Archive coverage
                          </p>
                          <ul className="mt-3 space-y-2">
                            {ARCHIVE_LANES.map((lane) => (
                              <li key={lane.title}>{lane.title}</li>
                            ))}
                          </ul>
                        </div>
                        <a
                          href={featuredPublication.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 font-semibold text-bocra-dark-maroon transition-all hover:gap-3"
                        >
                          <Download className="h-4 w-4" />
                          Download or view publication
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {secondaryPublications.map((publication) => {
                  const meta = FILE_TYPE_META[publication.file_type];
                  const Icon = meta.icon;

                  return (
                    <Card
                      key={publication.id}
                      className="flex h-full flex-col bg-white p-6 transition-shadow hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <Badge variant="outline" className={meta.badge}>
                          {meta.label}
                        </Badge>
                        <div className="rounded-2xl bg-bocra-light-grey p-3">
                          <Icon className="h-5 w-5 text-bocra-dark-maroon" />
                        </div>
                      </div>

                      <h3 className="mt-5 text-xl font-semibold text-bocra-text-primary">
                        {publication.title}
                      </h3>
                      <p className="mt-3 flex-1 text-sm text-bocra-text-secondary">
                        {publication.description}
                      </p>

                      <div className="mt-5 space-y-3 text-sm text-bocra-text-muted">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-bocra-dark-maroon" />
                          <time dateTime={publication.published_at}>
                            {format(
                              new Date(publication.published_at),
                              'dd MMM yyyy'
                            )}
                          </time>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-bocra-dark-maroon" />
                          <span>{formatCategoryLabel(publication.category)}</span>
                        </div>
                      </div>

                      <a
                        href={publication.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex items-center gap-2 font-semibold text-bocra-dark-maroon transition-all hover:gap-3"
                      >
                        Open Publication
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
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
