import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ArrowUpRight,
  Download,
  FileSpreadsheet,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { format } from 'date-fns';
import { SITE_DESCRIPTION } from '@/const';
import {
  LICENCE_REGISTER_DATA,
  LICENCE_REGISTER_SOURCE_URL,
} from '@/data/licenceRegisterData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

function humanizeColumnLabel(value: string) {
  return value
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default function LicensingRegister() {
  const [activeSheetId, setActiveSheetId] = useState<string>(
    LICENCE_REGISTER_DATA.sheets[0]?.id ?? ''
  );
  const [activeSectionId, setActiveSectionId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const activeSheet =
    LICENCE_REGISTER_DATA.sheets.find((sheet) => sheet.id === activeSheetId) ??
    LICENCE_REGISTER_DATA.sheets[0];
  const activeSection =
    activeSheet?.sections.find((section) => section.id === activeSectionId) ??
    activeSheet?.sections[0];

  useEffect(() => {
    setActiveSectionId(activeSheet?.sections[0]?.id ?? '');
  }, [activeSheetId]);

  const filteredRows = useMemo(() => {
    if (!activeSection) {
      return [];
    }

    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return activeSection.rows;
    }

    return activeSection.rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(normalizedQuery)
      )
    );
  }, [activeSection, searchQuery]);

  const totals = {
    sheets: LICENCE_REGISTER_DATA.sheets.length,
    sections: LICENCE_REGISTER_DATA.sheets.reduce(
      (count, sheet) => count + sheet.sections.length,
      0
    ),
    records: LICENCE_REGISTER_DATA.totalRecords,
  };

  return (
    <>
      <Helmet>
        <title>Licence Register | BOCRA</title>
        <meta
          name="description"
          content="Search BOCRA licence holders, broadcasting stations, postal operators, and online services from the published register workbook."
        />
        <meta property="og:title" content="Licence Register | BOCRA" />
        <meta
          property="og:description"
          content="Search BOCRA licence holders, broadcasting stations, postal operators, and online services from the published register workbook."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`${window.location.origin}/licensing/register`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Licence Register | BOCRA" />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />
      </Helmet>

      <div className="bg-bocra-light-grey">
        <section className="border-b border-bocra-border bg-white">
          <div className="container py-12 md:py-16">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-bocra-forest-green">
                  Licensing Register
                </p>
                <h1 className="text-4xl font-bold text-bocra-text-primary md:text-5xl">
                  Search published BOCRA licence holders
                </h1>
                <p className="max-w-3xl text-lg text-bocra-text-secondary">
                  Instead of forcing visitors to download the spreadsheet first,
                  this page turns the BOCRA register into searchable sections
                  for ICT operators, broadcasting, postal services, online
                  services, and status changes such as revoked or surrendered
                  licences.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    className="bg-bocra-forest-green text-white hover:bg-bocra-forest-green/90"
                    asChild
                  >
                    <a
                      href={LICENCE_REGISTER_SOURCE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download source workbook
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/services/licensing">
                      Back to licensing
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              <Card className="border-0 bg-bocra-deep-teal p-6 text-white shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white/10 p-3">
                    <FileSpreadsheet className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                      Workbook source
                    </p>
                    <p className="mt-1 text-lg font-semibold">
                      {LICENCE_REGISTER_DATA.sourceLabel}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                      Sheets
                    </p>
                    <p className="mt-3 text-3xl font-semibold">{totals.sheets}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                      Sections
                    </p>
                    <p className="mt-3 text-3xl font-semibold">
                      {totals.sections}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                      Records
                    </p>
                    <p className="mt-3 text-3xl font-semibold">
                      {totals.records}
                    </p>
                  </div>
                </div>

                <p className="mt-6 text-sm text-white/80">
                  Last synced{' '}
                  {format(new Date(LICENCE_REGISTER_DATA.syncedAt), 'dd MMM yyyy')}
                  . Use the search box below to filter by operator name, licence
                  number, access type, or status.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section className="container py-8 md:py-10">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {LICENCE_REGISTER_DATA.sheets.map((sheet) => (
                <Button
                  key={sheet.id}
                  type="button"
                  variant={activeSheetId === sheet.id ? 'default' : 'outline'}
                  className={
                    activeSheetId === sheet.id
                      ? 'bg-bocra-forest-green text-white hover:bg-bocra-forest-green/90'
                      : ''
                  }
                  onClick={() => setActiveSheetId(sheet.id)}
                >
                  {sheet.label}
                </Button>
              ))}
            </div>

            {activeSheet && (
              <div className="flex flex-wrap gap-2">
                {activeSheet.sections.map((section) => (
                  <Button
                    key={section.id}
                    type="button"
                    variant={
                      activeSection?.id === section.id ? 'default' : 'outline'
                    }
                    className={
                      activeSection?.id === section.id
                        ? 'bg-bocra-teal text-white hover:bg-bocra-teal/90'
                        : ''
                    }
                    onClick={() => setActiveSectionId(section.id)}
                  >
                    {section.label}
                  </Button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="border-0 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <Badge
                    variant="outline"
                    className="border-transparent bg-bocra-forest-green/10 text-bocra-forest-green"
                  >
                    Active view
                  </Badge>
                  <h2 className="mt-4 text-2xl font-semibold text-bocra-text-primary">
                    {activeSection?.label || activeSheet?.label}
                  </h2>
                  <p className="mt-2 text-sm text-bocra-text-secondary">
                    {filteredRows.length} matching records
                  </p>
                </div>

                <div className="relative w-full md:max-w-sm">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bocra-text-muted" />
                  <Input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search this register section"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="mt-6 overflow-x-auto rounded-2xl border border-bocra-border">
                <table className="min-w-full divide-y divide-bocra-border text-sm">
                  <thead className="bg-bocra-light-grey">
                    <tr>
                      {activeSection?.columns.map((column) => (
                        <th
                          key={column}
                          scope="col"
                          className="px-4 py-3 text-left font-semibold text-bocra-text-primary"
                        >
                          {humanizeColumnLabel(column)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-bocra-border bg-white">
                    {filteredRows.map((row, index) => (
                      <tr key={`${activeSection?.id ?? 'section'}-${index}`}>
                        {activeSection?.columns.map((column) => {
                          const key =
                            column
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, '-')
                              .replace(/^-+|-+$/g, '') || column;

                          return (
                            <td
                              key={`${index}-${column}`}
                              className="px-4 py-3 align-top text-bocra-text-secondary"
                            >
                              {row[key as keyof typeof row] || '—'}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="border-0 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-bocra-teal/10 p-3 text-bocra-teal">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-bocra-text-muted">
                    How to use it
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-bocra-text-primary">
                    Search, filter, then verify
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm text-bocra-text-secondary">
                <p>
                  Switch between service sheets to focus on broadcasting,
                  network facilities, postal operators, or online services.
                </p>
                <p>
                  Use the section buttons to narrow the register to the exact
                  licence lane you need before searching.
                </p>
                <p>
                  For formal application guidance, go back to the licensing
                  service page and use the BOCRA portal or the mirrored
                  reference documents.
                </p>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}
