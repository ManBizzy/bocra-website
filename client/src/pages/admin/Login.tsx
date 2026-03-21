import { type FormEvent, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ADMIN_DASHBOARD_URL, PORTAL_LOGIN_URL } from '@/const';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function AdminLogin() {
  const { user, loading, refresh, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user?.role === 'admin') {
      window.location.href = ADMIN_DASHBOARD_URL;
    }
  }, [loading, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error ?? 'Sign in failed');
      }

      const currentUser = await refresh();

      if (!currentUser || currentUser.role !== 'admin') {
        await logout();
        throw new Error('This account does not have admin access.');
      }

      toast.success('Signed in as admin.');
      window.location.href = ADMIN_DASHBOARD_URL;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Sign in failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin | BOCRA</title>
      </Helmet>
      <div className="container py-12 md:py-20">
        <div className="mx-auto max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Admin Sign In</CardTitle>
              <CardDescription>
                Only accounts with the <code>admin</code> role in the Supabase
                <code> profiles</code> table can access the admin area.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <Input
                  type="email"
                  placeholder="Admin email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <Button
                  type="submit"
                  className="w-full bg-bocra-dark-maroon hover:bg-bocra-dark-maroon/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Checking access...' : 'Sign in'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="border-t">
              <a
                href={PORTAL_LOGIN_URL}
                className="text-sm text-bocra-teal hover:underline"
              >
                Back to citizen portal
              </a>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
