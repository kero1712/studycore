"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ar } from "@/lib/ar";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

export default function PdfViewer({ src }: { src: string }) {
  const box = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [w, setW] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const go = useCallback((d: number) => setPage((p) => Math.min(Math.max(1, p + d), pages || 1)), [pages]);

  return (
    <div ref={box} className="pdfbox">
      <div className="bar">
        <button onClick={() => go(-1)} disabled={page <= 1} aria-label="الصفحة السابقة">‹</button>
        <span>{ar(page)} / {pages ? ar(pages) : "…"}</span>
        <button onClick={() => go(1)} disabled={!pages || page >= pages} aria-label="الصفحة التالية">›</button>
        <button className="o" onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))} aria-label="تصغير">−</button>
        <button className="o" onClick={() => setZoom((z) => Math.min(3, z + 0.25))} aria-label="تكبير">+</button>
        <button onClick={() => box.current?.requestFullscreen?.()} aria-label="ملء الشاشة">⛶</button>
      </div>
      <div ref={wrap} className="pdfwrap">
        {failed ? (
          <div className="empty">تعذّر فتح الملف حاليًا.</div>
        ) : (
          <div style={{ width: "max-content", margin: "0 auto" }}>
            <Document
              file={src}
              onLoadSuccess={({ numPages }) => { setPages(numPages); setPage(1); }}
              onLoadError={() => setFailed(true)}
              loading={<div className="empty">جاري التحميل...</div>}
            >
              <Page pageNumber={page} width={Math.max(220, w * zoom)} renderTextLayer={false} renderAnnotationLayer={false} />
            </Document>
          </div>
        )}
      </div>
    </div>
  );
}
