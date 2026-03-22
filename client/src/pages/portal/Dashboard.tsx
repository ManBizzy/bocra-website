import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  FileText,
  Home,
  MessageSquare,
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { useAuth } from '@/_core/hooks/useAuth';
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
import { Textarea } from '@/components/ui/textarea';

type ComplaintStatus = 'open' | 'in_review' | 'resolved' | 'closed';

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
};

type ComplaintFormState = {
  title: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
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

const initialComplaintForm: ComplaintFormState = {
  title: '',
  category: complaintCategories[0],
  priority: 'medium',
  description: '',
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

  const handleComplaintSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
              Submit a complaint, then track its progress as BOCRA reviews and
              resolves it.
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            Sign out
          </Button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card id="file-complaint">
            <CardHeader>
              <CardTitle>File a Complaint</CardTitle>
              <CardDescription>
                Logged-in users can submit a complaint here and track it in this
                portal as the status changes.
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
                  {isSubmittingComplaint ? 'Submitting...' : 'Submit complaint'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>Your current authenticated session.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><strong>Name:</strong> {loading ? 'Loading...' : user?.name ?? '-'}</p>
                <p><strong>Email:</strong> {loading ? 'Loading...' : user?.email ?? '-'}</p>
                <p><strong>Role:</strong> {loading ? 'Loading...' : user?.role ?? '-'}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Complaint Snapshot</CardTitle>
                <CardDescription>
                  A quick view of the complaint records linked to your account.
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
                      ['Total', overview?.complaintSummary.total ?? 0],
                      ['Open', overview?.complaintSummary.open ?? 0],
                      ['In Review', overview?.complaintSummary.in_review ?? 0],
                      ['Resolved', overview?.complaintSummary.resolved ?? 0],
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
                  Reference pages that support complaint follow-up and public guidance.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <a
                  href="/services/complaints"
                  className="flex items-center justify-between rounded-xl border border-bocra-border px-4 py-3 transition-colors hover:bg-bocra-light-grey"
                >
                  <span>Complaints guidance</span>
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
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card id="complaint-history">
            <CardHeader>
              <CardTitle>Complaint Progress</CardTitle>
              <CardDescription>
                Track the status of every complaint submitted through this portal.
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
                <p className="text-sm text-bocra-dark-maroon">{overviewError}</p>
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
                          {format(new Date(complaint.submitted_date), 'dd MMM yyyy')}
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
                  No complaint records are linked to this account yet. Use the
                  form above to submit your first complaint.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Open Consultations</CardTitle>
              <CardDescription>
                Current regulatory engagement windows from the BOCRA public site.
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
                            Closes {format(new Date(consultation.end_date), 'dd MMM yyyy')}
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
    </>
  );
}
