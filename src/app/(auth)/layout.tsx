import PageContainer from "@/shared/components/layout/page-frame/container/PageContainer";
import AuthPageView from "@/shared/components/layout/page-frame/view/AuthPageView";

export default function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <PageContainer>
      <AuthPageView>
        {children}
      </AuthPageView>
    </PageContainer>

  );
}