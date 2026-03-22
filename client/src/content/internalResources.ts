import type { Publication } from '@/types';

export const LICENCE_REGISTER_URL = '/licensing/register';
export const STATISTICS_URL = '/statistics';

export const FEATURED_RESOURCE_SLUGS = {
  typeApprovalDatabase: 'type-approval-database-e874cba5',
  typeApprovalGuidelines: 'bocra-type-approval-guidelines-2023-9b31f162',
  broadcastingAudienceSurvey: 'nbb-audience-survey-report-volume-i-49d90659',
  telecomsStatistics: 'bocra-telecommunications-statistics-as-at-march-2021-2551c5ed',
} as const;

export function getPublicationResourceUrl(slug: string) {
  return `/resources/${slug}`;
}

export function formatCategoryLabel(category: string) {
  return category
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

export function isStatisticsPublication(publication: Publication) {
  const haystack = `${publication.title} ${publication.description} ${publication.category}`.toLowerCase();

  return (
    haystack.includes('statistics') ||
    haystack.includes('facts and figures') ||
    haystack.includes('market study') ||
    haystack.includes('survey report') ||
    haystack.includes('measurement report') ||
    haystack.includes('state of icts') ||
    haystack.includes('ict sector') ||
    haystack.includes('telecoms')
  );
}

export function getStatisticsTopic(publication: Publication) {
  const title = publication.title.toLowerCase();

  if (title.includes('statistics') || title.includes('state of icts')) {
    return 'telecom-statistics';
  }

  if (title.includes('broadband')) {
    return 'broadband';
  }

  if (title.includes('audience survey') || title.includes('survey') || title.includes('market study')) {
    return 'market-and-surveys';
  }

  if (title.includes('measurement report')) {
    return 'measurement-reports';
  }

  return 'other';
}

export const STATISTICS_TOPIC_LABELS: Record<string, string> = {
  'telecom-statistics': 'Telecom Statistics',
  broadband: 'Broadband',
  'market-and-surveys': 'Market & Surveys',
  'measurement-reports': 'Measurement Reports',
  other: 'Other Reports',
};
