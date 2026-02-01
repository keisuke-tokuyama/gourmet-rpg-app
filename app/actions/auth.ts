"use server";

import { createClient } from "@/lib/supabase/server";

export async function signInAnonymously() {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabaseが設定されていません。" };
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) return { error: error.message };
  return { ok: true };
}

export async function signUpWithEmail(email: string, password: string) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabaseが設定されていません。" };
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || ""}/auth/callback` },
  });
  if (error) return { error: error.message };
  return { ok: true };
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabaseが設定されていません。" };
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  return { ok: true };
}

export async function signOut() {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabaseが設定されていません。" };
  await supabase.auth.signOut();
  return { ok: true };
}

export async function resetPassword(email: string) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabaseが設定されていません。" };
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || ""}/auth/reset-password`,
  });
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
