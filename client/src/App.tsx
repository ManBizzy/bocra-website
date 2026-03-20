import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Suspense, lazy } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Licensing = lazy(() => import("./pages/Licensing"));
const Complaints = lazy(() => import("./pages/Complaints"));
const DomainRegistry = lazy(() => import("./pages/DomainRegistry"));
const News = lazy(() => import("./pages/News"));
const NewsArticle = lazy(() => import("./pages/NewsArticle"));
const Publications = lazy(() => import("./pages/Publications"));
const Contact = lazy(() => import("./pages/Contact"));
const PortalLogin = lazy(() => import("./pages/portal/Login"));
const PortalDashboard = lazy(() => import("./pages/portal/Dashboard"));
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-4 w-full max-w-md px-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public Pages */}
      <Route path={"/"}>
        {() => (
          <PublicLayout>
            <Suspense fallback={<LoadingFallback />}>
              <Home />
            </Suspense>
          </PublicLayout>
        )}
      </Route>

      <Route path={"/about"}>
        {() => (
          <PublicLayout>
            <Suspense fallback={<LoadingFallback />}>
              <About />
            </Suspense>
          </PublicLayout>
        )}
      </Route>

      <Route path={"/services"}>
        {() => (
          <PublicLayout>
            <Suspense fallback={<LoadingFallback />}>
              <Services />
            </Suspense>
          </PublicLayout>
        )}
      </Route>

      <Route path={"/licensing"}>
        {() => (
          <PublicLayout>
            <Suspense fallback={<LoadingFallback />}>
              <Licensing />
            </Suspense>
          </PublicLayout>
        )}
      </Route>

      <Route path={"/complaints"}>
        {() => (
          <PublicLayout>
            <Suspense fallback={<LoadingFallback />}>
              <Complaints />
            </Suspense>
          </PublicLayout>
        )}
      </Route>

      <Route path={"/domain-registry"}>
        {() => (
          <PublicLayout>
            <Suspense fallback={<LoadingFallback />}>
              <DomainRegistry />
            </Suspense>
          </PublicLayout>
        )}
      </Route>

      <Route path={"/news"}>
        {() => (
          <PublicLayout>
            <Suspense fallback={<LoadingFallback />}>
              <News />
            </Suspense>
          </PublicLayout>
        )}
      </Route>

      <Route path={"/news/:slug"}>
        {({ slug }) => (
          <PublicLayout>
            <Suspense fallback={<LoadingFallback />}>
              <NewsArticle slug={slug} />
            </Suspense>
          </PublicLayout>
        )}
      </Route>

      <Route path={"/publications"}>
        {() => (
          <PublicLayout>
            <Suspense fallback={<LoadingFallback />}>
              <Publications />
            </Suspense>
          </PublicLayout>
        )}
      </Route>

      <Route path={"/contact"}>
        {() => (
          <PublicLayout>
            <Suspense fallback={<LoadingFallback />}>
              <Contact />
            </Suspense>
          </PublicLayout>
        )}
      </Route>

      {/* Portal Routes */}
      <Route path={"/portal/login"}>
        {() => (
          <Suspense fallback={<LoadingFallback />}>
            <PortalLogin />
          </Suspense>
        )}
      </Route>

      <Route path={"/portal/dashboard"}>
        {() => (
          <Suspense fallback={<LoadingFallback />}>
            <PortalDashboard />
          </Suspense>
        )}
      </Route>

      {/* Admin Routes */}
      <Route path={"/admin/login"}>
        {() => (
          <Suspense fallback={<LoadingFallback />}>
            <AdminLogin />
          </Suspense>
        )}
      </Route>

      <Route path={"/admin/dashboard"}>
        {() => (
          <Suspense fallback={<LoadingFallback />}>
            <AdminDashboard />
          </Suspense>
        )}
      </Route>

      {/* 404 Fallback */}
      <Route path={"/404"}>
        {() => (
          <PublicLayout>
            <Suspense fallback={<LoadingFallback />}>
              <NotFound />
            </Suspense>
          </PublicLayout>
        )}
      </Route>

      <Route>
        {() => (
          <PublicLayout>
            <Suspense fallback={<LoadingFallback />}>
              <NotFound />
            </Suspense>
          </PublicLayout>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
