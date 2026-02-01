import Link from "next/link";
import { ArrowLeft, Edit3, User } from "lucide-react";
import { getProfile, getProfileStats } from "@/app/actions/profile";
import { getPosts } from "@/app/actions/posts";
import { getCurrentUserId } from "@/app/actions/auth";
import { isFollowing } from "@/app/actions/follow";
import { PostCard } from "./post-card";
import { FollowButton } from "./follow-button";

interface ProfileViewProps {
  userId: string;
  isOwnProfile: boolean;
}

export async function ProfileView({ userId, isOwnProfile }: ProfileViewProps) {
  const [profile, stats, posts, currentUserId] = await Promise.all([
    getProfile(userId),
    getProfileStats(userId),
    getPosts({ userId }),
    getCurrentUserId(),
  ]);

  if (!profile) notFound();

  const isFollowingUser = currentUserId
    ? await isFollowing(currentUserId, userId)
    : false;

  return (
    <main className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="p-2 -ml-2 text-foreground/70 hover:text-foreground transition-colors"
            aria-label="戻る"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
          </Link>
          {isOwnProfile ? (
            <Link
              href="/profile/edit"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-foreground/70 hover:text-foreground transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              編集
            </Link>
          ) : (
            <FollowButton
              followingId={userId}
              initialFollowing={isFollowingUser}
            />
          )}
        </div>
      </nav>

      <div className="max-w-md mx-auto px-4 pt-16 pb-12">
        {/* プロフィールヘッダー */}
        <section className="mb-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-medium tracking-tight truncate">
                {profile.display_name || "名無しの冒険者"}
              </h1>
              <p className="text-sm text-amber-700/90 font-medium mt-0.5">
                Lv.{profile.level} {profile.title}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                好きな食べ物: {profile.favorite_food || "未設定"}
              </p>
            </div>
          </div>

          {profile.bio && (
            <p className="mt-4 text-sm leading-relaxed text-foreground/90">
              {profile.bio}
            </p>
          )}

          {profile.target_restaurant && (
            <div className="mt-4 p-3 rounded-sm bg-muted/50 border border-border/50">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">
                次に狙っている秘宝（店）
              </p>
              <p className="text-sm font-medium">{profile.target_restaurant}</p>
            </div>
          )}

          {/* フォロー数 */}
          {stats && (
            <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
              <span>フォロワー {stats.followerCount}</span>
              <span>フォロー中 {stats.followingCount}</span>
            </div>
          )}
        </section>

        {/* ステータス */}
        {stats && (
          <section className="mb-8 p-4 rounded-sm border border-border/50 bg-card/30">
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
              ステータス
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">累計消費ゴールド</span>
                <span className="font-medium">¥{stats.totalGold.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">累計獲得XP</span>
                <span className="font-medium">{stats.totalXp} XP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">獲得した ✨</span>
                <span className="font-medium">{stats.articleLikesReceived}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">獲得した 📖</span>
                <span className="font-medium">{stats.reviewLikesReceived}</span>
              </div>
              <div className="pt-2 border-t border-border/50">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2">
                  ジャンル分布
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(stats.genreDistribution)
                    .sort(([, a], [, b]) => b - a)
                    .map(([genre, count]) => (
                      <span
                        key={genre}
                        className="px-2 py-0.5 text-xs border border-border rounded-sm"
                      >
                        {genre} ×{count}
                      </span>
                    ))}
                  {Object.keys(stats.genreDistribution).length === 0 && (
                    <span className="text-xs text-muted-foreground">
                      まだ記録なし
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 投稿一覧 */}
        <section>
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
            投稿 ({posts.length})
          </h2>
          {posts.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              {isOwnProfile
                ? "まだ投稿がありません"
                : "このユーザーはまだ投稿していません"}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} compact />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
