import "./globals.css";
import { kccHanbit, pretendard } from "@/styles/system/fonts";
import ServiceWorkerRegister from "@/shared/components/service-worker/ServiceWorkerRegister";

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
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
