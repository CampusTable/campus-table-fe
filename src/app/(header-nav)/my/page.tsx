"use client" // TODO: 추후 로그아웃 정상 구현 후 SSR 변경

import { useRouter } from "next/navigation";
import { logout } from "@/features/auth/api/logoutApi.client";

export default function MyMainPage() {
  const router = useRouter();

  const handleLogout = async (): Promise<void> => {
    await logout();
    router.replace("/login");
  }

  return (
    <>
      <div>마이페이지 메인 페이지</div>
      <button
        type="button"
        onClick={handleLogout}
        className="bg-main"
      >
        로그아웃
      </button>
    </>
  );
};