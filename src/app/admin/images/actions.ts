"use server";

import { revalidatePath } from "next/cache";
import { imageUrlColumn } from "@/lib/db/columns";
import { createClient } from "@/lib/supabase/server";

async function assertSuperAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_superadmin")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.is_superadmin !== true) {
    throw new Error("Forbidden");
  }
  return supabase;
}

function emptyToNull(v: string | undefined): string | null {
  const t = v?.trim();
  return t ? t : null;
}

export async function createImageAction(formData: FormData) {
  const supabase = await assertSuperAdmin();
  const url = (formData.get("url") as string | null)?.trim();
  if (!url) {
    throw new Error("URL is required");
  }
  const userId = emptyToNull(formData.get("user_id") as string | undefined);
  const captionId = emptyToNull(
    formData.get("caption_id") as string | undefined,
  );

  const row: Record<string, string | null> = {
    [imageUrlColumn]: url,
    user_id: userId,
    caption_id: captionId,
  };

  const { error } = await supabase.from("images").insert(row);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/admin/images");
  revalidatePath("/admin");
}

export async function updateImageAction(id: string, formData: FormData) {
  const supabase = await assertSuperAdmin();
  const urlRaw = (formData.get("url") as string | null) ?? "";
  const url = urlRaw.trim() === "" ? null : urlRaw.trim();
  const userId = emptyToNull(formData.get("user_id") as string | undefined);
  const captionId = emptyToNull(
    formData.get("caption_id") as string | undefined,
  );

  const row: Record<string, string | null> = {
    [imageUrlColumn]: url,
    user_id: userId,
    caption_id: captionId,
  };

  const { error } = await supabase.from("images").update(row).eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/admin/images");
  revalidatePath("/admin");
}

export async function deleteImageAction(id: string) {
  const supabase = await assertSuperAdmin();
  const { error } = await supabase.from("images").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath("/admin/images");
  revalidatePath("/admin");
}
