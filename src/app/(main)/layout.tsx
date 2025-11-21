import PageContainer from "@/shared/components/layout/page-frame/container/PageContainer";
import PageView from "@/shared/components/layout/page-frame/view/PageView";
import BottomNavigation from "@/shared/components/navigation/BottomNavigation";
import Header from "@/shared/components/header/Header";

export default function MainLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <PageContainer>

      {/* 헤더 */}
      <Header />

      <PageView>{children}</PageView>

      {/* 하단 네비바 */}
      <BottomNavigation />

    </PageContainer>
  );
}