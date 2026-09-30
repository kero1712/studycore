// نقبل فقط Range بصيغة bytes=a-b قبل تمريره إلى Google
export const safeRange = (r: string | null | undefined): string | undefined =>
  r && /^bytes=\d*-\d*$/.test(r) ? r : undefined;
