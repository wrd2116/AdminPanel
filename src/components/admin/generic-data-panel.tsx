"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createRowAction,
  deleteRowAction,
  updateRowAction,
} from "@/app/admin/data/actions";
import type { DataMode } from "@/lib/admin/data-config";

type Props = {
  table: string;
  mode: DataMode;
  path: string;
  initialRows: Record<string, unknown>[];
};

function pretty(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function getId(row: Record<string, unknown>): string | null {
  const raw = row.id;
  if (typeof raw === "string") return raw;
  if (typeof raw === "number") return String(raw);
  return null;
}

export function GenericDataPanel({ table, mode, path, initialRows }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [createJson, setCreateJson] = useState("{}");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const router = useRouter();

  const canCreate = mode === "crud";
  const canUpdate = mode === "update" || mode === "crud";
  const canDelete = mode === "crud";

  const rowDrafts = useMemo(() => {
    const out: Record<string, string> = { ...drafts };
    initialRows.forEach((row) => {
      const id = getId(row);
      if (!id) return;
      if (!(id in out)) out[id] = pretty(row);
    });
    return out;
  }, [drafts, initialRows]);

  function run(task: () => Promise<void>) {
    setError(null);
    startTransition(() => {
      void (async () => {
        try {
          await task();
          router.refresh();
        } catch (e) {
          setError(e instanceof Error ? e.message : "Unexpected error");
        }
      })();
    });
  }

  return (
    <div className="space-y-5">
      {error ? (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      {canCreate ? (
        <section className="space-y-2 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
          <h2 className="text-sm font-medium text-zinc-100">Create row</h2>
          <p className="text-xs text-zinc-500">
            Provide a JSON object with the columns to insert. Do not include{" "}
            <code className="text-zinc-400">id</code>.
          </p>
          <textarea
            value={createJson}
            onChange={(e) => setCreateJson(e.target.value)}
            rows={8}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 font-mono text-xs text-zinc-200 outline-none ring-amber-500/40 focus:ring-2"
          />
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => createRowAction(table, createJson, path))}
            className="rounded-lg bg-amber-500/90 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-amber-400 disabled:opacity-50"
          >
            Create
          </button>
        </section>
      ) : null}

      <section className="space-y-3">
        {initialRows.length === 0 ? (
          <p className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 text-sm text-zinc-500">
            No rows found.
          </p>
        ) : null}
        {initialRows.map((row) => {
          const id = getId(row);
          const key = id ?? pretty(row);
          return (
            <article
              key={key}
              className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-[11px] text-zinc-400">
                  {id ? `id: ${id}` : "id: (none)"}
                </p>
              </div>
              <textarea
                value={id ? rowDrafts[id] ?? pretty(row) : pretty(row)}
                onChange={(e) => {
                  if (!id) return;
                  setDrafts((prev) => ({ ...prev, [id]: e.target.value }));
                }}
                disabled={!canUpdate || !id}
                rows={10}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 font-mono text-xs text-zinc-200 outline-none ring-amber-500/40 focus:ring-2 disabled:opacity-75"
              />
              {canUpdate || canDelete ? (
                <div className="flex gap-2">
                  {canUpdate ? (
                    <button
                      type="button"
                      disabled={pending || !id}
                      onClick={() => {
                        if (!id) return;
                        const payload = rowDrafts[id] ?? pretty(row);
                        run(() => updateRowAction(table, id, payload, path));
                      }}
                      className="rounded border border-zinc-600 px-3 py-1.5 text-xs text-zinc-200 hover:border-zinc-400 disabled:opacity-50"
                    >
                      Update
                    </button>
                  ) : null}
                  {canDelete ? (
                    <button
                      type="button"
                      disabled={pending || !id}
                      onClick={() => {
                        if (!id) return;
                        if (!window.confirm("Delete this row?")) return;
                        run(() => deleteRowAction(table, id, path));
                      }}
                      className="rounded border border-red-500/40 px-3 py-1.5 text-xs text-red-300 hover:border-red-400 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  ) : null}
                </div>
              ) : null}
            </article>
          );
        })}
      </section>
    </div>
  );
}
