import Link from "next/link";
import { Plus, Trophy, Sparkles, User } from "lucide-react";
import { getPosts } from "@/app/actions/posts";
import { getCurrentUserId } from "@/app/actions/auth";
import { PostCard } from "@/components/post-card";
import { FeedFilter } from "@/components/feed-filter";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const params = await searchParams;
  const showOthersOnly = params.filter === "others";
  const userId = await getCurrentUserId();

  const posts = await getPosts(
    showOthersOnly && userId ? { excludeUserId: userId } : undefined
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-12">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-medium tracking-tight">食の冒険録</h1>
          <div className="flex items-center gap-2">
            {userId ? (
              <Link
                href="/profile"
                className="p-2 text-foreground/70 hover:text-foreground transition-colors"
                aria-label="プロフィール"
              >
                <User className="w-5 h-5" strokeWidth={1.5} />
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-3 py-1.5 text-sm text-foreground/70 hover:text-foreground border border-border rounded-sm transition-colors"
              >
                ログイン
              </Link>
            )}
            <Link
              href="/ranking"
              className="p-2 text-foreground/70 hover:text-foreground transition-colors"
              aria-label="ランキング"
            >
              <Trophy className="w-5 h-5" strokeWidth={1.5} />
            </Link>
            <Link
              href="/new"
              className="p-2 text-foreground/70 hover:text-foreground transition-colors"
              aria-label="新規投稿"
            >
              <Plus className="w-5 h-5" strokeWidth={1.5} />
            </Link>
          </div>
        </header>

        {/* 新着フィード */}
        <section className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              新着の冒険
            </h2>
            {userId && (
              <FeedFilter showOthersOnly={showOthersOnly} />
            )}
          </div>
        </section>

        {/* Bento Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {posts.length === 0 ? (
            <div className="col-span-full py-16 text-center">
              <p className="text-muted-foreground text-sm mb-4">
                {showOthersOnly
                  ? "ほかの人の投稿はまだありません"
                  : "まだ投稿がありません"}
              </p>
              {!showOthersOnly && (
                <Link
                  href="/new"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-sm text-sm hover:bg-muted/50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  最初の冒険を記録する
                </Link>
              )}
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} compact />
            ))
          )}
        </section>
      </div>
    </main>
  );
}
