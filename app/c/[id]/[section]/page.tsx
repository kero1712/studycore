import Link from "next/link";
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
        {items.length ? items.map((c) => {
          const inner = (
            <>
              <span className="ic"><Icon name={c.type === "video" ? "vid" : "pdf"} /></span>
              <span><b dir="auto">{c.name}</b><small>{c.type === "pdf" ? "PDF" : c.type === "video" ? "فيديو" : "رابط"}</small></span>
              <span className="go"><Icon name="go" /></span>
            </>
          );
          const cls = `row ${c.type === "video" ? "v" : ""}`;
          return c.type === "link"
            ? <a key={c.id} href={c.url} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
            : <Link key={c.id} href={`/view/${c.id}`} className={cls}>{inner}</Link>;
        }) : <div className="empty">لا يوجد محتوى في هذا القسم بعد.</div>}
      </div>
    </>
  );
}
