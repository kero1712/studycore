"use client";
import { useState } from "react";
import Link from "next/link";
import Icon from "./Icon";
import type { SearchEntry } from "@/lib/data";

export default function SearchClient({ index }: { index: SearchEntry[] }) {
  const [q, setQ] = useState("");
  const v = q.trim();
  const results = v ? index.filter((c) => c.name.includes(v)).slice(0, 20) : [];
  return (
    <>
      <h2 style={{ marginTop: 14 }}>ابحث عن محتوى</h2>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="اكتب اسم المحاضرة أو الملف..." autoFocus />
      <div className="list">
        {results.map((c) => {
          const inner = (
            <>
              <span className="ic"><Icon name={c.type === "video" ? "vid" : "pdf"} /></span>
              <span><b dir="auto">{c.name}</b></span>
              <span className="go"><Icon name="go" /></span>
            </>
          );
          const cls = `row ${c.type === "video" ? "v" : ""}`;
          return c.type === "link"
            ? <a key={c.id} href={c.url} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
            : <Link key={c.id} href={`/view/${c.id}`} className={cls}>{inner}</Link>;
        })}
        {v && !results.length && <div className="empty">لا توجد نتائج. جرّب كلمة أقصر.</div>}
      </div>
    </>
  );
}
