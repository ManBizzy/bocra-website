import type { Publication } from '@/types';

export const LICENCE_REGISTER_URL = '/licensing/register';
export const STATISTICS_URL = '/statistics';

export function getPortalRouteWithNext(nextPath: string) {
  return `/portal/login?next=${encodeURIComponent(nextPath)}`;
}

export const PORTAL_COMPLAINT_URL = getPortalRouteWithNext(
  '/portal/dashboard#file-complaint'
);
export const PORTAL_LICENCE_VERIFICATION_URL = getPortalRouteWithNext(
  '/portal/dashboard#licence-verification'
);

export const FEATURED_RESOURCE_SLUGS = {
  typeApprovalDatabase: 'type-approval-database-e874cba5',
  typeApprovalGuidelines: 'bocra-type-approval-guidelines-2023-9b31f162',
  spectrumLicensingPolicy:
    'a-new-policy-for-spectrum-licensing-and-spectrum-pricing-in-botswana-9850492c',
  licensingFramework: 'bocra-licensing-framework-3f30ff71',
  complaintsHandlingProcedure: 'complaints-handling-procedure-5472e6dd',
  qualityOfServiceGuidelines:
    'information-communication-technologies-quality-of-service-and-quality-of-experience-guidelines-7c378e8f',
  domainTermsAndConditions:
    'botswana-domain-name-bw-registration-terms-and-conditions-43097a98',
  broadcastingAudienceSurvey: 'nbb-audience-survey-report-volume-i-49d90659',
  broadcastingRegulation: 'broadcasting-regulation-fc24be82',
  broadcastingLicenceProcedure:
    'broadcasting-licence-application-and-assessment-procedure-ed996afc',
  cybersecurityStrategy: 'national-cybersecurity-strategy-71a9230f',
  cybersecurityAct: 'cybersecurity-act-2025-d2337016',
  electronicTransactionsAct:
    'electronic-communications-and-transactions-act-2014-3629bdd7',
  electronicRecordsEvidenceAct:
    'electronic-records-and-evidence-act-2014-32ba3f36',
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
