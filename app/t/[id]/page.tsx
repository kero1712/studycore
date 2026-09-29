import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import Crumb from "@/components/Crumb";
import { terms, subjects } from "@/data/catalog";

export default function TermPage({ params }: { params: { id: string } }) {
  const term = terms.find((t) => t.id === Number(params.id));
  if (!term) notFound();
  const list = subjects.filter((s) => s.termId === term.id);
  return (
    <div className="narrow">
      <Crumb href="/">الرئيسية</Crumb>
      <h2 style={{ marginTop: 8 }}>اختر المادة</h2>
      <span className="tag">{term.name}</span>
      <div className="list subs">
        {list.map((s) => (
          <Link key={s.id} href={`/s/${s.id}`} className="row sub">
            <span className="ic"><Icon name={s.icon} /></span>
            <b dir="auto">{s.name}</b>
            <span className="go"><Icon name="go" /></span>
          </Link>
        ))}
      </div>
    </div>
  );
}
