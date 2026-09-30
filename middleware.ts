import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// يحمي كل /admin ما عدا صفحة الدخول: يتطلب مستخدمًا مسجّلًا موجودًا في admin_users.
export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/admin/login") return NextResponse.next();
  const login = () => NextResponse.redirect(new URL("/admin/login", req.url));
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return login();

  let res = NextResponse.next({ request: req });
  const sb = createServerClient(url, key, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({ request: req });
        list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return login();
  const { data: row } = await sb.from("admin_users").select("role").eq("user_id", user.id).maybeSingle();
  if (!row) return login();
  return res;
}

export const config = { matcher: ["/admin/:path*"] };
