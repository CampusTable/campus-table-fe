import PageContainer from "@/shared/components/layout/page-frame/container/PageContainer";
import PageView from "@/shared/components/layout/page-frame/view/PageView";

export default function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <PageContainer>
      <PageView>
        {children}
      </PageView>
    </PageContainer>

  );
}