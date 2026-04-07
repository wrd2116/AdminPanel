import { mapCaption } from "@/lib/db/types";
import { createClient } from "@/lib/supabase/server";

export default async function AdminCaptionsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("captions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  const rows = (data ?? []).map((r) =>
    mapCaption(r as unknown as Record<string, unknown>),
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-50">Captions</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Read-only transcript of caption rows — newest first (500 max on this
          screen).
        </p>
      </header>

      {error ? (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          Could not load captions: {error.message}
        </p>
      ) : null}

      <ul className="space-y-3">
        {rows.map((c) => (
          <li
            key={c.id}
            className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-mono text-[10px] text-zinc-500">{c.id}</p>
              <p className="text-xs text-zinc-500">
                {new Date(c.created_at).toLocaleString()}
              </p>
            </div>
            {c.image_id ? (
              <p className="mt-1 text-[10px] text-zinc-600">
                image_id:{" "}
                <span className="font-mono text-zinc-500">{c.image_id}</span>
              </p>
            ) : null}
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">
              {c.text ?? (
                <span className="italic text-zinc-600">Empty text</span>
              )}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
