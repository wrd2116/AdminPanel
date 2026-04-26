import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getFirst(value: string | string[] | undefined): string | null {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value.length > 0) return value[0] ?? null;
  return null;
}

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  const code = getFirst(params.code);
  if (code) {
    const next = getFirst(params.next);
    const qs = new URLSearchParams({ code });
    if (next) qs.set("next", next);
    redirect(`/auth/callback?${qs.toString()}`);
  }
  redirect("/admin");
}
