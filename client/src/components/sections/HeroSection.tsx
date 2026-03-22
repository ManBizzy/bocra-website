import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getLoginUrl } from '@/const';

export default function HeroSection() {
  const [showScrollCue, setShowScrollCue] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 24) {
        setShowScrollCue(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section
      className="relative flex h-screen w-full items-center justify-center overflow-hidden md:h-[85vh]"
      style={{
        backgroundImage: `url('/Images/background%204.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 container max-w-3xl text-center text-white px-6">
        <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
          Connecting Botswana. Protecting Citizens. Regulating the Future.
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-white md:text-xl">
          BOCRA is mandated to regulate telecommunications, broadcasting,
          postal, and internet services in Botswana in the public interest,
          making communications accessible, fair, and secure for every
          citizen.
        </p>

        <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            className="bg-white px-8 py-6 text-base font-semibold text-bocra-teal hover:bg-white/90"
            onClick={() =>
              (window.location.href = `${getLoginUrl()}?next=${encodeURIComponent(
                '/portal/dashboard#file-complaint'
              )}`)
            }
          >
            File a Complaint
          </Button>
          <Button
            variant="outline"
            className="border-white px-8 py-6 text-base font-semibold text-white hover:bg-white/10"
            onClick={() => (window.location.href = '/services/licensing')}
          >
            Licensing Guidance
          </Button>
        </div>
      </div>

      {showScrollCue && (
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 transform">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-white/60">Scroll to explore</span>
            <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/30 p-2">
              <div className="h-2 w-1 rounded-full bg-white/60" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
