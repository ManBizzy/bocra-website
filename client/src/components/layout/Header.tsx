import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { Menu, X, Search } from 'lucide-react';
import {
  NAV_LINKS,
  CITIZEN_PORTAL_URL,
  getLoginUrl,
  ADMIN_DASHBOARD_URL,
} from '@/const';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/_core/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import BrandLogo from '@/components/branding/BrandLogo';
import SiteSearch from '@/components/layout/SiteSearch';

export default function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const portalUrl = user ? CITIZEN_PORTAL_URL : getLoginUrl();
  const adminUrl = ADMIN_DASHBOARD_URL;

  // Handle scroll shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle mobile menu close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Handle focus trap for mobile drawer
  useEffect(() => {
    if (!isMobileMenuOpen || !drawerRef.current) return;

    const focusableElements = drawerRef.current.querySelectorAll(
      'button, [href], input, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => window.removeEventListener('keydown', handleTabKey);
  }, [isMobileMenuOpen]);

  const isActive = (href: string) => location === href;

  return (
    <>
      <SiteSearch open={isSearchOpen} onOpenChange={setIsSearchOpen} />

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-0 z-40 h-screen w-full max-w-sm bg-white flex flex-col md:hidden"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-bocra-border">
              <h2 className="text-lg font-semibold text-bocra-text-primary">Menu</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Drawer Links */}
            <nav className="flex-1 overflow-y-auto py-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-bocra-teal border-l-4 border-bocra-teal bg-bocra-teal/5'
                      : 'text-bocra-text-secondary hover:text-bocra-teal'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Drawer Footer */}
            <div className="border-t border-bocra-border p-4 space-y-2">
              <Button
                className="w-full bg-bocra-teal hover:bg-bocra-teal/90 text-white"
                onClick={() => {
                  window.location.href = portalUrl;
                  setIsMobileMenuOpen(false);
                }}
              >
                Open Portal
              </Button>
              {user?.role === 'admin' && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    window.location.href = adminUrl;
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Admin Panel
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header
        className={`sticky top-0 z-20 bg-white transition-shadow duration-200 ${
          isScrolled ? 'shadow-md' : ''
        }`}
      >
        <div className="container py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex flex-shrink-0 items-center" aria-label="BOCRA home">
              <BrandLogo imageClassName="h-10 sm:h-11" />
              <span className="sr-only">Botswana Communications Regulatory Authority</span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors relative ${
                    isActive(link.href)
                      ? 'text-bocra-teal'
                      : 'text-bocra-text-secondary hover:text-bocra-teal'
                  }`}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-bocra-teal" />
                  )}
                </a>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Open search"
                className="text-bocra-text-secondary hover:text-bocra-teal"
              >
                <Search className="w-5 h-5" />
              </Button>

              {/* Desktop Portal Button */}
              <Button
                className="hidden sm:inline-flex bg-bocra-teal hover:bg-bocra-teal/90 text-white"
                onClick={() => (window.location.href = portalUrl)}
              >
                Portal
              </Button>

              {user?.role === 'admin' && (
                <a
                  href={adminUrl}
                  className="hidden lg:inline-block text-xs text-bocra-text-muted hover:text-bocra-teal transition-colors"
                >
                  Admin
                </a>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
                className="md:hidden text-bocra-text-secondary"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
