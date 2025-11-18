import PageFrame from "@/shared/components/layout/page-frame/PageFrame";

export default function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <PageFrame>{children}</PageFrame>
  );
}