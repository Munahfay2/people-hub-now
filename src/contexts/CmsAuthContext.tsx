import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { loginAdmin, logoutAdmin } from "@/lib/cms-auth";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

type CmsAuthContextValue = {
  isAuthenticated: boolean;
  email: string | null;
  loading: boolean;
  configured: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
};

const CmsAuthContext = createContext<CmsAuthContextValue | null>(null);

export function CmsAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setEmail(session?.user.email ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setEmail(session?.user.email ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (userEmail: string, password: string) => {
    const result = await loginAdmin(userEmail, password);
    if (result.ok) {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(true);
      setEmail(session?.user.email ?? userEmail);
    }
    return result;
  };

  const logout = async () => {
    await logoutAdmin();
    setIsAuthenticated(false);
    setEmail(null);
  };

  return (
    <CmsAuthContext.Provider
      value={{
        isAuthenticated,
        email,
        loading,
        configured: isSupabaseConfigured,
        login,
        logout,
      }}
    >
      {children}
    </CmsAuthContext.Provider>
  );
}

export function useCmsAuth() {
  const ctx = useContext(CmsAuthContext);
  if (!ctx) throw new Error("useCmsAuth must be used within CmsAuthProvider");
  return ctx;
}
