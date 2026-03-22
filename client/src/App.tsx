import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Suspense, lazy } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BocraLoadingSpinner from "@/components/BocraLoadingSpinner";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const BoardOfDirectors = lazy(() => import("./pages/BoardOfDirectors"));
const ExecutiveManagement = lazy(() => import("./pages/ExecutiveManagement"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Consultations = lazy(() => import("./pages/Consultations"));
const ConsultationDetail = lazy(() => import("./pages/ConsultationDetail"));
const News = lazy(() => import("./pages/News"));
const NewsArticle = lazy(() => import("./pages/NewsArticle"));
const Publications = lazy(() => import("./pages/Publications"));
const PublicationResource = lazy(() => import("./pages/PublicationResource"));
const LicensingRegister = lazy(() => import("./pages/LicensingRegister"));
const Statistics = lazy(() => import("./pages/Statistics"));
const Contact = lazy(() => import("./pages/Contact"));
const PortalLogin = lazy(() => import("./pages/portal/Login"));
const PortalDashboard = lazy(() => import("./pages/portal/Dashboard"));
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <BocraLoadingSpinner size="lg" message="Loading page..." />
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

      <Route path={"/board-of-directors"}>
        {() => (
          <PublicLayout>
            <Suspense fallback={<LoadingFallback />}>
              <BoardOfDirectors />
            </Suspense>
          </PublicLayout>
        )}
      </Route>

      <Route path={"/executive-management"}>
        {() => (
          <PublicLayout>
            <Suspense fallback={<LoadingFallback />}>
              <ExecutiveManagement />
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
              <ServiceDetail slug="licensing" />
            </Suspense>
          </PublicLayout>
        )}
      </Route>

      <Route path={"/complaints"}>
        {() => (
          <PublicLayout>
            <Suspense fallback={<LoadingFallback />}>
              <ServiceDetail slug="complaints" />
            </Suspense>
          </PublicLayout>
        )}
      </Route>

      <Route path={"/domain-registry"}>
        {() => (
          <PublicLayout>
            <Suspense fallback={<LoadingFallback />}>
              <ServiceDetail slug="domain-registry" />
            </Suspense>
          </PublicLayout>
        )}
      </Route>

      <Route path={"/services/:slug"}>
        {({ slug }) => (
          <PublicLayout>
            <Suspense fallback={<LoadingFallback />}>
              <ServiceDetail slug={slug} />
            </Suspense>
          </PublicLayout>
        )}
      </Route>

      <Route path={"/consultations"}>
        {() => (
          <PublicLayout>
            <Suspense fallback={<LoadingFallback />}>
              <Consultations />
            </Suspense>
          </PublicLayout>
        )}
      </Route>

      <Route path={"/consultations/:id"}>
        {({ id }) => (
          <PublicLayout>
            <Suspense fallback={<LoadingFallback />}>
              <ConsultationDetail id={id} />
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

      <Route path={"/resources/:slug"}>
        {({ slug }) => (
          <PublicLayout>
            <Suspense fallback={<LoadingFallback />}>
              <PublicationResource slug={slug} />
            </Suspense>
          </PublicLayout>
        )}
      </Route>

      <Route path={"/licensing/register"}>
        {() => (
          <PublicLayout>
            <Suspense fallback={<LoadingFallback />}>
              <LicensingRegister />
            </Suspense>
          </PublicLayout>
        )}
      </Route>

      <Route path={"/statistics"}>
        {() => (
          <PublicLayout>
            <Suspense fallback={<LoadingFallback />}>
              <Statistics />
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
