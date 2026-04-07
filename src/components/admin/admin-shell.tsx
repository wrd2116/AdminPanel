import Link from "next/link";
import { SignOutButton } from "@/components/auth/sign-out-button";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/images", label: "Images" },
  { href: "/admin/captions", label: "Captions" },
];

type Props = {
  children: React.ReactNode;
  displayName: string;
  email: string | null;
};

export function AdminShell({ children, displayName, email }: Props) {
  return (
    <div className="flex min-h-full flex-1 bg-zinc-950 text-zinc-100">
      <aside className="flex w-56 flex-col border-r border-zinc-800/80 bg-zinc-950/95 px-4 py-6">
        <div className="mb-8 px-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-400/90">
            Control
          </p>
          <p className="mt-1 text-lg font-semibold tracking-tight text-zinc-50">
            AdminPanel
          </p>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-3 border-t border-zinc-800/80 pt-4">
          <div className="px-2 text-xs text-zinc-500">
            <p className="truncate font-medium text-zinc-300">{displayName}</p>
            {email ? <p className="truncate">{email}</p> : null}
          </div>
          <SignOutButton />
        </div>
      </aside>
      <div className="flex min-h-full flex-1 flex-col">
        <main className="flex-1 overflow-auto px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
