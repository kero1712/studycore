import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import Crumb from "@/components/Crumb";
import { getSection } from "@/lib/data";

export default async function SectionPage({ params }: { params: { id: string; section: string } }) {
  const found = await getSection(Number(params.id), params.section);
  if (!found) notFound();
  const { subject, section, items } = found;
  return (
    <>
      <Crumb href={`/s/${subject.id}`}>الأقسام</Crumb>
      <div className="pghead">
        <span className="ic"><Icon name={section.icon} /></span>
        <h1>{section.name}</h1>
      </div>
      <div className="list">
        {items.length ? items.map((c) => (
          <div key={c.id} className={`row ${c.type === "video" ? "v" : ""}`}>
            <span className="ic"><Icon name={c.type === "video" ? "vid" : "pdf"} /></span>
            <span><b>{c.name}</b></span>
          </div>
        )) : <div className="empty">لا يوجد محتوى في هذا القسم بعد.</div>}
      </div>
    </>
  );
}
