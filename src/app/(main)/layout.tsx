import PageFrame from "@/shared/components/layout/page-frame/PageFrame";

export default function MainLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>

      {/* 헤더 */}

      <PageFrame>{children}</PageFrame>

      {/* 하단 네비바 */}

    </>
  );
}