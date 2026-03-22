import { LICENCE_REGISTER_DATA } from '@/data/licenceRegisterData';

export type LicenceVerificationStatus =
  | 'active'
  | 'revoked'
  | 'surrendered_cancelled';

export interface LicenceVerificationRecord {
  id: string;
  entityName: string;
  licenceNumber: string | null;
  issuedDate: string | null;
  expiryDate: string | null;
  sheetId: string;
  sheetLabel: string;
  sectionId: string;
  sectionLabel: string;
  status: LicenceVerificationStatus;
  statusLabel: string;
  searchText: string;
  raw: Record<string, string>;
}

type RegisterRow = Record<string, string>;

const ENTITY_KEYS = [
  'company-name',
  'name-of-company',
  'name',
  'station-name',
  'service-provider',
  'operator-name',
  'company',
];

const LICENCE_KEYS = [
  'licence-no',
  'licence-number',
  'license-no',
  'license-number',
  'permit-no',
];

const ISSUED_KEYS = [
  'date-issued',
  'authorisation-date',
  'authorization-date',
  'issue-date',
];

const EXPIRY_KEYS = ['expiry-date', 'expiration-date', 'valid-until'];

function pickPreferredValue(row: RegisterRow, preferredKeys: string[]) {
  for (const key of preferredKeys) {
    const value = row[key];

    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

function pickValueByKeyWords(row: RegisterRow, requiredFragments: string[]) {
  for (const [key, value] of Object.entries(row)) {
    if (
      typeof value === 'string' &&
      value.trim() &&
      requiredFragments.every((fragment) => key.includes(fragment))
    ) {
      return value.trim();
    }
  }

  return null;
}

function getEntityName(row: RegisterRow) {
  const directMatch = pickPreferredValue(row, ENTITY_KEYS);

  if (directMatch) {
    return directMatch;
  }

  const nameLikeMatch = pickValueByKeyWords(row, ['name']);

  if (nameLikeMatch) {
    return nameLikeMatch;
  }

  return (
    Object.values(row).find((value) => {
      const text = String(value).trim();

      return Boolean(text) && !/^\d+$/.test(text);
    }) ?? 'Unknown entity'
  );
}

function getStatusForSheet(sheetId: string): LicenceVerificationStatus {
  if (sheetId === 'revoked') {
    return 'revoked';
  }

  if (sheetId === 'surrendered-cancelled') {
    return 'surrendered_cancelled';
  }

  return 'active';
}

function getStatusLabel(status: LicenceVerificationStatus) {
  switch (status) {
    case 'revoked':
      return 'Revoked';
    case 'surrendered_cancelled':
      return 'Surrendered / Cancelled';
    case 'active':
    default:
      return 'Active Register';
  }
}

export const LICENCE_VERIFICATION_TABS = [
  { id: 'all', label: 'All records' },
  ...LICENCE_REGISTER_DATA.sheets.map((sheet) => ({
    id: sheet.id,
    label: sheet.label,
  })),
];

export const LICENCE_VERIFICATION_RECORDS: LicenceVerificationRecord[] =
  LICENCE_REGISTER_DATA.sheets
    .flatMap((sheet) =>
      sheet.sections.flatMap((section) =>
        (section.rows as readonly RegisterRow[]).map((row, index) => {
          const status = getStatusForSheet(sheet.id);
          const entityName = getEntityName(row);
          const licenceNumber =
            pickPreferredValue(row, LICENCE_KEYS) ??
            pickValueByKeyWords(row, ['licence', 'no']) ??
            pickValueByKeyWords(row, ['license', 'no']);
          const issuedDate =
            pickPreferredValue(row, ISSUED_KEYS) ??
            pickValueByKeyWords(row, ['date', 'issued']);
          const expiryDate =
            pickPreferredValue(row, EXPIRY_KEYS) ??
            pickValueByKeyWords(row, ['expiry']);

          return {
            id: `${sheet.id}-${section.id}-${index}`,
            entityName,
            licenceNumber,
            issuedDate,
            expiryDate,
            sheetId: sheet.id,
            sheetLabel: sheet.label,
            sectionId: section.id,
            sectionLabel: section.label,
            status,
            statusLabel: getStatusLabel(status),
            searchText: [
              entityName,
              licenceNumber,
              issuedDate,
              expiryDate,
              sheet.label,
              section.label,
              ...Object.values(row),
            ]
              .filter(Boolean)
              .join(' ')
              .toLowerCase(),
            raw: row,
          };
        })
      )
    )
    .sort((left, right) => left.entityName.localeCompare(right.entityName));

export const LICENCE_VERIFICATION_COUNTS = LICENCE_VERIFICATION_RECORDS.reduce(
  (counts, record) => {
    counts.total += 1;

    if (record.status === 'active') {
      counts.active += 1;
    } else if (record.status === 'revoked') {
      counts.revoked += 1;
    } else {
      counts.surrenderedCancelled += 1;
    }

    return counts;
  },
  {
    total: 0,
    active: 0,
    revoked: 0,
    surrenderedCancelled: 0,
  }
);
