import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import Crumb from "@/components/Crumb";
import PdfViewerLoader from "@/components/PdfViewerLoader";
import { getContentItem } from "@/lib/data";
import { pdfProxyPath } from "@/lib/pdf";
import { videoEmbedUrl } from "@/lib/embed";

export default async function ViewPage({ params }: { params: { id: string } }) {
  const found = await getContentItem(params.id);
  if (!found || found.item.type === "link") notFound();
  const { item, subject, section } = found;
  const embed = item.type === "video" ? videoEmbedUrl(item.url) : null;
  return (
    <>
      <Crumb href={`/c/${subject.id}/${section.id}`}>{section.name}</Crumb>
      <div className="pghead">
        <span className="ic"><Icon name={item.type === "video" ? "vid" : "pdf"} /></span>
        <h1 dir="auto" style={{ fontSize: "clamp(28px,6vw,40px)" }}>{item.name}</h1>
      </div>
      {item.type === "pdf" ? (
        <PdfViewerLoader src={pdfProxyPath(item.id)} />
      ) : embed ? (
        <iframe className="vidframe" src={embed} title={item.name} allowFullScreen allow="fullscreen; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" />
      ) : (
        <div className="empty">تعذّر تشغيل هذا الفيديو.</div>
      )}
    </>
  );
}
