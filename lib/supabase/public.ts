import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// عميل القراءة العامة (للطلاب). يرجع null إذا لم تُضبط المفاتيح، فيعمل الموقع بالبيانات الثابتة.
export function getPublicClient() {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
}
