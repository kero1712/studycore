import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { signOut } from "@/app/admin/actions";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div>
      <nav className="arow" style={{ margin: "14px 0" }}>
        <Link href="/admin" className="btn sm">لوحة التحكم</Link>
        <Link href="/admin/subjects" className="btn sm">المواد</Link>
        <form action={signOut} style={{ marginInlineStart: "auto" }}><button className="btn sm gh">خروج</button></form>
      </nav>
      {children}
    </div>
  );
}
