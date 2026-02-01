"use server";

import { createClient } from "@/lib/supabase/server";
import type { ProfileFormData } from "@/lib/types";
import { xpToLevel, xpToTitle } from "@/lib/rpg";

export async function getProfile(userId: string) {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) return null;

  const level = xpToLevel(data.xp ?? 0);
  const title = xpToTitle(data.xp ?? 0);

  return {
    ...data,
    display_name: data.display_name ?? "",
    favorite_food: data.favorite_food ?? "",
    bio: data.bio ?? "",
    target_restaurant: data.target_restaurant ?? "",
    level,
    title,
  };
}

export async function getProfileStats(userId: string) {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data: posts } = await supabase
    .from("posts")
    .select("id, genre, amount_numeric")
    .eq("user_id", userId);

  const { data: profile } = await supabase
    .from("profiles")
    .select("xp")
    .eq("id", userId)
    .single();

  const ids = (posts ?? []).map((p) => p.id);

  let articleLikes = 0;
  let reviewLikes = 0;
  if (ids.length > 0) {
    const { data: likes } = await supabase
      .from("likes")
      .select("post_id, type")
      .in("post_id", ids);
    for (const l of likes ?? []) {
      if (l.type === "article") articleLikes++;
      else reviewLikes++;
    }
  }

  const genreDistribution: Record<string, number> = {};
  let totalGold = 0;
  for (const p of posts ?? []) {
    genreDistribution[p.genre] = (genreDistribution[p.genre] ?? 0) + 1;
    if (p.amount_numeric) totalGold += p.amount_numeric;
  }

  const { count: followerCount } = await supabase
    .from("follows")
    .select("id", { count: "exact", head: true })
    .eq("following_id", userId);

  const { count: followingCount } = await supabase
    .from("follows")
    .select("id", { count: "exact", head: true })
    .eq("follower_id", userId);

  return {
    totalGold,
    totalXp: profile?.xp ?? 0,
    genreDistribution,
    articleLikesReceived: articleLikes,
    reviewLikesReceived: reviewLikes,
    postCount: posts?.length ?? 0,
    followerCount: followerCount ?? 0,
    followingCount: followingCount ?? 0,
  };
}

export async function updateProfile(form: ProfileFormData) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabaseが設定されていません。" };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "ログインが必要です" };

  if (!form.favorite_food?.trim()) {
    return { error: "好きな食べ物は必須です" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: form.display_name?.trim() || "",
      favorite_food: form.favorite_food.trim(),
      bio: form.bio?.trim() || "",
      target_restaurant: form.target_restaurant?.trim() || "",
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) return { error: error.message };
  return { ok: true };
}
