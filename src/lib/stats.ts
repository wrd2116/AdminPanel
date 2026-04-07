import type { SupabaseClient } from "@supabase/supabase-js";
import { imageSelectFragment } from "@/lib/db/columns";
import { mapCaption, mapImageRow } from "@/lib/db/types";

export type DayCount = { date: string; count: number };

export type DashboardStats = {
  profilesTotal: number;
  superadminCount: number;
  profilesNew7d: number;
  imagesTotal: number;
  imagesNew7d: number;
  captionsTotal: number;
  imagesWithCaption: number;
  captionCoveragePct: number;
  avgImagesPerUser: number | null;
  uploadsByDay14: DayCount[];
  busiestDay: { date: string; count: number } | null;
  longestCaptionLen: number;
  recentImages: ReturnType<typeof mapImageRow>[];
};

function startIso(daysAgo: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

function emptyLastDays(days: number): DayCount[] {
  const out: DayCount[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    const date = d.toISOString().slice(0, 10);
    out.push({ date, count: 0 });
  }
  return out;
}

export async function getDashboardStats(
  supabase: SupabaseClient,
): Promise<DashboardStats> {
  const since7 = startIso(7);
  const since14 = startIso(14);
  const imageSel = imageSelectFragment();

  const [
    profilesCount,
    superadminRes,
    profiles7,
    imagesCount,
    images7,
    captionsCount,
    imagesWithCap,
    uploads14,
    captionSample,
    recentRes,
    taggedImagesRes,
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("is_superadmin", true),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since7),
    supabase.from("images").select("id", { count: "exact", head: true }),
    supabase
      .from("images")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since7),
    supabase.from("captions").select("id", { count: "exact", head: true }),
    supabase
      .from("images")
      .select("id", { count: "exact", head: true })
      .not("caption_id", "is", null),
    supabase
      .from("images")
      .select("created_at")
      .gte("created_at", since14),
    supabase.from("captions").select("*").limit(2000),
    supabase
      .from("images")
      .select(imageSel)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("images").select("user_id").not("user_id", "is", null),
  ]);

  const profilesTotal = profilesCount.count ?? 0;
  const superadminCount = superadminRes.count ?? 0;
  const profilesNew7d = profiles7.count ?? 0;
  const imagesTotal = imagesCount.count ?? 0;
  const imagesNew7d = images7.count ?? 0;
  const captionsTotal = captionsCount.count ?? 0;
  const imagesWithCaption = imagesWithCap.count ?? 0;
  const captionCoveragePct =
    imagesTotal > 0
      ? Math.round((imagesWithCaption / imagesTotal) * 1000) / 10
      : 0;

  const taggedRows = taggedImagesRes.data ?? [];
  const userIds = new Set(
    taggedRows
      .map((r) => r.user_id as string | null)
      .filter((id): id is string => Boolean(id)),
  );
  const taggedImageCount = taggedRows.length;
  const avgImagesPerUser =
    userIds.size > 0
      ? Math.round((taggedImageCount / userIds.size) * 10) / 10
      : null;

  const byDay = emptyLastDays(14);
  const dayIndex = new Map(byDay.map((d) => [d.date, d]));
  (uploads14.data ?? []).forEach((row) => {
    const raw = row.created_at as string | undefined;
    if (!raw) return;
    const key = raw.slice(0, 10);
    const bucket = dayIndex.get(key);
    if (bucket) bucket.count += 1;
  });

  let busiestDay: { date: string; count: number } | null = null;
  for (const d of byDay) {
    if (!busiestDay || d.count > busiestDay.count) busiestDay = { ...d };
  }
  if (busiestDay && busiestDay.count === 0) busiestDay = null;

  let longestCaptionLen = 0;
  (captionSample.data ?? []).forEach((row) => {
    const c = mapCaption(row as unknown as Record<string, unknown>);
    longestCaptionLen = Math.max(longestCaptionLen, (c.text ?? "").length);
  });

  const recentImages = (recentRes.data ?? []).map((r) =>
    mapImageRow(r as unknown as Record<string, unknown>),
  );

  return {
    profilesTotal,
    superadminCount,
    profilesNew7d,
    imagesTotal,
    imagesNew7d,
    captionsTotal,
    imagesWithCaption,
    captionCoveragePct,
    avgImagesPerUser,
    uploadsByDay14: byDay,
    busiestDay,
    longestCaptionLen,
    recentImages,
  };
}
