import { redirect } from "next/navigation";
import { createSupabaseServer } from "./supabase/server";

// تحقق من الأدمن داخل كل صفحة/Action (طبقة ثانية بعد الـmiddleware؛ الحماية الفعلية للكتابة هي RLS).
export async function requireAdmin() {
  const sb = createSupabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: row } = await sb.from("admin_users").select("role").eq("user_id", user.id).maybeSingle();
  if (!row) redirect("/admin/login");
  return sb;
}
