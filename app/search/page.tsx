"use client";
import { useState } from "react";
import Icon from "@/components/Icon";
import { content } from "@/data/catalog";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const v = q.trim();
  const results = v ? content.filter((c) => c.title.includes(v)).slice(0, 20) : [];
  return (
    <>
      <h2 style={{ marginTop: 14 }}>ابحث عن محتوى</h2>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="اكتب اسم المحاضرة أو الملف..." autoFocus />
      <div className="list">
        {results.map((c) => (
          <div key={c.id} className={`row ${c.kind === "video" ? "v" : ""}`}>
            <span className="ic"><Icon name={c.kind === "video" ? "vid" : "pdf"} /></span>
            <span><b>{c.title}</b></span>
          </div>
        ))}
        {v && !results.length && <div className="empty">لا توجد نتائج. جرّب كلمة أقصر.</div>}
      </div>
    </>
  );
}
