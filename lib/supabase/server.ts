import { createServerClient, type SupabaseClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient(): Promise<SupabaseClient | null> {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return null;
  if (!url.startsWith("http")) url = `https://${url}`;
  url = url.replace(/\/+$/, "");

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Component 内では無視
        }
      },
    },
  });
}
