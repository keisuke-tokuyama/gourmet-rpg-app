"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface FeedFilterProps {
  showOthersOnly: boolean;
}

export function FeedFilter({ showOthersOnly }: FeedFilterProps) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 rounded-sm border border-border/50 p-0.5">
      <Link
        href={pathname}
        className={cn(
          "px-2.5 py-1 text-xs rounded transition-colors",
          !showOthersOnly
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        すべて
      </Link>
      <Link
        href={`${pathname}?filter=others`}
        className={cn(
          "px-2.5 py-1 text-xs rounded transition-colors",
          showOthersOnly
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        ほかの人の投稿
      </Link>
    </div>
  );
}
