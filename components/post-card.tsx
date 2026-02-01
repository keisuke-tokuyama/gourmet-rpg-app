"use client";

import Link from "next/link";
import { GenreChip } from "./genre-chip";
import { postToDisplayData } from "@/lib/types";
import type { Post } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post & { article_likes_count?: number; review_likes_count?: number };
  compact?: boolean;
}

export function PostCard({ post, compact }: PostCardProps) {
  const d = postToDisplayData(post);

  return (
    <Link
      href={`/post/${post.id}`}
      className={cn(
        "block rounded-sm overflow-hidden border border-border/50 bg-card/50 transition-all hover:border-border hover:shadow-sm",
        compact ? "grid grid-cols-[40%_1fr] gap-3 p-3" : "grid grid-cols-[40%_1fr] gap-4 p-4"
      )}
    >
      <div className="flex flex-col justify-end min-h-0">
        <GenreChip genre={d.genre} isActive={false} />
        <h2
          className={cn(
            "font-medium leading-tight tracking-tight text-foreground text-balance mt-2 line-clamp-2",
            compact ? "text-sm" : "text-base"
          )}
        >
          {d.restaurant.name}
        </h2>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <span>✨ {post.article_likes_count ?? 0}</span>
          <span>📖 {post.review_likes_count ?? 0}</span>
        </div>
      </div>
      <div className="aspect-[3/4] rounded-sm overflow-hidden bg-muted">
        <img
          src={d.image}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    </Link>
  );
}
