"use client";

import { useState } from "react";
import { toggleFollow } from "@/app/actions/follow";

interface FollowButtonProps {
  followingId: string;
  initialFollowing: boolean;
}

export function FollowButton({
  followingId,
  initialFollowing,
}: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const res = await toggleFollow(followingId);
    setLoading(false);
    if (!res.error) setFollowing(res.following);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-4 py-2 text-sm rounded-sm transition-colors ${
        following
          ? "border border-border bg-muted/50 text-muted-foreground"
          : "bg-foreground text-background hover:opacity-90"
      }`}
    >
      {following ? "フォロー中" : "フォロー"}
    </button>
  );
}
