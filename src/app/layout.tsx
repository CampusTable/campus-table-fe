import "./globals.css";
import { kccHanbit, pretendard } from "@/styles/system/fonts";
import ServiceWorkerRegister from "@/shared/components/service-worker/ServiceWorkerRegister";
import QueryClientProvider from "@/shared/providers/QueryClientProvider";

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
      {/* TODO: 추후 module.css 분리 */}
      <body className="min-h-screen antialiased font-sans">
        <QueryClientProvider>
          {children}
        </QueryClientProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
