import PageContainer from "@/shared/components/layout/page-frame/container/PageContainer";
import PageView from "@/shared/components/layout/page-frame/view/PageView";

export default function MainLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <PageContainer>

      {/* 헤더 */}

      <PageView>{children}</PageView>

      {/* 하단 네비바 */}

    </PageContainer>
  );
}