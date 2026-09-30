"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await createSupabaseBrowser().auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return setErr("بيانات الدخول غير صحيحة");
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="narrow">
      <h2 style={{ marginTop: 14 }}>دخول المشرف</h2>
      {!configured ? (
        <div className="empty">لم تُضبط مفاتيح Supabase بعد. راجع ملف .env.example.</div>
      ) : (
        <form onSubmit={submit} className="box">
          <input dir="ltr" type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input dir="ltr" type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="btn" disabled={busy}>دخول</button>
          {err && <p style={{ color: "#B91C1C", margin: 0 }}>{err}</p>}
        </form>
      )}
    </div>
  );
}
