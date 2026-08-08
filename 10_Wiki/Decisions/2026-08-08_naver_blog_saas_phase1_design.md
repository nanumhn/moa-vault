# 네이버 블로그 자동화 SaaS — 페이즈1 설계 (화면 · DB 스키마 · 인터페이스 스펙)

작성: 윤서진(CTO) · 2026-08-08 · **rev3 (qa-lead-jian 2차 검수 FAIL 반영 재제출)**
선행 결정문서: [[2026-08-08_naver_blog_saas_plan]] (형 결재 완료 · 노선 ㉡ 사용자 PC 설치형 확정)
상태: **설계 초안 rev3 — qa-lead-jian 3차 검수 대기**

> 결정문서 관례를 따라 전문용어에는 괄호로 짧은 한글 설명을 붙였다.

---

## rev3 변경 이력 (2차 검수 지적 5건 처리)

2차 검수에서 D2~D9는 통과. **D1이 층만 옮겨 살아있었고 신규 중대 2건**이 나왔다.

| # | 지적 | 처리 | 반영 위치 |
|---|---|---|---|
| **E1** | D1이 L4만 계산하고 **L2를 모델링 안 함**. 문서 문자 그대로면 100% SKIPPED. 게다가 3-1의 "12h"와 3-2 규칙B의 "11h15m"이 문서 내부에서 모순 | **수정** — 지적이 맞다. QA의 **100.00%를 그대로 재현**했다. 근본원인은 L2가 `now()`(예정 35분 전)를 기준으로 삼은 것. **L2·L4를 동일 임계(11h15m)·동일 컬럼(`publishAttemptAt`)·동일 술어로 통일**하되 L2의 좌변을 `now()`가 아니라 **잡의 예정 실행시각**으로 바꿔 리드타임 의존성 자체를 제거. 두 프레이밍 모두 **0.00%**, 리드타임 35·60분 무관 | 3-1, 3-2 |
| **E2** | CHECK#2 + unique 조합 때문에 **MANUAL/RETRY 잡을 INSERT할 자리가 없음**(EXPIRED 후 수동발행이 unique violation) | **수정** — `PublishSlot` 테이블로 분리. 슬롯(하루 2개 상한)과 잡 시도(N회)를 1:N 정규화. 슬롯 예약을 **발행 전에** 잡으므로 중복 방어도 같이 강해짐 | 2-1, 2-2, 2-5 |
| **E3** | 지연흡수에 복귀규칙이 없어 예약시각이 **영구 이탈**(09:00→11:30 고착), `deferCount` 상한2는 절대 안 걸림 | **수정** — 재현 확인. 흡수 목표를 `직전+12h`(여유 0을 재생성하던 원인) → **`직전+11h20m`**로 바꾸니 **드리프트가 슬롯당 40분씩 감쇠**해 최대 4슬롯(2일) 안에 정시 복귀. 그 과정에서 하드룰은 한 번도 안 깨짐 | 3-2 ④ |
| **E4** | 변경이력 D3행 "CHECK 3개"인데 실제 5개 (D7과 같은 종류 실수 재발) | **수정** — 스크립트로 세어 **6개**로 정정(E2로 1개 증가). 문서의 모든 개수 표기를 grep으로 재검증 | 변경이력, 2-4 |
| **E5** | `skipReason` 값이 스키마 주석 4개 / 5-2장 5개로 불일치 | **수정** — **6개로 단일화**하고 2-5에서만 정의, 다른 곳은 참조만 | 2-2, 2-5, 5-2 |
| 권고 | 45분 허용오차는 수용 가능하나, 공통지터로 같은 날 간격이 12h로 **결정화**되는 부작용(지터 본래 목적=패턴 은닉과 역행)을 남길 것 | **반영** | 10장 |

---

## rev2 변경 이력 (1차 검수 지적 9건 처리)

| # | 지적 | 처리 | 반영 위치 |
|---|---|---|---|
| **D1** | 지터 ±10분 때문에 두 번째 발행의 50%가 조용히 SKIPPED | **수정** — 시뮬레이션으로 재현(49.86%) 후 3개 조치: 슬롯 간격 12h 고정 · 하루 공통 지터 · **실측 허용오차 45분** · 지연 흡수(deferral). 재시뮬 결과 위반 0.00% | 3-2 |
| **D2** | 12시간을 어느 컬럼으로 재는지 미정의 → 중복발행 위험 | **수정** — 기준 컬럼 `publishAttemptAt` 신설·명시, 판정 SQL 원문 기재. `postedAt`/`finishedAt`은 쿼터 판정 사용 금지 명문화 | 3-3 |
| **D3** | L3(DB유니크)가 slotIndex=2를 못 막아 실제로 3중 | **수정** — Prisma가 CHECK 미지원임을 인정하고 초기 마이그레이션에 raw SQL CHECK 제약 추가(**rev3 기준 6개**, E4로 개수 정정). 잘못된 주석 삭제 | 2-4, 8장 |
| **D4** | VERIFY(검증) 잡이 모델·API에 없음 → 3-2·7장이 실행 불가 | **수정** — `JobKind` enum, `verifyTargetJobId` 자기참조, claim/result 스펙에 VERIFY 분기, 이벤트 4종 추가 | 2-3, 3-4, 5-2 |
| **D5** | 화면↔스키마 불일치 4건 | **수정** — `Blog.preferredAgentId` / 본문 스냅샷 3필드 / `Payment` 모델 / `User.role` 추가 | 2-3 |
| **D6** | 가격 확정을 페이즈2로 조용히 이월 | **수정** — 9장 #2를 "추천안"이 아니라 **"미이행 · 이월 승인 요청"**으로 표기 | 9장 |
| **D7** | 규모 표기 오류(테이블 12→15, 화면 11→13) | **수정** — 모델 16개(Payment 추가), 화면 13개로 정정 | 전역 |
| **D8** | claim 200 예시에 `skipped` 누락, 사유 저장 컬럼 없음 | **수정** — 예시 보강 + `PublishJob.skipReason` 추가 | 2-3, 5-2 |
| **D9** | 구글 OAuth 선택 시 refresh_token 평문 저장 | **수정** — 6장 보안표에 앱레벨 암호화 항목 추가 | 6장 |
| — | 자정경계 차단 주체를 L2로 잘못 기술 | **수정** — L2/L4가 각각 어느 타이밍을 담당하는지 정확히 재기술 | 3-1 |

---

## 0. 이 문서가 확정하는 것 / 확정하지 않는 것

| | 내용 |
|---|---|
| **확정(승인 대상)** | ① DB 스키마 **모델 17개** + raw SQL CHECK 제약 **6개** ② 웹 대시보드 **화면 13개** ③ PC 에이전트↔서버 인터페이스 **엔드포인트 7개** ④ 발행 제약(하루 2회·12시간) 강제 지점 4곳 + 근거 계산 |
| **확정 안 함(형 결재 필요, 9장)** | 요금 금액(**미이행·이월 승인 요청**) · 구글시트 연결 방식 · 에이전트 배포/코드서명 · 신규 레포/포트 |
| **범위 밖(절대 안 만듦)** | 사용자 네이버 아이디·비밀번호·세션쿠키의 서버 저장 (선행문서 5장) |

### 0-1. 설계를 관통하는 4개 원칙
1. **서버는 비밀을 모른다.** 네이버 인증정보는 사용자 PC 밖으로 나오지 않는다. 에이전트는 "로그인 되어 있음/없음"과 "블로그 ID"만 보고한다.
2. **발행 경로에 AI가 없다.** 본문은 발행 시점에 만드는 게 아니라 미리 시트/DB에 들어와 있다. 로컬 LLM이 죽어도 발행은 안 멈춘다.
3. **중복 발행은 실패보다 나쁘다.** "결과를 모르겠는 상태(UNVERIFIED)"는 자동 재시도하지 않고 검증 잡으로만 구제한다(3-4).
4. **하드 룰은 한 곳에 두지 않는다.** 하루 2회·12시간 제약은 UI·잡생성기·DB제약·수령시점 4중으로 막는다(3장).

---

## 1. 시스템 구성

```
[사용자 브라우저]
      │ NextAuth v5 세션
      ▼
[웹 대시보드 + API]  Next.js 16 (App Router)
      │                    ├─ /api/agent/v1/*        (에이전트 전용, Bearer 토큰)
      │                    └─ /api/internal/cron/*   (스케줄러, 시크릿 헤더)
      ▼
[PostgreSQL]  Prisma 6
      ▲                    ▲
      │                    │
[시트 동기화 워커]     [글감 생성 워커(업셀 전용)]
 Google Sheets API      로컬 LLM (LM Studio, 배치·비실시간)
                             │
                    (여기까지 서버 영역 — 네이버 접속 없음)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    (여기부터 사용자 PC — 네이버 접속 있음)
[PC 에이전트]  트레이 앱
   폴링으로 잡 수령 → 사용자 본인 크롬의 실제 네이버 세션으로 발행 → 결과 보고
```

- **경계선의 의미**: 네이버에 접속하는 코드는 전부 사용자 PC 안에만 있다. 우리 서버는 네이버와 통신하지 않는다. 선행문서 5장 보안원칙의 구조적 구현이다.
- 에이전트 기술 스택은 페이즈2 확정. 현재 유력안은 **트레이 앱(Tauri/Electron) + Playwright·CDP로 사용자 기본 크롬 프로필에 attach**.

---

## 2. DB 스키마

PostgreSQL + Prisma 6 (saju-studio와 동일 스택). 시각 컬럼은 전부 UTC 저장, 표시·쿼터 계산만 블로그별 타임존 적용.

### 2-1. 모델 17개

| 모델 | 역할 | 핵심 관계 |
|---|---|---|
| `User` | 사용자(테넌트) + **role(운영자 권한)** | 최상위 |
| `Account` / `Session` / `VerificationToken` | NextAuth v5 표준 | User 1:N |
| `Plan` | 요금제 정의(코드·쿼터) | 마스터 |
| `Subscription` | 사용자의 구독·애드온 | User 1:1 |
| **`Payment`** | **결제 이력(S10)** | User 1:N |
| `Blog` | 연결된 네이버 블로그 | **User 1:N (최대 3)** |
| `Agent` | 페어링된 PC | User 1:N |
| `PairingCode` | 1회용 페어링 코드 | User 1:N |
| `SheetSource` | 구글시트 연동 | Blog 1:1 |
| `ContentItem` | 글감(제목·본문) | Blog 1:N |
| `Schedule` | 예약 슬롯 **정의**(요일·시각) | **Blog 1:N (최대 2)** |
| **`PublishSlot`** | **하루치 발행 자리(쿼터 토큰). 하루 2개가 상한** | **Blog 1:N (하루 최대 2)** |
| `PublishJob` | 한 슬롯에 대한 **시도 1회** / 검증 잡 | **PublishSlot 1:N**, 자기참조 |
| `JobEvent` | 잡 단계 타임스탬프 로그 | PublishJob 1:N |
| `AuditEvent` | 계정·설정·페어링 변경 로그 | User 1:N |

**이벤트 테이블을 둘로 나눈 이유**: `JobEvent`는 잡 1건당 5~8행씩 쌓이는 고빈도·정형 로그라 `jobId` 하나로 빠르게 긁어야 한다. `AuditEvent`는 저빈도·비정형(보안 감사용)이다. 한 테이블에 섞으면 잡 타임라인 조회가 전체 스캔이 되고, 보존기간(잡 90일 / 감사 365일)도 따로 못 준다.

**[E2] 슬롯과 잡을 분리한 이유 (rev3 신규)**: rev2는 `PublishJob`에 `slotDate`·`slotIndex`를 직접 달고 거기에 유니크를 걸었다. 그 결과 **"하루 2회"가 "블로그·날짜당 잡 행 2개"로 잘못 표현**됐고, 슬롯0이 `EXPIRED`(PC 꺼짐)된 뒤 사용자가 수동 발행이나 재시도를 하면 **행이 이미 있어서 unique violation이 나 재시도 자체가 구조적으로 불가능**했다(2차 검수 지적 E2). 7장이 약속한 "실패 시 재시도·수동 발행" 선택지가 DB 레벨에서 막혀 있던 것이다.

rev3은 개념을 둘로 나눈다.
- **`PublishSlot` = 자리(쿼터).** `(blogId, slotDate, slotIndex)` 유니크 + `slotIndex ∈ {0,1}` → **하루 최대 2자리**. 이게 L3의 진짜 주체다.
- **`PublishJob` = 그 자리에 대한 시도.** 한 자리에 여러 번 시도(최초·재시도·수동 대체)가 매달릴 수 있다.

부수 효과로 중복 방어가 더 강해진다. **슬롯 점유(`consumedAt`)를 에이전트가 발행하기 전, 잡 수령 시점에 원자적으로 잡기 때문**이다. rev2처럼 "발행 후 상태 전이 때 유니크로 막는" 방식은 이미 글이 올라간 뒤에 실패하므로 원칙3(중복 발행은 실패보다 나쁘다)을 지킬 수 없다.

### 2-2. Prisma 스키마

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_URL_UNPOOLED")
}

// ─────────────────────────── 사용자 / 인증 ───────────────────────────

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  emailVerified DateTime?
  timezone      String    @default("Asia/Seoul")

  // [D5] 운영자 콘솔(A1) 접근 권한. MEMBER는 /admin 라우트 진입 자체가 404
  role UserRole @default(MEMBER)

  notifyEmail     Boolean @default(true)
  notifyOnFailure Boolean @default(true)
  notifyOnOffline Boolean @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  accounts     Account[]
  sessions     Session[]
  subscription Subscription?
  payments     Payment[]
  blogs        Blog[]
  agents       Agent[]
  pairingCodes PairingCode[]
  auditEvents  AuditEvent[]
}

enum UserRole {
  MEMBER
  ADMIN
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  // [D9] 구글시트 연동을 OAuth로 갈 경우 이 두 컬럼에 구글 토큰이 들어온다.
  //      DB 평문 저장 금지 — 앱 레벨 AES-256-GCM 암호문만 저장(6장).
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ─────────────────────────── 요금제 / 구독 / 결제 ───────────────────────────

model Plan {
  code            String  @id            // "BASIC" | "PRO" ...
  name            String
  blogQuota       Int     @default(1)
  aiDraftIncluded Boolean @default(false)
  priceKrw        Int?                   // [미확정] 9장 #2 결재 전까지 null
  isActive        Boolean @default(true)
  sortOrder       Int     @default(0)

  subscriptions Subscription[]
}

model Subscription {
  id     String @id @default(cuid())
  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  planCode String
  plan     Plan               @relation(fields: [planCode], references: [code])
  status   SubscriptionStatus @default(TRIALING)

  // ── 업셀 애드온 2종 (선행문서 3·7장) ──
  extraBlogSlots Int     @default(0)   // plan.blogQuota + 이 값 <= 3 (앱 + CHECK 제약)
  aiDraftEnabled Boolean @default(false)

  billingProvider        String?
  externalCustomerId     String?
  externalSubscriptionId String? @unique

  currentPeriodEnd DateTime?
  trialEndsAt      DateTime?
  canceledAt       DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([status])
}

enum SubscriptionStatus {
  TRIALING
  ACTIVE
  PAST_DUE
  CANCELED
}

// [D5] S10 결제 이력 화면의 데이터 원천
model Payment {
  id     String @id @default(cuid())
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  provider          String    // 결제 레일(페이즈2 확정)
  externalPaymentId String?   @unique
  amountKrw         Int
  status            PaymentStatus @default(PAID)
  paidAt            DateTime
  periodStart       DateTime?
  periodEnd         DateTime?
  receiptUrl        String?
  memo              String?

  createdAt DateTime @default(now())

  @@index([userId, paidAt])
}

enum PaymentStatus {
  PAID
  REFUNDED
  FAILED
}

// ─────────────────────────── 블로그 (1:N, 최대 3) ───────────────────────────

model Blog {
  id     String @id @default(cuid())
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  naverBlogId String
  displayName String
  timezone    String     @default("Asia/Seoul")
  status      BlogStatus @default(PENDING_VERIFY)

  // 소유 증명: 서버가 확인할 방법이 없으므로 "그 PC의 네이버 로그인 세션이
  // 이 blogId를 소유한다"는 에이전트 보고로 갈음한다.
  // 에이전트가 삭제돼도 증명 이력은 남아야 하므로 관계가 아닌 값으로 보관.
  verifiedAt        DateTime?
  verifiedByAgentId String?

  // [D5] S6·7장 "선호 기기". null이면 아무 에이전트나 수령 가능.
  preferredAgentId String?
  preferredAgent   Agent?  @relation("PreferredAgent", fields: [preferredAgentId], references: [id], onDelete: SetNull)

  // [D1] 지터는 슬롯이 아니라 블로그 단위. 같은 날 두 슬롯에 동일 오프셋을
  //      적용해 같은 날 간격이 항상 정확히 12시간이 되게 만든다(3-2).
  jitterSec Int @default(600)   // 상한 600 — 앱 + CHECK 제약

  defaultCategoryName String?
  defaultOpenType     String  @default("PUBLIC")   // PUBLIC | NEIGHBOR | PRIVATE
  defaultAllowComment Boolean @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  sheetSource SheetSource?
  schedules   Schedule[]
  slots       PublishSlot[]
  contents    ContentItem[]
  jobs        PublishJob[]

  // 같은 사용자가 같은 블로그를 두 번 등록하는 것만 막는다.
  // 전역 unique로 안 하는 이유: 대행사가 고객 블로그를 관리하는 정당한 경우가
  // 있고, 전역 unique는 "선점 등록"으로 남의 블로그를 막아버리는 부작용이 있다.
  @@unique([userId, naverBlogId])
  @@index([status])
}

enum BlogStatus {
  PENDING_VERIFY   // 에이전트 소유 확인 전 — 발행 불가
  ACTIVE
  PAUSED
  DISCONNECTED
}

// ─────────────────────────── 에이전트 / 페어링 ───────────────────────────

model Agent {
  id     String @id @default(cuid())
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  deviceName    String
  os            String
  osVersion     String?
  machineIdHash String   // PC 식별자의 해시. 원본 하드웨어 ID 미저장
  agentVersion  String

  // ★ 토큰 원문 미저장. sha256 해시만.
  tokenHash      String    @unique
  tokenIssuedAt  DateTime  @default(now())
  tokenExpiresAt DateTime
  revokedAt      DateTime?
  revokedReason  String?

  lastSeenAt    DateTime?
  lastStatus    AgentRunState @default(IDLE)
  naverLoggedIn Boolean       @default(false)
  knownBlogIds  String[]
  nextPollSec   Int           @default(60)
  lastIpHash    String?       // 감사용. 원본 IP 미저장

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  claimedJobs       PublishJob[]
  preferredForBlogs Blog[]       @relation("PreferredAgent")

  @@index([userId, revokedAt])
  @@index([lastSeenAt])
}

enum AgentRunState {
  IDLE
  BUSY
  ERROR
}

model PairingCode {
  id     String @id @default(cuid())
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  codeHash       String    @unique   // 코드 원문 미저장
  expiresAt      DateTime            // 발급 +10분
  usedAt         DateTime?
  usedByAgentId  String?
  failedAttempts Int       @default(0)
  voidedAt       DateTime?           // 5회 실패 시 폐기

  createdAt DateTime @default(now())

  @@index([userId, expiresAt])
}

// ─────────────────────────── 글감 (구글시트) ───────────────────────────

model SheetSource {
  id     String @id @default(cuid())
  blogId String @unique
  blog   Blog   @relation(fields: [blogId], references: [id], onDelete: Cascade)

  spreadsheetId String
  sheetName     String @default("글감")
  headerRow     Int    @default(1)

  lastSyncedAt   DateTime?
  lastSyncStatus String?   // OK | PERMISSION_DENIED | SCHEMA_MISMATCH | NOT_FOUND
  lastSyncError  String?
  syncedRowCount Int       @default(0)

  writeBackEnabled Boolean @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model ContentItem {
  id     String @id @default(cuid())
  blogId String
  blog   Blog   @relation(fields: [blogId], references: [id], onDelete: Cascade)

  source     ContentSource @default(SHEET)
  sheetRowNo Int?          // 시트 원본 행 번호 (write-back 대상)

  title        String
  bodyHtml     String    @db.Text   // 스마트에디터3.0 서식 규격
  tags         String[]
  categoryName String?
  desiredDate  DateTime? @db.Date
  priority     Int       @default(0)

  status     ContentStatus @default(READY)
  statusNote String?

  contentHash String   // 제목+본문 sha256. 중복 글감 탐지 + 검증 잡 대조 키
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  jobs PublishJob[]

  @@index([blogId, status, desiredDate, priority])
  @@unique([blogId, sheetRowNo])
}

enum ContentSource {
  SHEET     // 사용자가 시트에 직접 채움 (기본플랜)
  AI_DRAFT  // 배치 워커가 채움 (업셀)
  MANUAL    // 대시보드에서 직접 입력
}

enum ContentStatus {
  DRAFT
  READY
  ASSIGNED
  PUBLISHED
  FAILED
  SKIPPED
}

// ─────────────────────────── 예약 (블로그당 정확히 2슬롯) ───────────────────────────

model Schedule {
  id     String @id @default(cuid())
  blogId String
  blog   Blog   @relation(fields: [blogId], references: [id], onDelete: Cascade)

  slotIndex Int   // 0 | 1 — CHECK 제약으로 값 제한(2-4)
  hour      Int   // slot0은 0~11만 허용(3-2). slot1 = slot0 + 12h 자동 산출
  minute    Int
  weekdays  Int[] // 0(일)~6(토). 비우면 매일
  enabled   Boolean @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([blogId, slotIndex])
}

// ─────────────────────────── 발행 슬롯(쿼터) ───────────────────────────

// [E2] "하루 최대 2회"를 표현하는 유일한 주체. 잡이 아니라 이 테이블에 유니크가 걸린다.
model PublishSlot {
  id     String @id @default(cuid())
  blogId String
  blog   Blog   @relation(fields: [blogId], references: [id], onDelete: Cascade)

  slotDate  DateTime @db.Date   // 블로그 타임존 기준 날짜
  slotIndex Int                 // 0 | 1 — CHECK 제약(2-4)
  plannedAt DateTime            // 지터 적용 전 기준시각. 12시간 계획 검사의 기준(3-2 규칙A)

  // 점유는 "에이전트가 발행하기 전"(잡 수령 시점)에 원자적으로 잡는다.
  // 잡이 publishAttemptAt 없이 FAILED/EXPIRED로 끝나면 NULL로 되돌려 재시도를 허용하고,
  // publishAttemptAt이 찍혔으면(=올라갔을 수 있음) 영구 점유로 남긴다.
  consumedAt      DateTime?
  consumedByJobId String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  jobs PublishJob[]

  @@unique([blogId, slotDate, slotIndex])
  @@index([blogId, slotDate])
}

// ─────────────────────────── 발행 잡 / 검증 잡 ───────────────────────────

model PublishJob {
  id     String @id @default(cuid())
  blogId String
  blog   Blog   @relation(fields: [blogId], references: [id], onDelete: Cascade)

  // [D4] 잡 종류. VERIFY는 UNVERIFIED 구제 전용이며 슬롯을 소비하지 않는다.
  kind JobKind @default(PUBLISH)

  // [E2] PUBLISH 잡은 슬롯에 반드시 매달리고, VERIFY 잡은 절대 안 매달린다(CHECK 제약).
  //   한 슬롯에 여러 시도(최초·재시도·수동 대체)가 attemptSeq로 구분돼 공존한다.
  slotId     String?
  slot       PublishSlot? @relation(fields: [slotId], references: [id], onDelete: Cascade)
  attemptSeq Int          @default(1)

  contentItemId String?
  contentItem   ContentItem? @relation(fields: [contentItemId], references: [id])

  // [D4] VERIFY 잡이 확인하려는 대상 발행 잡 (자기참조)
  verifyTargetJobId String?
  verifyTarget      PublishJob?  @relation("VerifyTarget", fields: [verifyTargetJobId], references: [id])
  verifyJobs        PublishJob[] @relation("VerifyTarget")

  // 지터·지연흡수가 반영된 실제 목표시각
  scheduledAt DateTime
  expiresAt   DateTime            // slot.plannedAt + 3시간
  origin      JobOrigin @default(SCHEDULED)

  status      JobStatus @default(QUEUED)
  attempt     Int       @default(0)
  maxAttempts Int       @default(3)
  deferCount  Int       @default(0)   // [E3] 지연 흡수 횟수. 안전 상한 6(정상 수렴은 4 이내)
  skipReason  String?                 // 값 정의는 2-5 한 곳에서만

  claimedByAgentId String?
  claimedByAgent   Agent?    @relation(fields: [claimedByAgentId], references: [id])
  claimedAt        DateTime?
  leaseExpiresAt   DateTime?

  // [D2] ★12시간 판정의 유일한 기준 컬럼.
  //   PUBLISH_SUBMITTED 이벤트 수신 시각(= 발행 버튼을 누른 시각)을 기록한다.
  //   이벤트를 못 받고 result만 온 경우 result 수신 시각으로 보정 기록.
  //   SUBMITTED / UNVERIFIED / VERIFIED 전 상태에서 NOT NULL이 보장된다.
  publishAttemptAt DateTime?

  // [D5] 발행 당시 본문 스냅샷 — 글감이 나중에 수정·삭제돼도 S9d에서 실제
  //      올라간 내용을 보여줘야 하고, 검증 잡의 대조 기준이기도 하다.
  titleSnapshot    String?
  bodySnapshotHtml String?  @db.Text
  tagsSnapshot     String[]
  contentHash      String?

  idempotencyKey String    @unique   // 결과 보고 중복 차단
  postUrl        String?
  postedAt       DateTime?           // 표시용. ★쿼터 판정에 쓰지 않음(3-3)
  errorCode      String?
  errorMessage   String?
  finishedAt     DateTime?           // 표시용. ★쿼터 판정에 쓰지 않음(3-3)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  events JobEvent[]

  // [E2] 하루 2회 상한은 PublishSlot이 담당한다. 여기서는 한 슬롯 안에서
  //      시도 번호가 겹치지 않는 것만 보장한다(재시도·수동 대체 허용).
  @@unique([slotId, attemptSeq])
  @@index([status, scheduledAt])
  @@index([blogId, kind, status])
  @@index([blogId, publishAttemptAt])
}

enum JobKind {
  PUBLISH
  VERIFY
}

enum JobOrigin {
  SCHEDULED
  MANUAL
  RETRY
  VERIFY_FOLLOWUP   // [D4] UNVERIFIED 후속 검증
}

enum JobStatus {
  QUEUED
  CLAIMED
  RUNNING
  SUBMITTED
  VERIFIED
  UNVERIFIED   // ★자동 재시도 금지. VERIFY 잡으로만 구제
  FAILED
  EXPIRED
  CANCELED
  SKIPPED
}

model JobEvent {
  id    String     @id @default(cuid())
  jobId String
  job   PublishJob @relation(fields: [jobId], references: [id], onDelete: Cascade)

  type       String
  at         DateTime            // 발생 시각(에이전트 보고분은 서버시간으로 보정)
  recordedAt DateTime @default(now())
  actor      String              // "server" | "agent:<id>" | "user:<id>"
  detail     Json?

  @@index([jobId, at])
}

model AuditEvent {
  id     String @id @default(cuid())
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  type       String
  entityType String?
  entityId   String?
  ipHash     String?
  detail     Json?
  at         DateTime @default(now())

  @@index([userId, at])
}
```

### 2-3. 잡 단계 이벤트 타입

정상 수명은 아래 순서로 **각각 1행씩** `JobEvent`에 남는다. S9d가 이걸 세로 타임라인으로 그린다.

| 순서 | type | 주체 | 의미 |
|---|---|---|---|
| 1 | `JOB_CREATED` | server | 슬롯 잡 생성 |
| 2 | `CONTENT_BOUND` | server | 글감 바인딩 + 본문 스냅샷 확정 |
| 3 | `JOB_CLAIMED` | agent | 수령(리스 시작) |
| 4 | `AGENT_SESSION_OK` | agent | 네이버 로그인 확인 |
| 5 | `EDITOR_OPENED` | agent | 에디터 진입 |
| 6 | `CONTENT_FILLED` | agent | 제목·본문·태그 입력 완료 |
| 7 | `PUBLISH_SUBMITTED` | agent | **발행 버튼 클릭 → 서버가 `publishAttemptAt` 기록** |
| 8 | `PUBLISH_VERIFIED` | agent | 결과 URL 확인 → 성공 |
| — | `PUBLISH_UNVERIFIED` | agent | 눌렀으나 URL 확인 실패 |
| — | `VERIFY_SCHEDULED` | server | [D4] 검증 잡 생성 |
| — | `VERIFY_STARTED` | agent | [D4] 최근 글 목록 조회 시작 |
| — | `VERIFY_FOUND` | agent | [D4] 일치 글 발견 → 대상 잡 VERIFIED 승격 |
| — | `VERIFY_NOT_FOUND` | agent | [D4] 없음 → 대상 잡 FAILED, 재시도 가능 |
| — | `VERIFY_INCONCLUSIVE` | agent | [D4] 판단 불가 → UNVERIFIED 유지, 사람 확인 |
| — | `JOB_FAILED` | agent/server | 실패 확정(errorCode 포함) |
| — | `JOB_RETRY_SCHEDULED` | server | 재시도 예약 |
| — | `JOB_DEFERRED` | server | [D1] 지연 흡수로 목표시각 재조정 |
| — | `LEASE_RENEWED` / `LEASE_EXPIRED` | server | 리스 갱신/만료 |
| — | `JOB_SKIPPED` | server | 제약 위반(skipReason 동봉) |
| — | `JOB_EXPIRED` | server | 슬롯 만료(PC 꺼짐 등) |
| — | `JOB_CANCELED` | user | 사용자 취소 |

보존기간: `JobEvent` 90일 / `AuditEvent` 365일 (일 배치 삭제).

### 2-4. [D3] Prisma로 표현 안 되는 제약 — 초기 마이그레이션 raw SQL

**Prisma 6은 CHECK 제약을 스키마 문법으로 지원하지 않는다.** 1차 설계에서 "`slotIndex Int` + 유니크로 3번째 잡이 물리적으로 안 생긴다"고 쓴 것은 **사실이 아니었다**(slotIndex=2가 그냥 INSERT됨). 아래 SQL을 **초기 마이그레이션에 포함해야만** L3가 성립한다.

```sql
-- 1) 예약 정의의 슬롯 인덱스는 0 또는 1만
ALTER TABLE "Schedule" ADD CONSTRAINT schedule_slot_index_range
  CHECK ("slotIndex" IN (0, 1));

-- 2) [E2] 실제 쿼터를 쥔 슬롯도 0 또는 1만.
--    이 CHECK + @@unique(blogId, slotDate, slotIndex) 조합이 "하루 최대 2자리"의 실체다.
ALTER TABLE "PublishSlot" ADD CONSTRAINT publish_slot_index_range
  CHECK ("slotIndex" IN (0, 1));

-- 3) [E2] 발행 잡은 슬롯에 반드시 매달리고, 검증 잡은 절대 안 매달린다
ALTER TABLE "PublishJob" ADD CONSTRAINT publish_job_slot_shape CHECK (
  ("kind" = 'PUBLISH' AND "slotId" IS NOT NULL)
  OR
  ("kind" = 'VERIFY'  AND "slotId" IS NULL)
);

-- 4) 블로그 상한 3개 (Plan.blogQuota + extraBlogSlots <= 3)
ALTER TABLE "Subscription" ADD CONSTRAINT subscription_extra_slots_range
  CHECK ("extraBlogSlots" BETWEEN 0 AND 2);

-- 5) 지터 상한 600초 — 3-2의 허용오차 계산이 이 상한에 의존한다
ALTER TABLE "Blog" ADD CONSTRAINT blog_jitter_range
  CHECK ("jitterSec" BETWEEN 0 AND 600);

-- 6) 슬롯0은 오전(0~11시)만 — slot1 = slot0 + 12h가 같은 달력일에 들어오게(3-2)
ALTER TABLE "Schedule" ADD CONSTRAINT schedule_hour_shape CHECK (
  ("slotIndex" = 0 AND "hour" BETWEEN 0 AND 11) OR
  ("slotIndex" = 1 AND "hour" BETWEEN 12 AND 23)
);
```

> **[E2] rev2에서 바뀐 점**: rev2의 CHECK#2는 `PublishJob`에 `slotDate`/`slotIndex`를 강제해 **블로그·날짜당 PUBLISH 행이 영구히 2개로 고정**됐고, 그래서 `EXPIRED` 후 수동 발행·재시도가 unique violation으로 막혔다. rev3은 쿼터를 `PublishSlot`으로 옮겼기 때문에 **자리는 2개로 유지되면서 그 자리에 대한 시도는 여러 번 가능**하다.

> `prisma migrate dev` 로 생성된 SQL 파일 끝에 위 5개를 손으로 덧붙이고, 이후 `prisma migrate diff` 로 드리프트가 안 나는지 확인한다. **CI에 "CHECK 제약 5개 존재 확인" 테스트를 넣는다** — 나중에 누가 마이그레이션을 재생성하면 조용히 사라지는 종류의 방어이기 때문이다.

**검증 상태 (정직하게 구분)**
- **[확인]** 위 SQL이 참조하는 테이블·컬럼 식별자는 `prisma migrate diff --from-empty --script`로 실제 DDL을 뽑아 대조했다. `"PublishJob"."kind"`는 `CREATE TYPE "JobKind" AS ENUM ('PUBLISH','VERIFY')` 타입, `"PublishJob"."slotId" TEXT` nullable, `"PublishSlot"."slotIndex" INTEGER`, `"Schedule"."slotIndex"·"hour"`, `"Blog"."jitterSec"`, `"Subscription"."extraBlogSlots"` 모두 존재하며 대소문자 인용도 일치한다. `PublishSlot_blogId_slotDate_slotIndex_key`, `PublishJob_slotId_attemptSeq_key` 유니크 인덱스도 실제로 생성된다.
- **[미검증]** 위 6개 `ALTER TABLE` 문을 **실제 Postgres에서 실행해 보지는 못했다.** 로컬에 Postgres 컨테이너·이미지가 없고 docker pull이 막혀 있다. 따라서 "3번째 슬롯 INSERT가 거부된다"는 것은 아직 **설계상 주장이지 실행 확인이 아니다.** 페이즈2 첫 마이그레이션에서 반드시 실측하고, 8장 테스트 목록이 그 확인을 담당한다. (1차 설계에서 "물리적으로 안 생긴다"고 단정했다가 반려된 것과 같은 실수를 반복하지 않기 위해 명시한다.)

### 2-5. [E5] `skipReason` 표준값 — 정의는 여기 한 곳에만

rev2는 스키마 주석(4개)과 5-2장(5개)에 따로 적어 불일치가 났다. rev3은 아래 **6개**를 유일한 정의로 두고, 스키마 주석·API 스펙·S9 화면은 전부 이 표를 참조만 한다.

| 값 | 언제 | 사용자에게 보이는 문장 |
|---|---|---|
| `MIN_INTERVAL_12H` | 규칙B(11h15m) 위반이고 지연 흡수도 불가 | "직전 글과 너무 가까워 이번 발행을 건너뛰었습니다" |
| `DAILY_QUOTA` | 그날 슬롯 2개가 이미 점유됨 | "오늘 발행 2회를 모두 사용했습니다" |
| `NO_CONTENT` | 바인딩할 `READY` 글감 없음 | "발행할 글감이 없습니다" |
| `BLOG_PAUSED` | 블로그가 `PAUSED`/`DISCONNECTED`/`PENDING_VERIFY` | "블로그가 일시중지 상태입니다" |
| `AGENT_NOT_PREFERRED` | 선호 기기 지정 + 그 기기가 15분 내 온라인 | "지정하신 PC에서 발행을 기다리는 중입니다" |
| `SUBSCRIPTION_INACTIVE` | 구독이 `PAST_DUE`/`CANCELED` | "구독 상태를 확인해 주세요" |

---

## 3. 발행 제약(하루 2회 · 최소 12시간)의 강제 — 재설계

### 3-1. 4중 방어선 (각 층이 담당하는 타이밍)

**[E1] rev3의 핵심 변경 — L2와 L4는 완전히 같은 술어를 쓴다.**

```
              GATE = 12h − 45분(허용오차) = 11h15m
    통과 조건 :  candidateRunAt − lastPublishAttemptAt  ≥  GATE

    L2 :  candidateRunAt = 그 잡의 예정 실행시각(scheduledAt)   ← now() 아님
    L4 :  candidateRunAt = 실제 수령 시각(now())
```

| 층 | 위치 | candidateRunAt | 담당 타이밍 |
|---|---|---|---|
| L1 | 예약 설정 화면(S8) | — | 사용자가 설정을 저장할 때. 슬롯 3개째 추가 불가, 슬롯1은 슬롯0+12h로 자동 고정 |
| L2 | 잡 생성기 `slot-planner` | **잡의 예정 실행시각** | 잡을 만드는 시점에 이미 확정된 과거 발행. 위반이면 지연 흡수 또는 `SKIPPED` |
| L3 | **DB CHECK + UNIQUE** (2-4) | — | INSERT 순간. `PublishSlot`의 `slotIndex ∈ {0,1}` + 유니크 → 하루 3번째 자리 생성 불가 |
| L4 | 잡 수령(claim) 시점 | **실제 수령 시각** | 잡 생성 이후~수령 직전에 새로 생긴 발행(수동 발행 끼어들기, 직전 슬롯의 지연 발행) |

> **[E1] rev2에서 무엇이 틀렸나.** rev2는 3-1에서 L2를 "그 시점(=`now()`) 기준 12h 이내면 스킵"으로 적었다. 잡 생성은 예정 35분 전에 일어나므로 `now()`는 **구조적으로 항상 예정시각보다 35분 이르다**. 12시간 간격으로 짜인 스케줄에서 이 술어는 **영원히 참이 될 수 없다** — 2차 검수가 계산한 100.00% SKIPPED가 정확히 이것이다. 게다가 3-1은 임계를 `12h`로, 3-2 규칙B는 `11h15m`으로 적어 문서 내부에서도 모순이었다.
>
> rev3은 **L2의 좌변을 `now()`가 아니라 "그 잡이 실제로 돌 예정인 시각"으로 바꾼다.** L2가 답해야 할 질문은 "지금 12시간이 지났나"가 아니라 **"이 잡이 예정대로 돌면 그때 간격이 확보되나"**이기 때문이다. 이 교정으로 **리드타임(35분)이 정확성에서 완전히 분리된다** — 리드타임을 35분으로 두든 60분으로 두든 결과가 같다는 것을 시뮬레이션으로 확인했다(3-2). 리드타임 조정(35→30분)으로 푸는 방법도 있었지만, 그건 여유가 5분밖에 안 남는 경계값 튜닝이라 채택하지 않았다.

> **1차 설계 정정(유지)**: 자정 경계 케이스(23:50 → 익일 00:10)의 차단 주체는 L2가 아니라 **L4**다. L2는 "이미 지나간 발행"만, L4는 "생성 후에 생긴 발행"만 본다. 두 층이 서로 다른 시간대를 담당하는 것이 4중 구성의 핵심이며 L4 없이는 이 케이스가 샌다.

### 3-2. [D1] 하루 2회 + 12시간 + 지터가 서로 모순되던 문제 — 원인과 해결

#### 문제 재현 (검수 지적이 맞다)

매일 2회 발행을 반복하면 하루 24시간을 두 간격이 나눠 갖는다. 두 간격이 **모두** 12시간 이상이려면 `a ≥ 12 ∧ b ≥ 12 ∧ a + b = 24` → **`a = b = 12` 뿐이다. 여유(margin)가 수학적으로 0이다.** 여기에 ±10분 지터와 실행 지연을 얹으면 절반이 임계 아래로 내려간다.

#### [E1] rev3 시뮬레이션 — L2까지 포함해 다시 측정

2차 검수 지적대로 rev2의 시뮬은 **L4(예정시각 간격)만 계산하고 L2를 모델링하지 않았다.** L2를 넣어 다시 돌렸다. 두 가지 프레이밍으로 각각 측정한다.

- **프레이밍A (검수 방식)**: 직전 발행이 예정대로 났다고 보고 인접 쌍을 독립 평가. "규칙이 의도한 패턴을 허용하는가"를 본다.
- **프레이밍B (체인)**: 스킵되면 시계가 안 밀려 다음 건이 통과하는 연쇄까지 반영. "실제로 몇 %가 빠지는가"를 본다.

| 구성 | A: 쌍 단위 위반 | B: 체인 스킵률 | 최소 실측 간격 |
|---|---|---|---|
| rev2 문서 문자 그대로 (L2 `now()` 기준 · 임계 12h · 리드 35분) | **100.00%** | 50.00% | — |
| rev2 관대 해석 (L2 `now()` 기준 · 임계 11h15m · 리드 35분) | 9.94% | 9.88% | 11h 50.0m |
| 참고: 리드타임만 30분으로 (L2 `now()` 기준 · 임계 11h15m) | 3.63% | 3.58% | 11h 45.0m |
| **rev3 채택안 (L2 예정시각 기준 · 임계 11h15m · 리드 35분)** | **0.00%** | **0.00%** | 11h 36.0m |
| **rev3 채택안 + 리드타임 60분** | **0.00%** | **0.00%** | 11h 36.0m |
| rev3 채택안 + PC지연 5%(최대 3h) 섞음 | — | 스킵 0.07% / 흡수 8.51% | 11h 15.1m |

**검수 수치와의 차이를 밝힌다.** 100.00%는 프레이밍A에서 **정확히 재현**했다. 다만 검수가 "관대 해석"으로 제시한 12.46%는 내 계산에서 9.94%가 나온다. 원인은 **같은 날 쌍(slot0→slot1)을 분모에 넣느냐**다. 같은 날 쌍은 공통 지터가 상쇄돼 그 임계에서는 절대 위반하지 않으므로(0%), 교차일 쌍만 보면 ~19.9%, 두 쌍을 평균하면 9.94%가 된다. 검수의 해석식 `P(Δ < −10분) = 12.5%`는 교차일 쌍만 본 값이다. **어느 쪽이든 "규칙이 깨져 있다"는 결론은 같고, 채택안이 두 프레이밍 모두 0.00%라는 점도 같다.**

**결론**: rev2의 진짜 병목은 지터가 아니라 **L2의 기준 시각**이었다. 좌변을 예정시각으로 바꾸는 것만으로 100.00% → 0.00%가 되고, 리드타임(35분/60분)에도 무관해진다.

#### 참고 — rev2에서 이미 확인한 L4 단독 수치(유지)

| 구성 | 12h 미만 비율 | 최소 실측 간격 |
|---|---|---|
| 1차 설계(슬롯별 독립 지터, 허용오차 0) | **49.86%** | 11h 35.9m |
| 하루 공통 지터, 허용오차 0 | **50.02%** | 11h 36.0m |
| **하루 공통 지터 + 허용오차 45분 (채택)** | **0.00%** | 11h 35.5m |

> **공통 지터만으로는 해결되지 않는다**(50.02%) — 최악값을 만드는 것은 날짜 경계 간격이고 지터 결합은 여기에 영향이 없기 때문이다. **실질적 해결책은 허용오차이고, 공통 지터는 같은 날 간격을 결정적으로 만드는 보조책이다.**

#### 채택안 (4개 조치)

**① 두 슬롯 간격을 "12시간 이상"이 아니라 "정확히 12시간"으로 고정한다.**
S8에서 사용자는 슬롯0 시각만 고른다(0~11시). 슬롯1은 `slot0 + 12h`로 자동 산출되며 편집 불가. 13시간 같은 간격을 허용하면 날짜 경계 간격이 11시간이 되어 **매일 슬롯0이 죽는다** — 1차 설계의 "±12시간 구간 회색 처리(=13시간 허용)" UI는 이 함정을 그대로 갖고 있었으므로 폐기한다.

**② 지터는 슬롯이 아니라 블로그·날짜 단위로 하나만 뽑는다.**
`offset(blogId, slotDate) = PRNG(seed = hash(blogId + slotDate)) ∈ [−jitterSec, +jitterSec]`
같은 날 두 슬롯에 같은 오프셋이 적용되므로 **같은 날 간격은 지터와 무관하게 항상 정확히 12시간**이다. 날짜 경계 간격만 `12h ± 20분` 범위로 흔들린다. (그래서 `jitterSec`을 `Schedule`이 아니라 `Blog`에 뒀다.)

**③ 12시간 검사를 "계획 기준"과 "실측 기준" 둘로 나눈다.**

| 규칙 | 기준 | 임계 | 목적 |
|---|---|---|---|
| **A (계획)** | `PublishSlot.plannedAt` (지터 적용 전) | 정확히 12h | 설정이 애초에 유효한지. 스케줄이 12h 고정이므로 항상 통과. 수동 발행(`MANUAL`)은 요청 시각을 `plannedAt`으로 삼아 여기서 걸린다 |
| **B (실측)** | `publishAttemptAt` (3-3) | **GATE = 12h − 45분 = 11h 15분** | 실제로 너무 붙어 나가는 것을 막는 안전망. **L2·L4가 이 임계를 공유한다**(3-1) |

허용오차 45분의 근거:

```
최악 실측 간격 = 12h − (지터 최대차 20분) − (실행지연 최대차 5분) = 11h 35분
임계(11h 15분) 대비 여유 = 20분
```
지터 상한 600초는 DB CHECK로 고정했다(2-4 ④). 이 상한이 풀리면 계산이 깨지므로 스키마에 묶어 둔 것이다.

**④ [E3 개정] 지연 흡수(deferral) — 슬롯이 조용히 죽지 않게, 그리고 예약시각이 영구 이탈하지 않게.**

직전 발행이 크게 늦어져(PC를 늦게 켬 등) 다음 잡이 규칙B에 걸리면 즉시 `SKIPPED`로 죽이지 않고 목표시각을 밀어 `QUEUED`를 유지한다(`JOB_DEFERRED`). `expiresAt`(plannedAt + 3시간)을 넘기면 그때 `EXPIRED` + **사용자 알림**.

**rev2의 버그**: 흡수 목표를 `publishAttemptAt + 12h`로 잡았다. 이건 **여유 0인 상태를 그대로 재생성**하므로 다음 슬롯도 똑같이 밀리고, 그 다음도 밀린다. 2차 검수가 재현한 대로 **09:00/21:00이 영구히 11:30/23:30으로 고착**된다. `deferCount` 상한 2는 잡마다 1회씩만 쓰이므로 영원히 안 걸리는 죽은 방어였다.

**rev3의 교정**: 흡수 목표를 **`publishAttemptAt + GATE + 5분`(= 직전 + 11h20m)** 으로 바꾼다. 그러면 드리프트가 스스로 줄어든다.

```
드리프트 D = 실제 발행시각 − 원래 예정시각
다음 목표 = 실제 + 11h20m = 원래예정 + D + 11h20m
다음 드리프트 D' = (원래예정 + D + 11h20m) − (원래예정 + 12h) = D − 40분
                                                              ↑ 슬롯마다 40분씩 감쇠
D ≤ 45분이면 애초에 규칙B를 통과하므로 흡수가 걸리지 않는다 → 정시 복귀
```

실행 검증(부록 A):

| 슬롯 | rev2 `+12h` 흡수 | rev3 `+11h20m` 흡수 |
|---|---|---|
| 1 | DEFER 예정+150분 · 간격 12.000h | DEFER 예정+110분 · 간격 11.333h |
| 2 | DEFER 예정+150분 | DEFER 예정+70분 |
| 3 | DEFER 예정+150분 | DEFER 예정+30분 |
| 4 | DEFER 예정+150분 | **정시 · 간격 11.500h** |
| 5 | DEFER 예정+150분 | **정시 · 간격 12.000h** |
| 6 | DEFER 예정+150분 (영구) | **정시 · 간격 12.000h** |

최악(드리프트 3시간 = `expiresAt` 한계)에서도 **4슬롯(2일) 안에 정시 복귀**하고, 그 과정의 모든 간격이 GATE 이상이라 **하드룰은 한 번도 안 깨진다.**

부수 효과: A1 계기판의 "DEFERRED 발생률"이 상시 100%로 죽지 않고(장기 시뮬 8.5% 수준, PC지연 5% 가정), S8의 "다음 7일 예정" 미리보기도 실제와 일치한다. `deferCount` 안전 상한은 6으로 두되(정상 수렴 4 이내), 이 값에 걸리는 것은 버그 신호이므로 A1에 경보를 띄운다.

예: 21:00 예정 슬롯이 PC 지연으로 23:30 발행 → 다음날 09:00 슬롯은 10:50으로 밀려 발행되고, 그 다음 슬롯부터 21:00 정시로 돌아온다.

#### "두 번째 발행이 안 잘린다"는 근거 정리

| 경로 | 결과 |
|---|---|
| **L2(잡 생성) 통과 여부** | 좌변이 예정시각이라 리드타임과 무관 → **0.00%** (프레이밍 A·B 모두, 리드 35·60분 모두) |
| 같은 날 슬롯0 → 슬롯1 | 공통 지터로 간격이 **항상 정확히 12h** → 규칙A·B 모두 통과 |
| 날짜 경계 슬롯1 → 다음날 슬롯0 | 최악 11h36m > GATE 11h15m → 통과 (20만일 위반 0건) |
| 직전 발행이 지연됨 | 규칙B에 걸리지만 **④ 지연 흡수로 재예약**, 이후 40분씩 감쇠해 정시 복귀 |
| 3시간 넘게 지연 | `EXPIRED` + **사용자 알림**. 조용히 사라지는 경로가 아니다 (장기 시뮬 스킵률 0.07%) |
| 슬롯이 `EXPIRED`된 뒤 수동 발행·재시도 | **[E2] `PublishSlot`이 점유 해제되어 새 `PublishJob`(attemptSeq+1)이 정상 INSERT됨** — rev2에서 unique violation으로 막히던 경로 |
| 사용자가 수동 발행을 끼워넣음 | 규칙A·B가 정상 차단(의도된 동작). S4에서 버튼 비활성 + 사유·해제 예정시각 표시 |

> **[미검증]** 위 수치는 시뮬레이션과 산술 근거이며, 실제 네이버 계정에서 "12시간 간격 2회"가 저품질을 실제로 피하는지는 페이즈3 베타 실측 전까지 알 수 없다. 선행문서 10장 kill 기준 유지.

### 3-3. [D2] 12시간을 재는 기준 컬럼 — `publishAttemptAt`

1차 설계는 기준 컬럼을 정의하지 않았다. 순진하게 `postedAt`으로 구현하면 **`SUBMITTED`·`UNVERIFIED` 잡은 `postedAt`이 NULL이라 검사에서 통째로 사라지고**, "이미 올라갔을지 모르는 글" 위에 두 번째 글이 나간다 — 원칙3 정면 위반이다. 그래서 컬럼을 못 박는다.

```sql
-- ① 12시간 간격 검사 (규칙B) — 기준 컬럼은 publishAttemptAt 하나뿐
SELECT MAX("publishAttemptAt") AS last_risk_at
FROM "PublishJob"
WHERE "blogId" = $1
  AND "kind"   = 'PUBLISH'                              -- 검증 잡은 제외
  AND "status" IN ('SUBMITTED', 'UNVERIFIED', 'VERIFIED');
--  → last_risk_at 이 NULL이 아니고 now() - last_risk_at < interval '11 hours 15 minutes' 이면 차단

-- ② 진행 중 잡 차단 (아직 버튼을 안 눌러 publishAttemptAt이 NULL인 구간)
SELECT EXISTS(
  SELECT 1 FROM "PublishJob"
  WHERE "blogId" = $1 AND "kind" = 'PUBLISH'
    AND "status" IN ('CLAIMED', 'RUNNING')
);
--  → true면 무조건 차단. 같은 블로그에 두 잡이 동시에 돌지 않는다

-- ③ [E2] 하루 2회 카운트 — 잡이 아니라 슬롯 점유를 센다
SELECT COUNT(*) FROM "PublishSlot"
WHERE "blogId" = $1 AND "slotDate" = $2 AND "consumedAt" IS NOT NULL;
--  → 2 이상이면 차단. 슬롯 행 자체가 유니크+CHECK로 하루 2개가 상한이므로
--    이 카운트는 구조적으로 2를 넘을 수 없다(L3).
```

**컬럼 규약**
- `publishAttemptAt`은 서버가 `PUBLISH_SUBMITTED` 이벤트를 받는 순간 기록한다. 이벤트를 못 받고 `/result`만 도착한 경우 **결과 수신 시각으로 보정 기록**한다. 즉 `SUBMITTED`·`UNVERIFIED`·`VERIFIED` 상태에서 이 값이 NULL인 잡은 존재할 수 없다(정합성 점검 배치가 매일 검사).
- **`postedAt`과 `finishedAt`은 화면 표시 전용이며 쿼터·간격 판정에 절대 쓰지 않는다.** 코드 리뷰 체크리스트 항목으로 고정하고, "쿼터 쿼리에 postedAt이 등장하면 실패"하는 테스트를 넣는다.
- `FAILED`·`EXPIRED`·`SKIPPED`·`CANCELED`는 카운트하지 않는다(안 올라갔으므로 쿼터를 소모시키면 안 된다).

### 3-3-1. [E2] 슬롯 점유·해제 규칙 (재시도가 가능한 이유)

| 시점 | 동작 |
|---|---|
| 잡 수령(claim) | `PublishSlot.consumedAt = now()`, `consumedByJobId = <job>` 을 **원자적으로** 세팅. 이미 점유돼 있으면 잡을 안 내준다 |
| 잡이 `publishAttemptAt` **없이** `FAILED`/`EXPIRED`/`CANCELED`로 종료 | **점유 해제**(`consumedAt = NULL`). 글이 안 올라갔으므로 그 자리는 다시 쓸 수 있다 → 재시도·수동 발행이 `attemptSeq+1`로 INSERT 가능 |
| 잡이 `publishAttemptAt`이 **찍힌 채** 종료(`SUBMITTED`/`UNVERIFIED`/`VERIFIED`) | **영구 점유**. 올라갔을 수 있으므로 그 자리는 다시 안 쓴다(원칙3) |
| 수동 발행 | 오늘 자리 중 비어 있는 것을 점유. 스케줄이 없어 자리 행이 아직 없으면 **그 자리 행을 만들어서** 점유(유니크가 하루 2개를 보장) |
| `UNVERIFIED` 후 사용자가 강제 재발행 | 그 자리는 영구 점유이므로 **남은 다른 자리**를 쓴다. 둘 다 찼으면 다음날까지 차단 |

이 규칙이 2차 검수 지적 E2("EXPIRED 후 수동 발행이 unique violation")를 푸는 실체다.

### 3-4. [D4] UNVERIFIED 구제 — 검증 잡(VERIFY)

1차 설계는 `nextAction: VERIFY_LATER`와 7장 표가 검증 잡에 의존하는데 **모델·API에 그 기능이 아예 없었다.** UNVERIFIED는 자동 재시도가 금지된 상태라 검증 잡이 유일한 구제 수단이므로, 없으면 그 잡은 영원히 사람이 손대야 한다. 아래를 추가한다.

**생성**: `/result`가 `outcome=UNVERIFIED`로 오면 서버가 `kind=VERIFY`, `origin=VERIFY_FOLLOWUP`, `verifyTargetJobId=<대상>`, `scheduledAt=now()+60초` 잡을 만든다(`VERIFY_SCHEDULED`). **슬롯을 소비하지 않는다** — `slotDate`/`slotIndex`가 NULL이고, 3-3의 모든 쿼터 쿼리는 `kind='PUBLISH'`로 필터한다.

**수행**: 에이전트가 대상 블로그의 최근 글 목록을 열어 `titleSnapshot` 완전일치 + 게시시각이 `publishAttemptAt ± 10분` 범위인 글을 찾는다.

| 결과 | 대상 잡 처리 | 사용자에게 |
|---|---|---|
| `FOUND` | `VERIFIED`로 승격 + `postUrl` 기록 | 성공으로 표시 |
| `NOT_FOUND` | `FAILED`(errorCode=`VERIFY_NOT_FOUND`) — 이제 안전하게 재시도 가능 | "발행 안 됨, 재시도" |
| `INCONCLUSIVE` | `UNVERIFIED` 유지 | "직접 확인 필요" + 재발행은 명시 확인 후에만 |

검증 잡이 3회 연속 `INCONCLUSIVE`면 중단하고 사람에게 넘긴다. **검증 잡은 절대 글을 쓰지 않는다** — 읽기 전용 동작만 하므로 중복 발행 위험이 구조적으로 없다.

---

## 4. 웹 대시보드 화면 (13개)

```
공개   ├ S1 랜딩/요금제
       └ S2 로그인·가입
로그인  ├ S3 온보딩 위저드(4스텝)   ├ S8 예약 설정
       ├ S4 대시보드 홈            ├ S9 발행 이력
       ├ S5 블로그 관리            ├ S9d 잡 상세
       ├ S6 에이전트 관리          ├ S10 요금제·결제
       ├ S7 글감(시트)             └ S11 계정 설정
운영자  └ A1 운영자 콘솔  (User.role = ADMIN 만 접근)
```

### S1. 랜딩 / 요금제
- 제품 설명, 플랜 비교표(기본 / +추가블로그 / +AI글감대행), FAQ.
- **PC 설치형이라는 사실과 "PC가 켜져 있어야 발행된다"를 가입 전에 명시**한다. 숨기면 첫 달 이탈로 돌아온다.
- "네이버 비밀번호를 요구하지 않습니다"를 전면 배치.

### S2. 로그인 / 가입
- NextAuth v5. 구글 OAuth + 이메일 매직링크. 자체 비밀번호 없음.
- 가입 즉시 `Subscription`을 `TRIALING`으로 생성.

### S3. 온보딩 위저드 (4스텝 — 선행문서 3장 플로우)
| 스텝 | 화면 | 완료 조건 |
|---|---|---|
| 1 | 블로그 연결 | `naverBlogId` 입력 → `Blog(PENDING_VERIFY)` 생성 |
| 2 | 에이전트 설치·페어링 | 설치파일 다운로드 → 페어링 코드(10분 카운트다운) → 에이전트가 붙으면 폴링으로 자동 전환. 에이전트가 보고한 `knownBlogIds`와 스텝1 블로그를 대조해 `ACTIVE` 승격 |
| 3 | 구글시트 연동 | 시트 템플릿 "복사하기" → 연결 → 첫 동기화 1행 이상 성공 |
| 4 | 예약 설정 | **슬롯0 시각(0~11시) 선택 → 슬롯1 자동 확정** 후 저장 |
- 각 스텝 이탈 후 재진입 가능. 스텝2에서 막히는 사용자가 가장 많을 것이므로 **"안 될 때" 체크리스트**(방화벽·크롬 미설치·네이버 미로그인)를 접이식으로 상시 노출.

### S4. 대시보드 홈
- **오늘 발행 현황**: 블로그별 슬롯 2칸 타임라인 — `09:00 ✓완료 / 21:00 ⏳대기`.
- **에이전트 오프라인 배너**: "마지막 응답 N분 전 · 이대로면 오늘 21:00 발행이 안 됩니다".
- **네이버 로그아웃 경고**: 에이전트는 살아있는데 `naverLoggedIn=false`면 별도 경고(발행 시점에야 실패하는 걸 미리 잡음).
- 글감 3건 미만 경고 / 최근 실패 3건 + 재시도 버튼.
- **수동 발행 버튼**: 오늘 슬롯이 소진됐거나 12시간 룰에 걸리면 비활성 + 사유·해제 예정시각 표시(3-3 쿼리 결과 그대로).

### S5. 블로그 관리
- 목록(`2/3` 쿼터 표시), 추가·이름변경·일시중지·연결해제.
- 쿼터 초과 시 업셀 모달. **하드캡 3개는 결제로도 못 넘음**(`extraBlogSlots ≤ 2` CHECK).
- 블로그별 발행 기본값(카테고리·공개범위·댓글) + **지터 폭**(0~10분) 편집.
- `PENDING_VERIFY`면 "에이전트가 이 블로그의 로그인을 확인하지 못했습니다" + 해결 가이드.

### S6. 에이전트 관리
- 기기 목록: 이름·OS·버전·온라인여부·마지막 응답·네이버 로그인 여부·인식된 블로그.
- **페어링 코드 발급**(10분, 남은 시간 표시, 재발급 시 이전 코드 즉시 폐기).
- 기기 연결 해제(revoke) — 다음 폴링에서 에이전트가 401 받고 스스로 정지.
- **[D5] 블로그별 선호 기기 지정** — `Blog.preferredAgentId`. 지정 시 그 기기만 해당 블로그 잡을 수령한다. 단 선호 기기가 **15분 이상 오프라인**이면 다른 기기가 대신 가져간다(폴백). 폴백이 없으면 "회사 PC를 선호로 지정 → 그날 회사 안 감 → 발행 0"이 되기 때문이다.

### S7. 글감 (구글시트)
- 연결 상태·마지막 동기화·오류 사유(권한없음/헤더불일치/시트없음), "지금 동기화".
- 글감 테이블: 상태·희망일·제목·글자수·중복경고(같은 `contentHash`).
- 대시보드 직접 추가/수정(`source=MANUAL`).
- AI 글감 대행 사용자는 "생성 대기 N / 검토 대기 N" 큐 추가 표시.

**시트 표준 헤더(고정)**: `상태 | 발행희망일 | 제목 | 본문 | 태그 | 카테고리 | 결과URL | 결과시각 | 실패사유`
→ 앞 6열 = 사용자 입력, 뒤 3열 = 우리가 write-back 하는 출력.

### S8. 예약 설정 ★rev2에서 재설계
- 블로그별 슬롯 편집기. **슬롯 칸은 2개 고정**(3번째 추가 버튼 없음).
- **사용자는 슬롯0 시각만 고른다(00:00~11:59). 슬롯1은 `+12시간`으로 자동 표시되고 편집 불가.**
  안내 문구: "네이버 저품질 위험을 줄이려고 하루 2회·12시간 간격을 고정합니다. 두 번째 시각은 첫 시각에 맞춰 자동으로 정해집니다."
- 1차 설계의 "±12시간 회색 처리(13시간 등 허용)" 방식은 **날짜 경계 간격이 11시간이 되어 매일 한 번이 죽으므로 폐기**(3-2).
- 요일 선택, 일시중지, 지터 안내("정확히 정각이 아니라 ±10분 안에서 자연스럽게 올립니다").
- 미리보기: "다음 7일 발행 예정 시각" — **지터·지연 흡수 반영 후의 실제 예상 시각**을 보여준다.

### S9. 발행 이력
- 필터(블로그·상태·기간), 상태 배지, `postUrl` 바로가기.
- 실패 건은 사유 + "재시도"/"수동 발행". **`SKIPPED` 건은 `skipReason`을 한국어 문장으로 풀어서 표시**(D8) — 조용히 사라진 것처럼 보이면 안 된다.

### S9d. 잡 상세
- **단계 타임라인**: `JobEvent` 세로 배치 — 요청됨 09:00:00 → 수령 09:00:12 → 로그인확인 09:00:15 → 에디터열림 09:00:31 → 작성완료 09:01:12 → 발행클릭 09:01:20 → 확인됨 09:01:34. 단계별 소요시간(델타) 표시.
- **[D5] 발행 본문 스냅샷**: `titleSnapshot` / `bodySnapshotHtml` / `tagsSnapshot`. 글감이 나중에 수정·삭제돼도 실제 올라간 내용을 보여준다.
- 검증 잡이 붙은 경우 그 결과도 같은 타임라인에 이어서 표시(`verifyTargetJobId` 역참조).
- `UNVERIFIED` 건은 **"이미 올라갔을 수 있으니 블로그를 먼저 확인하세요"** 경고 + 재발행 버튼 기본 비활성(체크박스 명시 확인 시 활성).

### S10. 요금제 · 결제
- 현재 플랜, 애드온 토글(추가 블로그 수 / AI 글감 대행), 다음 결제일, 해지.
- **[D5] 결제 이력 테이블** — `Payment` 기준: 결제일·금액·기간·상태·영수증 링크.
- 금액은 `Plan.priceKrw`에서 렌더 — 화면은 만들되 값은 9장 #2 결재 후 주입.

### S11. 계정 설정
- 프로필, 타임존, 알림 설정, 데이터 내보내기, 탈퇴.
- **"우리가 저장하지 않는 것" 고지 블록** 상시 노출(비번·세션쿠키). 신뢰가 판매 포인트라 화면에 못 박는다.

### A1. 운영자 콘솔 (내부) — **`User.role = ADMIN` 전용**
- **[D5] 접근 제어**: 미들웨어에서 `role !== ADMIN`이면 `/admin/*`을 404로 응답(403이 아니라 404 — 존재 자체를 숨긴다). 진입 시도는 `AuditEvent`에 기록.
- 테넌트 목록, 잡 성공률/실패코드 분포, 에이전트 버전 분포, 오프라인 비율, **`SKIPPED`/`DEFERRED` 발생률**(3-2 설계가 실제로 먹히는지 보는 계기판).
- **실패코드 분포가 1순위 지표** — `EDITOR_DOM_CHANGED` 급증은 네이버 에디터 개편이고 전 고객 동시 장애다. 임계치 초과 시 즉시 경보.

---

## 5. PC 에이전트 ↔ 서버 인터페이스 스펙

Base URL `https://{app}/api/agent/v1` · HTTPS · JSON · 인증 `Authorization: Bearer <agentToken>`(페어링 제외).
공통 응답 헤더 `X-Server-Time`(RFC3339). **에이전트는 로컬 시계를 신뢰하지 않고 서버 시간을 기준으로 삼는다** — 사용자 PC 시계가 틀어져 있으면 발행 시각이 통째로 어긋난다.

### 5-1. 페어링 프로토콜

```
[대시보드]                [서버]                     [PC 에이전트]
    │  코드 발급 요청 ──────▶│
    │◀── "K7Q2-M4XR" (10분) │  DB엔 sha256(코드)만 저장
    │   사용자가 코드를 에이전트 창에 입력 ─────────────▶│
    │                        │◀── POST /pair {code, device, ver} ──│
    │                        │   코드해시 조회·만료·사용여부 검사   │
    │                        │── {agentId, agentToken, ...} ──────▶│
    │                        │   코드 usedAt 기록(1회용 소멸)      │
    │◀── 화면 자동 전환(폴링) │            토큰은 OS 자격증명 저장소에 보관
```

**`POST /pair`** (인증 불필요)
```jsonc
// 요청
{ "code": "K7Q2M4XR",
  "device": { "name": "사무실-데스크탑", "os": "Windows", "osVersion": "11", "machineIdHash": "<sha256>" },
  "agentVersion": "1.0.0" }
// 200
{ "agentId": "cl...", "agentToken": "<64자 랜덤>", "tokenExpiresAt": "2026-11-06T…Z",
  "pollIntervalSec": 60, "serverTime": "2026-08-08T…Z" }
```
| 실패 | 코드 |
|---|---|
| 400 `INVALID_CODE` | 코드 없음/형식오류 (실패 카운트 +1) |
| 410 `CODE_EXPIRED` | 10분 경과 |
| 409 `CODE_USED` | 이미 사용됨 |
| 429 `TOO_MANY_ATTEMPTS` | IP당 분당 5회 / 코드당 누적 5회 실패 시 코드 즉시 폐기 |

**설계 근거**
- 코드는 혼동문자(I·L·O·U) 제외 대문자·숫자 8자리 = 32⁸ ≈ 1.1조 조합. 10분 TTL + 5회 실패 폐기와 합치면 추측 공격이 성립하지 않는다.
- 코드·토큰 모두 **평문 미저장**(sha256). DB가 유출돼도 남의 에이전트를 조종할 수 없다.
- 토큰 90일, 만료 30일 전부터 `/token/rotate`로 무중단 갱신. 대시보드에서 해제하면 `revokedAt` 즉시 세팅 → 다음 요청부터 401.
- 페어링에 **네이버 비번은 물론 사용자 이메일조차 필요 없다.**

### 5-2. 하트비트 / 잡 수신 (폴링)

**결정: WebSocket 상시연결이 아니라 폴링.** 사용자 PC는 NAT·기업방화벽 뒤에 있고 노트북은 절전·네트워크 전환이 잦아 상시연결 재접속 관리가 그 자체로 실패 원인이 된다. 발행 시각 정밀도는 분 단위면 충분하고(±10분 지터를 주는 마당에 초 단위는 무의미), 폴링이 방화벽을 가장 잘 통과한다.

**폴링 주기(제안)** — 값은 서버가 `nextPollSec`로 지시하고 **에이전트는 하드코딩하지 않는다**(서버만 고쳐서 전체 조절 가능해야 한다).

| 상황 | 주기 |
|---|---|
| 평시 | **60초** |
| 슬롯 예정시각 T−5분 ~ T+30분 | **15초** |
| 잡 실행 중 | 폴링 중단, 진행 이벤트가 하트비트를 겸함(최소 30초마다 1회) |
| 서버 5xx/네트워크 오류 | 지수 백오프 30초→10분 상한, 지터 ±20% |
| 401(revoked) | 폴링 영구 중단 + 트레이 알림 |

트래픽: 1명·평시 60초 = 하루 약 1,440 요청. 200명이면 약 29만 요청/일, 응답 본문 200바이트 수준. **[미검증 — 계산치, 베타에서 실측 필요]**

**`POST /heartbeat`**
```jsonc
// 요청 — ★쿠키·비번·세션토큰은 절대 담지 않는다
{ "agentVersion": "1.0.0", "runState": "IDLE",
  "naver": { "loggedIn": true, "blogIds": ["myshop2020"] },
  "currentJobId": null }
// 200
{ "serverTime": "…", "nextPollSec": 60, "pendingJobs": 0,
  "commands": [ { "type": "UPDATE_AVAILABLE", "version": "1.1.0" } ] }
```
- `commands`: `REVOKE` / `UPDATE_AVAILABLE` / `RESYNC_BLOGS` / `PING_LOG`.
- **오프라인 판정**: `lastSeenAt + max(180초, 3 × nextPollSec)` 경과. 3배인 이유는 폴링 1~2회 유실을 오프라인으로 오인하지 않기 위해서다.

**`POST /jobs/claim`** — 잡 수령(GET이 아닌 이유: 리스를 거는 상태 변경)
```jsonc
// 요청
{ "max": 1, "capabilities": { "editor": "se3", "browser": "chrome" } }

// 200 — 발행 잡
{ "serverTime": "2026-08-09T00:00:03Z",
  "jobs": [ {
    "jobId": "cl…", "kind": "PUBLISH", "idempotencyKey": "…",
    "blog": { "id": "cl…", "naverBlogId": "myshop2020" },
    "scheduledAt": "2026-08-09T00:00:00Z", "expiresAt": "2026-08-09T03:00:00Z",
    "leaseExpiresAt": "2026-08-09T00:15:00Z",
    "content": { "title": "…", "bodyHtml": "…", "tags": ["…"],
                 "categoryName": "일상", "openType": "PUBLIC", "allowComment": true }
  } ],
  "skipped": [] }

// 200 — [D4] 검증 잡
{ "serverTime": "…",
  "jobs": [ {
    "jobId": "cl…", "kind": "VERIFY", "idempotencyKey": "…",
    "blog": { "id": "cl…", "naverBlogId": "myshop2020" },
    "leaseExpiresAt": "…",
    "verify": { "targetJobId": "cl…", "expectedTitle": "…",
                "contentHash": "sha256:…", "since": "2026-08-09T00:01:00Z",
                "toleranceSec": 600 }
  } ],
  "skipped": [] }

// 200 — [D8] 내줄 잡이 제약에 걸린 경우 (사유를 반드시 실어 보낸다)
{ "serverTime": "…", "jobs": [],
  "skipped": [ { "jobId": "cl…", "reason": "MIN_INTERVAL_12H",
                 "detail": { "lastPublishAttemptAt": "…", "retryAfterSec": 4200 } } ] }

// 204 — 내줄 것도 알릴 것도 없음 (본문 없음)
```
- **리스(lease)**: 수령 시 15분 임대, 진행 이벤트로 갱신. 에이전트가 죽으면 만료 후 재수령 — 단 `SUBMITTED` 이후는 재수령 금지(3-4).
- 서버는 이 시점에 12시간 룰을 **재검사**하고(L4), 위반 시 지연 흡수 또는 `SKIPPED` 후 위 `skipped` 배열로 사유를 알린다.
- `reason` 값은 **2-5의 표준 6개**를 그대로 쓴다(여기서 따로 정의하지 않는다 — rev2의 불일치 원인).
- `max`는 1 권장 — 한 PC가 두 글을 동시에 쓰면 에디터가 충돌한다.

**`POST /jobs/{jobId}/events`** — 진행 보고 (리스 갱신 겸용)
```jsonc
{ "events": [ { "type": "EDITOR_OPENED", "at": "…", "detail": { "ms": 3120 } } ],
  "renewLease": true }
// 200 → { "leaseExpiresAt": "…", "abort": false }
```
- `abort:true`면 에이전트 즉시 중단(사용자가 취소한 경우).
- 서버는 `PUBLISH_SUBMITTED` 수신 시 **`publishAttemptAt`을 기록한다**(3-3).

**`POST /jobs/{jobId}/result`** — 최종 결과
```jsonc
// 발행 잡
{ "idempotencyKey": "…", "kind": "PUBLISH",
  "outcome": "VERIFIED",            // VERIFIED | UNVERIFIED | FAILED
  "postUrl": "https://blog.naver.com/myshop2020/223…",
  "postedAt": "…", "errorCode": null, "errorMessage": null }
// 200 → { "accepted": true, "duplicate": false, "nextAction": "IDLE" }

// [D4] 검증 잡
{ "idempotencyKey": "…", "kind": "VERIFY",
  "outcome": "FOUND",               // FOUND | NOT_FOUND | INCONCLUSIVE
  "postUrl": "https://blog.naver.com/myshop2020/223…",
  "matchedAt": "…", "candidatesChecked": 12 }
// 200 → { "accepted": true, "targetJobStatus": "VERIFIED" }
```
- `idempotencyKey`가 이미 처리됐으면 `{"accepted":true,"duplicate":true}` + **200**. 에러를 주지 않는다 — 에러를 주면 에이전트가 재시도를 반복하다 중복 발행으로 이어진다.
- `nextAction`: `IDLE` | `VERIFY_LATER`(UNVERIFIED → 60초 후 검증 잡) | `STOP`.

**에이전트 실패코드 표준** (`errorCode`)
| 코드 | 의미 | 서버 처리 |
|---|---|---|
| `NAVER_LOGGED_OUT` | 세션 없음/만료 | 재시도 안 함. "네이버 로그인 필요" 알림 |
| `CAPTCHA_REQUIRED` | 캡차·추가인증 | 재시도 안 함. 사용자 개입 요청 |
| `EDITOR_DOM_CHANGED` | 에디터 구조 변경 | 재시도 안 함. **운영자 즉시 경보**(전체 장애 신호) |
| `BROWSER_UNAVAILABLE` | 크롬 없음/attach 실패 | 5분 후 1회 재시도 |
| `NETWORK` | 네트워크 오류 | 백오프 재시도(최대 3) |
| `NAVER_RATE_LIMITED` | 네이버 제한 | 당일 해당 블로그 발행 중단 |
| `CONTENT_REJECTED` | 본문 거부(길이·금칙어) | 재시도 안 함. 글감 `FAILED` |
| `VERIFY_NOT_FOUND` | [D4] 검증 결과 글 없음 | 대상 잡 `FAILED`, 재시도 허용 |
| `UNKNOWN` | 그 외 | 1회 재시도 후 중단 |

**`POST /token/rotate`** — 구 토큰으로 인증 → 신 토큰 발급, 구 토큰 5분 유예 후 폐기.
**`GET /release/latest`** — 자동 업데이트용(버전·서명된 설치파일 URL·sha256).

### 5-3. 서버 내부 스케줄러 (cron)

| 잡 | 주기 | 하는 일 |
|---|---|---|
| `slot-planner` | 5분 | 앞으로 35분 내 슬롯 스캔 → `PublishJob` 생성(글감 바인딩 · 본문 스냅샷 확정 · 지터 확정 · L2 검사) |
| `sheet-sync` | 15분 | 시트 → `ContentItem` 동기화 + 결과 write-back |
| `job-reaper` | 1분 | 리스 만료 회수 / `expiresAt` 초과 잡 `EXPIRED` + 알림 / **지연 흡수 재예약 처리** |
| `agent-watch` | 1분 | 오프라인 전환 감지 → 알림(6시간 쿨다운) |
| `ai-draft` | 1시간 | 업셀 사용자 글감 부족분 로컬 LLM 배치 생성 |
| `integrity-check` | 일 1회 | `SUBMITTED/UNVERIFIED/VERIFIED`인데 `publishAttemptAt`이 NULL인 잡 탐지(3-3 규약 위반) |
| `retention` | 일 1회 | `JobEvent` 90일 / `AuditEvent` 365일 삭제 |

---

## 6. 보안 요약

| 항목 | 처리 |
|---|---|
| 네이버 비번·세션쿠키 | **수집·전송·저장 전부 안 함.** 에이전트→서버 페이로드에 쿠키 필드 자체가 없음 |
| 에이전트 토큰 | 서버는 sha256만 보관 / PC는 OS 자격증명 저장소(Windows DPAPI)에 보관, 평문 파일 금지 |
| 페어링 코드 | sha256 보관, 10분 TTL, 1회용, 5회 실패 폐기, IP 레이트리밋 |
| 멀티테넌시 격리 | 모든 조회는 `userId` 스코프 필수. 에이전트 토큰도 `userId`에 묶여 남의 잡 수령 불가 |
| **[D9] 구글 OAuth 토큰** | 9장 #3에서 ㉡(OAuth)를 택하면 `Account.refresh_token`에 장기 토큰이 들어온다. **DB 평문 저장 금지 — 앱 레벨 AES-256-GCM 암호화 후 저장**, 키는 `.env.local`의 `TOKEN_ENC_KEY`(32바이트)로만 주입하고 코드·vault·git에 넣지 않는다. 복호화는 시트 API 호출 직전 메모리에서만. ㉠(서비스계정)을 택하면 이 항목 자체가 사라지는데, **이것이 ㉠을 추천하는 두 번째 이유**다 |
| **[D5] 운영자 권한** | `User.role = ADMIN` 만 `/admin/*` 접근. 미인가 접근은 404 응답 + `AuditEvent` 기록. 승격은 DB 직접 변경으로만(화면에 승격 기능 없음) |
| 로그 | IP는 해시로만. 본문 스냅샷은 사용자 데이터로 취급해 탈퇴 시 삭제 |
| 에이전트 배포 | 코드서명 필수(미서명이면 SmartScreen 경고로 설치 이탈) — 9장 #4 |

---

## 7. 실패 시나리오와 설계상의 답

| 시나리오 | 처리 | 사용자에게 보이는 것 |
|---|---|---|
| 발행 시각에 PC가 꺼져 있음 | `QUEUED` 유지 → `expiresAt`(+3시간)까지 대기 → `EXPIRED` | 홈 배너 "에이전트 오프라인 — 오늘 21:00 발행 못 함" + 만료 알림 |
| **직전 발행이 늦어져 12시간 룰에 걸림** | **[E3] 지연 흡수** — 목표시각을 `publishAttemptAt + 11h20m`로 재예약. 드리프트가 슬롯당 40분씩 줄어 최대 4슬롯 안에 정시 복귀(3-2 ④) | "발행이 10:50으로 조정되었습니다" + 며칠 내 원래 시각 복귀 |
| **슬롯이 `EXPIRED`된 뒤 재시도·수동 발행** | **[E2]** 슬롯 점유가 해제돼 `attemptSeq+1` 잡이 정상 생성(3-3-1). rev2에서 unique violation으로 막히던 경로 | 이력에서 "재시도" 버튼이 실제로 동작 |
| 네이버가 로그아웃됨 | `NAVER_LOGGED_OUT`, 재시도 안 함 | "네이버에 다시 로그인해 주세요" + 재시도 버튼 |
| 발행 눌렀는데 응답이 끊김 | `UNVERIFIED` → 60초 후 **검증 잡**(3-4) | 확인되면 성공 / 아니면 "확인 필요"(자동 재발행 없음) |
| 네이버 에디터 개편 | `EDITOR_DOM_CHANGED` 급증 → 운영자 경보 | 전체 공지 + 에이전트 핫픽스 |
| 글감이 떨어짐 | 잡 생성 시 바인딩 실패 → `skipReason=NO_CONTENT` | "글감 3건 미만" 사전 경고 + 이력에 사유 표시 |
| PC 두 대에 설치 | 리스 방식으로 먼저 가져간 쪽이 처리. 선호 기기 지정 시 그 기기 우선, 15분 오프라인이면 폴백 | 기기 목록에 2대 + 블로그별 선호 기기 |
| 시트 권한이 끊김 | `lastSyncStatus=PERMISSION_DENIED` | 글감 화면에 사유 + 재연결 버튼 |

---

## 8. 페이즈2(개발) 착수 전 준비물

1. 신규 레포 `nblog-saas` (Next.js 16 + Prisma 6 + PostgreSQL/Neon), 개발 포트 **3002** — 3000·3001·8080 회피.
2. 마이그레이션 순서: NextAuth 테이블 → 도메인 테이블 → **2-4의 raw SQL CHECK 6개 수동 삽입** → `Plan` 시드.
3. 테스트 우선순위(Vitest) — **하드 룰부터 테스트로 못 박는다**:
   - **[E1] L2·L4 임계 일치**: 두 층이 같은 상수(GATE)·같은 컬럼을 쓰는지 정적 검사 / **리드타임을 35·60분으로 바꿔도 스킵률이 0인지** (리드타임 의존성이 되살아나면 즉시 실패)
   - **[D1] 슬롯 간격**: 슬롯0=09:00 설정 시 슬롯1이 21:00으로 자동 확정되는지 / 지터를 적용해도 같은 날 간격이 정확히 12h인지 / 날짜 경계 최소 간격이 GATE 이상인지 — **20만일 시뮬레이션을 회귀 테스트로 고정**
   - **[E3] 드리프트 감쇠**: 드리프트 3시간을 주입했을 때 4슬롯 이내에 정시 복귀하는지 / 그 과정의 모든 간격이 GATE 이상인지 / `deferCount`가 6에 도달하지 않는지
   - **[E2] 재시도 경로**: 슬롯 `EXPIRED` 후 수동 발행이 **INSERT에 성공**하는지(rev2 회귀) / `publishAttemptAt`이 찍힌 잡은 슬롯이 해제되지 **않는지** / 하루 3번째 슬롯 INSERT가 거부되는지
   - **[D2] 기준 컬럼**: `SUBMITTED`·`UNVERIFIED` 잡이 12시간 검사에 실제로 잡히는지 / 쿼터 쿼리에 `postedAt`이 등장하면 실패하는 정적 검사
   - **[D3] CHECK 제약**: **6개 존재 확인**(개수를 상수로 박고 grep)
   - **[D4] 검증 잡**: UNVERIFIED → VERIFY 생성 → FOUND 시 대상 잡 승격 / VERIFY 잡이 슬롯을 소비하지 않는지
   - **[E5] 문서-코드 일치**: `skipReason` enum 값이 2-5 표의 6개와 정확히 일치하는지
   - 멱등성: 같은 `idempotencyKey` 2회 보고 시 부작용 0
   - `SUBMITTED` 이후 재클레임 거부 / `UNVERIFIED` 자동 재시도 미발생
4. 에이전트 프로토타입은 발행 로직보다 **페어링·폴링·하트비트 골격을 먼저** 만든다(가장 많이 깨지는 곳이 발행이 아니라 연결이다).

---

## 9. 형(CEO) 결재 필요 항목

| # | 항목 | 상태 | 선택지 / 내 판단 |
|---|---|---|---|
| 1 | **화면·스키마·인터페이스 승인** | 결재 대기 | 2·4·5장 승인 시 페이즈1 완료 판정 |
| 2 | **요금 금액 확정** | ⚠️ **미이행 — 이월 승인 요청** | 선행 결정문서 3·7장은 "가격 세부안을 **페이즈1에서 확정**"으로 적혀 있는데, 이번 설계에서 **금액을 산출하지 못했다.** 원가(서버비·LLM 배치·고객지원 인건)를 실측 없이 추정하면 7B 모델이 냈던 48만원처럼 근거 없는 숫자가 또 나오기 때문이다. **요청: 금액 확정을 페이즈2 초반(개발 착수 후 2주 내, 인프라 실비가 나오는 시점)으로 이월하는 것을 승인해 주세요.** 스키마는 `Plan.priceKrw` nullable로 설계돼 있어 금액 없이도 개발 진행에 지장 없음 |
| 3 | **구글시트 연결 방식** | 결재 대기 | ㉠ 서비스계정에 시트 공유 **(내가 추천)** — OAuth 민감범위 심사로 MVP가 늦고, ㉡을 택하면 refresh_token 암호화 설비까지 추가로 만들어야 한다(6장 D9) / ㉡ 구글 OAuth |
| 4 | **에이전트 코드서명** | 결재 대기 | 인증서 구매 **(내가 추천)** — 미서명은 SmartScreen 경고로 설치 단계 이탈이 크다. 단 베타(페이즈3)까지는 미서명 + 안내로 버틸 수 있으므로 구매 시점은 페이즈3 직전으로 미뤄도 됨 |
| 5 | **신규 레포/포트** | 결재 대기 | `nblog-saas` / 3002 |

---

## 10. 잔존 리스크

- **네이버 자동화 탐지**: 사용자 본인 세션·본인 PC라 서버 봇보다 훨씬 안전하지만 0은 아니다. 완화책 = 하루 2회·12시간 고정·±10분 지터·사람 속도 입력. 실계정 실측은 페이즈3 베타에서만 가능 — 선행문서 10장 kill 기준 유지.
- **에디터 개편 리스크**: 네이버가 에디터를 바꾸면 전 고객 동시 장애. `EDITOR_DOM_CHANGED`를 별도 코드로 분리하고 A1의 1순위 지표로 뒀다.
- **설치 지원 부담**: PC 설치형의 최대 비용은 서버비가 아니라 고객지원이다. 온보딩 스텝2 이탈률을 페이즈3 핵심 측정치로.
- **12시간 여유 0 구조**: 하루 2회를 유지하는 한 간격 여유는 구조적으로 0이고, 우리는 45분 허용오차로 이를 흡수하고 있다. 즉 **실제 발행 간격이 11시간대로 내려갈 수 있다**는 뜻이다. 저품질 관점에서 11h15m와 12h가 유의미하게 다른지는 [미검증]. 만약 베타에서 12시간 엄수가 필요하다고 판명되면 **하루 1회 상품으로 내리거나 지터를 0으로 두는 것**이 유일한 해법이다 — 이 트레이드오프를 지금 문서에 남겨 둔다.
- **[E3 권고 반영] 공통 지터의 부작용 — 같은 날 간격이 12시간으로 결정화된다.** 3-2 ②의 하루 공통 지터는 같은 날 두 발행의 간격을 **정확히 12h00m00s로 고정**시킨다. 지터의 원래 목적이 "정각 반복이라는 기계 패턴을 숨기는 것"인데, **간격 자체는 오히려 완벽히 규칙적이 된다** — 목적과 부분적으로 역행한다. 남는 은닉 효과는 "매일의 절대 시각이 ±10분 흔들린다"는 것뿐이고, "두 글의 간격이 항상 정확히 12시간"이라는 패턴은 그대로 노출된다. 네이버가 절대 시각이 아니라 **간격의 규칙성**을 본다면 이 설계는 은닉에 기여하지 못한다. 대안(슬롯별 독립 지터)은 D1 문제를 되살리므로 지금은 이 트레이드오프를 감수하되, 베타에서 저품질이 관측되면 **"간격에도 지터를 주되 GATE를 12h가 아닌 11h로 낮추는" 재설계**가 다음 카드다. [미검증]
- **[미검증]** 폴링 주기·트래픽 추정은 계산치다. D1 시뮬레이션은 실행 검증된 값이지만, 그 입력(실행지연 최대 5분)은 가정이다. 베타에서 실측 필요.

---

## 부록 A. [D1] 근거 시뮬레이션 (재현용)

3-2 표의 수치를 뽑은 스크립트 원문. `bun a.js` 또는 `node a.js`로 재현 가능하다.

```js
const H=3600, J=600, D=300;           // 지터 ±600초, 실행지연 0~300초
function run(coupled, tolMin){
  const tol=tolMin*60, N=200000; let viol=0, minGap=1e9;
  let jPrev=(Math.random()*2-1)*J;
  for(let d=0; d<N; d++){
    const jCur=(Math.random()*2-1)*J;
    const j0  = coupled ? jCur  : (Math.random()*2-1)*J;   // 오늘 슬롯0 지터
    const j1  = coupled ? jCur  : (Math.random()*2-1)*J;   // 오늘 슬롯1 지터
    const jP1 = coupled ? jPrev : (Math.random()*2-1)*J;   // 어제 슬롯1 지터
    const gapCross = 12*H + (j0 - jP1) + (Math.random()*D - Math.random()*D); // 어제21시→오늘9시
    const gapIntra = 12*H + (j1 - j0)  + (Math.random()*D - Math.random()*D); // 오늘9시→오늘21시
    for(const g of [gapCross, gapIntra]){ if(g < 12*H - tol) viol++; minGap=Math.min(minGap,g); }
    jPrev=jCur;
  }
  return { viol:(viol/(N*2)*100).toFixed(2)+'%', minGapH:(minGap/H).toFixed(4) };
}
console.log('1차설계(슬롯별 독립지터, 허용오차 0):', run(false, 0));
console.log('공통지터만    (허용오차 0)         :', run(true,  0));
console.log('채택안 공통지터+허용오차 45분      :', run(true,  45));
```

실행 결과(2026-08-08, 20만일 × 2간격 = 40만 표본):
```
1차설계(슬롯별 독립지터, 허용오차 0): { viol: '49.86%', minGapH: '11.5980' }
공통지터만    (허용오차 0)         : { viol: '50.02%', minGapH: '11.6005' }
채택안 공통지터+허용오차 45분      : { viol: '0.00%',  minGapH: '11.5923' }
```

**읽는 법**: 1행이 1차 검수 지적("두 번째 발행의 50%가 SKIPPED")의 재현이다. 2행은 **지터를 공통으로 묶는 것만으로는 해결되지 않음**을 보여준다. 3행이 채택안이며, 최소 실측 간격 11.5923h(=11h35.5m)가 GATE 11h15m보다 20분 위에 있어 위반이 0이다.

**이 시뮬레이션의 한계**: 실행지연 상한 `D=300초`는 가정값이다. 실제 지연이 25분을 넘으면 위반이 다시 생긴다 — 그래서 그 경우를 ④ 지연 흡수가 받아낸다. 지연 분포는 페이즈3 베타에서 실측해 교정해야 한다.

---

## 부록 B. [E1] L2 포함 재시뮬 (rev3 신규 — 재검 시 여기부터)

2차 검수가 지적한 대로 부록 A는 **L4만** 계산했다. 아래가 L2를 포함한 것이다. 프레이밍A는 검수 방식(인접 쌍 독립 평가)을 그대로 구현해 **검수의 100.00%를 재현**한다.

```js
const MIN=60,H=3600,J=600,GATE=11*H+15*MIN,LEAD=35*MIN;
function pairwise(thresh,lead,rule,N=400000){
  let v=0,t=0;
  for(let k=0;k<N;k++){
    const j0=(Math.random()*2-1)*J, j1=(Math.random()*2-1)*J;  // 어제/오늘 공통지터
    const d=Math.random()*300;                                  // 직전 발행 실행지연
    for(const dj of [0, j1-j0]){        // 같은날 쌍 / 교차일 쌍
      t++;
      const byNow     = 12*H + dj - lead - d;   // rev2: L2가 now() 기준
      const byPlanned = 12*H + dj - d;          // rev3: L2가 예정시각 기준
      if((rule==='now'?byNow:byPlanned) < thresh) v++;
    }
  }
  return (v/t*100).toFixed(2)+'%';
}
console.log('rev2 문자그대로 now기준·임계12h    :',pairwise(12*H,LEAD,'now'));
console.log('rev2 관대해석   now기준·임계11h15m :',pairwise(GATE,LEAD,'now'));
console.log('참고 리드30분   now기준·임계11h15m :',pairwise(GATE,30*MIN,'now'));
console.log('★rev3 채택안 예정시각기준·11h15m   :',pairwise(GATE,LEAD,'planned'));
console.log('★rev3 채택안 리드60분(무관 확인)   :',pairwise(GATE,60*MIN,'planned'));
```
```
rev2 문자그대로 now기준·임계12h    : 100.00%      ← 검수 수치 정확히 재현
rev2 관대해석   now기준·임계11h15m : 9.94%        ← 검수 12.46%와의 차이는 아래 설명
참고 리드30분   now기준·임계11h15m : 3.63%
★rev3 채택안 예정시각기준·11h15m   : 0.00%
★rev3 채택안 리드60분(무관 확인)   : 0.00%
```

**9.94% vs 검수 12.46%**: 같은 날 쌍(slot0→slot1)을 분모에 넣느냐의 차이다. 같은 날 쌍은 공통 지터가 상쇄돼 그 임계에서 절대 위반하지 않으므로(0%), 교차일 쌍만 보면 약 19.9%, 두 쌍 평균이 9.94%다. 검수의 해석식 `P(Δ<−10분)=12.5%`는 교차일 쌍만 본 값이다. **결론(규칙이 깨져 있음)과 채택안 수치(0.00%)는 양쪽 프레이밍에서 동일하다.**

---

## 부록 C. [E3] 지연 흡수 드리프트 감쇠 검증 (rev3 신규)

```js
const MIN=60,H=3600,GATE=11*H+15*MIN;
function trace(label,buf,D0){
  console.log(`\n[${label}] 흡수목표=직전+${((GATE+buf)/H).toFixed(3)}h, 초기드리프트 ${D0/MIN}분`);
  let last=9*H+D0, base=9*H;
  for(let s=1;s<=6;s++){
    base+=12*H;
    let sched=base, dfr=false;
    if(sched-last<GATE){ sched=last+GATE+buf; dfr=true; }
    const gap=sched-last;
    console.log(`  슬롯${s}: ${dfr?'DEFER':'정시 '} 예정+${((sched-base)/MIN).toFixed(0).padStart(3)}분  실간격 ${(gap/H).toFixed(3)}h  ${gap>=GATE?'OK':'★위반'}`);
    last=sched;
  }
}
trace('rev2 현행 +12h 흡수',   45*MIN, 150*MIN);
trace('rev3 개정 +11h20m 흡수', 5*MIN, 150*MIN);
trace('rev3 개정 최악 드리프트3h', 5*MIN, 180*MIN);
```

출력은 3-2 ④의 표와 같다. **rev2는 6슬롯 내내 `예정+150분`으로 고착**(2차 검수 지적 ③ 재현), **rev3은 110→70→30→정시**로 슬롯당 40분씩 감쇠하며, 최악(3시간)에서도 140→100→60→20→정시로 4슬롯 만에 복귀한다. 모든 행의 실간격이 GATE 이상이다.

---

## 관련
- 선행 결정: [[2026-08-08_naver_blog_saas_plan]]
- 원본 회의: `00_Raw/2026-08-08/run_20260808_105736_naver_blog_saas_네이버블로그자동화SaaS기획/`
- rev1 커밋: `7024ce3` (검수 FAIL) · rev2: 본 문서
