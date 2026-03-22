import { type FormEvent, useEffect, useState } from 'react';
import { ArrowLeft, Home, ShieldCheck } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import {
  ADMIN_DASHBOARD_URL,
  CITIZEN_PORTAL_URL,
  SITE_FULL_NAME,
} from '@/const';
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

export default function PortalLogin() {
  const { user, loading, refresh } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (loading || !user) {
      return;
    }

    window.location.href =
      user.role === 'admin' ? ADMIN_DASHBOARD_URL : CITIZEN_PORTAL_URL;
  }, [loading, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        mode === 'signup' ? '/api/auth/signup' : '/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            name: name.trim() || undefined,
            email: email.trim(),
            password,
          }),
        }
      );

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error ?? 'Authentication failed');
      }

      const currentUser = await refresh();
      const nextUrl =
        currentUser?.role === 'admin' ? ADMIN_DASHBOARD_URL : CITIZEN_PORTAL_URL;

      toast.success(mode === 'signup' ? 'Account created.' : 'Signed in.');
      window.location.href = nextUrl;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Authentication failed'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Portal Sign In | BOCRA</title>
      </Helmet>
      <div className="container py-12 md:py-20">
        <div className="mx-auto flex max-w-xl flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
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

          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold">BOCRA Portal</h1>
            <p className="text-bocra-text-secondary">
              Use one sign-in form for both citizen and admin access. Your role
              is detected automatically after authentication.
            </p>
          </div>

          <Card>
            <CardHeader>
              <div className="inline-flex items-center gap-2 rounded-full bg-bocra-light-grey px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-bocra-teal">
                <ShieldCheck className="h-3.5 w-3.5" />
                {SITE_FULL_NAME}
              </div>
              <CardTitle className="pt-4">
                {mode === 'login' ? 'Sign in' : 'Create an account'}
              </CardTitle>
              <CardDescription>
                Citizens can create an account here. Admin users also sign in
                here and will be routed to the admin dashboard automatically.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-bocra-light-grey p-1">
                <Button
                  type="button"
                  variant={mode === 'login' ? 'default' : 'ghost'}
                  className={
                    mode === 'login'
                      ? 'bg-bocra-teal text-white hover:bg-bocra-teal/90'
                      : 'text-bocra-text-secondary'
                  }
                  onClick={() => setMode('login')}
                >
                  Sign in
                </Button>
                <Button
                  type="button"
                  variant={mode === 'signup' ? 'default' : 'ghost'}
                  className={
                    mode === 'signup'
                      ? 'bg-bocra-teal text-white hover:bg-bocra-teal/90'
                      : 'text-bocra-text-secondary'
                  }
                  onClick={() => setMode('signup')}
                >
                  Create account
                </Button>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {mode === 'signup' && (
                  <Input
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                )}
                <Input
                  type="email"
                  placeholder="Email address"
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
                  className="w-full bg-bocra-teal text-white hover:bg-bocra-teal/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? 'Please wait...'
                    : mode === 'login'
                      ? 'Sign in'
                      : 'Create account'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="border-t text-sm text-bocra-text-secondary">
              {mode === 'login'
                ? 'Use your email and password to enter the citizen or admin dashboard.'
                : 'New accounts are created as citizen accounts by default.'}
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
