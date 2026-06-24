# 월 2,000만 매출 점화 — 실행계획서 (Implementation Plan)

> **For agentic workers:** 이 플랜은 모아 본부장 에이전트 위임으로 실행한다(generic subagent 아님). 각 태스크는 owner 본부장이 수행 → qa-lead-jian 검수 → secretary가 형 결재 보고. 체크박스(`- [ ]`)로 진행 추적.

**Goal:** k-saju 결제(Gumroad)를 라이브로 켜 첫 유료결제를 발생시키고, GA4 실측 + 주간 수익 리뷰 루프를 동시에 가동한다.

**Architecture:** A안(단일 라인 올인). 이미 완성된 Gumroad 코드(미커밋)를 커밋·키연결·db push로 라이브화 → 기존 GA4 래퍼(`analytics.ts`/`ga-server.ts`)에 빠진 퍼널 이벤트와 Gumroad 결제 서버이벤트를 연결 → data-finance가 weekly 실측 기록 시작 → CSO가 revenue-review로 주간 갭 루프 가동.

**Tech Stack:** Next.js(App Router) · Prisma · Gumroad API · GA4(gtag + Measurement Protocol) · Vercel(배포) · Neon(DB) · bun. 회사 측: moa-vault(git) · revenue-review/finance-dashboard/completion-gate 스킬.

## Global Constraints

- **목표 = 월 순수익 2,000만원** (1,000만 아님). 모든 수익 산출물 2,000만 기준.
- **API 키는 메모리·transcript·vault·git 어디에도 절대 기록 금지.** 키 입력은 형이 직접(.env.local/Vercel).
- **`prisma db push`는 데이터·PayPal 보존(reset 절대 금지).** 형 승인 후 실행.
- **GA4 이벤트에 PII 금지** — 생년월일/시간/이메일/이름 파라미터 금지, 익명 카운트만.
- **빌드 그린 유지** — 키 빈 값이어도 결제는 PayPal 폴백, GA는 no-op(기존 graceful 설계 유지).
- **30일 성공 = 엔진 점화**(첫 결제1+계기판ON+주간루프), 2,000만 달성 아님. 보고에 이 분리 명시.
- **포트:** saju-studio 3001 / moa-studio 3000.

## File Structure

| 파일 | 책임 | 작업 |
|---|---|---|
| `src/lib/gumroad/client.ts` (283줄) | Gumroad API 클라(완성·미커밋) | 커밋만 |
| `src/app/api/gumroad/checkout/route.ts` | 체크아웃 시작(완성·미커밋) | 커밋만 |
| `src/app/api/webhooks/gumroad/route.ts` (283줄) | 결제 webhook(완성·미커밋) | 커밋 + 서버 purchase 이벤트 연결 |
| `prisma/schema.prisma` | gumroad 필드(수정됨·미스테이징) | 커밋 + db push |
| `.env.example` | GUMROAD_*·GA 키 플레이스홀더 | 커밋 |
| `src/lib/analytics.ts` | 클라 GA4 래퍼(`track`/`getClientId`) | 변경 없음(소비) |
| `src/lib/ga-server.ts` | 서버 MP(`sendServerEvent`) | 변경 없음(소비) |
| `src/app/[locale]/pay/gate/*` | 결제 게이트·체크아웃 버튼 | 퍼널 이벤트 호출 추가 + CRO |
| `moa-vault/10_Wiki/Finance/weekly/` | 실측 스냅샷(텅 빔) | 첫 파일 생성 |

---

## Phase A — 결제 라이브 (W1, owner: 형 + CTO 윤서진)

### Task 1: Gumroad 계정·상품·키 발급 (owner: 형)

**Files:** 없음(외부 콘솔 작업)

- [ ] **Step 1:** gumroad.com 가입(심사 없음)
- [ ] **Step 2:** 상품 2개 생성 — ①구독 Membership $7.99/mo + 7일 트라이얼 ②단발 $4.99. 둘 다 Redirect URL = `https://k-saju.me/pay/return`
- [ ] **Step 3:** Ping URL = `https://k-saju.me/api/webhooks/gumroad` 등록 + 구독상품 resource subscription(sale/refund/cancellation/subscription_updated/subscription_ended) 켜기
- [ ] **Step 4:** 키 4종 확보 — access token(Settings→Advanced→Applications), seller_id(`GET /v2/user`), product_id(`/v2/products`), 두 상품 permalink
- [ ] **Step 5(검증):** 5개 값을 형이 직접 보관(클로에 키 전달 금지, "받았다"만 통지)

**Deliverable:** GUMROAD_ACCESS_TOKEN / SELLER_ID / PRODUCT_ID / SUBSCRIPTION_PERMALINK / ONETIME_PERMALINK 값 형 보유.

### Task 2: 기존 Gumroad 코드 커밋 (owner: CTO)

**Files:** Modify(stage): 위 File Structure의 gumroad 5개 + schema.prisma + .env.example

- [ ] **Step 1:** `cd D:/Develop/saju-studio && git status`로 untracked gumroad 파일 확인
- [ ] **Step 2:** `bun run build`로 현재 빌드 그린 확인 (키 없이도 PayPal 폴백)
- [ ] **Step 3:** `git add src/lib/gumroad src/app/api/gumroad src/app/api/webhooks/gumroad prisma/schema.prisma .env.example` (lemonsqueezy는 별도 보존)
- [ ] **Step 4:** `git commit -m "feat(pay): Gumroad 결제 통합 (키 미설정시 PayPal 폴백)"`
- [ ] **Step 5(검증):** `git log --oneline -1` 커밋 확인. 빌드 재확인.

### Task 3: 키 연결 (owner: CTO, 선행=Task1·2)

**Files:** Modify: `.env.local`(로컬) + Vercel 환경변수(형이 직접 입력)

- [ ] **Step 1:** 형에게 .env.local 입력 위치·키 이름 5개 안내(값은 형이 붙여넣음)
- [ ] **Step 2:** Vercel Project Settings→Environment Variables에 동일 5개 형이 입력(클로는 키 안 만짐)
- [ ] **Step 3(검증):** `gumroad/client.ts`의 `isConfigured()`가 true 반환 — 로컬에서 `bun run dev`(3001) 후 `/pay/gate` 진입 시 provider가 Gumroad로 분기되는지 확인

### Task 4: prisma db push (owner: CTO, 형 승인 게이트)

**Files:** DB 스키마 적용(gumroad nullable 필드)

- [ ] **Step 1:** 형에게 "db push = 데이터·PayPal 보존, reset 아님" 명시하고 승인 요청
- [ ] **Step 2(승인 후):** `bunx prisma db push`
- [ ] **Step 3(검증):** `bunx prisma studio` 또는 쿼리로 Subscription 테이블에 gumroad* 컬럼 존재 + 기존 행 보존 확인

### Task 5: 테스트결제 스모크 (owner: CTO + qa-lead 검수)

**Files:** 없음(런타임 검증)

- [ ] **Step 1:** 실제 테스트결제 1건(단발 $4.99) 진행
- [ ] **Step 2:** Gumroad webhook 수신 → `/v2/sales/:id` 재조회로 seller_id 일치 검증 동작 확인(route.ts 로직)
- [ ] **Step 3:** `/pay/gate`·`/daily` 게이팅이 결제 후 ACTIVE로 열리는지 확인
- [ ] **Step 4(검증·검수):** qa-lead-jian completion-gate — 결제 작동 증거(로그/스크린샷) 통과해야 다음 Phase

---

## Phase B — 계기판 ON (W1, owner: CTO + data-finance 박지원)

### Task 6: Gumroad 결제 서버 purchase 이벤트 연결 (owner: CTO)

**Files:** Modify: `src/app/api/webhooks/gumroad/route.ts`
**Interfaces:** Consumes `sendServerEvent(clientId, events)` from `ga-server.ts`, `syntheticClientId(seed)` — PayPal webhook과 동일 패턴.

- [ ] **Step 1:** `src/app/api/paypal/webhook/route.ts`에서 결제 성공 시 `sendServerEvent`로 `purchase` 보내는 부분을 읽어 패턴 파악(이미 구현됨)
- [ ] **Step 2:** Gumroad webhook의 결제 확정 분기에서 동일하게 `purchase` 이벤트 전송 — Subscription에 저장된 client_id(없으면 `syntheticClientId(gumroadSaleId)`)로 stitching. params = `{ value, currency: 'USD', transaction_id: gumroadSaleId }` (PII 금지)
- [ ] **Step 3(검증):** Task5 테스트결제의 GA4 DebugView에 `purchase` 이벤트 수신 확인. 값/통화 정확.

### Task 7: 퍼널 5단계 이벤트 점검·보강 (owner: CTO)

**Files:** Modify: `src/app/[locale]/pay/gate/page.tsx`·`checkout-button.tsx`, 사주입력/랜딩 컴포넌트
**Interfaces:** Consumes `track(event, params)` from `analytics.ts`.

- [ ] **Step 1:** `grep -rn "track(" src/`로 현재 발화 이벤트 목록 추출
- [ ] **Step 2:** spec 5단계(`landing_view→saju_input→pay_gate_view→checkout_started→purchase_completed`)와 대조해 빠진 단계 식별
- [ ] **Step 3:** 빠진 호출 추가 — 예: 체크아웃 버튼 클릭에 `track('checkout_started', { plan })`, pay/gate 마운트에 `track('pay_gate_view')` (익명 카운트만)
- [ ] **Step 4(검증):** dev에서 퍼널을 한 바퀴 돌며 DebugView에 5단계 모두 순서대로 찍히는지 확인

### Task 8: weekly 실측 스냅샷 첫 기록 (owner: data-finance)

**Files:** Create: `moa-vault/10_Wiki/Finance/weekly/2026-W26.md` (또는 해당 주차)

- [ ] **Step 1:** finance-dashboard 스킬로 스냅샷 템플릿 생성 — 항목: 방문(UV)·사주입력·pay_gate_view·checkout_started·purchase·MRR·구독자수·비용·순이익. 실측/추정 구분 컬럼.
- [ ] **Step 2:** GA4 + Gumroad 대시보드에서 실제 숫자 회수해 채움(없으면 0·"실측0" 명시)
- [ ] **Step 3:** `git add` + commit + push(vault)
- [ ] **Step 4(검증):** weekly/ 폴더에 파일 ≥1 존재, 실측/추정 구분 명확

---

## Phase C — 첫 결제 점화 + 주간 루프 (W1~W2, owner: growth 나래 + content 서아 + CSO 지영)

### Task 9: 첫 트래픽 드라이브 (owner: growth + content)

**Files:** Create: 게시 콘텐츠(블로그/Reddit), vault에 배포 기록

- [ ] **Step 1(growth):** launch ORB 프레임으로 '지금 가능한 채널' 확정 — blog.k-saju.me SEO글 + Reddit(점성술/타로 서브) 2채널 우선(인스타는 Meta차단 풀린 뒤)
- [ ] **Step 2(content):** content-creation 스킬로 채널별 게시용 완성본 제작(블로그 SEO글 1·Reddit 게시물 1·k-saju 유입 CTA 포함). PII·다크패턴 금지, 사용자 가치 먼저.
- [ ] **Step 3:** 게시 시 UTM 부착(`utm_source/medium/campaign`)으로 채널 귀인 측정 가능하게
- [ ] **Step 4(검증):** 게시 URL + UTM 링크 확보, GA4에 해당 source 유입 카운트 확인(W2 리뷰 입력)

### Task 10: 주간 수익 리뷰 루프 첫 가동 (owner: CSO, W2, 선행=Task8)

**Files:** Create: `moa-vault/10_Wiki/Finance/weekly/` 리뷰 산출물

- [ ] **Step 1:** data-finance에 이번 주 지표 요청(측정 먼저, CSO 직접 숫자 안 만듦)
- [ ] **Step 2:** revenue-review 스킬로 "갭(2,000만 대비)→원인(병목 단계)→다음주 액션 정확히 3개(owner)→형 결재요약" 산출
- [ ] **Step 3:** 최대 누수 퍼널 단계 진단(유입 병목 vs 전환 병목) — Task7 퍼널 데이터 기반
- [ ] **Step 4(검증):** 액션 정확히 3개·각 owner 지정·결재요약 1개. qa-lead 검수 통과.

---

## Phase D — 전환·역산 (W3~W4, owner: sales 지오 + CSO + data-finance)

### Task 11: 체크아웃 CRO 1차 (owner: sales, W3)

**Files:** Modify: `src/app/[locale]/pay/gate/page.tsx`·`checkout-button.tsx`

- [ ] **Step 1:** cro 7항목으로 `/pay/gate` 진단 — 가치제안 5초·단일 CTA·신뢰신호(7일 트라이얼·환불)·가격 anxiety·friction
- [ ] **Step 2:** baseline 전환율(checkout_started→purchase) Task7 데이터에서 산출
- [ ] **Step 3:** 가장 큰 누수 1개만 개선(예: CTA 카피·신뢰신호 추가). 빌드 그린.
- [ ] **Step 4(검증):** 변경 전후 전환율 비교 측정(샘플 작으면 "baseline만 확보"로 정직 보고)

### Task 12: 2,000만 도달 경로 역산 (owner: CSO + data-finance, W4)

**Files:** Create: `moa-vault/10_Wiki/Finance/2026-06_2000man-path.md`

- [ ] **Step 1:** 2,000만 = 필요 MRR($15K) 역산 — 객단가($7.99) → 필요 활성 구독자 수
- [ ] **Step 2:** 실측 퍼널 전환율로 필요 트래픽 역산(구독자수 ÷ 전환율 = 필요 방문)
- [ ] **Step 3:** 채널별 유입 목표 분배 + 다음 30일 계획
- [ ] **Step 4(검증):** 역산 문서에 가정·실측 출처 명시. qa-lead 검수.

---

## Phase E — 30일 검수 (owner: qa-lead-jian)

### Task 13: completion-gate 최종 검수

- [ ] **Step 1:** §6 검수기준 5항목 증거 회수 — 라이브결제 작동/GA4 purchase 실측/weekly 파일≥2/첫 결제≥1/역산 문서
- [ ] **Step 2:** PASS면 secretary→형 결재 보고. FAIL이면 담당 본부장 반려(형 거치지 않음).

---

## Self-Review (spec 대조)

- **§1 목표/성공기준** → Global Constraints + Task13 검수 ✅
- **§3 점화 사슬** → Phase A(형키→커밋→연결→push→스모크) 순서 일치 ✅
- **§4.1 계기판** → Task6(서버 purchase)·Task7(퍼널)·Task8(weekly) ✅
- **§4.2 점화 ORB** → Task9 ✅
- **§4.3 체크아웃 CRO** → Task11 ✅
- **§5 마일스톤** → Phase A~D가 W1~W4 매핑 ✅
- **§6 검수** → Task13 ✅
- **§7 리스크** → Global Constraints(키 보안·db보존)·Task10 재진단(트래픽0) 반영 ✅
- 키 보안·PII·db보존·2천만 통일 = Global Constraints에 verbatim ✅

근거 spec: `2026-06-25-revenue-ignition-design.md`
