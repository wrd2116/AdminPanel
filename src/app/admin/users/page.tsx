import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/db/types";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as Profile[];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-50">Users & profiles</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Read-only directory of every profile row. Editing happens in your
          database or primary product.
        </p>
      </header>

      {error ? (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          Could not load profiles: {error.message}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-zinc-900/80 text-xs font-medium uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Superadmin</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3 font-mono text-[10px]">id</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80">
            {rows.map((p) => (
              <tr key={p.id} className="bg-zinc-950/40 hover:bg-zinc-900/40">
                <td className="px-4 py-3 text-zinc-200">{p.email ?? "—"}</td>
                <td className="px-4 py-3 text-zinc-300">{p.full_name ?? "—"}</td>
                <td className="px-4 py-3">
                  {p.is_superadmin ? (
                    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-300">
                      Yes
                    </span>
                  ) : (
                    <span className="text-zinc-600">No</span>
                  )}
                </td>
                <td className="px-4 py-3 text-zinc-500">
                  {p.created_at
                    ? new Date(p.created_at).toLocaleDateString()
                    : "—"}
                </td>
                <td className="max-w-[120px] truncate px-4 py-3 font-mono text-[10px] text-zinc-500">
                  {p.id}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
