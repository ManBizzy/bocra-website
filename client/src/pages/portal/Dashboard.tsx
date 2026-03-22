import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Download,
  FileText,
  Home,
  MessageSquare,
  Search,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { useAuth } from '@/_core/hooks/useAuth';
import { LICENCE_REGISTER_SOURCE_URL } from '@/data/licenceRegisterData';
import {
  LICENCE_VERIFICATION_COUNTS,
  LICENCE_VERIFICATION_RECORDS,
  LICENCE_VERIFICATION_TABS,
  type LicenceVerificationStatus,
} from '@/lib/licenceVerification';
import type { LicenseApplication } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

type ComplaintStatus = 'open' | 'in_review' | 'resolved' | 'closed';
type LicenseApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'more_information_required'
  | 'approved'
  | 'rejected';

type PortalComplaint = {
  id: string;
  title: string;
  category: string;
  description: string;
  status: ComplaintStatus;
  priority: 'low' | 'medium' | 'high';
  submitted_date: string;
};

type PortalConsultation = {
  id: string;
  title: string;
  end_date: string;
  status: 'open' | 'closed' | 'archived';
};

type PortalOverview = {
  complaintSummary: Record<ComplaintStatus | 'total', number>;
  complaints: PortalComplaint[];
  consultations: PortalConsultation[];
  licenseApplications: LicenseApplication[];
  licenseApplicationSummary: Record<LicenseApplicationStatus | 'total', number>;
};

type ComplaintFormState = {
  title: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
};

type LicenseApplicationFormState = {
  applicationType: string;
  organizationName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  serviceArea: string;
  summary: string;
};

const complaintBadgeClass: Record<ComplaintStatus, string> = {
  open: 'bg-bocra-dark-maroon text-white',
  in_review: 'bg-bocra-golden-yellow text-bocra-text-primary',
  resolved: 'bg-bocra-forest-green text-white',
  closed: 'bg-bocra-text-muted text-white',
};

const complaintStageOrder: ComplaintStatus[] = [
  'open',
  'in_review',
  'resolved',
  'closed',
];

const complaintStageLabel: Record<ComplaintStatus, string> = {
  open: 'Submitted',
  in_review: 'In Review',
  resolved: 'Resolved',
  closed: 'Closed',
};

const verificationBadgeClass: Record<LicenceVerificationStatus, string> = {
  active: 'bg-bocra-forest-green text-white',
  revoked: 'bg-bocra-dark-maroon text-white',
  surrendered_cancelled: 'bg-bocra-golden-yellow text-bocra-text-primary',
};

const licenseApplicationBadgeClass: Record<LicenseApplicationStatus, string> = {
  submitted: 'bg-bocra-dark-maroon text-white',
  under_review: 'bg-bocra-teal text-white',
  more_information_required: 'bg-bocra-golden-yellow text-bocra-text-primary',
  approved: 'bg-bocra-forest-green text-white',
  rejected: 'bg-bocra-text-muted text-white',
};

const licenseApplicationStageOrder: LicenseApplicationStatus[] = [
  'submitted',
  'under_review',
  'more_information_required',
  'approved',
  'rejected',
];

const licenseApplicationStageLabel: Record<LicenseApplicationStatus, string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  more_information_required: 'More Info',
  approved: 'Approved',
  rejected: 'Rejected',
};

const complaintCategories = [
  'Mobile data quality',
  'Voice service',
  'Billing dispute',
  'SIM registration',
  'Internet services',
  'Broadcasting services',
  'Postal services',
  'Licensing guidance',
  'Other',
] as const;

const licenseApplicationTypes = [
  'Individual licence application',
  'Broadcasting licence',
  'Telecommunications authorisation',
  'Spectrum assignment request',
  'Type approval application',
  'Postal operator application',
  'Other regulatory application',
] as const;

const licenseServiceAreas = [
  'Licensing',
  'Broadcasting',
  'Spectrum Management',
  'Type Approval',
  'Postal Services',
  'Cybersecurity Advisory',
  'Other',
] as const;

const initialComplaintForm: ComplaintFormState = {
  title: '',
  category: complaintCategories[0],
  priority: 'medium',
  description: '',
};

const initialLicenseApplicationForm: LicenseApplicationFormState = {
  applicationType: licenseApplicationTypes[0],
  organizationName: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  serviceArea: licenseServiceAreas[0],
  summary: '',
};

function ComplaintProgress({ status }: { status: ComplaintStatus }) {
  const currentIndex = complaintStageOrder.indexOf(status);

  return (
    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
      {complaintStageOrder.map((step, index) => {
        const active = currentIndex >= index;

        return (
          <div
            key={step}
            className={`rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] ${
              active
                ? 'border-bocra-teal bg-bocra-teal/10 text-bocra-teal'
                : 'border-bocra-border bg-white text-bocra-text-muted'
            }`}
          >
            {complaintStageLabel[step]}
          </div>
        );
      })}
    </div>
  );
}

function LicenseApplicationProgress({
  status,
}: {
  status: LicenseApplicationStatus;
}) {
  const activeSteps = {
    submitted: ['submitted'],
    under_review: ['submitted', 'under_review'],
    more_information_required: [
      'submitted',
      'under_review',
      'more_information_required',
    ],
    approved: ['submitted', 'under_review', 'approved'],
    rejected: ['submitted', 'under_review', 'rejected'],
  }[status] as LicenseApplicationStatus[];

  return (
    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
      {licenseApplicationStageOrder.map((step) => {
        const active = activeSteps.includes(step);

        return (
          <div
            key={step}
            className={`rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] ${
              active
                ? 'border-bocra-forest-green bg-bocra-forest-green/10 text-bocra-forest-green'
                : 'border-bocra-border bg-white text-bocra-text-muted'
            }`}
          >
            {licenseApplicationStageLabel[step]}
          </div>
        );
      })}
    </div>
  );
}

function formatRegisterDate(value: string | null) {
  if (!value) return 'Not listed';
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return value;
  return format(parsedDate, 'dd MMM yyyy');
}

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error(`Could not read ${file.name}.`));
        return;
      }
      resolve(reader.result);
    };
    reader.onerror = () => reject(new Error(`Could not read ${file.name}.`));
    reader.readAsDataURL(file);
  });
}

export default function PortalDashboard() {
  const { user, loading, logout } = useAuth({
    redirectOnUnauthenticated: true,
  });
  const [overview, setOverview] = useState<PortalOverview | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState<string | null>(null);
  const [complaintForm, setComplaintForm] =
    useState<ComplaintFormState>(initialComplaintForm);
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);
  const [verificationTabId, setVerificationTabId] = useState('all');
  const [verificationQuery, setVerificationQuery] = useState('');
  const [workflowTab, setWorkflowTab] = useState<'complaints' | 'license-applications'>(
    typeof window !== 'undefined' &&
      window.location.hash.includes('license-applications')
      ? 'license-applications'
      : 'complaints'
  );
  const [licenseApplicationForm, setLicenseApplicationForm] =
    useState<LicenseApplicationFormState>(initialLicenseApplicationForm);
  const [licenseApplicationFiles, setLicenseApplicationFiles] = useState<File[]>(
    []
  );
  const [isSubmittingLicenseApplication, setIsSubmittingLicenseApplication] =
    useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);

  const verificationResults = useMemo(() => {
    const normalizedQuery = verificationQuery.trim().toLowerCase();

    return LICENCE_VERIFICATION_RECORDS.filter((record) => {
      const matchesTab =
        verificationTabId === 'all' || record.sheetId === verificationTabId;
      const matchesQuery =
        !normalizedQuery || record.searchText.includes(normalizedQuery);

      return matchesTab && matchesQuery;
    });
  }, [verificationQuery, verificationTabId]);

  const visibleVerificationResults = verificationResults.slice(0, 12);

  const loadOverview = async () => {
    setOverviewLoading(true);

    try {
      const response = await fetch('/api/portal/overview', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Could not load portal activity.');
      }

      const payload = (await response.json()) as PortalOverview;
      setOverview(payload);
      setOverviewError(null);
    } catch (error) {
      setOverviewError(
        error instanceof Error
          ? error.message
          : 'Could not load portal activity.'
      );
    } finally {
      setOverviewLoading(false);
    }
  };

  useEffect(() => {
    if (loading || !user) {
      return;
    }

    setLicenseApplicationForm((current) => ({
      ...current,
      contactName: current.contactName || user.name,
      contactEmail: current.contactEmail || user.email,
    }));

    void loadOverview();
  }, [loading, user]);

  const handleComplaintField = (
    field: keyof ComplaintFormState,
    value: string
  ) => {
    setComplaintForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleLicenseApplicationField = (
    field: keyof LicenseApplicationFormState,
    value: string
  ) => {
    setLicenseApplicationForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleComplaintSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const payload = {
      title: complaintForm.title.trim(),
      category: complaintForm.category.trim(),
      priority: complaintForm.priority,
      description: complaintForm.description.trim(),
    };

    if (!payload.title || !payload.category || !payload.description) {
      toast.error('Please complete the complaint title, category, and details.');
      return;
    }

    setIsSubmittingComplaint(true);

    try {
      const response = await fetch('/api/portal/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error ?? 'Could not submit complaint.');
      }

      setComplaintForm(initialComplaintForm);
      setWorkflowTab('complaints');
      toast.success('Complaint submitted. You can now track its progress below.');
      await loadOverview();
      window.location.hash = 'complaint-history';
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Could not submit complaint.'
      );
    } finally {
      setIsSubmittingComplaint(false);
    }
  };

  const handleLicenseApplicationSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const payload = {
      applicationType: licenseApplicationForm.applicationType.trim(),
      organizationName: licenseApplicationForm.organizationName.trim(),
      contactName: licenseApplicationForm.contactName.trim(),
      contactEmail: licenseApplicationForm.contactEmail.trim(),
      contactPhone: licenseApplicationForm.contactPhone.trim(),
      serviceArea: licenseApplicationForm.serviceArea.trim(),
      summary: licenseApplicationForm.summary.trim(),
      attachments: await Promise.all(
        licenseApplicationFiles.map(async (file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
          dataBase64: await fileToBase64(file),
        }))
      ),
    };

    if (
      !payload.applicationType ||
      !payload.organizationName ||
      !payload.contactName ||
      !payload.contactEmail ||
      !payload.serviceArea ||
      !payload.summary
    ) {
      toast.error('Complete the application details before submitting.');
      return;
    }

    setIsSubmittingLicenseApplication(true);

    try {
      const response = await fetch('/api/portal/license-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error ?? 'Could not submit licence application.');
      }

      setLicenseApplicationForm((current) => ({
        ...initialLicenseApplicationForm,
        contactName: current.contactName,
        contactEmail: current.contactEmail,
        contactPhone: current.contactPhone,
      }));
      setLicenseApplicationFiles([]);
      setFileInputKey((current) => current + 1);
      setWorkflowTab('license-applications');
      toast.success('Licence application submitted. BOCRA can now review it.');
      await loadOverview();
      window.location.hash = 'application-history';
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Could not submit licence application.'
      );
    } finally {
      setIsSubmittingLicenseApplication(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Citizen Portal | BOCRA</title>
      </Helmet>
      <div className="container py-12 md:py-20">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-bocra-text-secondary transition-colors hover:text-bocra-teal"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to website
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-2 text-bocra-text-secondary transition-colors hover:text-bocra-teal"
          >
            <Home className="h-4 w-4" />
            Homepage
          </a>
        </div>

        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">Citizen Portal</h1>
            <p className="mt-2 text-bocra-text-secondary">
              Verify published licence holders, submit a complaint, and manage
              licence applications from one signed-in workspace.
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            Sign out
          </Button>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Card id="licence-verification">
            <CardHeader>
              <CardTitle>Licence Verification</CardTitle>
              <CardDescription>
                Search the mirrored BOCRA register by operator name, licence
                number, or service lane without downloading the source workbook
                first.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {LICENCE_VERIFICATION_TABS.map((tab) => (
                  <Button
                    key={tab.id}
                    type="button"
                    variant={verificationTabId === tab.id ? 'default' : 'outline'}
                    className={
                      verificationTabId === tab.id
                        ? 'bg-bocra-forest-green text-white hover:bg-bocra-forest-green/90'
                        : ''
                    }
                    onClick={() => setVerificationTabId(tab.id)}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-bocra-text-primary">
                    {verificationResults.length} matching record
                    {verificationResults.length === 1 ? '' : 's'}
                  </p>
                  <p className="mt-1 text-sm text-bocra-text-secondary">
                    Search by operator, company name, section, or licence number.
                  </p>
                </div>

                <div className="relative w-full md:max-w-md">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bocra-text-muted" />
                  <Input
                    type="search"
                    value={verificationQuery}
                    onChange={(event) => setVerificationQuery(event.target.value)}
                    placeholder="Search the licence register"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {visibleVerificationResults.length ? (
                  visibleVerificationResults.map((record) => (
                    <div
                      key={record.id}
                      className="rounded-2xl border border-bocra-border p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-lg font-semibold text-bocra-text-primary">
                            {record.entityName}
                          </p>
                          <p className="mt-1 text-sm text-bocra-text-secondary">
                            {record.sheetLabel} / {record.sectionLabel}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={verificationBadgeClass[record.status]}>
                            {record.statusLabel}
                          </Badge>
                          <Badge variant="outline">{record.sheetLabel}</Badge>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 text-sm text-bocra-text-secondary md:grid-cols-3">
                        <div className="rounded-xl bg-bocra-light-grey px-3 py-2">
                          <span className="font-semibold text-bocra-text-primary">
                            Licence No:
                          </span>{' '}
                          {record.licenceNumber ?? 'Not listed'}
                        </div>
                        <div className="rounded-xl bg-bocra-light-grey px-3 py-2">
                          <span className="font-semibold text-bocra-text-primary">
                            Issued:
                          </span>{' '}
                          {formatRegisterDate(record.issuedDate)}
                        </div>
                        <div className="rounded-xl bg-bocra-light-grey px-3 py-2">
                          <span className="font-semibold text-bocra-text-primary">
                            Expiry:
                          </span>{' '}
                          {formatRegisterDate(record.expiryDate)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl border border-dashed border-bocra-border px-4 py-6 text-sm text-bocra-text-secondary">
                    No licence records match this search yet. Try a company
                    name, a licence number, or switch to another tab.
                  </p>
                )}
              </div>

              {verificationResults.length > visibleVerificationResults.length && (
                <p className="mt-4 text-sm text-bocra-text-secondary">
                  Showing the first {visibleVerificationResults.length} matches.
                  Narrow the search for a specific operator or open the full
                  register for deeper browsing.
                </p>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Register Snapshot</CardTitle>
                <CardDescription>
                  Published BOCRA register counts mirrored into this portal.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Total', LICENCE_VERIFICATION_COUNTS.total],
                    ['Active', LICENCE_VERIFICATION_COUNTS.active],
                    ['Revoked', LICENCE_VERIFICATION_COUNTS.revoked],
                    [
                      'Surrendered',
                      LICENCE_VERIFICATION_COUNTS.surrenderedCancelled,
                    ],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl bg-bocra-light-grey p-4"
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-bocra-text-muted">
                        {label}
                      </p>
                      <p className="mt-3 text-2xl font-semibold text-bocra-text-primary">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Verification Actions</CardTitle>
                <CardDescription>
                  Open the full register view or the original BOCRA workbook
                  when you need more context.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-bocra-text-secondary">
                <div className="rounded-2xl bg-bocra-light-grey p-4">
                  This portal mirrors the published licence workbook for quick
                  public verification. Formal licensing applications can be
                  submitted in the workflow tabs below.
                </div>
                <a
                  href="/licensing/register"
                  className="flex items-center justify-between rounded-xl border border-bocra-border px-4 py-3 transition-colors hover:bg-bocra-light-grey"
                >
                  <span>Open full licence register</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href={LICENCE_REGISTER_SOURCE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-bocra-border px-4 py-3 transition-colors hover:bg-bocra-light-grey"
                >
                  <span>Download source workbook</span>
                  <Download className="h-4 w-4" />
                </a>
                <div className="inline-flex items-center gap-2 rounded-xl bg-bocra-teal/10 px-4 py-3 text-bocra-teal">
                  <ShieldCheck className="h-4 w-4" />
                  Use complaints when a verified operator still needs regulatory
                  follow-up.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <Tabs
              value={workflowTab}
              onValueChange={(value) =>
                setWorkflowTab(value as 'complaints' | 'license-applications')
              }
            >
              <TabsList className="h-auto w-full flex-wrap rounded-2xl bg-bocra-light-grey p-1">
                <TabsTrigger
                  value="complaints"
                  className="flex-1 data-[state=active]:bg-white data-[state=active]:text-bocra-dark-maroon"
                >
                  Complaints
                </TabsTrigger>
                <TabsTrigger
                  value="license-applications"
                  className="flex-1 data-[state=active]:bg-white data-[state=active]:text-bocra-forest-green"
                >
                  Licence Applications
                </TabsTrigger>
              </TabsList>

              <TabsContent value="complaints" className="space-y-6">
                <Card id="file-complaint">
                  <CardHeader>
                    <CardTitle>File a Complaint</CardTitle>
                    <CardDescription>
                      Logged-in users can submit a complaint here and track it in
                      this portal as the status changes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-5" onSubmit={handleComplaintSubmit}>
                      <div className="space-y-2">
                        <Label htmlFor="complaint-title">Complaint title</Label>
                        <Input
                          id="complaint-title"
                          placeholder="Short summary of the issue"
                          value={complaintForm.title}
                          onChange={(event) =>
                            handleComplaintField('title', event.target.value)
                          }
                          required
                        />
                      </div>

                      <div className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="complaint-category">Category</Label>
                          <select
                            id="complaint-category"
                            value={complaintForm.category}
                            onChange={(event) =>
                              handleComplaintField('category', event.target.value)
                            }
                            className="flex h-10 w-full rounded-md border border-bocra-border bg-white px-3 py-2 text-sm text-bocra-text-primary"
                          >
                            {complaintCategories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="complaint-priority">Priority</Label>
                          <select
                            id="complaint-priority"
                            value={complaintForm.priority}
                            onChange={(event) =>
                              handleComplaintField(
                                'priority',
                                event.target.value as ComplaintFormState['priority']
                              )
                            }
                            className="flex h-10 w-full rounded-md border border-bocra-border bg-white px-3 py-2 text-sm text-bocra-text-primary"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="complaint-description">What happened?</Label>
                        <Textarea
                          id="complaint-description"
                          placeholder="Describe the provider, dates, reference numbers, and the issue you need BOCRA to review."
                          value={complaintForm.description}
                          onChange={(event) =>
                            handleComplaintField('description', event.target.value)
                          }
                          className="min-h-36"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="bg-bocra-dark-maroon text-white hover:bg-bocra-dark-maroon/90"
                        disabled={isSubmittingComplaint}
                      >
                        {isSubmittingComplaint
                          ? 'Submitting...'
                          : 'Submit complaint'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card id="complaint-history">
                  <CardHeader>
                    <CardTitle>Complaint Progress</CardTitle>
                    <CardDescription>
                      Track the status of every complaint submitted through this
                      portal.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {overviewLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((item) => (
                          <Skeleton key={item} className="h-40 w-full" />
                        ))}
                      </div>
                    ) : overviewError ? (
                      <p className="text-sm text-bocra-dark-maroon">
                        {overviewError}
                      </p>
                    ) : overview?.complaints.length ? (
                      <div className="space-y-4">
                        {overview.complaints.map((complaint) => (
                          <div
                            key={complaint.id}
                            className="rounded-2xl border border-bocra-border p-4"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <p className="text-lg font-semibold text-bocra-text-primary">
                                  {complaint.title}
                                </p>
                                <p className="mt-1 text-sm text-bocra-text-secondary">
                                  {complaint.category}
                                </p>
                              </div>
                              <Badge className={complaintBadgeClass[complaint.status]}>
                                {complaint.status.replace('_', ' ')}
                              </Badge>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-4 text-sm text-bocra-text-muted">
                              <span className="inline-flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-bocra-teal" />
                                Priority {complaint.priority}
                              </span>
                              <span className="inline-flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-bocra-teal" />
                                Submitted{' '}
                                {format(
                                  new Date(complaint.submitted_date),
                                  'dd MMM yyyy'
                                )}
                              </span>
                            </div>

                            <p className="mt-4 text-sm text-bocra-text-secondary">
                              {complaint.description}
                            </p>

                            <ComplaintProgress status={complaint.status} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-bocra-text-secondary">
                        No complaint records are linked to this account yet. Use
                        the form above to submit your first complaint.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="license-applications" className="space-y-6">
                <Card id="license-applications">
                  <CardHeader>
                    <CardTitle>Start a Licence Application</CardTitle>
                    <CardDescription>
                      Submit a licensing request with supporting files and track
                      its progress from the same portal.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      className="space-y-5"
                      onSubmit={(event) => {
                        void handleLicenseApplicationSubmit(event);
                      }}
                    >
                      <div className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="application-type">Application type</Label>
                          <select
                            id="application-type"
                            value={licenseApplicationForm.applicationType}
                            onChange={(event) =>
                              handleLicenseApplicationField(
                                'applicationType',
                                event.target.value
                              )
                            }
                            className="flex h-10 w-full rounded-md border border-bocra-border bg-white px-3 py-2 text-sm text-bocra-text-primary"
                          >
                            {licenseApplicationTypes.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="service-area">Service area</Label>
                          <select
                            id="service-area"
                            value={licenseApplicationForm.serviceArea}
                            onChange={(event) =>
                              handleLicenseApplicationField(
                                'serviceArea',
                                event.target.value
                              )
                            }
                            className="flex h-10 w-full rounded-md border border-bocra-border bg-white px-3 py-2 text-sm text-bocra-text-primary"
                          >
                            {licenseServiceAreas.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="organization-name">
                          Organisation or applicant name
                        </Label>
                        <Input
                          id="organization-name"
                          placeholder="Registered organisation or applicant name"
                          value={licenseApplicationForm.organizationName}
                          onChange={(event) =>
                            handleLicenseApplicationField(
                              'organizationName',
                              event.target.value
                            )
                          }
                          required
                        />
                      </div>

                      <div className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="contact-name">Contact name</Label>
                          <Input
                            id="contact-name"
                            value={licenseApplicationForm.contactName}
                            onChange={(event) =>
                              handleLicenseApplicationField(
                                'contactName',
                                event.target.value
                              )
                            }
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="contact-email">Contact email</Label>
                          <Input
                            id="contact-email"
                            type="email"
                            value={licenseApplicationForm.contactEmail}
                            onChange={(event) =>
                              handleLicenseApplicationField(
                                'contactEmail',
                                event.target.value
                              )
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contact-phone">Contact phone</Label>
                        <Input
                          id="contact-phone"
                          placeholder="+267 ..."
                          value={licenseApplicationForm.contactPhone}
                          onChange={(event) =>
                            handleLicenseApplicationField(
                              'contactPhone',
                              event.target.value
                            )
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="application-summary">
                          Application summary
                        </Label>
                        <Textarea
                          id="application-summary"
                          placeholder="Describe the requested licence or authorisation, the service scope, and any supporting background BOCRA should review."
                          value={licenseApplicationForm.summary}
                          onChange={(event) =>
                            handleLicenseApplicationField(
                              'summary',
                              event.target.value
                            )
                          }
                          className="min-h-36"
                          required
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="application-files">
                          Supporting files
                        </Label>
                        <div className="rounded-2xl border border-dashed border-bocra-border p-4">
                          <div className="flex items-center gap-3 text-sm text-bocra-text-secondary">
                            <Upload className="h-4 w-4 text-bocra-forest-green" />
                            Upload up to 4 files. PDF, Word, Excel, PNG, JPG, and
                            WebP are accepted.
                          </div>
                          <Input
                            key={fileInputKey}
                            id="application-files"
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.webp"
                            className="mt-4"
                            onChange={(event) =>
                              setLicenseApplicationFiles(
                                Array.from(event.target.files ?? []).slice(0, 4)
                              )
                            }
                          />
                          {licenseApplicationFiles.length > 0 && (
                            <div className="mt-4 space-y-2">
                              {licenseApplicationFiles.map((file) => (
                                <div
                                  key={`${file.name}-${file.size}`}
                                  className="rounded-xl bg-bocra-light-grey px-3 py-2 text-sm text-bocra-text-secondary"
                                >
                                  {file.name} ({Math.ceil(file.size / 1024)} KB)
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="bg-bocra-forest-green text-white hover:bg-bocra-forest-green/90"
                        disabled={isSubmittingLicenseApplication}
                      >
                        {isSubmittingLicenseApplication
                          ? 'Submitting...'
                          : 'Submit licence application'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card id="application-history">
                  <CardHeader>
                    <CardTitle>Licence Application Progress</CardTitle>
                    <CardDescription>
                      Track every application submitted through this portal,
                      including supporting files and BOCRA review status.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {overviewLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((item) => (
                          <Skeleton key={item} className="h-48 w-full" />
                        ))}
                      </div>
                    ) : overviewError ? (
                      <p className="text-sm text-bocra-dark-maroon">
                        {overviewError}
                      </p>
                    ) : overview?.licenseApplications.length ? (
                      <div className="space-y-4">
                        {overview.licenseApplications.map((application) => (
                          <div
                            key={application.id}
                            className="rounded-2xl border border-bocra-border p-4"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <p className="text-lg font-semibold text-bocra-text-primary">
                                  {application.application_type}
                                </p>
                                <p className="mt-1 text-sm text-bocra-text-secondary">
                                  {application.organization_name}
                                </p>
                              </div>
                              <Badge
                                className={
                                  licenseApplicationBadgeClass[application.status]
                                }
                              >
                                {application.status.replaceAll('_', ' ')}
                              </Badge>
                            </div>

                            <div className="mt-4 grid gap-3 text-sm text-bocra-text-secondary md:grid-cols-3">
                              <div className="rounded-xl bg-bocra-light-grey px-3 py-2">
                                <span className="font-semibold text-bocra-text-primary">
                                  Service area:
                                </span>{' '}
                                {application.service_area}
                              </div>
                              <div className="rounded-xl bg-bocra-light-grey px-3 py-2">
                                <span className="font-semibold text-bocra-text-primary">
                                  Submitted:
                                </span>{' '}
                                {format(
                                  new Date(application.submitted_at),
                                  'dd MMM yyyy'
                                )}
                              </div>
                              <div className="rounded-xl bg-bocra-light-grey px-3 py-2">
                                <span className="font-semibold text-bocra-text-primary">
                                  Contact:
                                </span>{' '}
                                {application.contact_email}
                              </div>
                            </div>

                            <p className="mt-4 text-sm text-bocra-text-secondary">
                              {application.summary}
                            </p>

                            {application.review_notes && (
                              <div className="mt-4 rounded-2xl bg-bocra-golden-yellow/15 p-4 text-sm text-bocra-text-primary">
                                <span className="font-semibold">BOCRA note:</span>{' '}
                                {application.review_notes}
                              </div>
                            )}

                            {application.attachments.length > 0 && (
                              <div className="mt-4 flex flex-wrap gap-3">
                                {application.attachments.map((attachment) =>
                                  attachment.signed_url ? (
                                    <a
                                      key={attachment.storage_path}
                                      href={attachment.signed_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 rounded-xl border border-bocra-border px-3 py-2 text-sm text-bocra-text-secondary transition-colors hover:bg-bocra-light-grey hover:text-bocra-teal"
                                    >
                                      <FileText className="h-4 w-4" />
                                      {attachment.name}
                                    </a>
                                  ) : null
                                )}
                              </div>
                            )}

                            <LicenseApplicationProgress status={application.status} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-bocra-text-secondary">
                        No licence applications are linked to this account yet.
                        Use the form above to submit your first request.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Your current authenticated session.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <strong>Name:</strong> {loading ? 'Loading...' : user?.name ?? '-'}
                </p>
                <p>
                  <strong>Email:</strong>{' '}
                  {loading ? 'Loading...' : user?.email ?? '-'}
                </p>
                <p>
                  <strong>Role:</strong> {loading ? 'Loading...' : user?.role ?? '-'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Portal Snapshot</CardTitle>
                <CardDescription>
                  A quick view of the records currently linked to your account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {overviewLoading ? (
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((item) => (
                      <Skeleton key={item} className="h-20 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ['Complaints', overview?.complaintSummary.total ?? 0],
                      ['Open', overview?.complaintSummary.open ?? 0],
                      [
                        'Applications',
                        overview?.licenseApplicationSummary.total ?? 0,
                      ],
                      [
                        'Under Review',
                        overview?.licenseApplicationSummary.under_review ?? 0,
                      ],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-2xl bg-bocra-light-grey p-4"
                      >
                        <p className="text-xs uppercase tracking-[0.2em] text-bocra-text-muted">
                          {label}
                        </p>
                        <p className="mt-3 text-2xl font-semibold text-bocra-text-primary">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Useful Routes</CardTitle>
                <CardDescription>
                  Reference pages that support verification, complaints, and
                  licensing follow-up.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <a
                  href="/services/licensing"
                  className="flex items-center justify-between rounded-xl border border-bocra-border px-4 py-3 transition-colors hover:bg-bocra-light-grey"
                >
                  <span>Licensing guidance</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="/licensing/register"
                  className="flex items-center justify-between rounded-xl border border-bocra-border px-4 py-3 transition-colors hover:bg-bocra-light-grey"
                >
                  <span>Full licence register</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="/consultations"
                  className="flex items-center justify-between rounded-xl border border-bocra-border px-4 py-3 transition-colors hover:bg-bocra-light-grey"
                >
                  <span>Open consultations</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="/contact"
                  className="flex items-center justify-between rounded-xl border border-bocra-border px-4 py-3 transition-colors hover:bg-bocra-light-grey"
                >
                  <span>General enquiries</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Open Consultations</CardTitle>
                <CardDescription>
                  Current regulatory engagement windows from the BOCRA public
                  site.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {overviewLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((item) => (
                      <Skeleton key={item} className="h-20 w-full" />
                    ))}
                  </div>
                ) : overview?.consultations.length ? (
                  <div className="space-y-4">
                    {overview.consultations.map((consultation) => (
                      <a
                        key={consultation.id}
                        href={`/consultations/${consultation.id}`}
                        className="block rounded-2xl border border-bocra-border p-4 transition-colors hover:bg-bocra-light-grey"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-bocra-text-primary">
                              {consultation.title}
                            </p>
                            <p className="mt-2 text-sm text-bocra-text-secondary">
                              Closes{' '}
                              {format(
                                new Date(consultation.end_date),
                                'dd MMM yyyy'
                              )}
                            </p>
                          </div>
                          <FileText className="h-5 w-5 text-bocra-forest-green" />
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-bocra-text-secondary">
                    There are no open consultations at the moment.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {overviewError && (
          <p className="mt-6 text-sm text-bocra-dark-maroon">{overviewError}</p>
        )}
      </div>
    </>
  );
}
