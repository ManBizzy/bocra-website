import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  FileText,
  Search,
} from 'lucide-react';
import { format } from 'date-fns';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { SITE_DESCRIPTION } from '@/const';
import { LICENCE_REGISTER_DATA } from '@/data/licenceRegisterData';
import {
  STATISTICS_TOPIC_LABELS,
  formatCategoryLabel,
  getPublicationResourceUrl,
  getStatisticsTopic,
  isStatisticsPublication,
} from '@/content/internalResources';
import { usePublications } from '@/hooks/usePublications';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

const CHART_COLORS = [
  '#1B7F79',
  '#2D6A2D',
  '#8B1A1A',
  '#F0B429',
  '#0F4F4B',
] as const;

export default function Statistics() {
  const { publications, loading, error } = usePublications();
  const [activeGroupId, setActiveGroupId] = useState<string>(
    LICENCE_REGISTER_DATA.kpi.groups[0]?.id ?? ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState('all');

  const kpiGroups = useMemo(
    () =>
      LICENCE_REGISTER_DATA.kpi.groups.map((group) => ({
        ...group,
        series: group.series.filter((series) => {
          const hasMeaningfulValue = series.values.some(
            (entry) => entry.value !== null && entry.value !== 0
          );

          return hasMeaningfulValue && series.label !== group.label;
        }),
      })).filter((group) => group.series.length > 0),
    []
  );

  const activeGroup =
    kpiGroups.find((group) => group.id === activeGroupId) ?? kpiGroups[0];

  const chartData = useMemo(() => {
    if (!activeGroup) {
      return [];
    }

    const featuredSeries = activeGroup.series.slice(0, 4);

    return activeGroup.series[0].values.map((point, index) => {
      const label = `${point.year} ${point.label}`.trim();
      const row: Record<string, string | number | null> = { label };

      for (const series of featuredSeries) {
        row[series.label] = series.values[index]?.value ?? null;
      }

      return row;
    });
  }, [activeGroup]);

  const statisticsPublications = useMemo(
    () => publications.filter(isStatisticsPublication),
    [publications]
  );

  const topicOptions = useMemo(() => {
    const keys = Array.from(
      new Set(statisticsPublications.map((publication) => getStatisticsTopic(publication)))
    );

    return ['all', ...keys];
  }, [statisticsPublications]);

  const filteredPublications = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return statisticsPublications.filter((publication) => {
      const topic = getStatisticsTopic(publication);
      const matchesTopic = activeTopic === 'all' || topic === activeTopic;
      const matchesSearch =
        normalizedQuery.length === 0 ||
        publication.title.toLowerCase().includes(normalizedQuery) ||
        publication.description.toLowerCase().includes(normalizedQuery) ||
        publication.category.toLowerCase().includes(normalizedQuery);

      return matchesTopic && matchesSearch;
    });
  }, [activeTopic, searchQuery, statisticsPublications]);

  return (
    <>
      <Helmet>
        <title>Telecom Statistics | BOCRA</title>
        <meta
          name="description"
          content="View BOCRA telecom statistics, KPI trends, broadband facts, market studies, and survey reports without leaving the site."
        />
        <meta property="og:title" content="Telecom Statistics | BOCRA" />
        <meta
          property="og:description"
          content="View BOCRA telecom statistics, KPI trends, broadband facts, market studies, and survey reports without leaving the site."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/statistics`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Telecom Statistics | BOCRA" />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />
      </Helmet>

      <div className="bg-bocra-light-grey">
        <section className="border-b border-bocra-border bg-white">
          <div className="container py-12 md:py-16">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bocra-teal">
                  Telecom Statistics
                </p>
                <h1 className="text-4xl font-bold text-bocra-text-primary md:text-5xl">
                  Sector indicators and research on one page
                </h1>
                <p className="max-w-3xl text-lg text-bocra-text-secondary">
                  This replaces the old redirect with BOCRA KPI trends from the
                  published register workbook plus mirrored statistical
                  publications, market studies, broadband reports, and audience
                  surveys.
                </p>
              </div>

              <Card className="border-0 bg-bocra-deep-teal p-6 text-white shadow-lg">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                      KPI groups
                    </p>
                    <p className="mt-3 text-3xl font-semibold">
                      {kpiGroups.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                      KPI series
                    </p>
                    <p className="mt-3 text-3xl font-semibold">
                      {LICENCE_REGISTER_DATA.totalKpiSeries}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                      Reports
                    </p>
                    <p className="mt-3 text-3xl font-semibold">
                      {statisticsPublications.length}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="container py-8 md:py-10">
          <div className="flex flex-wrap gap-2">
            {kpiGroups.map((group) => (
              <Button
                key={group.id}
                type="button"
                variant={activeGroup?.id === group.id ? 'default' : 'outline'}
                className={
                  activeGroup?.id === group.id
                    ? 'bg-bocra-teal text-white hover:bg-bocra-teal/90'
                    : ''
                }
                onClick={() => setActiveGroupId(group.id)}
              >
                {group.label}
              </Button>
            ))}
          </div>

          {activeGroup && (
            <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <Card className="border-0 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-bocra-teal/10 p-3 text-bocra-teal">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-bocra-text-muted">
                      KPI trend
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold text-bocra-text-primary">
                      {activeGroup.label}
                    </h2>
                  </div>
                </div>

                <div className="mt-6 h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis
                        dataKey="label"
                        tick={{ fill: '#718096', fontSize: 12 }}
                        interval="preserveStartEnd"
                      />
                      <YAxis tick={{ fill: '#718096', fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      {activeGroup.series.slice(0, 4).map((series, index) => (
                        <Line
                          key={series.id}
                          type="monotone"
                          dataKey={series.label}
                          stroke={CHART_COLORS[index % CHART_COLORS.length]}
                          strokeWidth={2}
                          dot={false}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="border-0 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-bocra-text-primary">
                  Latest published values
                </h2>
                <div className="mt-6 grid gap-4">
                  {activeGroup.series.slice(0, 6).map((series) => (
                    <div
                      key={series.id}
                      className="rounded-2xl border border-bocra-border bg-bocra-light-grey p-4"
                    >
                      <p className="text-sm text-bocra-text-secondary">
                        {series.label}
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-bocra-text-primary">
                        {series.latestValue}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </section>

        <section className="container pb-12 md:pb-16">
          <div className="mb-6 flex flex-col gap-4">
            <div className="relative w-full md:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bocra-text-muted" />
              <Input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search telecom reports"
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {topicOptions.map((topic) => (
                <Button
                  key={topic}
                  type="button"
                  variant={activeTopic === topic ? 'default' : 'outline'}
                  className={
                    activeTopic === topic
                      ? 'bg-bocra-dark-maroon text-white hover:bg-bocra-dark-maroon/90'
                      : ''
                  }
                  onClick={() => setActiveTopic(topic)}
                >
                  {topic === 'all'
                    ? 'All reports'
                    : STATISTICS_TOPIC_LABELS[topic]}
                </Button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <Skeleton key={item} className="h-64 w-full" />
              ))}
            </div>
          ) : error ? (
            <Card className="p-8">
              <h2 className="text-2xl font-semibold text-bocra-text-primary">
                Statistics reports are temporarily unavailable
              </h2>
              <p className="mt-3 text-bocra-text-secondary">{error}</p>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredPublications.map((publication) => (
                <Card
                  key={publication.id}
                  className="flex h-full flex-col bg-white p-6 transition-shadow hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <Badge
                      variant="outline"
                      className="border-transparent bg-bocra-dark-maroon text-white"
                    >
                      {STATISTICS_TOPIC_LABELS[getStatisticsTopic(publication)]}
                    </Badge>
                    <div className="rounded-2xl bg-bocra-light-grey p-3">
                      <FileText className="h-5 w-5 text-bocra-dark-maroon" />
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
                        {format(new Date(publication.published_at), 'dd MMM yyyy')}
                      </time>
                    </div>
                    <div>{formatCategoryLabel(publication.category)}</div>
                  </div>

                  <a
                    href={getPublicationResourceUrl(publication.slug)}
                    className="mt-6 inline-flex items-center gap-2 font-semibold text-bocra-dark-maroon transition-all hover:gap-3"
                  >
                    View on this site
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
