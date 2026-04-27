import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/db/types";

export type SuperAdminContext = {
  user: User;
  profile: Pick<Profile, "id" | "email" | "is_superadmin">;
};

function isSuperAdminFlag(value: unknown): boolean {
  if (value === true) return true;
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  if (typeof value === "number") {
    return value === 1;
  }
  return false;
}

export async function requireSuperAdmin(): Promise<SuperAdminContext> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/admin");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, email, is_superadmin")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile || !isSuperAdminFlag(profile.is_superadmin)) {
    redirect("/forbidden");
  }

  return {
    user,
    profile: profile as SuperAdminContext["profile"],
  };
}

export type AuthProfileState =
  | { kind: "anonymous" }
  | {
      kind: "signed_in";
      user: User;
      profile: {
        email: string | null;
        is_superadmin: boolean | null;
      } | null;
      isSuperAdmin: boolean;
    };

export async function getAuthProfileState(): Promise<AuthProfileState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { kind: "anonymous" };
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("email, is_superadmin")
    .eq("id", user.id)
    .maybeSingle();
  const isSuperAdmin = isSuperAdminFlag(profile?.is_superadmin);
  return {
    kind: "signed_in",
    user,
    profile,
    isSuperAdmin,
  };
}
