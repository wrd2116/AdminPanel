import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getDashboardStats } from "@/lib/stats";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const stats = await getDashboardStats(supabase);

  const maxUpload =
    stats.uploadsByDay14.reduce((m, d) => Math.max(m, d.count), 0) || 1;

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">
          Operations overview
        </h1>
        <p className="max-w-2xl text-sm text-zinc-400">
          Live snapshot of people, media, and narrative coverage. Bars are
          upload cadence; cards blend scale with freshness so you can spot
          drift quickly.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Profiles"
          value={stats.profilesTotal}
          subtitle={`+${stats.profilesNew7d} in last 7 days`}
          accent="from-violet-500/25 to-transparent"
        />
        <StatCard
          title="Superadmins"
          value={stats.superadminCount}
          subtitle="Gatekeepers of this panel"
          accent="from-amber-500/25 to-transparent"
        />
        <StatCard
          title="Images"
          value={stats.imagesTotal}
          subtitle={`+${stats.imagesNew7d} this week`}
          accent="from-sky-500/25 to-transparent"
        />
        <StatCard
          title="Caption coverage"
          value={`${stats.captionCoveragePct}%`}
          subtitle={`${stats.imagesWithCaption} of ${stats.imagesTotal} linked`}
          accent="from-emerald-500/25 to-transparent"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-medium text-zinc-50">
                Upload rhythm
              </h2>
              <p className="text-sm text-zinc-500">
                Daily image creates — last 14 days (UTC)
              </p>
            </div>
            {stats.busiestDay ? (
              <div className="text-right text-xs text-zinc-500">
                <p className="font-medium text-amber-300/90">Busiest day</p>
                <p>
                  {stats.busiestDay.date}{" "}
                  <span className="text-zinc-400">
                    · {stats.busiestDay.count} uploads
                  </span>
                </p>
              </div>
            ) : null}
          </div>
          <div className="flex h-40 items-end gap-1">
            {stats.uploadsByDay14.map((d) => (
              <div key={d.date} className="group flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-amber-600/80 to-amber-400/30 transition group-hover:from-amber-500 group-hover:to-amber-300/50"
                  style={{
                    height: `${Math.max(8, (d.count / maxUpload) * 100)}%`,
                    minHeight: d.count ? 6 : 2,
                  }}
                  title={`${d.date}: ${d.count}`}
                />
                <span className="hidden text-[9px] text-zinc-600 group-hover:block">
                  {d.date.slice(5)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 className="text-lg font-medium text-zinc-50">Story metrics</h2>
          <ul className="space-y-4 text-sm text-zinc-400">
            <li className="flex justify-between gap-2 border-b border-zinc-800/80 pb-3">
              <span>Captions stored</span>
              <span className="font-mono text-zinc-200">{stats.captionsTotal}</span>
            </li>
            <li className="flex justify-between gap-2 border-b border-zinc-800/80 pb-3">
              <span>Longest caption (sample)</span>
              <span className="font-mono text-zinc-200">
                {stats.longestCaptionLen} chars
              </span>
            </li>
            <li className="flex justify-between gap-2 border-b border-zinc-800/80 pb-3">
              <span>Avg images / attributed user</span>
              <span className="font-mono text-zinc-200">
                {stats.avgImagesPerUser ?? "—"}
              </span>
            </li>
            <li className="flex justify-between gap-2">
              <span>Orphan caption coverage</span>
              <span className="text-xs text-zinc-500">
                {100 - stats.captionCoveragePct > 0
                  ? `${(100 - stats.captionCoveragePct).toFixed(1)}% without link`
                  : "All sampled images linked"}
              </span>
            </li>
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-lg font-medium text-zinc-50">Latest images</h2>
          <Link
            href="/admin/images"
            className="text-sm text-amber-400/90 hover:text-amber-300"
          >
            Manage images →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.recentImages.map((img) => (
            <article
              key={img.id}
              className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/30"
            >
              <div className="relative aspect-square bg-zinc-900">
                {img.url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- admin sources may be arbitrary URLs
                  <img
                    src={img.url}
                    alt=""
                    className="absolute inset-0 size-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-zinc-600">
                    No URL
                  </div>
                )}
              </div>
              <div className="space-y-1 p-3 text-xs text-zinc-500">
                <p className="truncate font-mono text-[10px] text-zinc-400">
                  {img.id}
                </p>
                <p>{new Date(img.created_at).toLocaleString()}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  accent,
}: {
  title: string;
  value: number | string;
  subtitle: string;
  accent: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br ${accent} p-5`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {title}
      </p>
      <p className="mt-3 text-3xl font-semibold tabular-nums text-zinc-50">
        {value}
      </p>
      <p className="mt-2 text-sm text-zinc-400">{subtitle}</p>
    </div>
  );
}
