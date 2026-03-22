import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ArrowLeft, Home, Inbox, Mail, MessageSquare } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { useAuth } from '@/_core/hooks/useAuth';
import { PORTAL_LOGIN_URL } from '@/const';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type ComplaintStatus = 'open' | 'in_review' | 'resolved' | 'closed';
type ComplaintPriority = 'low' | 'medium' | 'high';
type ContactStatus = 'new' | 'read' | 'responded';

type AdminComplaint = {
  id: string;
  title: string;
  category: string;
  description: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  submitted_date: string;
  reporter_name: string;
  reporter_email: string;
};

type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  status: ContactStatus;
  created_at: string;
};

type AdminOverview = {
  complaintSummary: Record<ComplaintStatus | 'total', number>;
  contactSummary: Record<ContactStatus | 'total', number>;
  complaints: AdminComplaint[];
  contactSubmissions: ContactSubmission[];
};

const complaintBadgeClass: Record<ComplaintStatus, string> = {
  open: 'bg-bocra-dark-maroon text-white',
  in_review: 'bg-bocra-golden-yellow text-bocra-text-primary',
  resolved: 'bg-bocra-forest-green text-white',
  closed: 'bg-bocra-text-muted text-white',
};

const contactBadgeClass: Record<ContactStatus, string> = {
  new: 'bg-bocra-dark-maroon text-white',
  read: 'bg-bocra-golden-yellow text-bocra-text-primary',
  responded: 'bg-bocra-forest-green text-white',
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

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth({
    redirectOnUnauthenticated: true,
    redirectPath: PORTAL_LOGIN_URL,
  });
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState<string | null>(null);
  const [updatingComplaintId, setUpdatingComplaintId] = useState<string | null>(
    null
  );

  const loadOverview = async () => {
    setOverviewLoading(true);

    try {
      const response = await fetch('/api/admin/overview', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Could not load admin queues.');
      }

      const payload = (await response.json()) as AdminOverview;
      setOverview(payload);
      setOverviewError(null);
    } catch (error) {
      setOverviewError(
        error instanceof Error ? error.message : 'Could not load admin queues.'
      );
    } finally {
      setOverviewLoading(false);
    }
  };

  useEffect(() => {
    if (loading || !user || user.role !== 'admin') {
      return;
    }

    void loadOverview();
  }, [loading, user]);

  const handleStatusUpdate = async (
    complaintId: string,
    nextStatus: ComplaintStatus
  ) => {
    setUpdatingComplaintId(complaintId);

    try {
      const response = await fetch(`/api/admin/complaints/${complaintId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          status: nextStatus,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error ?? 'Could not update complaint status.');
      }

      toast.success(`Complaint moved to ${nextStatus.replace('_', ' ')}.`);
      await loadOverview();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Could not update complaint status.'
      );
    } finally {
      setUpdatingComplaintId(null);
    }
  };

  if (!loading && user && user.role !== 'admin') {
    return (
      <>
        <Helmet>
          <title>Admin Dashboard | BOCRA</title>
        </Helmet>
        <div className="container py-12">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="mt-4 text-lg text-bocra-text-secondary">
            This account does not have admin access.
          </p>
          <a
            href={PORTAL_LOGIN_URL}
            className="mt-6 inline-block text-bocra-teal hover:underline"
          >
            Return to portal sign in
          </a>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | BOCRA</title>
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
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="mt-2 text-bocra-text-secondary">
              Review new complaints, update progress, and keep the citizen view
              in sync.
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            Sign out
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Admin Session</CardTitle>
              <CardDescription>
                This view is restricted to accounts with the admin role.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>Name:</strong> {loading ? 'Loading...' : user?.name ?? '-'}</p>
              <p><strong>Email:</strong> {loading ? 'Loading...' : user?.email ?? '-'}</p>
              <p><strong>Role:</strong> {loading ? 'Loading...' : user?.role ?? '-'}</p>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Queue Snapshot</CardTitle>
              <CardDescription>
                Current complaint and contact workload in the Supabase demo project.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {overviewLoading ? (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <Skeleton key={item} className="h-24 w-full" />
                  ))}
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                  {[
                    ['Complaints', overview?.complaintSummary.total ?? 0],
                    ['Open', overview?.complaintSummary.open ?? 0],
                    ['In Review', overview?.complaintSummary.in_review ?? 0],
                    ['Resolved', overview?.complaintSummary.resolved ?? 0],
                    ['Contact', overview?.contactSummary.total ?? 0],
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
        </div>

        {overviewError && (
          <p className="mt-6 text-sm text-bocra-dark-maroon">{overviewError}</p>
        )}

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Card>
            <CardHeader>
              <CardTitle>Complaint Queue</CardTitle>
              <CardDescription>
                Review incoming complaints and move each one through the workflow.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {overviewLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((item) => (
                    <Skeleton key={item} className="h-56 w-full" />
                  ))}
                </div>
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
                            {complaint.reporter_name}
                            {complaint.reporter_email
                              ? ` - ${complaint.reporter_email}`
                              : ''}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={complaintBadgeClass[complaint.status]}>
                            {complaint.status.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline">
                            {complaint.priority} priority
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-bocra-text-muted">
                        <span className="inline-flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-bocra-teal" />
                          {complaint.category}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <Inbox className="h-4 w-4 text-bocra-teal" />
                          {format(new Date(complaint.submitted_date), 'dd MMM yyyy')}
                        </span>
                      </div>

                      <p className="mt-4 text-sm text-bocra-text-secondary">
                        {complaint.description}
                      </p>

                      <ComplaintProgress status={complaint.status} />

                      <div className="mt-5 flex flex-wrap gap-2">
                        {complaintStageOrder.map((status) => (
                          <Button
                            key={status}
                            type="button"
                            size="sm"
                            variant={
                              complaint.status === status ? 'default' : 'outline'
                            }
                            className={
                              complaint.status === status
                                ? 'bg-bocra-teal text-white hover:bg-bocra-teal/90'
                                : ''
                            }
                            disabled={
                              updatingComplaintId === complaint.id ||
                              complaint.status === status
                            }
                            onClick={() =>
                              void handleStatusUpdate(complaint.id, status)
                            }
                          >
                            {complaintStageLabel[status]}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-bocra-text-secondary">
                  There are no complaint records in the queue.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Queue</CardTitle>
              <CardDescription>
                Recent general enquiries submitted from the public contact page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {overviewLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <Skeleton key={item} className="h-24 w-full" />
                  ))}
                </div>
              ) : overview?.contactSubmissions.length ? (
                <div className="space-y-4">
                  {overview.contactSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="rounded-2xl border border-bocra-border p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-bocra-text-primary">
                            {submission.subject}
                          </p>
                          <p className="mt-1 text-sm text-bocra-text-secondary">
                            {submission.name} - {submission.email}
                          </p>
                        </div>
                        <Badge className={contactBadgeClass[submission.status]}>
                          {submission.status}
                        </Badge>
                      </div>

                      <p className="mt-4 inline-flex items-center gap-2 text-sm text-bocra-text-muted">
                        <Mail className="h-4 w-4 text-bocra-teal" />
                        {format(new Date(submission.created_at), 'dd MMM yyyy')}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-bocra-text-secondary">
                  There are no contact submissions in the queue.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
