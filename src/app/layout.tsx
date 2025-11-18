import "./globals.css";
import { kccHanbit, pretendard } from "@/styles/system/fonts";

export { metadata } from "./metadata";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${kccHanbit.variable}`}
    >
      <body className="min-h-screen antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
