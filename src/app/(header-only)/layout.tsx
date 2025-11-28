import React from "react";
import PageContainer from "@/shared/components/layout/page-frame/container/PageContainer";
import Header from "@/shared/components/header/Header";
import PageView from "@/shared/components/layout/page-frame/view/PageView";

export default function HeaderOnlyLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <PageContainer>
      <Header />
      <PageView variant="header-only">
        {children}
      </PageView>
    </PageContainer>
  );
}