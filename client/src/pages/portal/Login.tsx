import { type FormEvent, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ADMIN_LOGIN_URL, CITIZEN_PORTAL_URL } from '@/const';
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
    if (!loading && user) {
      window.location.href = CITIZEN_PORTAL_URL;
    }
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

      await refresh();
      toast.success(mode === 'signup' ? 'Account created.' : 'Signed in.');
      window.location.href = CITIZEN_PORTAL_URL;
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
        <title>Citizen Portal | BOCRA</title>
      </Helmet>
      <div className="container py-12 md:py-20">
        <div className="mx-auto flex max-w-md flex-col gap-6">
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold">Citizen Portal</h1>
            <p className="text-bocra-text-secondary">
              Sign in to review BOCRA portal activity, or create a starter
              account for the demo environment.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {mode === 'login' ? 'Sign in' : 'Create an account'}
              </CardTitle>
              <CardDescription>
                This uses the Supabase-backed demo auth flow configured for the
                project.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                {mode === 'signup' && (
                  <Input
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
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
                  className="w-full bg-bocra-teal hover:bg-bocra-teal/90 text-white"
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
            <CardFooter className="flex items-center justify-between gap-3 border-t">
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  setMode((currentMode) =>
                    currentMode === 'login' ? 'signup' : 'login'
                  )
                }
              >
                {mode === 'login'
                  ? 'Need an account?'
                  : 'Already have an account?'}
              </Button>
              <a
                href={ADMIN_LOGIN_URL}
                className="text-sm text-bocra-teal hover:underline"
              >
                Admin sign in
              </a>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
