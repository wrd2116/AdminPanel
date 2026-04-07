/** Map env to your Supabase column names without code edits. */

export const imageUrlColumn =
  process.env.NEXT_PUBLIC_IMAGE_URL_COLUMN ?? "url";

export const captionTextColumn =
  process.env.NEXT_PUBLIC_CAPTION_TEXT_COLUMN ?? "text";

export function imageSelectFragment(): string {
  return `id, created_at, updated_at, user_id, caption_id, ${imageUrlColumn}`;
}
