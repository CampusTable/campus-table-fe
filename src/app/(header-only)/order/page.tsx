"use client";

import { useRouter } from "next/navigation";

export default function OrderPage() {
  const router = useRouter();

  const onClick = () => {
    router.replace("/");
  }
  return (
    <div>
      주문 페이지 입니다
      <button
        className="bg-blue-400"
        onClick={onClick}
      >
        홈 화면 이동
      </button>
    </div>
  );
};