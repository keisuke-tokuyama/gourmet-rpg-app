"use server";

import { createClient } from "@/lib/supabase/server";

export async function uploadImage(formData: FormData): Promise<{ url: string } | { error: string }> {
  const file = formData.get("file") as File | null;
  if (!file || !file.size) return { error: "画像を選択してください" };

  const supabase = await createClient();
  if (!supabase) return { error: "Supabaseが設定されていません。" };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "ログインが必要です" };

  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${user.id}/${Date.now()}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error } = await supabase.storage
    .from("posts")
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) return { error: error.message };

  const { data: urlData } = supabase.storage
    .from("posts")
    .getPublicUrl(fileName);

  return { url: urlData.publicUrl };
}
