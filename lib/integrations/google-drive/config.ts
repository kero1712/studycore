// إعداد التكامل. المفتاح server-only (بدون NEXT_PUBLIC) ولا يُستورد هذا الملف من أي مكوّن عميل.
export const driveApiKey = () => process.env.GOOGLE_DRIVE_API_KEY ?? "";
export const isDriveConfigured = () => driveApiKey().length > 0;
