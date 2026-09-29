import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import Crumb from "@/components/Crumb";
import { getSubject } from "@/lib/data";
import { ar } from "@/lib/ar";

export default async function SubjectPage({ params }: { params: { id: string } }) {
  const found = await getSubject(Number(params.id));
  if (!found) notFound();
  const { term, subject } = found;
  return (
    <>
      <Crumb href={`/t/${term.id}`}>المواد</Crumb>
      <div className="pghead">
        <span className="ic"><Icon name={subject.icon} /></span>
        <h1 dir="auto">{subject.name}</h1>
      </div>
      <p style={{ color: "var(--mu)", margin: "0 0 14px" }}>اختر ما تحتاجه</p>
      <div className="bento c">
        {subject.sections.map((x) => (
          <Link key={x.id} href={`/c/${subject.id}/${x.id}`} className="tile sc">
            <span className={`ic ${x.tone}`}><Icon name={x.icon} /></span>
            <span className="go"><Icon name="go" /></span>
            <span className="tx">
              <h3>{x.name}</h3>
              <small>{ar(x.contentItems.length)} عناصر</small>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
