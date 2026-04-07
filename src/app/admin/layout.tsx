import { AdminShell } from "@/components/admin/admin-shell";
import { requireSuperAdmin } from "@/lib/auth/superadmin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireSuperAdmin();

  return (
    <AdminShell
      displayName={profile.full_name ?? profile.email ?? "Superadmin"}
      email={profile.email}
    >
      {children}
    </AdminShell>
  );
}
