"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import {
  signInWithEmail,
  signUpWithEmail,
  signInAnonymously,
} from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "signin" | "signup";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("error") === "auth") {
      toast.error("認証に失敗しました。もう一度お試しください。");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setLoading(true);
    const action = mode === "signup" ? signUpWithEmail : signInWithEmail;
    const res = await action(email.trim(), password);
    setLoading(false);

    if (res.error) {
      toast.error(res.error);
      return;
    }

    if (mode === "signup") {
      toast.success("確認メールを送信しました。メール内のリンクをクリックしてください。");
    } else {
      toast.success("ログインしました");
      router.push("/");
      router.refresh();
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    const res = await signInAnonymously();
    setLoading(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success("ゲストとしてログインしました");
    router.push("/");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-md mx-auto px-4 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
            aria-label="戻る"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-sm">トップへ</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-sm mx-auto px-4 pt-24 pb-16">
        <header className="mb-12">
          <h1 className="text-2xl font-medium tracking-tight text-foreground">
            食の冒険録
          </h1>
          <p className="mt-2 text-sm text-muted-foreground tracking-wide">
            食の思い出を記録し、仲間と共有する
          </p>
        </header>

        <div className="border border-border/50 rounded-sm bg-card/50 p-6">
          <div className="flex border-b border-border/50 mb-6 -mx-6 px-6">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                mode === "signin"
                  ? "text-foreground border-b-2 border-foreground -mb-[1px]"
                  : "text-muted-foreground hover:text-foreground/80"
              }`}
            >
              ログイン
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                mode === "signup"
                  ? "text-foreground border-b-2 border-foreground -mb-[1px]"
                  : "text-muted-foreground hover:text-foreground/80"
              }`}
            >
              新規登録
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                autoComplete="email"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">
                {mode === "signup" ? "パスワード（6文字以上）" : "パスワード"}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={mode === "signup" ? 6 : 1}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "送信中..."
                : mode === "signup"
                  ? "登録する"
                  : "ログイン"}
            </Button>
          </form>

          {mode === "signup" && (
            <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
              登録後、確認メールが届きます。リンクをクリックしてメールアドレスを認証してください。
            </p>
          )}
        </div>

        <div className="mt-6 text-center">
          <div className="relative mb-4">
            <span className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </span>
            <span className="relative bg-background px-3 text-xs text-muted-foreground">
              または
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGuestLogin}
            disabled={loading}
          >
            ゲストとして続ける
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            投稿やいいねにはログインが必要です
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">読み込み中...</p>
      </main>
    }>
      <LoginForm />
    </Suspense>
  );
}
