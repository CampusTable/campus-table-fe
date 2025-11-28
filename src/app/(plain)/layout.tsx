import React from "react";
import PageContainer from "@/shared/components/layout/page-frame/container/PageContainer";
import PageView from "@/shared/components/layout/page-frame/view/PageView";

export default function PlainLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <PageContainer>
      <PageView variant="plain">
        {children}
      </PageView>
    </PageContainer>
  );
};