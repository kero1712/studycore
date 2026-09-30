// الأقسام السبعة (تُستخدم في الكتالوج الثابت وعند إنشاء مادة جديدة من الـAdmin)
export const SECTION_TEMPLATES = [
  { id: "book", name: "كتاب الجامعة", icon: "book", order: 1 },
  { id: "lec", name: "المحاضرات", icon: "lec", order: 2 },
  { id: "sec", name: "السكاشن", icon: "sec", order: 3 },
  { id: "sum", name: "الملخصات", icon: "sum", order: 4 },
  { id: "vid", name: "الفيديوهات", icon: "vid", order: 5 },
  { id: "q", name: "الأسئلة", icon: "q", order: 6 },
  { id: "ex", name: "الامتحانات", icon: "ex", order: 7 },
] as const;

// لون أيقونة القسم (دراسة / وسائط / تقييم) يُشتق من الأيقونة، فلا حاجة لعمود في قاعدة البيانات
export const TONE_BY_ICON: Record<string, "g1" | "g2" | "g3"> = { book: "g1", lec: "g1", sec: "g1", sum: "g1", vid: "g2", q: "g3", ex: "g3" };

export const SUBJECT_ICONS = ["lang", "cart", "code", "atom", "sigma", "calc", "scale", "bolt", "spark", "logic", "shield", "db", "globe", "layers", "cpu", "book"];
