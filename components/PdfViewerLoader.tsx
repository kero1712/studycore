"use client";
import dynamic from "next/dynamic";

// pdf.js يعمل في المتصفح فقط
const PdfViewer = dynamic(() => import("./PdfViewer"), { ssr: false, loading: () => <div className="empty">جاري التحميل...</div> });

export default function PdfViewerLoader({ src }: { src: string }) {
  return <PdfViewer src={src} />;
}
