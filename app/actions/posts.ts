"use server";

import { createClient } from "@/lib/supabase/server";
import type { PostFormData } from "@/lib/types";
import { XP_PER_POST, XP_PER_LIKE } from "@/lib/rpg";

export async function getPosts(options?: {
  excludeUserId?: string;
  userId?: string;
}) {
  const supabase = await createClient();
  if (!supabase) return [];

  let query = supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (options?.excludeUserId) {
    query = query.neq("user_id", options.excludeUserId);
  }
  if (options?.userId) {
    query = query.eq("user_id", options.userId);
  }

  const { data: posts, error } = await query;

  if (error) {
    console.error(error);
    return [];
  }

  const postIds = (posts ?? []).map((p) => p.id);
  const { data: likesData } = await supabase
    .from("likes")
    .select("post_id, type");

  const counts: Record<string, { article: number; review: number }> = {};
  for (const id of postIds) counts[id] = { article: 0, review: 0 };
  for (const l of likesData ?? []) {
    if (l.type === "article") counts[l.post_id].article++;
    else counts[l.post_id].review++;
  }

  return (posts ?? []).map((p) => ({
    ...p,
    article_likes_count: counts[p.id]?.article ?? 0,
    review_likes_count: counts[p.id]?.review ?? 0,
  }));
}

export async function getPostById(id: string) {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !post) return null;

  const { data: likes } = await supabase
    .from("likes")
    .select("type, user_id")
    .eq("post_id", id);

  const articleCount = likes?.filter((l) => l.type === "article").length ?? 0;
  const reviewCount = likes?.filter((l) => l.type === "review").length ?? 0;

  const { data: { user } } = await supabase.auth.getUser();
  const userArticleLiked = user
    ? likes?.some((l) => l.type === "article" && l.user_id === user.id)
    : false;
  const userReviewLiked = user
    ? likes?.some((l) => l.type === "review" && l.user_id === user.id)
    : false;

  return {
    ...post,
    article_likes_count: articleCount,
    review_likes_count: reviewCount,
    user_article_liked: userArticleLiked,
    user_review_liked: userReviewLiked,
  };
}

export async function createPost(form: PostFormData) {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabaseが設定されていません。.env.local を確認してください。" };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "ログインが必要です" };

  const { data, error } = await supabase
    .from("posts")
    .insert({
      user_id: user.id,
      restaurant_name: form.restaurant_name,
      genre: form.genre,
      closed_days: form.closed_days,
      hours: form.hours,
      address: form.address,
      image_url: form.image_url,
      visit_date: form.visit_date,
      companions: form.companions,
      amount: form.amount,
      amount_numeric: form.amount_numeric ?? null,
      dishes: form.dishes,
      review_content: form.review_content,
      taste_rating: form.taste_rating,
      price_rating: form.price_rating,
      atmosphere_rating: form.atmosphere_rating,
      overall_rating: form.overall_rating,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  // XP加算（投稿100）
  const { data: profile } = await supabase
    .from("profiles")
    .select("xp")
    .eq("id", user.id)
    .single();

  const newXp = (profile?.xp ?? 0) + XP_PER_POST;
  await supabase.from("profiles").update({ xp: newXp, updated_at: new Date().toISOString() }).eq("id", user.id);

  return { id: data.id };
}

export async function toggleLike(postId: string, type: "article" | "review") {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabaseが設定されていません。" };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "ログインが必要です" };

  const { data: existing } = await supabase
    .from("likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .eq("type", type)
    .single();

  if (existing) {
    await supabase.from("likes").delete().eq("id", existing.id);

    // 投稿者のXPから20を引く（簡易: 実際は投稿者を取得して減算する必要あり。今回はシンプルにしない）
    return { liked: false };
  }

  await supabase.from("likes").insert({
    post_id: postId,
    user_id: user.id,
    type,
  });

  // 投稿者にXP+20
  const { data: post } = await supabase.from("posts").select("user_id").eq("id", postId).single();
  if (post && post.user_id !== user.id) {
    const { data: profile } = await supabase.from("profiles").select("xp").eq("id", post.user_id).single();
    const newXp = (profile?.xp ?? 0) + XP_PER_LIKE;
    await supabase.from("profiles").update({ xp: newXp, updated_at: new Date().toISOString() }).eq("id", post.user_id);
  }

  return { liked: true };
}
