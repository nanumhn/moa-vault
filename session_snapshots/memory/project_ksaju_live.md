---
name: project_ksaju_live
description: "saju-studio is LIVE at k-saju.me — stack, deploy quirks, and the localhost-service constraint"
metadata: 
  node_type: memory
  type: project
  originSessionId: ee8b467e-df9e-45b7-958b-13a0479d9823
---

saju-studio(브랜드 **k-saju**)가 2026-06-15 라이브 배포됨. [[project_3_saju_global]]의 실제 구현체.

**라이브:** https://k-saju.me (도메인은 형이 등록, hosting.co.kr 네임서버 → Vercel A레코드 216.198.79.1). GitHub: nanumhn/k-saju (main). 코드: D:/Develop/saju-studio (Next.js 16 + React 19 + Tailwind v4 + Auth.js v5 + Prisma).

**인프라:**
- 배포: Vercel (프로젝트 k-saju, owen's projects). dev 포트 3001, bun 사용(node 없음).
- DB: **Neon PostgreSQL** (Vercel Storage 연동, DATABASE_URL/DATABASE_URL_UNPOOLED 자동주입). 로컬 prisma 작업 시 `set -a; source .env.local; set +a` 후 `bunx prisma db push`.
- 결제: **미해결 — MoR 2곳이 사주를 거부. 현재 추천=Gumroad (2026-06-22, 형 결재 대기).** 경위: PayPal 폐기(2026-06-17, 3벽: ①한국↔한국 국내결제 금지 ②개인계정 ssky.park 영구밴+nanumn 연쇄위험 ③사주=PayPal 고위험) → MoR 전환 시도했으나 **Paddle=점성술 명문금지로 탈락, Lemon Squeezy=2026-06-22 "Saju is not supported" 명시 거부**(LS 정산정보는 건짐: 한국은행·PayPal payout OK, Wise/Payoneer X). **→ Gumroad 추천**: 점성술·타로·운세 공개 허용(셀프서비스, 심사 게이트 없음)·MoR(세금자동)·구독+단발 지원·한국정산 OK(PayPal/은행, 최소4만원)·수수료 ~10%(LS보다 비쌈). 대안: Stripe직접(점성술 회색지대+사업자등록 필수, Phase2), PayPal(글로벌만 받으면 국내우회 가능하나 운세 고위험 밴리스크). **형 "Gumroad 확정?" 결재 시 cto가 셋업+통합(~2-4일).** 상세: moa-vault/10_Wiki/Decisions/2026-06-17_k-saju_payment_paypal_to_MoR.md + 2026-06-22 LS거부. (구판 PayPal 라이브 플랜·LS 셋업 모두 사용 안 함)
- **★웹훅 검증은 offline 자체검증**(cert+RSA-SHA256, src/lib/paypal/client.ts verifyWebhook). 이유: 라이브 앱이 `/v1/notifications/*` 권한 없어 verify-webhook-signature API가 403. cert_url은 paypal.com 도메인만 허용. 웹훅 생성도 API 403 → **대시보드에서 수동 생성**해야 함.
- 로그인: Google OAuth(Auth.js v5, DB 세션). 마이페이지 /account. 데일리 사주 카드 /daily(구독자 전용, 오행 rule-based). **결제는 로그인 필수**(2026-06-17): create-subscription이 auth() 세션 검증, 세션 이메일로 구독 생성(클라 임의 이메일 주입 차단).
- **UI는 영어 전용**(글로벌 타깃). 엔진은 *En/*Ko 둘 다 만들지만 화면엔 *En만 렌더. 한자 브랜딩(四柱八字)은 의도.
- 메일: support@k-saju.me 라이브 → [[reference_ksaju_email_setup]].

**★중요 제약:** Vercel(라이브)은 형 PC의 **localhost 서비스(LM Studio 1234, ComfyUI 8188)에 접근 불가.** 따라서 라이브 기능은 로컬 LLM/이미지생성에 의존 X — 텍스트는 rule-based, 이미지는 사전생성해 public/ 자산으로.

**★Vercel 자동배포 자주 누락:** git push해도 Vercel이 새 커밋 배포를 종종 안 함(특히 연속 푸시). → `git commit --allow-empty -m "retrigger" && git push`로 재트리거하면 반영됨. 배포 확인: 새 라우트 curl HTTP 200.

**Safe Browsing 오탐(2026-06-17):** 크롬이 로그인 경로(/api/auth/signin/google)를 빨간 "위험한 사이트"로 오탐(신규도메인+구글로그인+결제 조합). Search Console 보안문제는 "감지된 문제 없음"(정상) → 별도 채널 safebrowsing.google.com/safebrowsing/report_error/ 로 오탐 신고 접수. 해제 대기 중. Vercel env에 PAYPAL_* 6개 모두 라이브로 맞춰야 함(과거 PAYPAL_SECRET만 샌드박스로 남아 결제 500 발생한 적 있음).

**Gumroad 결제 라이프사이클 검증 (2026-07-03):** 형이 06-26 점화테스트로 가입한 K-Saju Premium 구독(permalink `hinuk`, $7.99/월+7일체험)이 체험종료 후 **07-03에 첫 실결제 $8.78 자동청구**(형 신한카드) → **결제→체험→자동갱신 전체 사슬 실카드로 정상작동 확인**. 형이 Gumroad 판매자 대시보드에서 구독 취소함(Membership status=Cancellation pending, 상단 Inactive 뱃지 = 다음달 청구중단, ~08-02 기간종료 후 자동 ended). 우리 DB는 아직 status=active(정상 — pending은 기간말까지 접근유지, 종료웹훅 오면 자동 inactive). **★교훈: 자기 상품에 자기 카드로 테스트결제 금지** — Gumroad가 결제즉시 수수료(~23%) 차감→판매잔액 순액만 남아 **전액환불 시도가 "insufficient balance"로 막힘**(순액~$6는 정기정산으로 통장복귀, 실손실=수수료~$2). 결제흐름 점검은 딴 카드/소액 1회로. **실유료고객 여전히 0명**(나머지 구독 3건=내부 @k-saju.me·example.com 테스트). 다음 목표=첫 진짜 유입. [[project_blog_ksaju]]

**민감정보 취급:** 모든 키(PayPal/Google/AUTH_SECRET/DB)는 Vercel env + 로컬 .env.local(gitignore)에만. 채팅·git·메모리에 값 절대 X. 관련: [[feedback_user_value_first]]
