"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ar } from "@/lib/ar";

pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type PdfViewerProps = {
  src: string;
  downloadUrl?: string;
  driveUrl?: string;
};

export default function PdfViewer({
  src,
  downloadUrl,
  driveUrl,
}: PdfViewerProps) {
  const box = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);

  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [width, setWidth] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const element = wrap.current;
    if (!element) return;

    const observer = new ResizeObserver(() => {
      setWidth(element.clientWidth);
    });

    observer.observe(element);
    setWidth(element.clientWidth);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = wrap.current;
    if (!element || !pages) return;

    const handleScroll = () => {
      const pageHeight = element.clientHeight;
      if (!pageHeight) return;

      const page = Math.round(element.scrollTop / pageHeight) + 1;

      setCurrentPage(
        Math.min(Math.max(page, 1), pages)
      );
    };

    element.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, [pages]);

  const goToPage = (pageNumber: number) => {
    const element = wrap.current;
    if (!element || !pages) return;

    const target = Math.min(
      Math.max(pageNumber, 1),
      pages
    );

    element.scrollTo({
      top: (target - 1) * element.clientHeight,
      behavior: "smooth",
    });

    setCurrentPage(target);
  };

  const actualDownloadUrl =
    downloadUrl ||
    `${src}${src.includes("?") ? "&" : "?"}download=1`;

  return (
    <div ref={box} className="pdfbox">
      <div className="bar">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="الصفحة السابقة"
          title="الصفحة السابقة"
        >
          ‹
        </button>

        <span>
          {ar(currentPage)} / {pages ? ar(pages) : "…"}
        </span>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={!pages || currentPage >= pages}
          aria-label="الصفحة التالية"
          title="الصفحة التالية"
        >
          ›
        </button>

        <button
          className="o"
          onClick={() =>
            setZoom((value) =>
              Math.max(0.5, value - 0.25)
            )
          }
          aria-label="تصغير"
          title="تصغير"
        >
          −
        </button>

        <button
          className="o"
          onClick={() =>
            setZoom((value) =>
              Math.min(3, value + 0.25)
            )
          }
          aria-label="تكبير"
          title="تكبير"
        >
          +
        </button>

        <button
          onClick={() => box.current?.requestFullscreen?.()}
          aria-label="ملء الشاشة"
          title="ملء الشاشة"
        >
          ⛶
        </button>

        <a
          href={actualDownloadUrl}
          aria-label="تحميل الكتاب"
          title="تحميل الكتاب"
          style={{
            width: "42px",
            height: "42px",
            minWidth: "42px",
            flex: "0 0 42px",
            borderRadius: "50%",
            background: "#f59e0b",
            color: "#fff",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            textDecoration: "none",
            fontSize: "25px",
            fontWeight: 900,
            lineHeight: 1,
            cursor: "pointer",
            boxSizing: "border-box",
          }}
        >
          ↓
        </a>


      </div>

      <div
        ref={wrap}
        className="pdfwrap pdf-vertical"
      >
        {failed ? (
          <div className="empty">
            تعذّر فتح الملف حاليًا.
          </div>
        ) : (
          <Document
            file={src}
            onLoadSuccess={({ numPages }) => {
              setPages(numPages);
              setCurrentPage(1);

              if (wrap.current) {
                wrap.current.scrollTop = 0;
              }
            }}
            onLoadError={() => setFailed(true)}
            loading={
              <div className="empty">
                جاري تحميل الكتاب...
              </div>
            }
          >
            {pages > 0 &&
              Array.from(
                { length: pages },
                (_, index) => (
                  <div
                    key={`page-${index + 1}`}
                    className="pdf-page-snap"
                  >
                    <Page
                      pageNumber={index + 1}
                      width={Math.max(
                        220,
                        width * zoom
                      )}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </div>
                )
              )}
          </Document>
        )}
      </div>
    </div>
  );
}
