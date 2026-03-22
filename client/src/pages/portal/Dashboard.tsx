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
import { Skeleton } from '@/components/ui/skeleton';

type ComplaintStatus = 'open' | 'in_review' | 'resolved' | 'closed';

type PortalComplaint = {
  id: string;
  title: string;
  category: string;
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

const complaintBadgeClass: Record<ComplaintStatus, string> = {
  open: 'bg-bocra-dark-maroon text-white',
  in_review: 'bg-bocra-golden-yellow text-bocra-text-primary',
  resolved: 'bg-bocra-forest-green text-white',
  closed: 'bg-bocra-text-muted text-white',
};

export default function PortalDashboard() {
  const { user, loading, logout } = useAuth({
    redirectOnUnauthenticated: true,
  });
  const [overview, setOverview] = useState<PortalOverview | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState<string | null>(null);

  useEffect(() => {
    if (loading || !user) {
      return;
    }

    let ignore = false;

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

        if (!ignore) {
          setOverview(payload);
          setOverviewError(null);
        }
      } catch (error) {
        if (!ignore) {
          setOverviewError(
            error instanceof Error
              ? error.message
              : 'Could not load portal activity.'
          );
        }
      } finally {
        if (!ignore) {
          setOverviewLoading(false);
        }
      }
    };

    void loadOverview();

    return () => {
      ignore = true;
    };
  }, [loading, user]);

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
              Review your profile, complaint activity, and current BOCRA
              consultation deadlines.
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            Sign out
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
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
                Public BOCRA sections that are fully working in this demo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <a
                href="/consultations"
                className="flex items-center justify-between rounded-xl border border-bocra-border px-4 py-3 transition-colors hover:bg-bocra-light-grey"
              >
                <span>Open consultations</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="/publications"
                className="flex items-center justify-between rounded-xl border border-bocra-border px-4 py-3 transition-colors hover:bg-bocra-light-grey"
              >
                <span>Publications archive</span>
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

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle>Recent Complaint Activity</CardTitle>
              <CardDescription>
                Recent complaint records attached to your BOCRA portal account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {overviewLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <Skeleton key={item} className="h-24 w-full" />
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
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-bocra-text-secondary">
                  No complaint records are linked to this account yet.
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
