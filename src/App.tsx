import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { CmsAuthProvider } from "@/contexts/CmsAuthContext";
import { PageVisitTracker } from "@/components/PageVisitTracker";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy-load new pages for code splitting + faster initial load
const Events = lazy(() => import("./pages/Events"));
const Blog   = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Donate = lazy(() => import("./pages/Donate"));

const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const BlogsAdmin = lazy(() => import("./pages/admin/BlogsAdmin"));
const EventsAdmin = lazy(() => import("./pages/admin/EventsAdmin"));
const SubmissionsAdmin = lazy(() => import("./pages/admin/SubmissionsAdmin"));
import { AdminLayout } from "@/components/admin/AdminLayout";

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="h-10 w-10 rounded-full border-4 border-muted border-t-accent animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CmsAuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <PageVisitTracker />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/events" element={<Events />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="blogs" element={<BlogsAdmin />} />
                <Route path="events" element={<EventsAdmin />} />
                <Route path="submissions" element={<SubmissionsAdmin />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </CmsAuthProvider>
  </QueryClientProvider>
);

export default App;
