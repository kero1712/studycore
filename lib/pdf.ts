// مسار عرض PDF داخل StudyCore: يمر عبر الـAPI الداخلي بمعرّف عنصر المحتوى (لا بمعرّف ملف Drive)
export const pdfProxyPath = (contentId: string) => `/api/drive/pdf/${encodeURIComponent(contentId)}`;
