"use client";

import { useState, useTransition } from "react";
import {
  createImageAction,
  deleteImageAction,
  updateImageAction,
} from "@/app/admin/images/actions";
import type { ImageRow } from "@/lib/db/types";

type Props = {
  initialImages: ImageRow[];
};

export function ImageAdminPanel({ initialImages }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function run(action: () => Promise<void>) {
    setError(null);
    startTransition(() => {
      void (async () => {
        try {
          await action();
        } catch (e) {
          setError(e instanceof Error ? e.message : "Something went wrong");
        }
      })();
    });
  }

  return (
    <div className="space-y-8">
      {error ? (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
        <h2 className="text-lg font-medium text-zinc-50">Create image</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Inserts a row in <code className="text-zinc-400">images</code>. Use a
          public URL or storage path your app understands.
        </p>
        <form
          className="mt-4 grid gap-3 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            run(async () => {
              await createImageAction(fd);
              e.currentTarget.reset();
            });
          }}
        >
          <label className="block space-y-1 md:col-span-2">
            <span className="text-xs font-medium text-zinc-500">URL *</span>
            <input
              name="url"
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none ring-amber-500/40 focus:ring-2"
              placeholder="https://..."
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-zinc-500">User id</span>
            <input
              name="user_id"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none ring-amber-500/40 focus:ring-2"
              placeholder="profiles.id (uuid)"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-zinc-500">Caption id</span>
            <input
              name="caption_id"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none ring-amber-500/40 focus:ring-2"
              placeholder="captions.id (uuid)"
            />
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-amber-500/90 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-amber-400 disabled:opacity-50"
            >
              {pending ? "Saving…" : "Create"}
            </button>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-zinc-900/80 text-xs font-medium uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Preview</th>
              <th className="px-4 py-3">URL</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Caption</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80">
            {initialImages.map((img) => (
              <tr key={img.id} className="bg-zinc-950/40 align-top">
                <td className="px-4 py-3">
                  <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-zinc-900">
                    {img.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img.url}
                        alt=""
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center text-[10px] text-zinc-600">
                        —
                      </span>
                    )}
                  </div>
                </td>
                <td className="max-w-[220px] px-4 py-3">
                  {editingId === img.id ? (
                    <EditRow
                      image={img}
                      pending={pending}
                      onCancel={() => setEditingId(null)}
                      onSave={(fd) =>
                        run(async () => {
                          await updateImageAction(img.id, fd);
                          setEditingId(null);
                        })
                      }
                    />
                  ) : (
                    <p className="break-all font-mono text-[11px] text-zinc-400">
                      {img.url ?? "—"}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-[10px] text-zinc-500">
                  {img.user_id ?? "—"}
                </td>
                <td className="px-4 py-3 font-mono text-[10px] text-zinc-500">
                  {img.caption_id ?? "—"}
                </td>
                <td className="px-4 py-3 text-zinc-500">
                  {new Date(img.created_at).toLocaleString()}
                </td>
                <td className="space-y-2 px-4 py-3">
                  {editingId === img.id ? null : (
                    <>
                      <button
                        type="button"
                        onClick={() => setEditingId(img.id)}
                        className="block w-full rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300 hover:border-zinc-500"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            typeof window !== "undefined" &&
                            window.confirm("Delete this image row?")
                          ) {
                            run(async () => {
                              await deleteImageAction(img.id);
                            });
                          }
                        }}
                        className="block w-full rounded border border-red-500/40 px-2 py-1 text-xs text-red-300 hover:border-red-400"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function EditRow({
  image,
  pending,
  onCancel,
  onSave,
}: {
  image: ImageRow;
  pending: boolean;
  onCancel: () => void;
  onSave: (fd: FormData) => void;
}) {
  return (
    <form
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(new FormData(e.currentTarget));
      }}
    >
      <input
        name="url"
        defaultValue={image.url ?? ""}
        className="w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 font-mono text-[11px] text-zinc-100"
      />
      <input
        name="user_id"
        defaultValue={image.user_id ?? ""}
        placeholder="user_id"
        className="w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 font-mono text-[11px] text-zinc-100"
      />
      <input
        name="caption_id"
        defaultValue={image.caption_id ?? ""}
        placeholder="caption_id"
        className="w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 font-mono text-[11px] text-zinc-100"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-900 disabled:opacity-50"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-zinc-600 px-2 py-1 text-xs text-zinc-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
