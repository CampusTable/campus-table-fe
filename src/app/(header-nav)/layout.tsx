import React from "react";
import PageContainer from "@/shared/components/layout/page-frame/container/PageContainer";
import BottomNavigation from "@/shared/components/navigation/BottomNavigation";
import PageView from "@/shared/components/layout/page-frame/view/PageView";
import Header from "@/shared/components/header/Header";

export default function HeaderNavLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <PageContainer>
      <Header />
      <PageView variant="header-nav">
        {children}
      </PageView>
      <BottomNavigation />
    </PageContainer>
  );
}