import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function PortalDashboard() {
  const { user, loading, logout } = useAuth({
    redirectOnUnauthenticated: true,
  });

  return (
    <>
      <Helmet>
        <title>Dashboard | BOCRA</title>
      </Helmet>
      <div className="container py-12 md:py-20">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="mt-2 text-bocra-text-secondary">
              Basic portal session is now wired through Supabase.
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            Sign out
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
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
              <CardTitle>Next Build Steps</CardTitle>
              <CardDescription>
                These are the next BOCRA portal features to connect to Supabase.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-bocra-text-secondary">
              <p>Wire complaint submission to the <code>complaints</code> table.</p>
              <p>Load user profile details from the <code>profiles</code> table.</p>
              <p>Show publications, consultations, and application history.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
