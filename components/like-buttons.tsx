"use client";

import { useState } from "react";
import { toggleLike } from "@/app/actions/posts";

interface LikeButtonsProps {
  postId: string;
  articleLikes: number;
  reviewLikes: number;
  userArticleLiked?: boolean;
  userReviewLiked?: boolean;
}

export function LikeButtons({
  postId,
  articleLikes,
  reviewLikes,
  userArticleLiked = false,
  userReviewLiked = false,
}: LikeButtonsProps) {
  const [articleCount, setArticleCount] = useState(articleLikes);
  const [reviewCount, setReviewCount] = useState(reviewLikes);
  const [articleLiked, setArticleLiked] = useState(userArticleLiked);
  const [reviewLiked, setReviewLiked] = useState(userReviewLiked);
  const [loading, setLoading] = useState<"article" | "review" | null>(null);

  const handleArticleLike = async () => {
    setLoading("article");
    const res = await toggleLike(postId, "article");
    setLoading(null);
    if (!res.error) {
      setArticleLiked(res.liked);
      setArticleCount((c) => (res.liked ? c + 1 : c - 1));
    }
  };

  const handleReviewLike = async () => {
    setLoading("review");
    const res = await toggleLike(postId, "review");
    setLoading(null);
    if (!res.error) {
      setReviewLiked(res.liked);
      setReviewCount((c) => (res.liked ? c + 1 : c - 1));
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleArticleLike}
        disabled={loading !== null}
        className={`flex items-center gap-1 px-3 py-2 rounded-sm text-sm transition-colors ${
          articleLiked
            ? "bg-amber-500/20 text-amber-700 dark:text-amber-400"
            : "text-foreground/70 hover:text-foreground hover:bg-muted"
        }`}
        title="記事いいね（写真・雰囲気が素晴らしい）"
      >
        <span className="text-base">✨</span>
        <span>{articleCount}</span>
      </button>
      <button
        onClick={handleReviewLike}
        disabled={loading !== null}
        className={`flex items-center gap-1 px-3 py-2 rounded-sm text-sm transition-colors ${
          reviewLiked
            ? "bg-amber-500/20 text-amber-700 dark:text-amber-400"
            : "text-foreground/70 hover:text-foreground hover:bg-muted"
        }`}
        title="感想いいね（文章や思い出が面白い）"
      >
        <span className="text-base">📖</span>
        <span>{reviewCount}</span>
      </button>
    </div>
  );
}
