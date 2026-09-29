// ملف البيانات الوحيد للمنصة: عدّل أو أضف هنا فقط، والواجهة تتحدث تلقائيًا.
// icon = اسم أيقونة من components/Icon.tsx

export const terms = [
  { id: 1, name: "الترم الأول" },
  { id: 2, name: "الترم الثاني" },
];

// لإضافة مادة: أضف سطرًا جديدًا (id فريد + termId + الاسم + الأيقونة).
// المادة السابعة في الترم الثاني لم تُحدَّد بعد، أضفها هنا عند معرفة اسمها.
export const subjects = [
  { id: 1, termId: 1, name: "English", icon: "lang" },
  { id: 2, termId: 1, name: "E-commerce", icon: "cart" },
  { id: 3, termId: 1, name: "CS", icon: "code" },
  { id: 4, termId: 1, name: "Physics", icon: "atom" },
  { id: 5, termId: 1, name: "Math 1", icon: "sigma" },
  { id: 6, termId: 1, name: "Math 0", icon: "calc" },
  { id: 7, termId: 1, name: "Ethics", icon: "scale" },
  { id: 8, termId: 2, name: "Electronics", icon: "bolt" },
  { id: 9, termId: 2, name: "Introduction to Artificial Intelligence", icon: "spark" },
  { id: 10, termId: 2, name: "Discrete Mathematics", icon: "sigma" },
  { id: 11, termId: 2, name: "Digital Logic Design", icon: "logic" },
  { id: 12, termId: 2, name: "Introduction to Cyber Security", icon: "shield" },
  { id: 13, termId: 2, name: "Computer Programming & Problem Solving", icon: "code" },
];

// group: g1 = مواد الدراسة (أزرق)، g2 = وسائط (برتقالي)، g3 = تقييم (كحلي)
export const sections = [
  { slug: "book", name: "كتاب الجامعة", icon: "book", group: "g1" },
  { slug: "lec", name: "المحاضرات", icon: "lec", group: "g1" },
  { slug: "sec", name: "السكاشن", icon: "sec", group: "g1" },
  { slug: "sum", name: "الملخصات", icon: "sum", group: "g1" },
  { slug: "vid", name: "الفيديوهات", icon: "vid", group: "g2" },
  { slug: "q", name: "الأسئلة", icon: "q", group: "g3" },
  { slug: "ex", name: "الامتحانات", icon: "ex", group: "g3" },
];

export type ContentItem = {
  id: string;
  subjectId: number;
  section: string; // slug من sections
  kind: "file" | "video";
  title: string;
  url: string;
};

// المحتوى فارغ حاليًا. يُملأ لاحقًا من الـAdmin.
export const content: ContentItem[] = [];
