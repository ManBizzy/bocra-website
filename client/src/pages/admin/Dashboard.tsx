import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/_core/hooks/useAuth';
import { ADMIN_LOGIN_URL } from '@/const';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth({
    redirectOnUnauthenticated: true,
    redirectPath: ADMIN_LOGIN_URL,
  });

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
            href={ADMIN_LOGIN_URL}
            className="mt-6 inline-block text-bocra-teal hover:underline"
          >
            Return to admin sign in
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
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="mt-2 text-bocra-text-secondary">
              Minimal admin gate is active. Extend this page with CRUD tools
              next.
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            Sign out
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin Session</CardTitle>
            <CardDescription>
              This page is restricted to users with the <code>admin</code> role.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Name:</strong> {loading ? 'Loading...' : user?.name ?? '-'}</p>
            <p><strong>Email:</strong> {loading ? 'Loading...' : user?.email ?? '-'}</p>
            <p><strong>Role:</strong> {loading ? 'Loading...' : user?.role ?? '-'}</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
