"use server";

import { createClient } from "@/lib/supabase/server";

export async function getArticleRanking(limit = 10) {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data: posts } = await supabase.from("posts").select("id");
  if (!posts?.length) return [];

  const { data: likes } = await supabase
    .from("likes")
    .select("post_id")
    .eq("type", "article");

  const count: Record<string, number> = {};
  for (const l of likes ?? []) {
    count[l.post_id] = (count[l.post_id] ?? 0) + 1;
  }

  const ranked = Object.entries(count)
    .map(([post_id, c]) => ({ post_id, count: c }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  if (ranked.length === 0) return [];

  const { data: postData } = await supabase
    .from("posts")
    .select("id, restaurant_name, genre, image_url, article_likes_count")
    .in("id", ranked.map((r) => r.post_id));

  const byId = Object.fromEntries((postData ?? []).map((p) => [p.id, p]));
  return ranked.map((r, i) => ({
    rank: i + 1,
    post_id: r.post_id,
    count: r.count,
    restaurant_name: byId[r.post_id]?.restaurant_name ?? "",
    genre: byId[r.post_id]?.genre ?? "",
    image_url: byId[r.post_id]?.image_url ?? null,
  }));
}

export async function getReviewRanking(limit = 10) {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data: likes } = await supabase
    .from("likes")
    .select("post_id")
    .eq("type", "review");

  const count: Record<string, number> = {};
  for (const l of likes ?? []) {
    count[l.post_id] = (count[l.post_id] ?? 0) + 1;
  }

  const ranked = Object.entries(count)
    .map(([post_id, c]) => ({ post_id, count: c }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  if (ranked.length === 0) return [];

  const { data: postData } = await supabase
    .from("posts")
    .select("id, restaurant_name, genre, image_url, dishes, review_content")
    .in("id", ranked.map((r) => r.post_id));

  const byId = Object.fromEntries((postData ?? []).map((p) => [p.id, p]));
  return ranked.map((r, i) => ({
    rank: i + 1,
    post_id: r.post_id,
    count: r.count,
    restaurant_name: byId[r.post_id]?.restaurant_name ?? "",
    genre: byId[r.post_id]?.genre ?? "",
    image_url: byId[r.post_id]?.image_url ?? null,
    dishes: byId[r.post_id]?.dishes ?? "",
    review_preview: (byId[r.post_id]?.review_content ?? "").slice(0, 80) + "...",
  }));
}
