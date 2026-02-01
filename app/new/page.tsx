"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useRef } from "react";
import { createPost } from "@/app/actions/posts";
import { signInAnonymously } from "@/app/actions/auth";
import { uploadImage } from "@/app/actions/upload";
import { GenreChip } from "@/components/genre-chip";
import { IconRating, type RatingSubject } from "@/components/icon-rating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PostFormData } from "@/lib/types";

const GENRES = ["和食", "洋食", "中華", "イタリアン", "フレンチ", "居酒屋", "カフェ", "その他"];

export default function NewPostPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<PostFormData>({
    restaurant_name: "",
    genre: "和食",
    closed_days: "",
    hours: "",
    address: "",
    image_url: "",
    visit_date: "",
    companions: "",
    amount: "",
    amount_numeric: null,
    dishes: "",
    review_content: "",
    taste_rating: 3,
    price_rating: 3,
    atmosphere_rating: 3,
    overall_rating: 3,
  });

  const update = (k: keyof PostFormData, v: string | number | null) => {
    setForm((f) => ({ ...f, [k]: v }));
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    await signInAnonymously();
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadImage(formData);
    setUploading(false);
    e.target.value = "";

    if ("error" in res) {
      toast.error(res.error);
      return;
    }
    update("image_url", res.url);
  };

  const handleRatingChange = (subject: RatingSubject, value: number) => {
    const key = {
      味: "taste_rating",
      値段: "price_rating",
      雰囲気: "atmosphere_rating",
      総合: "overall_rating",
    }[subject] as keyof PostFormData;
    update(key, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // ゲストログイン（未ログイン時）
    const { error: authErr } = await signInAnonymously();
    if (authErr) {
      toast.error("ログインに失敗しました");
      setSubmitting(false);
      return;
    }

    const visitDateFormatted = form.visit_date
      ? form.visit_date.replace(/-/g, ".")
      : form.visit_date;

    const amountNum = form.amount_numeric;
    const amountStr =
      amountNum != null
        ? `¥${amountNum.toLocaleString()} (一人当たり)`
        : form.amount || null;

    const payload: PostFormData = {
      ...form,
      visit_date: visitDateFormatted,
      image_url: form.image_url || null,
      amount: amountStr,
      amount_numeric: amountNum,
    };

    const res = await createPost(payload);
    setSubmitting(false);

    if (res.error) {
      toast.error(res.error);
      return;
    }

    toast.success("Experience Gained! +100 XP", {
      description: "冒険を記録しました",
    });
    router.push(`/post/${res.id}`);
  };

  const ratings = [
    { subject: "味" as const, value: form.taste_rating },
    { subject: "値段" as const, value: form.price_rating },
    { subject: "雰囲気" as const, value: form.atmosphere_rating },
    { subject: "総合" as const, value: form.overall_rating },
  ];

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
          <span className="text-sm text-muted-foreground">新規投稿</span>
        </div>
      </nav>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto px-4 pt-16 pb-8">
        <div className="py-4">
          <Label className="text-xs text-muted-foreground mb-2 block">ジャンル</Label>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => update("genre", g)}
                className="focus:outline-none"
              >
                <GenreChip genre={g} isActive={form.genre === g} />
              </button>
            ))}
          </div>
        </div>

        <header className="grid grid-cols-[40%_1fr] gap-4 mb-8">
          <div className="flex flex-col justify-end space-y-3">
            <div>
              <Label htmlFor="restaurant_name">店名</Label>
              <Input
                id="restaurant_name"
                value={form.restaurant_name}
                onChange={(e) => update("restaurant_name", e.target.value)}
                placeholder="季節料理 はな"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="closed_days">定休日</Label>
              <Input
                id="closed_days"
                value={form.closed_days}
                onChange={(e) => update("closed_days", e.target.value)}
                placeholder="毎週月曜日"
                className="mt-1 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="hours">営業時間</Label>
              <Input
                id="hours"
                value={form.hours}
                onChange={(e) => update("hours", e.target.value)}
                placeholder="11:30 - 22:00"
                className="mt-1 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="address">住所</Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                placeholder="東京都渋谷区..."
                className="mt-1 text-xs"
              />
            </div>
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full aspect-[3/4] rounded-sm overflow-hidden bg-muted border border-dashed border-border hover:border-foreground/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {form.image_url ? (
                <img
                  src={form.image_url}
                  alt="選択した写真"
                  className="w-full h-full object-cover"
                />
              ) : uploading ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground text-sm">
                  <span className="animate-pulse">アップロード中...</span>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground text-sm">
                  <span>写真を選択</span>
                  <span className="text-xs">
                    PC: ファイルから / iOS: 写真ライブラリから
                  </span>
                </div>
              )}
            </button>
          </div>
        </header>

        <div className="w-12 h-px bg-border mb-8" />

        <section className="space-y-4 mb-8">
          <div>
            <Label htmlFor="visit_date">訪問日</Label>
            <Input
              id="visit_date"
              type="date"
              value={form.visit_date}
              onChange={(e) => update("visit_date", e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="companions">誰と</Label>
            <Input
              id="companions"
              value={form.companions}
              onChange={(e) => update("companions", e.target.value)}
              placeholder="友人と2人で"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="amount_numeric">金額（一人当たり・円）</Label>
            <Input
              id="amount_numeric"
              type="number"
              min={0}
              value={form.amount_numeric ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                update(
                  "amount_numeric",
                  v === "" ? null : parseInt(v, 10) || null
                );
              }}
              placeholder="12500"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {form.amount_numeric != null
                ? `¥${form.amount_numeric.toLocaleString()} (一人当たり)`
                : "累計ゴールドの計算に使用します"}
            </p>
          </div>
          <div>
            <Label htmlFor="dishes">料理</Label>
            <Input
              id="dishes"
              value={form.dishes}
              onChange={(e) => update("dishes", e.target.value)}
              placeholder="焼き魚定食、天ぷら盛り合わせ..."
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="review_content">感想</Label>
            <Textarea
              id="review_content"
              value={form.review_content}
              onChange={(e) => update("review_content", e.target.value)}
              placeholder="店内に一歩足を踏み入れると..."
              rows={6}
              required
              className="mt-1 leading-relaxed"
            />
          </div>
        </section>

        <div className="w-full h-px bg-border mb-8" />

        <section className="mb-8">
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
            評価
          </h2>
          <div className="border border-border/50 rounded-sm bg-card/50 px-5 py-1">
            <IconRating
              data={ratings}
              editable
              onChange={handleRatingChange}
            />
          </div>
        </section>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "投稿中..." : "冒険を記録する"}
        </Button>
      </form>
    </main>
  );
}
