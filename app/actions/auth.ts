"use server";

import { createClient } from "@/lib/supabase/server";

export async function signInAnonymously() {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabaseが設定されていません。" };
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) return { error: error.message };
  return { ok: true };
}

export async function getSession() {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}
