import Link from "next/link";
import { redirect } from "next/navigation";
import { GoogleSignIn } from "@/components/auth/google-sign-in";
import { createClient } from "@/lib/supabase/server";

type Props = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { next: nextPath, error } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(nextPath && nextPath.startsWith("/") ? nextPath : "/admin");
  }

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-950 px-6 py-16">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-10 shadow-2xl shadow-amber-500/5">
        <div className="space-y-2 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-400/90">
            AdminPanel
          </p>
          <h1 className="text-2xl font-semibold text-zinc-50">
            Sign in with Google
          </h1>
          <p className="text-sm text-zinc-400">
            Access is limited to superadmin profiles only.
          </p>
        </div>
        {error ? (
          <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-center text-sm text-red-200">
            Sign-in failed. Try again or contact an administrator.
          </p>
        ) : null}
        <GoogleSignIn />
        <p className="text-center text-xs text-zinc-500">
          <Link href="/" className="underline-offset-2 hover:text-zinc-300 hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
