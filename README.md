# StudyCore — Checkpoint 1 — Data Structure
واجهة فقط (بدون Admin / Supabase / Google Drive / Auth).
- البيانات: `data/catalog.ts` (Terms → Subjects → Sections → ContentItems) والأنواع في `data/types.ts`.
- الوصول للبيانات: `lib/data.ts` فقط (async) — هنا يُستبدل المصدر بـ Supabase لاحقًا.
- تشغيل: `npm install` ثم `npm run dev`.
- الرجوع للنسخة: `git checkout checkpoint-1-data-structure` (وسوم سابقة: baseline-v1, baseline-v2).
