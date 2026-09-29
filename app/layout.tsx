import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = { title: "StudyCore", description: "منصة بسيطة ومنظمة تجمع المحتوى الدراسي في مكان واحد" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;700&family=Lalezar&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Header />
        <main id="app">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
