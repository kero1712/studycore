import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import Crumb from "@/components/Crumb";
import { subjects, sections, content } from "@/data/catalog";
import { ar } from "@/lib/ar";

export default function SubjectPage({ params }: { params: { id: string } }) {
  const sub = subjects.find((s) => s.id === Number(params.id));
  if (!sub) notFound();
  return (
    <>
      <Crumb href={`/t/${sub.termId}`}>المواد</Crumb>
      <div className="pghead">
        <span className="ic"><Icon name={sub.icon} /></span>
        <h1 dir="auto">{sub.name}</h1>
      </div>
      <p style={{ color: "var(--mu)", margin: "0 0 14px" }}>اختر ما تحتاجه</p>
      <div className="bento c">
        {sections.map((x) => (
          <Link key={x.slug} href={`/c/${sub.id}/${x.slug}`} className="tile sc">
            <span className={`ic ${x.group}`}><Icon name={x.icon} /></span>
            <span className="go"><Icon name="go" /></span>
            <span className="tx">
              <h3>{x.name}</h3>
              <small>{ar(content.filter((c) => c.subjectId === sub.id && c.section === x.slug).length)} عناصر</small>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
