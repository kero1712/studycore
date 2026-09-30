// اختبارات المرحلة 3. تشغيل: npm test (يبني أولًا إلى .test-out)
const assert = require("assert"), fs = require("fs"), path = require("path"), Module = require("module");
const root = path.resolve(__dirname, ".."), out = path.join(root, ".test-out");
// وحدات الخادم غير المتاحة خارج Next تُستبدل بـshim أثناء الاختبار فقط (noStore بلا أثر، وsupabase لا يُستدعى بدون env)
const orig = Module._load;
Module._load = function (req, ...a) {
  if (req === "next/cache") return { unstable_noStore() {} };
  if (req === "@supabase/supabase-js") return { createClient() { throw new Error("createClient must not be called without env"); } };
  return orig.call(this, req, ...a);
};
const req = (p) => require(path.join(out, p));
let passed = 0; const ok = (n, f) => { f(); passed++; console.log("PASS", n); };
const okA = async (n, f) => { await f(); passed++; console.log("PASS", n); };

(async () => {
const { parseDriveUrl, driveFileUrl } = req("lib/integrations/google-drive/parse.js");
const ID = "1AbCdEfGhIjKlMnOpQrStUvWxYz_-0123";
ok("drive url parsing", () => {
  for (const u of [`https://drive.google.com/file/d/${ID}/view?usp=sharing`, `https://drive.google.com/open?id=${ID}`, `https://drive.google.com/uc?export=download&id=${ID}`, `https://drive.google.com/file/u/0/d/${ID}/view`, `https://docs.google.com/document/d/${ID}/edit`, `  https://drive.google.com/file/d/${ID}  `])
    assert.deepStrictEqual(parseDriveUrl(u), { kind: "file", id: ID }, u);
  assert.deepStrictEqual(parseDriveUrl(`https://drive.google.com/drive/folders/${ID}?usp=sharing`), { kind: "folder", id: ID });
  for (const u of ["", "not a url", `http://drive.google.com/file/d/${ID}/view`, `https://evil.com/file/d/${ID}/view`, `https://drive.google.com.evil.com/file/d/${ID}`, "https://drive.google.com/file/d/short/view", "https://drive.google.com/", `javascript:alert(1)//drive.google.com/file/d/${ID}`, `https://drive.google.com/file/d/${ID}%2F..%2Fx/view`])
    assert.strictEqual(parseDriveUrl(u), null, u);
  assert.strictEqual(driveFileUrl(ID), `https://drive.google.com/file/d/${ID}/view`);
  assert.deepStrictEqual(parseDriveUrl(driveFileUrl(ID)), { kind: "file", id: ID });
});
const { videoEmbedUrl } = req("lib/embed.js");
ok("video embed urls", () => {
  const y = "dQw4w9WgXcQ";
  for (const u of [`https://www.youtube.com/watch?v=${y}&t=5`, `https://youtu.be/${y}`, `https://m.youtube.com/watch?v=${y}`, `https://www.youtube.com/embed/${y}`, `https://youtube.com/shorts/${y}`])
    assert.strictEqual(videoEmbedUrl(u), `https://www.youtube-nocookie.com/embed/${y}`, u);
  assert.strictEqual(videoEmbedUrl(`https://drive.google.com/file/d/${ID}/view`), `https://drive.google.com/file/d/${ID}/preview`);
  for (const u of ["http://youtu.be/dQw4w9WgXcQ", "https://evil.com/watch?v=dQw4w9WgXcQ", "javascript:alert(1)", "https://www.youtube.com/watch?v=bad", ""]) assert.strictEqual(videoEmbedUrl(u), null, u);
});
ok("pdf url handling + range sanitising", () => {
  const { pdfProxyPath } = req("lib/pdf.js"), { safeRange } = req("lib/integrations/google-drive/range.js");
  assert.strictEqual(pdfProxyPath("a-b"), "/api/drive/pdf/a-b");
  assert.strictEqual(pdfProxyPath("a/../b"), "/api/drive/pdf/a%2F..%2Fb");
  assert.ok(!pdfProxyPath(ID).includes("google"));
  assert.strictEqual(safeRange("bytes=0-1023"), "bytes=0-1023");
  assert.strictEqual(safeRange("bytes=100-"), "bytes=100-");
  for (const r of ["bytes=0-1,5-9", "items=0-1", "bytes=a-b", "bytes=0-1\r\nX: y", null, undefined, ""]) assert.strictEqual(safeRange(r), undefined);
});
ok("content item mapping (drive_file_id -> driveFileId)", () => {
  const { mapTerms } = req("lib/data-map.js");
  const rows = [{ id: 1, name: "T", sort_order: 1, subjects: [{ id: 1, name: "S", icon: "code", sort_order: 1, sections: [{ id: 5, name: "X", icon: "lec", sort_order: 1, content_items: [
    { id: "u1", name: "p", type: "pdf", url: driveFileUrl(ID), drive_file_id: ID, sort_order: 1 },
    { id: "u2", name: "v", type: "video", url: "https://youtu.be/dQw4w9WgXcQ", drive_file_id: null, sort_order: 2 }] }] }] }];
  const items = mapTerms(rows)[0].subjects[0].sections[0].contentItems;
  assert.strictEqual(items[0].driveFileId, ID); assert.ok(!("driveFileId" in items[1])); assert.strictEqual(items[0].type, "pdf");
});
ok("no secrets reach client code", () => {
  const files = []; (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { if (["node_modules", ".next", ".git", ".test-out"].includes(e.name)) continue; const p = path.join(d, e.name); e.isDirectory() ? walk(p) : /\.(ts|tsx|js|cjs|json|example)$/.test(e.name) && files.push(p); } })(root);
  const rel = (p) => path.relative(root, p).replace(/\\/g, "/");
  for (const f of files) {
    const s = fs.readFileSync(f, "utf8"), r = rel(f);
    if (/^["']use client["']/m.test(s)) {
      assert.ok(!/google-drive\/(config|client|index)|integrations\/google-drive["']/.test(s), `${r}: client file imports server-only Drive code`);
      assert.ok(!/process\.env\.(?!NEXT_PUBLIC_)/.test(s), `${r}: client file reads a non-public env var`);
    }
    if (!/^(scripts|\.env)/.test(r) && r !== "lib/integrations/google-drive/config.ts") assert.ok(!/GOOGLE_DRIVE_API_KEY|SERVICE_ROLE/i.test(s.replace(/^\s*\/\/.*$/gm, "")) || r === "README.md", `${r}: references a secret env var`);
    assert.ok(!/NEXT_PUBLIC_[A-Z_]*(SECRET|SERVICE|PRIVATE|DRIVE)/.test(s), `${r}: secret-looking NEXT_PUBLIC var`);
  }
  const env = fs.readFileSync(path.join(root, ".env.example"), "utf8");
  assert.ok(/^GOOGLE_DRIVE_API_KEY=/m.test(env) && !/NEXT_PUBLIC_GOOGLE/.test(env));
  const route = fs.readFileSync(path.join(root, "app/api/drive/pdf/[id]/route.ts"), "utf8"), cl = fs.readFileSync(path.join(root, "lib/integrations/google-drive/client.ts"), "utf8");
  assert.ok(!/[?&]key=/.test(route + cl), "API key must not be placed in a URL");
  assert.ok(/x-goog-api-key/.test(cl));
});
delete process.env.GOOGLE_DRIVE_API_KEY; delete process.env.NEXT_PUBLIC_SUPABASE_URL; delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
await okA("fallback: no Drive / no Supabase env", async () => {
  const cfg = req("lib/integrations/google-drive/config.js");
  assert.strictEqual(cfg.isDriveConfigured(), false);
  const d = req("lib/data.js");
  const terms = await d.getTerms();
  assert.strictEqual(terms.length, 2); assert.strictEqual(terms[0].subjects.length, 7); assert.strictEqual(terms[1].subjects.length, 6);
  assert.strictEqual(await d.getContentItem("nope"), undefined); assert.deepStrictEqual(await d.getSearchIndex(), []);
  process.env.GOOGLE_DRIVE_API_KEY = "x"; assert.strictEqual(cfg.isDriveConfigured(), true); delete process.env.GOOGLE_DRIVE_API_KEY;
});
console.log(`\nALL ${passed} TEST GROUPS PASSED`);
})().catch((e) => { console.error("FAIL", e.message); process.exit(1); });
