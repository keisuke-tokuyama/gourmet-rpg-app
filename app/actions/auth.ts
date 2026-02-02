"use server";

import { createClient } from "@/lib/supabase/server";

function getRedirectUrl(): string | undefined {
  const base = process.env.NEXT_PUBLIC_APP_URL;
  if (!base || typeof base !== "string" || !base.startsWith("http")) return undefined;
  return `${base.replace(/\/$/, "")}/auth/callback`;
}

export async function signInAnonymously() {
  try {
    const supabase = await createClient();
    if (!supabase) return { error: "Supabaseが設定されていません。環境変数 NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY を確認してください。" };
    const { error } = await supabase.auth.signInAnonymously();
    if (error) return { error: error.message };
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { error: msg.includes("fetch") ? "Supabase に接続できません。URL・キー・ネットワークを確認してください。" : msg };
  }
}

export async function signUpWithEmail(email: string, password: string) {
  try {
    const supabase = await createClient();
    if (!supabase) return { error: "Supabaseが設定されていません。環境変数 NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY を確認してください。" };

    const redirectTo = getRedirectUrl();
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: redirectTo ? { emailRedirectTo: redirectTo } : undefined,
    });
    if (error) return { error: error.message };
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("fetch") || msg.includes("Fetch") || msg.includes("network")) {
      return { error: "Supabase に接続できません。環境変数（NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY）と Supabase ダッシュボードの設定を確認してください。" };
    }
    return { error: msg };
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const supabase = await createClient();
    if (!supabase) return { error: "Supabaseが設定されていません。環境変数 NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY を確認してください。" };
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) return { error: error.message };
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("fetch") || msg.includes("Fetch") || msg.includes("network")) {
      return { error: "Supabase に接続できません。環境変数とネットワークを確認してください。" };
    }
    return { error: msg };
  }
}

export async function signOut() {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabaseが設定されていません。" };
  await supabase.auth.signOut();
  return { ok: true };
}

export async function resetPassword(email: string) {
  try {
    const supabase = await createClient();
    if (!supabase) return { error: "Supabaseが設定されていません。" };
    const redirectTo = getRedirectUrl();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo ? redirectTo.replace("/auth/callback", "/auth/reset-password") : undefined,
    });
    if (error) return { error: error.message };
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { error: msg.includes("fetch") ? "Supabase に接続できません。" : msg };
  }
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
