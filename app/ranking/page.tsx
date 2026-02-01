import Link from "next/link";
import { Trophy, Sparkles, BookOpen } from "lucide-react";
import { getArticleRanking, getReviewRanking } from "@/app/actions/ranking";

export default async function RankingPage() {
  const [articleRanking, reviewRanking] = await Promise.all([
    getArticleRanking(10),
    getReviewRanking(10),
  ]);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 pt-8 pb-12">
        <header className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="p-2 -ml-2 text-foreground/70 hover:text-foreground transition-colors"
            aria-label="戻る"
          >
            ←
          </Link>
          <h1 className="text-xl font-medium tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6" strokeWidth={1.5} />
            ランキング
          </h1>
          <div className="w-10" />
        </header>

        {/* ベストフォト賞 */}
        <section className="mb-12">
          <h2 className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            ベストフォト賞
          </h2>
          <p className="text-xs text-muted-foreground/80 mb-4">
            記事いいね（✨）が多い順
          </p>
          {articleRanking.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              まだいいねがありません
            </p>
          ) : (
            <ul className="space-y-3">
              {articleRanking.map((item) => (
                <li key={item.post_id}>
                  <Link
                    href={`/post/${item.post_id}`}
                    className="flex items-center gap-4 p-3 rounded-sm border border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <span
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                        item.rank === 1
                          ? "bg-amber-500/20 text-amber-700"
                          : item.rank === 2
                            ? "bg-neutral-300/50 text-neutral-600"
                            : item.rank === 3
                              ? "bg-amber-700/20 text-amber-800"
                              : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {item.rank}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.restaurant_name}</p>
                      <p className="text-xs text-muted-foreground">{item.genre}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-lg">✨</span>
                      <span className="font-medium">{item.count}</span>
                    </div>
                    {item.image_url && (
                      <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-muted">
                        <img
                          src={item.image_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ベストエッセイ賞 */}
        <section>
          <h2 className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            ベストエッセイ賞
          </h2>
          <p className="text-xs text-muted-foreground/80 mb-4">
            感想いいね（📖）が多い順
          </p>
          {reviewRanking.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              まだいいねがありません
            </p>
          ) : (
            <ul className="space-y-3">
              {reviewRanking.map((item) => (
                <li key={item.post_id}>
                  <Link
                    href={`/post/${item.post_id}`}
                    className="flex items-center gap-4 p-3 rounded-sm border border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <span
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium flex-shrink-0 ${
                        item.rank === 1
                          ? "bg-amber-500/20 text-amber-700"
                          : item.rank === 2
                            ? "bg-neutral-300/50 text-neutral-600"
                            : item.rank === 3
                              ? "bg-amber-700/20 text-amber-800"
                              : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {item.rank}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.restaurant_name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {item.dishes}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-lg">📖</span>
                      <span className="font-medium">{item.count}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
