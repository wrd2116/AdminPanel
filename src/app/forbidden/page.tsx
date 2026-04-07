import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { getAuthProfileState } from "@/lib/auth/superadmin";

export default async function ForbiddenPage() {
  const state = await getAuthProfileState();

  if (state.kind === "anonymous") {
    redirect("/login");
  }

  if (state.isSuperAdmin) {
    redirect("/admin");
  }

  const email = state.profile?.email ?? state.user.email ?? null;

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-950 px-6 py-16 text-zinc-100">
      <div className="max-w-md space-y-6 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-400/90">
          Access denied
        </p>
        <h1 className="text-2xl font-semibold">Not a superadmin</h1>
        <p className="text-sm text-zinc-400">
          Google sign-in worked, but your profile does not have{" "}
          <code className="rounded bg-zinc-900 px-1.5 py-0.5 text-amber-200/90">
            is_superadmin = true
          </code>
          . Ask a database admin to update your row in{" "}
          <code className="text-zinc-300">profiles</code>.
        </p>
        {email ? (
          <p className="text-xs text-zinc-500">
            Signed in as <span className="text-zinc-300">{email}</span>
          </p>
        ) : null}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <SignOutButton />
          <Link
            href="/"
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-500"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
