"use server";

import { createClient } from "@/lib/supabase/server";

export async function isFollowing(followerId: string, followingId: string) {
  const supabase = await createClient();
  if (!supabase) return false;

  const { data } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", followerId)
    .eq("following_id", followingId)
    .single();

  return !!data;
}

export async function toggleFollow(followingId: string) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabaseが設定されていません。" };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "ログインが必要です" };
  if (user.id === followingId) return { error: "自分自身はフォローできません" };

  const { data: existing } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("following_id", followingId)
    .single();

  if (existing) {
    await supabase.from("follows").delete().eq("id", existing.id);
    return { following: false };
  }

  await supabase.from("follows").insert({
    follower_id: user.id,
    following_id: followingId,
  });
  return { following: true };
}
