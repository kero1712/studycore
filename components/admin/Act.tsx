// زر صغير داخل form يستدعي Server Action مع حقول مخفية
export default function Act({ action, fields, label, cls = "" }: { action: (fd: FormData) => Promise<void>; fields: Record<string, string | number | boolean>; label: string; cls?: string }) {
  return (
    <form action={action} style={{ display: "inline" }}>
      {Object.entries(fields).map(([k, v]) => <input key={k} type="hidden" name={k} value={String(v)} />)}
      <button className={`btn sm ${cls}`}>{label}</button>
    </form>
  );
}
