# StudyCore — Checkpoint 2 — Supabase + Admin (NOT YET BUILT: npm install was blocked in the authoring environment)
تشغيل: `npm install` ثم `npm run dev`. بدون مفاتيح Supabase يعمل الموقع بالبيانات الثابتة في `data/catalog.ts`.

## ربط Supabase (يدويًا)
1. أنشئ مشروعًا في Supabase، ثم شغّل `supabase/schema.sql` ثم `supabase/seed.sql` في SQL Editor.
2. Authentication → Users: أنشئ مستخدم الأدمن، وعطّل التسجيل العام (Disable signups).
3. أضفه كأدمن في SQL Editor: `insert into public.admin_users (user_id) select id from auth.users where email = 'EMAIL';`
4. انسخ `.env.example` إلى `.env.local` وضع URL و anon key. ثم افتح `/admin/login`.

## الملفات
- `data/` أنواع + كتالوج ثابت (احتياطي) · `lib/data.ts` طبقة القراءة · `lib/data-map.ts` تحويل DB → واجهة
- `app/admin/` لوحة الأدمن (Server Actions في `actions.ts`) · `middleware.ts` حماية /admin
- المادة السابعة في الترم الثاني غير موجودة (اسمها لم يُحدَّد). أضفها من `/admin/subjects`.
