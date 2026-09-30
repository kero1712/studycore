export type ContentType = "pdf" | "video" | "link";

export interface ContentItem {
  id: string;
  name: string;
  type: ContentType;
  url: string;
  driveFileId?: string; // لعناصر pdf فقط: معرّف الملف في Google Drive
  order: number;
}

export interface Section {
  id: string; // ثابت داخل المادة: book | lec | sec | sum | vid | q | ex
  name: string;
  icon: string; // اسم أيقونة من components/Icon.tsx
  tone: "g1" | "g2" | "g3"; // لون الأيقونة (دراسة / وسائط / تقييم)
  order: number;
  contentItems: ContentItem[];
}

export interface Subject {
  id: number;
  name: string;
  icon: string;
  order: number;
  sections: Section[];
}

export interface Term {
  id: number;
  name: string;
  order: number;
  subjects: Subject[];
}
