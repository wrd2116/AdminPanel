import { ImageAdminPanel } from "@/components/admin/image-admin-panel";
import { imageSelectFragment } from "@/lib/db/columns";
import { mapImageRow } from "@/lib/db/types";
import { createClient } from "@/lib/supabase/server";

export default async function AdminImagesPage() {
  const supabase = await createClient();
  const sel = imageSelectFragment();

  const { data, error } = await supabase
    .from("images")
    .select(sel)
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = (data ?? []).map((r) =>
    mapImageRow(r as unknown as Record<string, unknown>),
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-50">Images</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Create, update, and delete rows in{" "}
          <code className="text-zinc-400">images</code>. Showing latest 200.
        </p>
      </header>

      {error ? (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          Could not load images: {error.message}
        </p>
      ) : null}

      <ImageAdminPanel initialImages={rows} />
    </div>
  );
}
