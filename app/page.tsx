import Link from "next/link";
import Icon from "@/components/Icon";
import { ART_INNER } from "@/lib/svg";
import { getTerms } from "@/lib/data";
import { ar } from "@/lib/ar";

export default async function Home() {
  const terms = await getTerms();
  return (
    <>
      <section className="hero">
        <div>
          <span className="fac">كلية الحاسبات والمعلومات والذكاء الاصطناعي</span>
          <h1>Study<span>Core</span></h1>
          <p>كل محاضراتك وسكاشنك وملخصاتك وامتحاناتك في مكان واحد.</p>
        </div>
        <svg className="art" viewBox="0 0 340 300" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ART_INNER }} />
      </section>
      <h2>اختر الترم الدراسي</h2>
      <div className="terms">
        {terms.map((t) => (
          <Link key={t.id} href={`/t/${t.id}`} className={`term t${t.id}`}>
            <span className="n">{ar(t.id)}</span>
            <span className="go"><Icon name="go" /></span>
            <small>{ar(t.subjects.length)} مواد</small>
            <h3>{t.name}</h3>
          </Link>
        ))}
      </div>
    </>
  );
}
