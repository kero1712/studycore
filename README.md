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

## Google Drive (Checkpoint 3)
- مصدر الـPDF هو Google Drive فقط (لا تخزين ملفات في Supabase). الأدمن يضع رابط ملف Drive عند إضافة عنصر من نوع PDF.
- الفتح داخل StudyCore عبر `/view/[id]` وقارئ pdf.js (react-pdf)، والملف يمر من `/api/drive/pdf/[id]` بمعرّف عنصر المحتوى.
- إعداد: أنشئ Google API key (Drive API مفعّل)، وضعه في `GOOGLE_DRIVE_API_KEY` (server-only)، وشارك الملفات "أي شخص لديه الرابط".
- للمشاريع القائمة: شغّل `supabase/migrations/003_google_drive.sql`. بدون المفتاح يعمل الموقع كما هو وتظهر رسالة "تعذّر فتح الملف" فقط عند فتح PDF.
- الاختبارات: `npm test`.

## Checkpoint 5 — تشغيل حقيقي مع Supabase (تنفّذه أنت)
1. Supabase → SQL Editor: الصق `supabase/setup.sql` (schema + seed) ثم Run. (لمشروع قديم فيه schema سابق: شغّل أيضًا `supabase/migrations/003_google_drive.sql`.)
2. Authentication → Users → Add user (بريد + كلمة مرور) للأدمن الوحيد. وعطّل التسجيل العام: Authentication → Sign In / Providers → "Allow new users to sign up" = off.
3. SQL Editor: `insert into public.admin_users (user_id) select id from auth.users where email = 'ADMIN_EMAIL';`
4. `.env.local` (لا يُرفع إلى git):
   - `NEXT_PUBLIC_SUPABASE_URL` و `NEXT_PUBLIC_SUPABASE_ANON_KEY` من Project Settings → API (anon/public فقط، ولا تستخدم service_role).
   - `GOOGLE_DRIVE_API_KEY` (server-only) لعرض الـPDF.
5. `npm run build && npm start` (أو `npm run dev`) ثم من طرفية أخرى:
   `ADMIN_EMAIL=... ADMIN_PASSWORD=... BASE_URL=http://localhost:3000 TEST_DRIVE_FILE_URL=<رابط PDF مشارك> npm run verify:e2e`
   (اختياري: `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` لمستخدم عادي غير أدمن لاختبار منعه من الكتابة). يتطلب Node 20.6+.
