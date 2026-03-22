import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  BriefcaseBusiness,
  FileText,
  Newspaper,
  Search,
} from 'lucide-react';
import { useLocation } from 'wouter';
import { SERVICE_AREAS } from '@/content/services';
import {
  fetchConsultations,
  fetchNews,
  fetchPublications,
} from '@/lib/supabase';
import type { Consultation, News, Publication } from '@/types';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

type SearchResult = {
  id: string;
  group: 'Service Pages' | 'News' | 'Publications' | 'Consultations';
  title: string;
  description: string;
  href: string;
  external?: boolean;
  keywords: string[];
};

const STATIC_SERVICE_RESULTS: SearchResult[] = SERVICE_AREAS.map((service) => ({
  id: `service-${service.slug}`,
  group: 'Service Pages',
  title: service.title,
  description: service.summary,
  href: `/services/${service.slug}`,
  keywords: [
    service.slug,
    service.eyebrow,
    service.summary,
    service.description,
    ...service.useCases,
    ...service.responsibilities,
  ],
}));

STATIC_SERVICE_RESULTS.push(
  {
    id: 'page-board-of-directors',
    group: 'Service Pages',
    title: 'Board of Directors',
    description: 'BOCRA governance page with the current board roster and member profiles.',
    href: '/board-of-directors',
    keywords: ['board', 'governance', 'leadership', 'chairperson', 'directors'],
  },
  {
    id: 'page-executive-management',
    group: 'Service Pages',
    title: 'Executive Management',
    description: 'BOCRA executive leadership roster embedded into the current website.',
    href: '/executive-management',
    keywords: ['executive', 'management', 'leadership', 'chief executive'],
  }
);

const GROUP_ORDER: SearchResult['group'][] = [
  'Service Pages',
  'News',
  'Publications',
  'Consultations',
];

function buildNewsResults(news: News[]): SearchResult[] {
  return news.map((article) => ({
    id: `news-${article.id}`,
    group: 'News',
    title: article.title,
    description: article.excerpt,
    href: `/news/${article.slug}`,
    keywords: [article.category, article.excerpt, article.content],
  }));
}

function buildPublicationResults(publications: Publication[]): SearchResult[] {
  return publications.map((publication) => ({
    id: `publication-${publication.id}`,
    group: 'Publications',
    title: publication.title,
    description: publication.description,
    href: publication.file_url,
    external: true,
    keywords: [
      publication.category,
      publication.file_type,
      publication.description,
      publication.source_url ?? '',
    ],
  }));
}

function buildConsultationResults(
  consultations: Consultation[]
): SearchResult[] {
  return consultations.map((consultation) => ({
    id: `consultation-${consultation.id}`,
    group: 'Consultations',
    title: consultation.title,
    description: consultation.description,
    href: `/consultations/${consultation.id}`,
    keywords: [
      consultation.status,
      consultation.description,
      consultation.document_url ?? '',
    ],
  }));
}

function iconForGroup(group: SearchResult['group']) {
  switch (group) {
    case 'News':
      return Newspaper;
    case 'Publications':
      return BookOpen;
    case 'Consultations':
      return FileText;
    case 'Service Pages':
    default:
      return BriefcaseBusiness;
  }
}

type SiteSearchProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function SiteSearch({ open, onOpenChange }: SiteSearchProps) {
  const [, setLocation] = useLocation();
  const [results, setResults] = useState<SearchResult[]>(STATIC_SERVICE_RESULTS);
  const [loading, setLoading] = useState(false);
  const [hasLoadedRemote, setHasLoadedRemote] = useState(false);

  useEffect(() => {
    const handleHotkey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        onOpenChange(!open);
      }
    };

    window.addEventListener('keydown', handleHotkey);
    return () => window.removeEventListener('keydown', handleHotkey);
  }, [onOpenChange, open]);

  useEffect(() => {
    if (!open || hasLoadedRemote) return;

    let ignore = false;

    const loadSearchData = async () => {
      setLoading(true);

      const [newsResult, publicationsResult, consultationsResult] =
        await Promise.allSettled([
          fetchNews(),
          fetchPublications(),
          fetchConsultations(undefined, 'all'),
        ]);

      if (ignore) return;

      const nextResults = [...STATIC_SERVICE_RESULTS];

      if (newsResult.status === 'fulfilled') {
        nextResults.push(...buildNewsResults(newsResult.value));
      }

      if (publicationsResult.status === 'fulfilled') {
        nextResults.push(...buildPublicationResults(publicationsResult.value));
      }

      if (consultationsResult.status === 'fulfilled') {
        nextResults.push(...buildConsultationResults(consultationsResult.value));
      }

      setResults(nextResults);
      setHasLoadedRemote(true);
      setLoading(false);
    };

    void loadSearchData();

    return () => {
      ignore = true;
    };
  }, [hasLoadedRemote, open]);

  const groupedResults = useMemo(() => {
    return GROUP_ORDER.map((group) => ({
      group,
      items: results.filter((item) => item.group === group),
    })).filter((entry) => entry.items.length > 0);
  }, [results]);

  const handleSelect = (item: SearchResult) => {
    onOpenChange(false);

    if (item.external) {
      window.location.assign(item.href);
      return;
    }

    setLocation(item.href);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search BOCRA"
      description="Search services, governance pages, news, publications, and consultations."
      className="max-w-2xl"
    >
      <CommandInput placeholder="Search services, leadership pages, news, publications, and consultations..." />
      <CommandList>
        <CommandEmpty>
          {loading ? 'Loading search index...' : 'No matching BOCRA content found.'}
        </CommandEmpty>
        {groupedResults.map(({ group, items }) => (
          <CommandGroup key={group} heading={group}>
            {items.map((item) => {
              const Icon = iconForGroup(group);

              return (
                <CommandItem
                  key={item.id}
                  value={`${item.title} ${item.description}`}
                  keywords={item.keywords}
                  onSelect={() => handleSelect(item)}
                >
                  <Icon className="h-4 w-4 text-bocra-teal" />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-medium">{item.title}</span>
                    <span className="truncate text-xs text-bocra-text-secondary">
                      {item.description}
                    </span>
                  </div>
                  {item.external && (
                    <span className="ml-auto text-[10px] font-semibold uppercase tracking-[0.2em] text-bocra-text-muted">
                      Document
                    </span>
                  )}
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}
      </CommandList>
      <div className="border-t border-bocra-border px-4 py-3 text-xs text-bocra-text-muted">
        <span className="inline-flex items-center gap-2">
          <Search className="h-3.5 w-3.5" />
          Use <kbd className="rounded border bg-white px-1.5 py-0.5">Ctrl</kbd>
          <span>+</span>
          <kbd className="rounded border bg-white px-1.5 py-0.5">K</kbd> to
          open search.
        </span>
      </div>
    </CommandDialog>
  );
}
