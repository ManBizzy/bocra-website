import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <>
      <Helmet><title>Page Not Found | BOCRA</title></Helmet>
      <div className="container py-12 text-center"><h1 className="text-6xl font-bold text-bocra-teal mb-4">404</h1><p className="text-xl text-bocra-text-secondary mb-8">Page not found</p><Button onClick={() => window.location.href = '/'}>Go Home</Button></div>
    </>
  );
}
