import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageVisit } from "@/lib/cms-store";

export function PageVisitTracker() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!pathname.startsWith("/admin")) {
      trackPageVisit(pathname);
    }
  }, [pathname]);

  return null;
}
