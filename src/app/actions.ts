"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export type GuestbookFormState = {
  error?: string;
  success?: boolean;
};

export async function addGuestbookEntry(
  _prevState: GuestbookFormState,
  formData: FormData
): Promise<GuestbookFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !message) {
    return { error: "이름과 메시지를 모두 입력해 주세요." };
  }

  if (name.length > 50) {
    return { error: "이름은 50자 이내로 입력해 주세요." };
  }

  if (message.length > 500) {
    return { error: "메시지는 500자 이내로 입력해 주세요." };
  }

  if (!isSupabaseConfigured || !supabase) {
    return {
      error:
        "Supabase가 아직 연결되지 않았어요. .env.local을 설정한 뒤 다시 시도해 주세요.",
    };
  }

  const { error } = await supabase
    .from("posts")
    .insert({ name, message });

  if (error) {
    return { error: "방명록을 등록하지 못했어요. 잠시 후 다시 시도해 주세요." };
  }

  revalidatePath("/");
  return { success: true };
}

export async function setPostLiked(id: string, liked: boolean) {
  if (!isSupabaseConfigured || !supabase) return;

  await supabase.rpc("adjust_post_likes", {
    post_id: id,
    delta: liked ? 1 : -1,
  });
  revalidatePath("/");
}

export async function deletePost(id: string) {
  if (!isSupabaseConfigured || !supabase) return;

  const { error } = await supabase.from("posts").delete().eq("id", id);
  revalidatePath("/");
  return { error: error?.message };
}
