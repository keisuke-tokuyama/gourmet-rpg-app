import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPostById } from "@/app/actions/posts";
import { getProfile } from "@/app/actions/profile";
import { GenreChip } from "@/components/genre-chip";
import { RestaurantInfo } from "@/components/restaurant-info";
import { ReviewSection } from "@/components/review-section";
import { IconRating } from "@/components/icon-rating";
import { LikeButtons } from "@/components/like-buttons";
import { postToDisplayData } from "@/lib/types";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  const author = await getProfile(post.user_id);
  const d = postToDisplayData(post);

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
          <LikeButtons
            postId={post.id}
            articleLikes={post.article_likes_count ?? 0}
            reviewLikes={post.review_likes_count ?? 0}
            userArticleLiked={post.user_article_liked}
            userReviewLiked={post.user_review_liked}
          />
        </div>
      </nav>

      <div className="max-w-md mx-auto px-4 pt-16 pb-8">
        <div className="py-4">
          <GenreChip genre={d.genre} isActive />
        </div>

        <header className="grid grid-cols-[40%_1fr] gap-4 mb-8">
          <RestaurantInfo
            name={d.restaurant.name}
            closedDays={d.restaurant.closedDays}
            hours={d.restaurant.hours}
            address={d.restaurant.address}
          />
          <div className="relative">
            <div className="aspect-[3/4] rounded-sm overflow-hidden">
              <img
                src={d.image}
                alt="料理の写真"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        <div className="w-12 h-px bg-border mb-8" />

        <section className="mb-10">
          <ReviewSection
            visitDate={d.review.visitDate}
            companions={d.review.companions}
            amount={d.review.amount}
            dishes={d.review.dishes}
            review={d.review.content}
          />
        </section>

        <div className="w-full h-px bg-border mb-8" />

        <section className="mb-8">
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
            評価
          </h2>
          <div className="border border-border/50 rounded-sm bg-card/50 px-5 py-1">
            <IconRating data={d.ratings} />
          </div>
        </section>

        <footer className="pt-4 border-t border-border space-y-2">
          {author && (
            <p className="text-xs text-muted-foreground text-center">
              <Link
                href={`/profile/${post.user_id}`}
                className="hover:text-foreground transition-colors"
              >
                by {author.display_name || "名無しの冒険者"}
              </Link>
            </p>
          )}
          <p className="text-xs text-muted-foreground/60 text-center">
            記録日: {d.review.visitDate}
          </p>
        </footer>
      </div>
    </main>
  );
}
