import Link from "next/link";

export default function RootMainPage() {
  return (
    <div>
      메인페이지입니다.
      <Link
        href="/login"
        className="text-red"
      >로그인 페이지 이동
      </Link>
    </div>
  );
}