import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

const pretendard = localFont({
  src: [
    {
      path: "../assets/fonts/PretendardVariable.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
  display: "swap",
  preload: true,
});

const kccHanbit = localFont({
  src: [
    {
      path: "../assets/fonts/KCC-Hanbit.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-kcc-hanbit",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "CampusTable",
  description: "먹고 싶은 학식, 바로 주문해요!",
};

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
      <body className="min-h-screen antialiased font-pretendard">
        {children}
      </body>
    </html>
  );
}
