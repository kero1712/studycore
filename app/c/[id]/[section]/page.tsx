import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import Crumb from "@/components/Crumb";
import { subjects, sections, content } from "@/data/catalog";

export default function SectionPage({ params }: { params: { id: string; section: string } }) {
  const sub = subjects.find((s) => s.id === Number(params.id));
  const sec = sections.find((x) => x.slug === params.section);
  if (!sub || !sec) notFound();
  const items = content.filter((c) => c.subjectId === sub.id && c.section === sec.slug);
  return (
    <>
      <Crumb href={`/s/${sub.id}`}>الأقسام</Crumb>
      <div className="pghead">
        <span className="ic"><Icon name={sec.icon} /></span>
        <h1>{sec.name}</h1>
      </div>
      <div className="list">
        {items.length ? items.map((c) => (
          <div key={c.id} className={`row ${c.kind === "video" ? "v" : ""}`}>
            <span className="ic"><Icon name={c.kind === "video" ? "vid" : "pdf"} /></span>
            <span><b>{c.title}</b></span>
          </div>
        )) : <div className="empty">لا يوجد محتوى في هذا القسم بعد.</div>}
      </div>
    </>
  );
}
