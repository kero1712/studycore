// مصدر البيانات الحالي (ملف ثابت). الواجهة لا تقرأ من هنا مباشرة بل عبر lib/data.ts،
// فيمكن لاحقًا استبدال هذا الملف بـ Supabase دون تغيير أي صفحة.
import type { Section, Subject, Term } from "./types";

// الأقسام السبعة، ويحصل كل Subject على نسخة منها بمحتوى فارغ.
const SECTION_TEMPLATES: Omit<Section, "contentItems">[] = [
  { id: "book", name: "كتاب الجامعة", icon: "book", tone: "g1", order: 1 },
  { id: "lec", name: "المحاضرات", icon: "lec", tone: "g1", order: 2 },
  { id: "sec", name: "السكاشن", icon: "sec", tone: "g1", order: 3 },
  { id: "sum", name: "الملخصات", icon: "sum", tone: "g1", order: 4 },
  { id: "vid", name: "الفيديوهات", icon: "vid", tone: "g2", order: 5 },
  { id: "q", name: "الأسئلة", icon: "q", tone: "g3", order: 6 },
  { id: "ex", name: "الامتحانات", icon: "ex", tone: "g3", order: 7 },
];

const subject = (id: number, name: string, icon: string, order: number): Subject => ({
  id,
  name,
  icon,
  order,
  sections: SECTION_TEMPLATES.map((s) => ({ ...s, contentItems: [] })),
});

// لإضافة محتوى: ضع عنصرًا داخل contentItems للقسم المطلوب،
// مثال: { id: "c1", name: "المحاضرة 1", type: "pdf", url: "...", order: 1 }
// لإضافة مادة: أضف subject(...) جديدًا. المادة السابعة في الترم الثاني لم تُحدَّد بعد.
export const catalog: Term[] = [
  {
    id: 1,
    name: "الترم الأول",
    order: 1,
    subjects: [
      subject(1, "English", "lang", 1),
      subject(2, "E-commerce", "cart", 2),
      subject(3, "CS", "code", 3),
      subject(4, "Physics", "atom", 4),
      subject(5, "Math 1", "sigma", 5),
      subject(6, "Math 0", "calc", 6),
      subject(7, "Ethics", "scale", 7),
    ],
  },
  {
    id: 2,
    name: "الترم الثاني",
    order: 2,
    subjects: [
      subject(8, "Electronics", "bolt", 1),
      subject(9, "Introduction to Artificial Intelligence", "spark", 2),
      subject(10, "Discrete Mathematics", "sigma", 3),
      subject(11, "Digital Logic Design", "logic", 4),
      subject(12, "Introduction to Cyber Security", "shield", 5),
      subject(13, "Computer Programming & Problem Solving", "code", 6),
    ],
  },
];
