// يُعاد إنشاؤه عند كل تنقل، فيعمل انتقال الصفحات (fade/slide) تلقائيًا
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="pg">{children}</div>;
}
