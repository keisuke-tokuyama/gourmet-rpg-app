"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { getProfile } from "@/app/actions/profile";
import { updateProfile } from "@/app/actions/profile";
import { getCurrentUserId } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ProfileEditPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    display_name: "",
    favorite_food: "",
    bio: "",
    target_restaurant: "",
  });

  useEffect(() => {
    async function load() {
      const userId = await getCurrentUserId();
      if (!userId) {
        router.replace("/");
        return;
      }
      const profile = await getProfile(userId);
      if (profile) {
        setForm({
          display_name: profile.display_name ?? "",
          favorite_food: profile.favorite_food ?? "",
          bio: profile.bio ?? "",
          target_restaurant: profile.target_restaurant ?? "",
        });
      }
      setLoading(false);
    }
    load();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await updateProfile(form);
    setSubmitting(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success("プロフィールを更新しました");
    router.push("/profile");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">読み込み中...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/profile"
            className="p-2 -ml-2 text-foreground/70 hover:text-foreground transition-colors"
            aria-label="戻る"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
          </Link>
          <span className="text-sm text-muted-foreground">プロフィール編集</span>
        </div>
      </nav>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto px-4 pt-16 pb-12 space-y-6"
      >
        <div>
          <Label htmlFor="display_name">ユーザー名</Label>
          <Input
            id="display_name"
            value={form.display_name}
            onChange={(e) =>
              setForm((f) => ({ ...f, display_name: e.target.value }))
            }
            placeholder="冒険者"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="favorite_food">
            好きな食べ物 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="favorite_food"
            value={form.favorite_food}
            onChange={(e) =>
              setForm((f) => ({ ...f, favorite_food: e.target.value }))
            }
            placeholder="パスタ"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="bio">自己紹介</Label>
          <Textarea
            id="bio"
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            placeholder="どのような食体験を求めているか..."
            rows={4}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            どのような食体験を求めているか
          </p>
        </div>

        <div>
          <Label htmlFor="target_restaurant">
            次に狙っている秘宝（店）
          </Label>
          <Input
            id="target_restaurant"
            value={form.target_restaurant}
            onChange={(e) =>
              setForm((f) => ({ ...f, target_restaurant: e.target.value }))
            }
            placeholder="いま一番行きたい店"
            className="mt-1"
          />
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "保存中..." : "保存する"}
        </Button>
      </form>
    </main>
  );
}
