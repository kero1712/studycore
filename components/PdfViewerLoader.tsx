"use client";

import PdfViewer from "./PdfViewer";

type PdfViewerLoaderProps = {
  src: string;
  driveUrl?: string;
};

export default function PdfViewerLoader({
  src,
  driveUrl,
}: PdfViewerLoaderProps) {
  return (
    <PdfViewer
      src={src}
      driveUrl={driveUrl}
    />
  );
}
