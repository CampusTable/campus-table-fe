import Link from "next/link";

const LAST_UPDATED = "2025-11-18";
const APP_NAME = "Campus Table";

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 text-sm leading-7 text-gray-800">
      <h1 className="mb-2 text-3xl font-bold">개인정보 처리방침</h1>
      <p className="mb-8 text-gray-500">최종 개정일: {LAST_UPDATED}</p>

      {/* 목차 */}
      <nav className="mb-10 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-base font-semibold">목차</h2>
        <ol className="list-decimal space-y-1 pl-5">
          <li><Link className="hover:underline"
                    href="#purpose">수집·이용 목적 및 항목</Link></li>
          <li><Link className="hover:underline"
                    href="#method">수집 방법</Link></li>
          <li><Link className="hover:underline"
                    href="#third-parties">제3자 제공 및 처리위탁</Link></li>
          <li><Link className="hover:underline"
                    href="#retention">보유 및 이용 기간</Link></li>
          <li><Link className="hover:underline"
                    href="#rights">이용자 권리와 행사 방법</Link></li>
          <li><Link className="hover:underline"
                    href="#cookies">쿠키 등 유사기술의 사용</Link></li>
          <li><Link className="hover:underline"
                    href="#security">개인정보의 안전성 확보조치</Link></li>
          <li><Link className="hover:underline"
                    href="#deletion">계정 및 데이터 삭제</Link></li>
          <li><Link className="hover:underline"
                    href="#children">아동의 개인정보 보호</Link></li>
          <li><Link className="hover:underline"
                    href="#contact">문의처</Link></li>
          <li><Link className="hover:underline"
                    href="#notice">고지의 의무</Link></li>
        </ol>
      </nav>

      <section id="purpose"
               className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">1. 수집·이용 목적 및 항목</h2>
        <p className="mb-2">
          ${APP_NAME}(이하 “서비스”)는 다음 목적을 위해 최소한의 개인정보를 수집·이용합니다.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>서비스 제공 및 운영: 계정 생성/인증, 모임 일정 생성·공유, 알림 전송 등</li>
          <li>서비스 개선 및 오류 분석: 성능 모니터링, 크래시 리포트, 이용 통계 분석</li>
          <li>고객 문의 응대 및 공지</li>
        </ul>
      </section>

      <section id="method"
               className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">2. 수집 방법</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>회원 가입, 정보 입력 등 사용자가 직접 제공</li>
          <li>서비스 이용 과정에서 자동 수집(쿠키, 로그, 기기 및 브라우저 정보 등)</li>
          <li>오류/성능 모니터링 도구를 통한 수집(예: Crash/Analytics SDK)</li>
        </ul>
      </section>

      <section id="third-parties"
               className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">3. 제3자 제공 및 처리위탁</h2>
        <p className="mb-2">
          서비스 운영에 필요한 범위 내에서 개인정보 처리 업무를 외부에 위탁하거나, 법령에 따라 제3자에게 제공할 수 있습니다.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>호스팅/인프라 제공자: 서비스 인프라 운영</li>
          <li>오류·분석 도구: 장애 대응 및 품질 개선</li>
          <li>알림/이메일 발송 서비스: 공지 및 알림 전송</li>
        </ul>
      </section>

      <section id="retention"
               className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">4. 보유 및 이용 기간</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>원칙: 수집 및 이용 목적 달성 시 지체 없이 파기</li>
          <li>법령에 따른 보관이 필요한 경우 해당 법정 기간 동안 보관</li>
          <li>비활성 계정 분리 보관 정책(예: 1년 미접속 시 분리 보관)</li>
        </ul>
      </section>

      <section id="rights"
               className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">5. 이용자 권리와 행사 방법</h2>
        <p className="mb-2">
          이용자는 언제든지 자신의 개인정보에 대해 열람·정정·삭제·처리정지·동의철회를 요청할 수 있습니다.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>앱/웹 내 설정 화면 또는 아래 문의처를 통해 요청</li>
          <li>법정대리인은 아동의 개인정보에 대해 권리를 행사할 수 있음</li>
        </ul>
      </section>

      <section id="cookies"
               className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">6. 쿠키 등 유사기술의 사용</h2>
        <p className="mb-2">
          서비스 품질 향상, 인증, 보안, 이용자 경험 개선을 위해 쿠키 및 유사기술을 사용합니다.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수 있습니다.</li>
        </ul>
      </section>

      <section id="security"
               className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">7. 개인정보의 안전성 확보조치</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>전송 구간 암호화(HTTPS) 및 저장 시 보호조치</li>
          <li>접근권한 관리, 최소한의 수집 원칙 적용</li>
          <li>로그 모니터링 및 보안 점검</li>
          <li>내부 관리계획 수립 및 교육</li>
        </ul>
      </section>

      <section id="deletion"
               className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">8. 계정 및 데이터 삭제</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>앱/웹: <span className="font-medium">설정 &gt; 계정 &gt; 계정 삭제</span>에서 요청 가능(예시)</li>
          <li>처리 기한 및 백업 보관에 따른 완전 삭제까지의 기간을 명시</li>
          <li>법령상 보관이 필요한 데이터는 해당 기간 동안 별도 보관 후 파기</li>
        </ul>
      </section>

      <section id="children"
               className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">9. 아동의 개인정보 보호</h2>
        <p>
          서비스는 원칙적으로 만 14세(또는 현지 법령 기준) 미만 아동을 대상으로 하지 않습니다. 아동의 개인정보가 수집된 사실을 알게 될 경우
          지체 없이 삭제 또는 필요한 조치를 취합니다.
        </p>
      </section>

      <section id="contact"
               className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">10. 문의처</h2>
        <p className="mb-2">
          개인정보 보호 책임자에게 문의하시면 신속히 답변 드리겠습니다.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>이메일: <a className="text-blue-600 underline"
                      href="mailto:bjh59629@gmail.com">bjh59629@gmail.com</a></li>
        </ul>
      </section>

      <section id="notice"
               className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">11. 고지의 의무</h2>
        <p>
          본 방침은 관련 법령, 서비스 내용 변경 등에 따라 갱신될 수 있으며, 중요한 변경 사항이 있을 경우 앱 내 공지 또는 웹페이지를 통해 안내합니다.
        </p>
      </section>

      <div className="mt-12 flex gap-3">
        <Link
          href="/"
          className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
        >
          홈으로
        </Link>
      </div>
    </main>
  );
}