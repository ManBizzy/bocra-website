import { useEffect } from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { PORTAL_LOGIN_URL } from '@/const';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AdminLogin() {
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      window.location.replace(PORTAL_LOGIN_URL);
    }, 1200);

    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <>
      <Helmet>
        <title>Admin Sign In | BOCRA</title>
      </Helmet>
      <div className="container py-12 md:py-20">
        <div className="mx-auto max-w-md">
          <Card>
            <CardHeader>
              <div className="inline-flex items-center gap-2 rounded-full bg-bocra-light-grey px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-bocra-dark-maroon">
                <ShieldCheck className="h-3.5 w-3.5" />
                Admin access
              </div>
              <CardTitle className="pt-4">Use the main portal sign in</CardTitle>
              <CardDescription>
                Admin accounts now use the same email and password form as
                citizens. Role detection happens after sign-in.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-bocra-text-secondary">
                You are being redirected to the portal login now.
              </p>
              <Button
                className="w-full bg-bocra-teal text-white hover:bg-bocra-teal/90"
                asChild
              >
                <a href={PORTAL_LOGIN_URL}>Open Portal Sign In</a>
              </Button>
              <a
                href="/"
                className="inline-flex items-center gap-2 text-sm text-bocra-text-secondary transition-colors hover:text-bocra-teal"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to website
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
