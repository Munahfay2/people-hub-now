import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export async function loginAdmin(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { ok: false, error: "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local" };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) return { ok: false, error: error.message };
  if (!data.session) return { ok: false, error: "No session returned" };
  return { ok: true };
}

export async function logoutAdmin(): Promise<void> {
  if (isSupabaseConfigured) await supabase.auth.signOut();
}

export async function getAdminSession() {
  if (!isSupabaseConfigured) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getAdminSession();
  return session !== null;
}

export function getAdminEmail(): string | null {
  return null; // use async session in context
}
