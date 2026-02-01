/**
 * 食の冒険録 - データモデル
 */

export type LikeType = "article" | "review"; // ✨記事いいね | 📖感想いいね

export interface RatingItem {
  subject: "味" | "値段" | "雰囲気" | "総合";
  value: number;
}

export interface Post {
  id: string;
  restaurant_name: string;
  genre: string;
  closed_days: string;
  hours: string;
  address: string;
  image_url: string | null;
  visit_date: string;
  companions: string;
  amount: string | null;
  amount_numeric?: number | null;
  dishes: string;
  review_content: string;
  taste_rating: number;
  price_rating: number;
  atmosphere_rating: number;
  overall_rating: number;
  user_id: string;
  created_at: string;
  // 集計用（JOINで取得）
  article_likes_count?: number;
  review_likes_count?: number;
}

export interface PostWithDetails extends Post {
  profile?: Profile | null;
  user_article_liked?: boolean;
  user_review_liked?: boolean;
}

export interface Like {
  id: string;
  post_id: string;
  user_id: string;
  type: LikeType;
  created_at: string;
}

export interface Profile {
  id: string;
  xp: number;
  level: number;
  title: string | null;
  display_name: string;
  favorite_food: string;
  bio: string;
  target_restaurant: string;
  updated_at: string;
}

export interface ProfileStats {
  totalGold: number;
  totalXp: number;
  genreDistribution: Record<string, number>;
  articleLikesReceived: number;
  reviewLikesReceived: number;
  postCount: number;
  followerCount: number;
  followingCount: number;
}

/** 投稿フォーム用 */
export interface PostFormData {
  restaurant_name: string;
  genre: string;
  closed_days: string;
  hours: string;
  address: string;
  image_url: string | null;
  visit_date: string;
  companions: string;
  amount: string | null;
  amount_numeric: number | null;
  dishes: string;
  review_content: string;
  taste_rating: number;
  price_rating: number;
  atmosphere_rating: number;
  overall_rating: number;
}

/** プロフィールフォーム用 */
export interface ProfileFormData {
  display_name: string;
  favorite_food: string;
  bio: string;
  target_restaurant: string;
}

/** Post を UI 表示用に変換 */
export function postToDisplayData(post: Post) {
  return {
    genre: post.genre,
    restaurant: {
      name: post.restaurant_name,
      closedDays: post.closed_days,
      hours: post.hours,
      address: post.address,
    },
    image: post.image_url || "/placeholder.svg",
    review: {
      visitDate: post.visit_date,
      companions: post.companions,
      amount: post.amount ?? undefined,
      dishes: post.dishes,
      content: post.review_content,
    },
    ratings: [
      { subject: "味" as const, value: post.taste_rating },
      { subject: "値段" as const, value: post.price_rating },
      { subject: "雰囲気" as const, value: post.atmosphere_rating },
      { subject: "総合" as const, value: post.overall_rating },
    ],
  };
}
