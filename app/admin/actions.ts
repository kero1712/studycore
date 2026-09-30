"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/admin";
import { createSupabaseServer } from "@/lib/supabase/server";
import { SECTION_TEMPLATES } from "@/data/section-templates";

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const ck = (error: { message: string } | null) => { if (error) throw new Error(error.message); };
const done = () => revalidatePath("/admin", "layout");

// ترتيب: نعيد ترقيم الإخوة 1..n بعد تبديل الموضع
async function reorder(sb: SupabaseClient, table: string, parentCol: string, parentId: string | number, id: string, dir: string) {
  const { data, error } = await sb.from(table).select("id").eq(parentCol, parentId).order("sort_order").order("id");
  ck(error);
  const ids: (string | number)[] = ((data ?? []) as { id: string | number }[]).map((r) => r.id);
  const i = ids.findIndex((x: string | number) => String(x) === id);
  const j = dir === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  await Promise.all(ids.map((x: string | number, k: number) => sb.from(table).update({ sort_order: k + 1 }).eq("id", x)));
}

async function nextOrder(sb: SupabaseClient, table: string, col: string, parent: string | number) {
  const { data } = await sb.from(table).select("sort_order").eq(col, parent).order("sort_order", { ascending: false }).limit(1);
  return ((data?.[0]?.sort_order as number | undefined) ?? 0) + 1;
}

export async function addSubject(fd: FormData) {
  const sb = await requireAdmin();
  const term_id = Number(str(fd, "term_id")), name = str(fd, "name"), icon = str(fd, "icon") || "book";
  if (!name || !term_id) return;
  const { data: sub, error } = await sb.from("subjects").insert({ term_id, name, icon, sort_order: await nextOrder(sb, "subjects", "term_id", term_id) }).select("id").single();
  ck(error);
  const r = await sb.from("sections").insert(SECTION_TEMPLATES.map((t) => ({ subject_id: sub!.id, name: t.name, icon: t.icon, sort_order: t.order })));
  ck(r.error);
  done();
}
export async function updateSubject(fd: FormData) {
  const sb = await requireAdmin();
  ck((await sb.from("subjects").update({ name: str(fd, "name"), icon: str(fd, "icon") }).eq("id", str(fd, "id"))).error);
  done();
}
export async function deleteSubject(fd: FormData) {
  const sb = await requireAdmin();
  ck((await sb.from("subjects").delete().eq("id", str(fd, "id"))).error);
  done();
}
export async function moveSubject(fd: FormData) {
  const sb = await requireAdmin();
  await reorder(sb, "subjects", "term_id", str(fd, "term_id"), str(fd, "id"), str(fd, "dir"));
  done();
}
export async function toggleSubject(fd: FormData) {
  const sb = await requireAdmin();
  ck((await sb.from("subjects").update({ is_published: str(fd, "published") !== "true" }).eq("id", str(fd, "id"))).error);
  done();
}

const TYPES = ["pdf", "video", "link"];
export async function addContent(fd: FormData) {
  const sb = await requireAdmin();
  const section_id = Number(str(fd, "section_id")), name = str(fd, "name"), url = str(fd, "url"), type = str(fd, "type");
  if (!section_id || !name || !url || !TYPES.includes(type)) return;
  ck((await sb.from("content_items").insert({ section_id, name, url, type, drive_url: str(fd, "drive_url") || null, sort_order: await nextOrder(sb, "content_items", "section_id", section_id) })).error);
  done();
}
export async function updateContent(fd: FormData) {
  const sb = await requireAdmin();
  const type = str(fd, "type");
  if (!TYPES.includes(type)) return;
  ck((await sb.from("content_items").update({ name: str(fd, "name"), url: str(fd, "url"), type, drive_url: str(fd, "drive_url") || null }).eq("id", str(fd, "id"))).error);
  done();
}
export async function deleteContent(fd: FormData) {
  const sb = await requireAdmin();
  ck((await sb.from("content_items").delete().eq("id", str(fd, "id"))).error);
  done();
}
export async function moveContent(fd: FormData) {
  const sb = await requireAdmin();
  await reorder(sb, "content_items", "section_id", str(fd, "section_id"), str(fd, "id"), str(fd, "dir"));
  done();
}
export async function toggleContent(fd: FormData) {
  const sb = await requireAdmin();
  ck((await sb.from("content_items").update({ is_published: str(fd, "published") !== "true" }).eq("id", str(fd, "id"))).error);
  done();
}

export async function signOut() {
  await createSupabaseServer().auth.signOut();
  redirect("/admin/login");
}
