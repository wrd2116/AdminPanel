/**
 * Shape hints for the existing database. Adjust types when you run
 * `supabase gen types typescript --project-id ...` and merge.
 */

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  is_superadmin: boolean | null;
  avatar_url: string | null;
  created_at: string;
  updated_at?: string | null;
};

export type ImageRow = {
  id: string;
  created_at: string;
  updated_at: string | null;
  user_id: string | null;
  caption_id: string | null;
  /** Resolved public URL field (see `imageUrlColumn`). */
  url: string | null;
};

export type Caption = {
  id: string;
  created_at: string;
  /** Resolved text field (see `captionTextColumn`). */
  text: string | null;
  image_id?: string | null;
};

export function mapImageRow(raw: Record<string, unknown>): ImageRow {
  const urlKey = process.env.NEXT_PUBLIC_IMAGE_URL_COLUMN ?? "url";
  const url =
    (raw[urlKey] as string | null | undefined) ??
    (raw.url as string | null | undefined) ??
    null;
  return {
    id: String(raw.id),
    created_at: String(raw.created_at),
    updated_at: (raw.updated_at as string | null) ?? null,
    user_id: (raw.user_id as string | null) ?? null,
    caption_id: (raw.caption_id as string | null) ?? null,
    url,
  };
}

export function mapCaption(raw: Record<string, unknown>): Caption {
  const textKey = process.env.NEXT_PUBLIC_CAPTION_TEXT_COLUMN ?? "text";
  const text =
    (raw[textKey] as string | null | undefined) ??
    (raw.text as string | null | undefined) ??
    null;
  return {
    id: String(raw.id),
    created_at: String(raw.created_at),
    text,
    image_id: (raw.image_id as string | null) ?? undefined,
  };
}
