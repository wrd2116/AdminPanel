import { notFound } from "next/navigation";
import { GenericDataPanel } from "@/components/admin/generic-data-panel";
import { getAdminDataConfig } from "@/lib/admin/data-config";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function AdminDataPage({ params }: Props) {
  const { slug } = await params;
  const config = getAdminDataConfig(slug);
  if (!config) {
    notFound();
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from(config.table).select("*").limit(200);
  const rows = (data ?? []) as Record<string, unknown>[];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-50">{config.label}</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {config.description} Showing up to 200 rows.
        </p>
      </header>

      {error ? (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          Could not load {config.table}: {error.message}
        </p>
      ) : null}

      <GenericDataPanel
        table={config.table}
        mode={config.mode}
        path={`/admin/data/${config.slug}`}
        initialRows={rows}
      />
    </div>
  );
}
