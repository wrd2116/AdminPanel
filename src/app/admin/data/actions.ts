"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAdminDataConfigByTable } from "@/lib/admin/data-config";

function isSuperAdminFlag(value: unknown): boolean {
  return value === true || value === "true" || value === 1;
}

async function assertSuperAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("is_superadmin")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !isSuperAdminFlag(profile?.is_superadmin)) {
    throw new Error("Forbidden");
  }
  return supabase;
}

function parseJsonObject(input: string): Record<string, unknown> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch {
    throw new Error("Payload must be valid JSON.");
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Payload must be a JSON object.");
  }
  return parsed as Record<string, unknown>;
}

function assertWritableTable(table: string, requireDelete = false) {
  const cfg = getAdminDataConfigByTable(table);
  if (!cfg) throw new Error("Table is not allowlisted.");
  if (cfg.mode === "read") throw new Error("Table is read-only.");
  if (requireDelete && cfg.mode !== "crud") {
    throw new Error("Delete is only allowed on CRUD tables.");
  }
  return cfg;
}

function sanitizePayload(input: Record<string, unknown>) {
  const next = { ...input };
  delete next.id;
  return next;
}

export async function createRowAction(
  table: string,
  payloadJson: string,
  revalidatePathname: string,
) {
  const cfg = assertWritableTable(table);
  const supabase = await assertSuperAdmin();
  const row = sanitizePayload(parseJsonObject(payloadJson));
  const { error } = await supabase.from(cfg.table).insert(row);
  if (error) throw new Error(error.message);
  revalidatePath(revalidatePathname);
}

export async function updateRowAction(
  table: string,
  id: string,
  payloadJson: string,
  revalidatePathname: string,
) {
  const cfg = assertWritableTable(table);
  const supabase = await assertSuperAdmin();
  const row = sanitizePayload(parseJsonObject(payloadJson));
  const { error } = await supabase.from(cfg.table).update(row).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(revalidatePathname);
}

export async function deleteRowAction(
  table: string,
  id: string,
  revalidatePathname: string,
) {
  const cfg = assertWritableTable(table, true);
  const supabase = await assertSuperAdmin();
  const { error } = await supabase.from(cfg.table).delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(revalidatePathname);
}
