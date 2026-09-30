// تحقق حقيقي ضد مشروع Supabase الفعلي (وخادم StudyCore إن وُجد BASE_URL). لا يعمل بدون بيانات اعتماد حقيقية.
// تشغيل: npm run verify:e2e   (يقرأ .env.local، وبيانات الأدمن من متغيرات الشل فقط)
import { createClient } from "@supabase/supabase-js";

const need = (k) => { if (!process.env[k]) { console.error(`MISSING ENV: ${k}`); process.exit(2); } return process.env[k]; };
const URL_ = need("NEXT_PUBLIC_SUPABASE_URL"), ANON = need("NEXT_PUBLIC_SUPABASE_ANON_KEY");
const ADMIN_EMAIL = need("ADMIN_EMAIL"), ADMIN_PASSWORD = need("ADMIN_PASSWORD");
const BASE = (process.env.BASE_URL || "").replace(/\/$/, ""), DRIVE_FILE = process.env.TEST_DRIVE_FILE_URL || "";
const mk = () => createClient(URL_, ANON, { auth: { persistSession: false, autoRefreshToken: false } });

class Skip extends Error {}
const results = []; let failed = 0;
const step = async (name, fn) => {
  try { await fn(); results.push(["PASS", name]); }
  catch (e) { if (e instanceof Skip) results.push(["SKIPPED", `${name} — ${e.message}`]); else { failed++; results.push(["FAIL", `${name} — ${e.message}`]); } }
  console.log(results.at(-1)[0].padEnd(8), results.at(-1)[1]);
};
const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${m}: expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`); };
const ok = (c, m) => { if (!c) throw new Error(m); };
const TERM1 = ["English", "E-commerce", "CS", "Physics", "Math 1", "Math 0", "Ethics"];
const TERM2 = ["Electronics", "Introduction to Artificial Intelligence", "Discrete Mathematics", "Digital Logic Design", "Introduction to Cyber Security", "Computer Programming & Problem Solving"];
const SECTIONS = ["كتاب الجامعة", "المحاضرات", "السكاشن", "الملخصات", "الفيديوهات", "الأسئلة", "الامتحانات"];

const anon = mk(), admin = mk();
const ctx = {};

await step("DATA: terms/subjects/sections seeded exactly (anon read)", async () => {
  const { data, error } = await anon.from("terms").select("name,sort_order,subjects(name,sort_order,sections(name,sort_order))").order("sort_order");
  if (error) throw new Error(error.message);
  eq(data.length, 2, "terms");
  const names = (t) => [...t.subjects].sort((a, b) => a.sort_order - b.sort_order).map((s) => s.name);
  eq(names(data[0]), TERM1, "term 1 subjects"); eq(names(data[1]), TERM2, "term 2 subjects (no invented #7)");
  for (const t of data) for (const s of t.subjects) eq([...s.sections].sort((a, b) => a.sort_order - b.sort_order).map((x) => x.name), SECTIONS, `sections of ${s.name}`);
});
await step("RLS: anonymous cannot write", async () => {
  const cur = (await anon.from("subjects").select("id,icon").eq("id", 1).single()).data;
  const ins = await anon.from("subjects").insert({ term_id: 1, name: "__anon__", icon: "book", sort_order: 99 });
  ok(ins.error, "anonymous INSERT into subjects was allowed");
  const up = await anon.from("subjects").update({ icon: cur.icon }).eq("id", cur.id).select();  // same value: harmless even if RLS were broken
  ok(up.error || (up.data ?? []).length === 0, "anonymous UPDATE affected rows");
  const a = await anon.from("admin_users").select("*"); ok(!a.error && (a.data ?? []).length === 0, "anonymous can read admin_users");
});
await step("ADMIN: login + present in admin_users", async () => {
  const { data, error } = await admin.auth.signInWithPassword({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  if (error) throw new Error(error.message);
  const r = await admin.from("admin_users").select("role").eq("user_id", data.user.id).maybeSingle();
  ok(r.data, "signed in but not listed in admin_users");
});
await step("RLS: signed-in NON-admin cannot write", async () => {
  if (!process.env.TEST_USER_EMAIL) throw new Skip("set TEST_USER_EMAIL/TEST_USER_PASSWORD (a normal, non-admin user)");
  const u = mk(); const { error } = await u.auth.signInWithPassword({ email: process.env.TEST_USER_EMAIL, password: process.env.TEST_USER_PASSWORD });
  if (error) throw new Error(error.message);
  ok((await u.from("subjects").insert({ term_id: 1, name: "__user__", icon: "book", sort_order: 99 })).error, "non-admin INSERT allowed");
  const cur = (await anon.from("subjects").select("icon").eq("id", 1).single()).data; const up = await u.from("subjects").update({ icon: cur.icon }).eq("id", 1).select(); ok(up.error || (up.data ?? []).length === 0, "non-admin UPDATE affected rows");
});

const created = [];
try {
  await step("ADMIN CRUD: add PDF + video in subject 'English' > المحاضرات", async () => {
    const { data: sub } = await admin.from("subjects").select("id,sections(id,name)").eq("name", "English").single();
    ctx.subjectId = sub.id; ctx.sectionId = sub.sections.find((s) => s.name === "المحاضرات").id;
    const driveUrl = DRIVE_FILE || "https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz_-0123/view";
    const m = driveUrl.match(/\/d\/([\w-]+)|[?&]id=([\w-]+)/); const fileId = m?.[1] ?? m?.[2];
    ok(fileId, "TEST_DRIVE_FILE_URL is not a Drive file link");
    const pdf = await admin.from("content_items").insert({ section_id: ctx.sectionId, name: "__e2e__ PDF", type: "pdf", url: driveUrl, drive_url: driveUrl, drive_file_id: fileId, sort_order: 900 }).select("id").single();
    if (pdf.error) throw new Error(pdf.error.message); ctx.pdfId = pdf.data.id; created.push(ctx.pdfId);
    const vid = await admin.from("content_items").insert({ section_id: ctx.sectionId, name: "__e2e__ Video", type: "video", url: "https://youtu.be/dQw4w9WgXcQ", sort_order: 901 }).select("id").single();
    if (vid.error) throw new Error(vid.error.message); ctx.videoId = vid.data.id; created.push(ctx.videoId);
    const bad = await admin.from("content_items").insert({ section_id: ctx.sectionId, name: "__e2e__ bad", type: "pdf", url: "https://x.com", sort_order: 902 });
    ok(bad.error, "DB constraint should reject a pdf without drive_file_id");
  });
  await step("STUDENT DATA: published items visible to anon immediately", async () => {
    const { data, error } = await anon.from("content_items").select("id,name").in("id", created); if (error) throw new Error(error.message);
    eq(data.map((x) => x.name).sort(), ["__e2e__ PDF", "__e2e__ Video"], "visible items");
  });
  await step("RLS: anonymous cannot edit/delete an existing content item", async () => {
    const up = await anon.from("content_items").update({ name: "__hacked__" }).eq("id", ctx.pdfId).select();
    ok(up.error || (up.data ?? []).length === 0, "anonymous UPDATE affected the item");
    const del = await anon.from("content_items").delete().eq("id", ctx.pdfId).select();
    ok(del.error || (del.data ?? []).length === 0, "anonymous DELETE removed the item");
    ok((await admin.from("content_items").select("name").eq("id", ctx.pdfId).single()).data.name === "__e2e__ PDF", "item changed by anonymous");
  });
  await step("ADMIN CRUD: edit content", async () => {
    const r = await admin.from("content_items").update({ name: "__e2e__ PDF (edited)" }).eq("id", ctx.pdfId).select("name").single();
    if (r.error) throw new Error(r.error.message);
    eq((await anon.from("content_items").select("name").eq("id", ctx.pdfId).single()).data.name, "__e2e__ PDF (edited)", "anon sees edit");
  });
  await step("STUDENT UI (HTTP): section lists items; /view opens PDF page + video iframe", async () => {
    if (!BASE) throw new Skip("set BASE_URL=http://localhost:3000 with `npm run dev`/`npm start` running");
    const sec = await (await fetch(`${BASE}/c/${ctx.subjectId}/${ctx.sectionId}`)).text();
    ok(sec.includes("__e2e__ PDF (edited)") && sec.includes("__e2e__ Video"), "section page does not list the new items");
    const p = await fetch(`${BASE}/view/${ctx.pdfId}`); eq(p.status, 200, "/view pdf status");
    const v = await fetch(`${BASE}/view/${ctx.videoId}`); const vh = await v.text(); eq(v.status, 200, "/view video status");
    ok(vh.includes("youtube-nocookie.com/embed/dQw4w9WgXcQ"), "video embed iframe missing");
  });
  await step("DRIVE (HTTP): PDF served through /api/drive/pdf (200 + Range 206)", async () => {
    if (!BASE || !DRIVE_FILE) throw new Skip("needs BASE_URL, GOOGLE_DRIVE_API_KEY on the server, and TEST_DRIVE_FILE_URL (a link-shared real PDF)");
    const r = await fetch(`${BASE}/api/drive/pdf/${ctx.pdfId}`); eq(r.status, 200, "status"); ok((r.headers.get("content-type") || "").includes("pdf"), "content-type not pdf");
    const b = new Uint8Array(await r.arrayBuffer()); eq(String.fromCharCode(...b.slice(0, 4)), "%PDF", "file signature");
    const g = await fetch(`${BASE}/api/drive/pdf/${ctx.pdfId}`, { headers: { Range: "bytes=0-99" } }); ok([206, 200].includes(g.status), `range status ${g.status}`);
    console.log(`         (range request returned ${g.status}; 206 = partial content honoured)`);
  });
  await step("PROTECTION: unpublished content hidden (DB + direct URL + API)", async () => {
    const r = await admin.from("content_items").update({ is_published: false }).eq("id", ctx.pdfId); if (r.error) throw new Error(r.error.message);
    eq((await anon.from("content_items").select("id").eq("id", ctx.pdfId)).data, [], "anon still reads unpublished item");
    if (BASE) { eq((await fetch(`${BASE}/view/${ctx.pdfId}`)).status, 404, "/view unpublished"); eq((await fetch(`${BASE}/api/drive/pdf/${ctx.pdfId}`)).status, 404, "api unpublished"); }
    if (BASE) { eq((await fetch(`${BASE}/api/drive/pdf/00000000-0000-0000-0000-000000000000`)).status, 404, "api invalid id"); }
  });
  await step("PROTECTION: published item inside a HIDDEN subject is not reachable", async () => {
    const h = await admin.from("subjects").update({ is_published: false }).eq("id", ctx.subjectId); if (h.error) throw new Error(h.error.message);
    try {
      eq((await anon.from("subjects").select("id").eq("id", ctx.subjectId)).data, [], "hidden subject visible");
      eq((await anon.from("sections").select("id").eq("subject_id", ctx.subjectId)).data, [], "sections of hidden subject visible");
      eq((await anon.from("content_items").select("id").eq("id", ctx.videoId)).data, [], "content of hidden subject visible");
      if (BASE) eq((await fetch(`${BASE}/view/${ctx.videoId}`)).status, 404, "/view of hidden subject");
    } finally { await admin.from("subjects").update({ is_published: true }).eq("id", ctx.subjectId); }
  });
} finally {
  await step("ADMIN CRUD: delete content (cleanup)", async () => {
    if (created.length) { const d = await admin.from("content_items").delete().in("id", created).select("id"); if (d.error) throw new Error(d.error.message); eq(d.data.length, created.length, "deleted rows"); }
    if (ctx.subjectId) eq((await admin.from("subjects").select("is_published").eq("id", ctx.subjectId).single()).data.is_published, true, "subject restored");
  });
}
await admin.auth.signOut();
const c = (k) => results.filter((r) => r[0] === k).length;
console.log(`\nPASS ${c("PASS")}  FAIL ${c("FAIL")}  SKIPPED ${c("SKIPPED")}`);
process.exit(failed ? 1 : 0);
