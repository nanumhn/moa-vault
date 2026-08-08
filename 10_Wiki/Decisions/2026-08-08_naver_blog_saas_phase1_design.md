# 네이버 블로그 자동화 SaaS — 페이즈1 설계 (화면 · DB 스키마 · 인터페이스 스펙)

작성: 윤서진(CTO) · 2026-08-08
선행 결정문서: [[2026-08-08_naver_blog_saas_plan]] (형 결재 완료 · 노선 ㉡ 사용자 PC 설치형 확정)
상태: **설계 초안 — qa-lead-jian 검수 → 형 승인 시 페이즈1 완료 판정**

> 결정문서 관례를 따라 전문용어에는 괄호로 짧은 한글 설명을 붙였다.

---

## 0. 이 문서가 확정하는 것 / 확정하지 않는 것

| | 내용 |
|---|---|
| **확정(승인 대상)** | ① DB 스키마 12개 테이블 ② 웹 대시보드 화면 11개 ③ PC 에이전트↔서버 인터페이스 7개 엔드포인트 ④ 발행 제약(하루 2회·12시간) 강제 지점 4곳 |
| **확정 안 함(형 결재 필요, 9장)** | 요금 금액 · 구글시트 연결 방식 · 에이전트 배포/코드서명 · 신규 레포/포트 |
| **범위 밖(절대 안 만듦)** | 사용자 네이버 아이디·비밀번호·세션쿠키의 서버 저장 (선행문서 5장) |

### 0-1. 설계를 관통하는 4개 원칙
1. **서버는 비밀을 모른다.** 네이버 인증정보는 사용자 PC 밖으로 나오지 않는다. 에이전트는 서버에 "로그인 되어 있음/없음"과 "블로그 ID"만 보고한다. 쿠키·비번·토큰 원문은 전송·저장 대상이 아니다.
2. **발행 경로에 AI가 없다.** 본문은 발행 시점에 만드는 게 아니라 **미리 만들어져 시트/DB에 들어와 있다**. (기본플랜=사용자가 직접 채움 / 업셀=우리 배치 워커가 미리 채움) → 발행은 "이미 있는 글을 올리는" 단순 작업이 되고, 로컬 LLM(LM Studio)이 죽어도 발행은 안 멈춘다. 실시간 LLM 호출을 발행 경로에 넣지 않는 것이 이번 설계의 핵심 단순화다.
3. **중복 발행은 실패보다 나쁘다.** 사용자 블로그에 같은 글이 두 번 올라가면 저품질 리스크가 커진다. 그래서 "결과를 모르겠는 상태(UNVERIFIED)"는 **절대 자동 재시도하지 않는다**. 실패로 단정할 수 있을 때만 재시도한다.
4. **하드 룰은 한 곳에 두지 않는다.** 하루 2회·12시간 제약은 UI·잡생성기·DB제약·수령시점 4중으로 막는다(3장).

---

## 1. 시스템 구성

```
[사용자 브라우저]
      │ NextAuth v5 세션
      ▼
[웹 대시보드 + API]  Next.js 16 (App Router)
      │                    ├─ /api/agent/v1/*  (에이전트 전용, Bearer 토큰)
      │                    └─ /api/internal/cron/*  (스케줄러, 시크릿 헤더)
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

- **경계선의 의미**: 네이버에 접속하는 코드는 전부 사용자 PC 안에만 있다. 우리 서버는 네이버와 통신하지 않는다. 이게 선행문서 5장 보안원칙의 구조적 구현이다.
- 에이전트 기술 스택은 페이즈2에서 확정하되 현재 유력안은 **트레이 앱(Tauri 또는 Electron) + Playwright/CDP로 사용자 기본 크롬 프로필에 attach**. 별도 브라우저를 띄우지 않고 사용자가 평소 쓰는 크롬에 붙는 방식 — 우리가 이미 chrome-devtools attach 운영 경험이 있고, 사용자가 새로 로그인할 필요가 없다.

---

## 2. DB 스키마

PostgreSQL + Prisma 6 (saju-studio와 동일 스택). 시각 컬럼은 전부 UTC 저장, 표시·쿼터 계산만 블로그별 타임존 적용.

### 2-1. 테이블 한눈에

| 테이블 | 역할 | 핵심 관계 |
|---|---|---|
| `User` | 사용자(테넌트) | 최상위 |
| `Account`/`Session`/`VerificationToken` | NextAuth v5 표준 | User 1:N |
| `Plan` | 요금제 정의(코드·쿼터) | 마스터 |
| `Subscription` | 사용자의 구독·애드온 | User 1:1 |
| `Blog` | 연결된 네이버 블로그 | **User 1:N (최대 3)** |
| `Agent` | 페어링된 PC | User 1:N, Blog와는 N:N 아님(3-4 참고) |
| `PairingCode` | 1회용 페어링 코드 | User 1:N |
| `SheetSource` | 구글시트 연동 | Blog 1:1 |
| `ContentItem` | 글감(제목·본문) | Blog 1:N |
| `Schedule` | 예약 슬롯 | **Blog 1:N (최대 2)** |
| `PublishJob` | 발행 작업 1건 | Blog 1:N |
| `JobEvent` | 잡 단계 타임스탬프 로그 | PublishJob 1:N |
| `AuditEvent` | 계정·설정·페어링 변경 로그 | User 1:N |

**이벤트 테이블을 둘로 나눈 이유**: `JobEvent`는 잡 1건당 5~8행씩 쌓이는 고빈도·정형 로그라 잡 상세 화면에서 `jobId` 하나로 빠르게 긁어야 한다. `AuditEvent`는 저빈도·비정형(보안 감사용)이다. 한 테이블에 섞으면 잡 타임라인 조회가 전체 이벤트 테이블 스캔이 되고, 보존기간 정책(잡 90일 / 감사 1년)도 따로 못 준다.

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

  // 알림 수신 설정 (실패·오프라인 경고)
  notifyEmail       Boolean @default(true)
  notifyOnFailure   Boolean @default(true)
  notifyOnOffline   Boolean @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  accounts     Account[]
  sessions     Session[]
  subscription Subscription?
  blogs        Blog[]
  agents       Agent[]
  pairingCodes PairingCode[]
  auditEvents  AuditEvent[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
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

// ─────────────────────────── 요금제 / 구독 ───────────────────────────

model Plan {
  code            String  @id            // "BASIC" | "PRO" ...
  name            String
  blogQuota       Int     @default(1)    // 기본 포함 블로그 수
  aiDraftIncluded Boolean @default(false)
  priceKrw        Int?                   // [미정] 금액 확정 전까지 null
  isActive        Boolean @default(true)
  sortOrder       Int     @default(0)

  subscriptions Subscription[]
}

model Subscription {
  id     String @id @default(cuid())
  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  planCode String
  plan     Plan   @relation(fields: [planCode], references: [code])
  status   SubscriptionStatus @default(TRIALING)

  // ── 업셀 애드온 2종 (선행문서 3·7장) ──
  extraBlogSlots Int     @default(0)   // 추가 블로그. plan.blogQuota + 이 값 <= 3 (앱에서 강제)
  aiDraftEnabled Boolean @default(false)

  // 결제 레일은 페이즈2에서 확정 — 컬럼만 미리 확보(nullable)
  billingProvider   String?
  externalCustomerId String?
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

// ─────────────────────────── 블로그 (1:N, 최대 3) ───────────────────────────

model Blog {
  id     String @id @default(cuid())
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  naverBlogId String     // blog.naver.com/{naverBlogId} 의 그 아이디
  displayName String
  timezone    String     @default("Asia/Seoul")
  status      BlogStatus @default(PENDING_VERIFY)

  // 소유 증명: 서버가 확인할 방법이 없으므로 "그 PC의 네이버 로그인 세션이
  // 이 blogId를 소유한다"는 사실을 에이전트가 보고한 것으로 갈음한다.
  verifiedAt      DateTime?
  verifiedByAgentId String?

  // 발행 기본값
  defaultCategoryName String?
  defaultOpenType     String @default("PUBLIC")   // PUBLIC | NEIGHBOR | PRIVATE
  defaultAllowComment Boolean @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  sheetSource SheetSource?
  schedules   Schedule[]
  contents    ContentItem[]
  jobs        PublishJob[]

  // 같은 사용자가 같은 블로그를 두 번 등록하는 것 방지.
  // 다른 사용자가 같은 blogId를 등록하는 것은 전역 unique로 막지 않는다
  // (대행사가 고객 블로그를 관리하는 정당한 경우가 있고, 전역 unique는
  //  "선점 공격"으로 남의 블로그 등록을 막아버리는 부작용이 생긴다.)
  @@unique([userId, naverBlogId])
  @@index([status])
}

enum BlogStatus {
  PENDING_VERIFY   // 등록됐지만 에이전트가 소유 확인 전 — 발행 불가
  ACTIVE
  PAUSED           // 사용자가 잠시 끔
  DISCONNECTED     // 연결 해제(이력 보존용, 발행 불가)
}

// ─────────────────────────── 에이전트 / 페어링 ───────────────────────────

model Agent {
  id     String @id @default(cuid())
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  deviceName    String
  os            String
  osVersion     String?
  machineIdHash String    // PC 식별자의 해시. 원본 하드웨어 ID는 저장하지 않음
  agentVersion  String

  // ★ 토큰 원문은 저장하지 않는다. sha256 해시만.
  tokenHash      String    @unique
  tokenIssuedAt  DateTime  @default(now())
  tokenExpiresAt DateTime
  revokedAt      DateTime?
  revokedReason  String?

  // 하트비트로 갱신되는 상태
  lastSeenAt      DateTime?
  lastStatus      AgentRunState @default(IDLE)
  naverLoggedIn   Boolean       @default(false)
  knownBlogIds    String[]      // 그 PC 세션이 소유한 네이버 블로그 아이디 목록
  nextPollSec     Int           @default(60)
  lastIpHash      String?       // 감사용. 원본 IP 미저장

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  claimedJobs PublishJob[]

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

  codeHash  String   @unique   // 코드 원문 미저장
  expiresAt DateTime            // 발급 +10분
  usedAt    DateTime?
  usedByAgentId String?
  failedAttempts Int @default(0)
  voidedAt  DateTime?           // 5회 실패 시 폐기

  createdAt DateTime @default(now())

  @@index([userId, expiresAt])
}

// ─────────────────────────── 글감 (구글시트) ───────────────────────────

model SheetSource {
  id     String @id @default(cuid())
  blogId String @unique
  blog   Blog   @relation(fields: [blogId], references: [id], onDelete: Cascade)

  spreadsheetId String
  sheetName     String  @default("글감")
  headerRow     Int     @default(1)

  lastSyncedAt   DateTime?
  lastSyncStatus String?    // OK | PERMISSION_DENIED | SCHEMA_MISMATCH | NOT_FOUND
  lastSyncError  String?
  syncedRowCount Int        @default(0)

  writeBackEnabled Boolean @default(true)   // 결과 URL을 시트에 되돌려 쓰기

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model ContentItem {
  id     String @id @default(cuid())
  blogId String
  blog   Blog   @relation(fields: [blogId], references: [id], onDelete: Cascade)

  source     ContentSource @default(SHEET)
  sheetRowNo Int?           // 시트 원본 행 번호 (write-back 대상)

  title      String
  bodyHtml   String        @db.Text   // 스마트에디터3.0 서식 규격
  tags       String[]
  categoryName String?
  desiredDate DateTime?    @db.Date   // 사용자가 지정한 발행 희망일(없으면 큐 순서대로)
  priority   Int           @default(0)

  status     ContentStatus @default(READY)
  statusNote String?

  contentHash String       // 제목+본문 sha256. 같은 블로그 내 중복 글감 탐지
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  jobs PublishJob[]

  @@index([blogId, status, desiredDate, priority])
  @@unique([blogId, sheetRowNo])
}

enum ContentSource {
  SHEET       // 사용자가 시트에 직접 채움 (기본플랜)
  AI_DRAFT    // 우리 배치 워커가 채움 (업셀)
  MANUAL      // 대시보드에서 직접 입력
}

enum ContentStatus {
  DRAFT      // AI 생성 중/검토 전
  READY      // 발행 가능
  ASSIGNED   // 잡에 물림
  PUBLISHED
  FAILED
  SKIPPED    // 사용자가 건너뜀
}

// ─────────────────────────── 예약 (블로그당 최대 2슬롯) ───────────────────────────

model Schedule {
  id     String @id @default(cuid())
  blogId String
  blog   Blog   @relation(fields: [blogId], references: [id], onDelete: Cascade)

  slotIndex Int      // 0 또는 1 — 하루 최대 2회 제약의 물리적 표현
  hour      Int      // 0-23, 블로그 타임존 기준
  minute    Int      // 0-59
  weekdays  Int[]    // 0(일)~6(토). 비우면 매일
  jitterSec Int      @default(600)  // ±10분 랜덤 흔들기 — 정각 기계패턴 회피
  enabled   Boolean  @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // slotIndex를 0/1로 제한 + 유니크 → 블로그당 스케줄 3개째가 물리적으로 안 생긴다
  @@unique([blogId, slotIndex])
}

// ─────────────────────────── 발행 잡 ───────────────────────────

model PublishJob {
  id     String @id @default(cuid())
  blogId String
  blog   Blog   @relation(fields: [blogId], references: [id], onDelete: Cascade)

  contentItemId String?
  contentItem   ContentItem? @relation(fields: [contentItemId], references: [id])

  // ★ 하루 2회 제약의 DB 레벨 방어선
  slotDate  DateTime @db.Date   // 블로그 타임존 기준 날짜
  slotIndex Int                  // 0 | 1

  scheduledAt DateTime           // 지터 적용 후 실제 목표 시각(UTC)
  expiresAt   DateTime           // scheduledAt + 3시간. 넘기면 EXPIRED
  origin      JobOrigin @default(SCHEDULED)

  status   JobStatus @default(QUEUED)
  attempt  Int       @default(0)
  maxAttempts Int    @default(3)

  // 수령(claim) 관리
  claimedByAgentId String?
  claimedByAgent   Agent?  @relation(fields: [claimedByAgentId], references: [id])
  claimedAt        DateTime?
  leaseExpiresAt   DateTime?

  // 결과
  idempotencyKey String   @unique   // 잡 생성 시 발급. 결과 보고 중복 차단용
  postUrl        String?
  postedAt       DateTime?
  errorCode      String?
  errorMessage   String?
  finishedAt     DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  events JobEvent[]

  // 같은 블로그·같은 날짜·같은 슬롯에 잡이 두 개 생길 수 없다
  @@unique([blogId, slotDate, slotIndex])
  @@index([status, scheduledAt])
  @@index([blogId, status])
}

enum JobOrigin {
  SCHEDULED   // 스케줄러가 만듦
  MANUAL      // 사용자가 "지금 발행"
  RETRY       // 실패 후 재시도
}

enum JobStatus {
  QUEUED      // 만들어짐, 아직 아무도 안 가져감
  CLAIMED     // 에이전트가 가져감(리스 보유)
  RUNNING     // 에디터 열고 작성 중
  SUBMITTED   // 발행 버튼 눌렀음, 결과 확인 전
  VERIFIED    // 발행 확인됨(postUrl 확보) — 성공
  UNVERIFIED  // 눌렀는데 확인 실패 ★자동 재시도 절대 금지
  FAILED      // 실패 확정 — 재시도 가능
  EXPIRED     // 슬롯 시간 지남(대부분 PC 꺼짐)
  CANCELED    // 사용자가 취소
  SKIPPED     // 제약(12시간 룰 등)에 걸려 건너뜀
}

model JobEvent {
  id    String @id @default(cuid())
  jobId String
  job   PublishJob @relation(fields: [jobId], references: [id], onDelete: Cascade)

  type      String   // 2-3 이벤트 타입 표
  at        DateTime           // 실제 발생 시각(에이전트 보고분은 서버시간으로 보정)
  recordedAt DateTime @default(now())  // 서버 수신 시각
  actor     String   // "server" | "agent:<id>" | "user:<id>"
  detail    Json?

  @@index([jobId, at])
}

model AuditEvent {
  id     String @id @default(cuid())
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  type       String   // PAIRING_CODE_ISSUED, AGENT_PAIRED, AGENT_REVOKED,
                      // BLOG_ADDED, BLOG_REMOVED, SCHEDULE_CHANGED,
                      // SHEET_CONNECTED, PLAN_CHANGED, LOGIN ...
  entityType String?
  entityId   String?
  ipHash     String?
  detail     Json?
  at         DateTime @default(now())

  @@index([userId, at])
}
```

### 2-3. 잡 단계 이벤트 타입 (선행문서 3장 "액션별 단계 타임스탬프" 요구 충족)

한 잡의 정상 수명은 아래 순서로 **각각 1행씩** `JobEvent`에 남는다. 대시보드 잡 상세는 이걸 세로 타임라인으로 그린다.

| 순서 | type | 기록 주체 | 의미 |
|---|---|---|---|
| 1 | `JOB_CREATED` | server | 스케줄러가 슬롯 잡을 만듦 |
| 2 | `CONTENT_BOUND` | server | 글감이 잡에 물림 |
| 3 | `JOB_CLAIMED` | agent | 에이전트가 가져감(리스 시작) |
| 4 | `AGENT_SESSION_OK` | agent | 네이버 로그인 상태 확인됨 |
| 5 | `EDITOR_OPENED` | agent | 글쓰기 에디터 진입 |
| 6 | `CONTENT_FILLED` | agent | 제목·본문·태그 입력 완료 |
| 7 | `PUBLISH_SUBMITTED` | agent | 발행 버튼 클릭 |
| 8 | `PUBLISH_VERIFIED` | agent | 결과 URL 확인 → 성공 |
| — | `PUBLISH_UNVERIFIED` | agent | 눌렀으나 URL 확인 실패 |
| — | `JOB_FAILED` | agent/server | 실패 확정(errorCode 포함) |
| — | `JOB_RETRY_SCHEDULED` | server | 재시도 예약 |
| — | `LEASE_RENEWED` / `LEASE_EXPIRED` | server | 리스 갱신/만료 |
| — | `JOB_SKIPPED_BY_QUOTA` | server | 12시간 룰에 걸려 건너뜀 |
| — | `JOB_EXPIRED` | server | 슬롯 만료(PC 꺼짐 등) |
| — | `JOB_CANCELED` | user | 사용자 취소 |

보존기간: `JobEvent` 90일 / `AuditEvent` 365일 (일 배치 삭제).

---

## 3. 발행 제약(하루 2회 · 최소 12시간)을 강제하는 4개 지점

선행문서 3장의 하드 룰. **한 군데만 막으면 반드시 새는 지점이 생기므로 4중으로 건다.**

| 층 | 위치 | 무엇을 막나 | 뚫렸을 때 |
|---|---|---|---|
| L1 | 예약 설정 화면 | 슬롯 3개째 추가 금지, 두 슬롯 간격 12시간 미만이면 저장 불가 | UI만 우회하면 뚫림 |
| L2 | 잡 생성기(cron) | 슬롯 잡 생성 직전, 해당 블로그의 마지막 성공 발행(`VERIFIED`/`SUBMITTED`/`UNVERIFIED`)이 12시간 이내면 잡을 만들지 않고 `SKIPPED` 기록 | 동시 실행 시 경합 가능 |
| L3 | **DB 유니크 제약** | `@@unique([blogId, slotDate, slotIndex])` + `slotIndex ∈ {0,1}` → 같은 날 3번째 잡이 물리적으로 INSERT 불가 | 뚫을 수 없음 |
| L4 | 잡 수령(claim) 시점 | 에이전트가 가져가는 그 순간 12시간 재검사(잡 생성 후 사용자가 수동 발행을 끼워넣었을 수 있음) → 위반이면 잡을 내주지 않고 `SKIPPED` | — |

### 3-1. 판정 규칙 (모호한 지점 명시)
- **"하루"의 기준**: 블로그의 `timezone`(기본 Asia/Seoul) 기준 달력 날짜. UTC 아님.
- **자정 경계**: 23:50 발행 후 다음날 00:10 발행은 날짜는 다르지만 간격이 20분이라 **12시간 룰에서 차단**된다. 두 룰은 OR가 아니라 **AND**로 검사한다.
- **카운트 대상**: `VERIFIED` · `SUBMITTED` · `UNVERIFIED` (= 네이버에 글이 올라갔을 가능성이 있는 상태 전부). `FAILED`/`EXPIRED`는 카운트하지 않는다 — 안 올라갔으므로 쿼터를 소모시키면 안 된다.
- **수동 발행("지금 발행")도 같은 룰을 받는다.** `origin=MANUAL` 잡도 슬롯을 차지한다. 그날 슬롯이 둘 다 소모됐으면 수동 발행 버튼이 비활성화되고 이유가 표시된다.
- **재시도는 슬롯을 새로 먹지 않는다.** 같은 `(blogId, slotDate, slotIndex)` 잡의 `attempt`만 올린다.

### 3-2. 중복 발행 방지 (원칙 3의 구현)
- 결과 보고는 `idempotencyKey` 기준 **최초 1건만 반영**. 네트워크 재전송으로 같은 결과가 두 번 와도 두 번째는 무시하고 200을 돌려준다(에이전트가 재시도를 멈추도록).
- `SUBMITTED` 이후에는 리스가 만료돼도 **다른 에이전트가 재클레임할 수 없다.** 발행 버튼을 이미 눌렀을 수 있기 때문.
- `UNVERIFIED`는 서버가 에이전트에게 **검증 잡(VERIFY)** 을 내려 "블로그 최근 글 목록에서 제목·contentHash 일치 확인"을 시킨다. 확인되면 `VERIFIED`로 승격, 못 찾으면 사용자에게 "확인 필요"로 노출하고 **자동 재발행은 하지 않는다**.

---

## 4. 웹 대시보드 화면 (11개)

### 4-0. 화면 지도
```
공개  ├ S1 랜딩/요금제
      └ S2 로그인·가입
로그인 ├ S3 온보딩 위저드 (최초 1회, 4스텝)
      ├ S4 대시보드 홈
      ├ S5 블로그 관리       ├ S8 예약 설정
      ├ S6 에이전트 관리     ├ S9 발행 이력 / S9d 잡 상세
      ├ S7 글감(시트)        ├ S10 요금제·결제
      └ S11 계정 설정
내부   └ A1 운영자 콘솔
```

### S1. 랜딩 / 요금제
- 제품 설명, 플랜 비교표(기본 / +추가블로그 / +AI글감대행), FAQ.
- **PC 설치형이라는 사실과 "PC가 켜져 있어야 발행된다"는 제약을 가입 전에 명시**한다. 이걸 숨기면 첫 달 이탈로 돌아온다.
- "네이버 비밀번호를 요구하지 않습니다"를 셀링포인트로 전면 배치.

### S2. 로그인 / 가입
- NextAuth v5. 구글 OAuth + 이메일 매직링크. 비밀번호 방식은 두지 않음.
- 가입 즉시 `Subscription`을 `TRIALING`으로 생성.

### S3. 온보딩 위저드 (4스텝 — 선행문서 3장 플로우 그대로)
| 스텝 | 화면 | 완료 조건 |
|---|---|---|
| 1 | 블로그 연결 | `naverBlogId` 입력 → `Blog(PENDING_VERIFY)` 생성 |
| 2 | 에이전트 설치·페어링 | 설치파일 다운로드 → 페어링 코드 표시(10분 카운트다운) → 에이전트가 붙으면 화면이 **폴링으로 자동 전환**. 이때 에이전트가 보고한 `knownBlogIds`와 스텝1의 블로그를 대조해 `ACTIVE`로 승격 |
| 3 | 구글시트 연동 | 시트 템플릿 "복사하기" 버튼 → 연결 → 첫 동기화 성공(1행 이상) |
| 4 | 예약 설정 | 슬롯 1~2개 저장(12시간 룰 검증 통과) |
- 각 스텝은 이탈 후 재진입 가능(진행상태 저장). 스텝2에서 막히는 사용자가 가장 많을 것이므로 **"안 될 때" 체크리스트**(방화벽·크롬 미설치·네이버 미로그인)를 접이식으로 항상 노출.

### S4. 대시보드 홈
- **오늘 발행 현황 카드**: 블로그별 슬롯 2칸을 타임라인으로 — `예정 09:00 ✓완료 / 예정 21:00 ⏳대기`.
- **에이전트 상태 배너**: 오프라인이면 최상단에 빨간 배너 + "마지막 응답 N분 전" + "이대로면 오늘 21:00 발행이 안 됩니다" (선행문서 3장 요구).
- **네이버 로그아웃 경고**: 에이전트는 켜져 있는데 `naverLoggedIn=false`면 별도 경고(발행 시점에야 실패하는 걸 미리 잡음).
- 남은 글감 수 경고: 3건 미만이면 "글감이 곧 떨어집니다".
- 최근 실패 3건 요약 + 각각 재시도 버튼.

### S5. 블로그 관리
- 목록(사용 2/3 형태로 쿼터 표시), 추가, 이름 변경, 일시중지/재개, 연결 해제.
- 추가 시 쿼터 초과면 업셀 모달(추가 블로그 애드온). **하드캡 3개는 결제로도 못 넘음** — 초과 시도 시 "최대 3개" 안내.
- 블로그별 발행 기본값(카테고리·공개범위·댓글 허용) 편집.
- `PENDING_VERIFY` 상태면 "에이전트가 이 블로그의 로그인을 확인하지 못했습니다" 배지 + 해결 가이드.

### S6. 에이전트 관리
- 기기 목록: 이름 · OS · 버전 · 온라인/오프라인 · 마지막 응답 시각 · 네이버 로그인 여부 · 인식된 블로그 목록.
- **페어링 코드 발급** 버튼(10분 유효, 남은 시간 표시, 재발급 시 이전 코드 즉시 폐기).
- 기기 연결 해제(토큰 revoke) — 즉시 반영, 다음 폴링에서 에이전트가 401 받고 스스로 정지.
- 에이전트 버전이 구버전이면 업데이트 안내.
- **한 사용자에 에이전트 여러 대 허용**(회사PC/집PC). 잡은 먼저 가져가는 쪽이 처리(리스 방식) — 다만 블로그별로 "선호 기기" 지정 옵션 제공(미지정이면 아무나).

### S7. 글감 (구글시트)
- 블로그별 시트 연결 상태 · 마지막 동기화 시각 · 동기화 오류 사유(권한 없음 / 헤더 불일치 / 시트 없음).
- "지금 동기화" 버튼.
- 글감 목록 테이블: 상태 · 희망일 · 제목 · 글자수 · 중복경고(같은 `contentHash` 존재 시).
- 대시보드에서 직접 글감 추가/수정(`source=MANUAL`).
- AI 글감 대행 사용자는 "생성 대기 N건 / 검토 대기 N건" 큐가 추가로 보임.

**시트 표준 헤더(고정)**: `상태 | 발행희망일 | 제목 | 본문 | 태그 | 카테고리 | 결과URL | 결과시각 | 실패사유`
→ 앞 6열은 사용자가 채우는 입력, 뒤 3열은 우리가 되돌려 쓰는 출력(write-back).

### S8. 예약 설정
- 블로그별 슬롯 편집기. **슬롯은 최대 2칸으로 UI 자체가 고정**(3번째 추가 버튼이 없음).
- 두 번째 슬롯 시각을 고르면 첫 슬롯 기준 ±12시간 구간이 **선택 불가로 회색 처리**되고, 이유를 문장으로 표시("네이버 저품질 위험을 줄이려고 12시간 간격을 강제합니다").
- 요일 선택, 일시중지, 지터 안내("정확히 정각이 아니라 ±10분 안에서 자연스럽게 올립니다").
- 미리보기: "다음 7일 발행 예정 시각" 리스트.

### S9. 발행 이력
- 필터(블로그·상태·기간), 상태 배지, `postUrl` 바로가기.
- 실패 건은 사유 문구 + "재시도" / "수동 발행" 선택지 (선행문서 3장 요구).

### S9d. 잡 상세 ★
- **단계 타임라인**: `JobEvent`를 세로로 — 요청됨 09:00:00 → 수령 09:00:12 → 로그인확인 09:00:15 → 에디터열림 09:00:31 → 작성완료 09:01:12 → 발행클릭 09:01:20 → 확인됨 09:01:34. 각 단계 소요시간(델타)도 표시.
- 발행된 본문 스냅샷, 대상 블로그, 담당 에이전트.
- `UNVERIFIED` 건은 **"이미 올라갔을 수 있으니 블로그를 먼저 확인하세요"** 경고와 함께 재발행 버튼을 기본 비활성화(체크박스로 명시 확인해야 활성).

### S10. 요금제 · 결제
- 현재 플랜, 애드온 토글(추가 블로그 수 / AI 글감 대행), 다음 결제일, 결제 이력, 해지.
- 금액은 `Plan.priceKrw`에서 렌더 — **금액 미확정이므로 화면은 만들되 값은 형 결재 후 주입**.

### S11. 계정 설정
- 프로필, 타임존, 알림 설정(실패 알림·오프라인 알림), 데이터 내보내기, 탈퇴.
- **"우리가 저장하지 않는 것" 고지 블록** 상시 노출(비번·세션쿠키) — 신뢰가 이 제품의 판매 포인트라 화면에 못 박아 둔다.

### A1. 운영자 콘솔 (내부)
- 테넌트 목록, 잡 성공률/실패코드 분포, 에이전트 버전 분포, 오프라인 에이전트 비율.
- **실패코드 분포가 가장 중요한 계기판** — `EDITOR_DOM_CHANGED`가 급증하면 네이버 에디터가 바뀐 것이고, 이건 전 고객 동시 장애다. 임계치 초과 시 즉시 경보.

---

## 5. PC 에이전트 ↔ 서버 인터페이스 스펙

Base URL: `https://{app}/api/agent/v1` · 전부 HTTPS · JSON · 인증은 `Authorization: Bearer <agentToken>` (페어링 제외).
공통 응답 헤더: `X-Server-Time`(RFC3339). **에이전트는 로컬 시계를 신뢰하지 않고 서버 시간을 기준으로 삼는다** (사용자 PC 시계가 틀어져 있으면 발행 시각이 통째로 어긋난다).

### 5-1. 페어링 프로토콜

```
[대시보드]                [서버]                     [PC 에이전트]
    │  코드 발급 요청 ──────▶│
    │◀── "K7Q2-M4XR" (10분) │  DB엔 sha256(코드)만 저장
    │                        │
    │   사용자가 코드를 에이전트 창에 입력 ─────────────▶│
    │                        │◀── POST /pair {code, device, ver} ──│
    │                        │   코드해시 조회·만료·사용여부 검사   │
    │                        │── {agentId, agentToken, ...} ──────▶│
    │                        │   코드 usedAt 기록(1회용 소멸)      │
    │◀── 화면 자동 전환(폴링) │                    토큰은 OS 자격증명 저장소에 보관
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
- 코드는 혼동문자(I·L·O·U) 뺀 대문자·숫자 8자리 = 32⁸ ≈ 1.1조 조합. 10분 TTL + 5회 실패 폐기와 합치면 추측 공격이 성립하지 않는다.
- 코드·토큰 모두 **평문 미저장**(sha256). DB가 통째로 유출돼도 남의 에이전트를 조종할 수 없다.
- 토큰 유효기간 90일, 만료 30일 전부터 `POST /token/rotate`로 무중단 갱신. 사용자가 대시보드에서 해제하면 `revokedAt` 즉시 세팅 → 다음 요청부터 401.
- 페어링에 **네이버 비번은 물론 사용자 이메일조차 필요 없다.** 코드 하나로 소유권을 옮긴다.

### 5-2. 하트비트 / 잡 수신 (폴링)

**결정: WebSocket 상시연결이 아니라 폴링을 쓴다.** 사용자 PC는 NAT·기업방화벽 뒤에 있고 노트북은 절전·네트워크 전환이 잦아 상시연결 재접속 관리가 실패 원인이 된다. 발행 시각 정밀도는 분 단위면 충분하고(지터를 ±10분이나 주는 마당에 초 단위 정밀도는 무의미), 폴링이 방화벽을 가장 잘 통과한다.

**폴링 주기(제안)** — 값은 서버가 응답의 `nextPollSec`로 지시하고 **에이전트는 하드코딩하지 않는다**. 나중에 서버만 고쳐서 전체 조절할 수 있어야 한다.

| 상황 | 주기 |
|---|---|
| 평시(다음 슬롯까지 여유) | **60초** |
| 슬롯 예정시각 T−5분 ~ T+30분 | **15초** |
| 잡 실행 중 | 폴링 중단, 진행 이벤트 전송이 하트비트를 겸함(최소 30초마다 1회) |
| 서버 5xx/네트워크 오류 | 지수 백오프 30초→10분 상한, 지터 ±20% |
| 401(revoked) | 폴링 영구 중단 + 트레이 알림 |

트래픽 추정: 사용자 1명·평시 60초 폴링 = 하루 약 1,440 요청. 200명이면 약 29만 요청/일 — 응답 본문이 200바이트 수준이라 서버리스에서도 부담 없다.

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
- `commands` 로 서버가 에이전트를 조종한다: `REVOKE`(즉시 정지) / `UPDATE_AVAILABLE` / `RESYNC_BLOGS`(블로그 목록 재보고) / `PING_LOG`(진단 로그 업로드 요청).
- **오프라인 판정**: `lastSeenAt + max(180초, 3 × nextPollSec)` 경과. 3배로 잡은 이유는 폴링 1~2회 유실을 오프라인으로 오인하지 않기 위해서다.

**`POST /jobs/claim`** — 잡 수령(GET이 아닌 이유: 서버 상태를 바꾼다=리스를 건다)
```jsonc
// 요청
{ "max": 1, "capabilities": { "editor": "se3", "browser": "chrome" } }
// 200 — 잡 있음
{ "jobs": [ {
    "jobId": "cl…", "idempotencyKey": "…",
    "blog": { "id": "cl…", "naverBlogId": "myshop2020" },
    "scheduledAt": "2026-08-09T00:00:00Z", "expiresAt": "2026-08-09T03:00:00Z",
    "leaseExpiresAt": "2026-08-09T00:15:00Z",
    "content": { "title": "…", "bodyHtml": "…", "tags": ["…"],
                 "categoryName": "일상", "openType": "PUBLIC", "allowComment": true }
} ] }
// 204 — 잡 없음 (본문 없음)
```
- **리스(lease) 방식**: 수령 시 15분 임대. 진행 이벤트를 보내면 갱신된다. 에이전트가 죽으면 리스 만료 후 재수령 가능 — 단 `SUBMITTED` 이후는 재수령 금지(3-2).
- 서버는 이 시점에 12시간 룰을 **재검사**한다(L4). 위반이면 잡 대신 `{"jobs":[],"skipped":[{"jobId":"…","reason":"MIN_INTERVAL_12H"}]}`.
- 잡이 여러 개여도 `max`는 1을 권장 — 한 PC가 두 글을 동시에 쓰면 에디터 충돌이 난다.

**`POST /jobs/{jobId}/events`** — 진행 보고 (리스 갱신 겸용)
```jsonc
{ "events": [ { "type": "EDITOR_OPENED", "at": "…", "detail": { "ms": 3120 } } ],
  "renewLease": true }
// 200 → { "leaseExpiresAt": "…", "abort": false }
```
- 응답의 `abort:true`면 에이전트는 즉시 중단(사용자가 대시보드에서 취소한 경우).

**`POST /jobs/{jobId}/result`** — 최종 결과
```jsonc
{ "idempotencyKey": "…",
  "outcome": "VERIFIED",              // VERIFIED | UNVERIFIED | FAILED
  "postUrl": "https://blog.naver.com/myshop2020/223…",
  "postedAt": "…",
  "errorCode": null, "errorMessage": null }
// 200 → { "accepted": true, "duplicate": false, "nextAction": "IDLE" }
```
- `idempotencyKey`가 이미 처리됐으면 `{"accepted":true,"duplicate":true}` + 200. **에러를 주지 않는다** — 에러를 주면 에이전트가 재시도를 반복하다 중복 발행으로 이어진다.
- `nextAction`: `IDLE` | `VERIFY_LATER`(UNVERIFIED일 때 60초 후 검증 잡 지시) | `STOP`.

**에이전트 실패코드 표준** (`errorCode`)
| 코드 | 의미 | 서버 처리 |
|---|---|---|
| `NAVER_LOGGED_OUT` | 세션 없음/만료 | 재시도 안 함. 사용자에게 "네이버 로그인 필요" 알림 |
| `CAPTCHA_REQUIRED` | 캡차·추가인증 | 재시도 안 함. 사용자 개입 요청 |
| `EDITOR_DOM_CHANGED` | 에디터 화면 구조 변경 | 재시도 안 함. **운영자 즉시 경보**(전체 장애 신호) |
| `BROWSER_UNAVAILABLE` | 크롬 없음/attach 실패 | 5분 후 1회 재시도 |
| `NETWORK` | 네트워크 오류 | 백오프 재시도(최대 3) |
| `NAVER_RATE_LIMITED` | 네이버가 제한 | 당일 해당 블로그 발행 중단 |
| `CONTENT_REJECTED` | 본문 거부(길이·금칙어 등) | 재시도 안 함. 글감을 `FAILED`로 |
| `UNKNOWN` | 그 외 | 1회 재시도 후 중단 |

**`POST /token/rotate`** — 토큰 갱신 (구 토큰으로 인증, 신 토큰 발급, 구 토큰 5분 유예 후 폐기)
**`GET /release/latest`** — 에이전트 자동 업데이트용 (버전·서명된 설치파일 URL·sha256)

### 5-3. 서버 내부 스케줄러 (cron)

| 잡 | 주기 | 하는 일 |
|---|---|---|
| `slot-planner` | 5분 | 앞으로 35분 내 슬롯을 스캔해 `PublishJob` 생성(글감 바인딩·12시간 재검사·지터 확정). 미리 만들어야 에이전트가 15초 폴링으로 갈아탈 수 있다 |
| `sheet-sync` | 15분 | 시트 → `ContentItem` 동기화 + 발행 결과 write-back |
| `job-reaper` | 1분 | 리스 만료 회수 / `expiresAt` 지난 잡 `EXPIRED` 처리 + 알림 |
| `agent-watch` | 1분 | 오프라인 전환 감지 → 알림(중복 알림은 6시간 쿨다운) |
| `ai-draft` | 1시간 | 업셀 사용자 글감 부족분 로컬 LLM 배치 생성 |
| `retention` | 일 1회 | `JobEvent` 90일 / `AuditEvent` 365일 삭제 |

---

## 6. 보안 요약

| 항목 | 처리 |
|---|---|
| 네이버 비번·세션쿠키 | **수집·전송·저장 전부 안 함.** 에이전트→서버 페이로드에 쿠키 필드 자체가 없음 |
| 에이전트 토큰 | 서버는 sha256만 보관 / PC는 OS 자격증명 저장소(Windows DPAPI)에 보관, 평문 파일 금지 |
| 페어링 코드 | sha256 보관, 10분 TTL, 1회용, 5회 실패 폐기, IP 레이트리밋 |
| 멀티테넌시 격리 | 모든 조회는 `userId` 스코프 필수. 에이전트 토큰도 `userId`에 묶여 남의 잡을 수령할 수 없음 |
| 구글시트 | 사용자 구글 비번 미보유. 서비스계정 공유 또는 OAuth(9장 미결) |
| 로그 | IP는 해시로만, 본문 스냅샷은 사용자 데이터로 취급해 탈퇴 시 삭제 |
| 에이전트 배포 | 코드서명 필수(미서명이면 SmartScreen 경고로 설치 이탈 발생) — 9장 미결 |

---

## 7. 실패 시나리오와 설계상의 답

| 시나리오 | 설계상 처리 | 사용자에게 보이는 것 |
|---|---|---|
| 발행 시각에 PC가 꺼져 있음 | 잡은 `QUEUED`로 대기, `expiresAt`(+3시간)까지 기다림 → 그래도 안 켜지면 `EXPIRED` | 홈 배너 "에이전트 오프라인 — 오늘 21:00 발행 못 함" + 만료 후 알림 |
| 네이버가 로그아웃됨 | `NAVER_LOGGED_OUT`, 재시도 안 함 | "네이버에 다시 로그인해 주세요" + 재시도 버튼 |
| 발행 눌렀는데 응답이 끊김 | `UNVERIFIED` → 60초 후 검증 잡으로 최근 글 대조 | 확인되면 성공 처리 / 아니면 "확인 필요"(자동 재발행 없음) |
| 네이버 에디터 개편 | `EDITOR_DOM_CHANGED` 급증 → 운영자 경보 | 전체 공지 + 에이전트 핫픽스 배포 |
| 글감이 떨어짐 | 잡 생성 시 바인딩 실패 → 잡을 만들지 않음 | "글감 3건 미만" 사전 경고 |
| 사용자가 PC 두 대에 설치 | 리스 방식으로 먼저 가져간 쪽이 처리 | 기기 목록에 2대 표시, 블로그별 선호 기기 지정 가능 |
| 시트 권한이 끊김 | `lastSyncStatus=PERMISSION_DENIED` | 글감 화면에 사유 + 재연결 버튼 |

---

## 8. 페이즈2(개발) 착수 전 준비물

1. 신규 레포 `nblog-saas` (Next.js 16 + Prisma 6 + PostgreSQL/Neon), 개발 포트 **3002** — 3000(moa-studio)·3001(saju-studio)·8080(clo_studio)은 점유 정책상 회피.
2. 마이그레이션 순서: `Plan` 시드 → NextAuth 테이블 → 나머지.
3. 테스트 우선순위(Vitest) — **하드 룰부터 테스트로 못 박는다**:
   - 12시간 룰: 자정 경계(23:50 → 익일 00:10) 차단 검증
   - 슬롯 유니크: 같은 날 3번째 잡 INSERT 실패 검증
   - 멱등성: 같은 `idempotencyKey` 2회 보고 시 부작용 0
   - `SUBMITTED` 이후 재클레임 거부
   - `UNVERIFIED` 자동 재시도 미발생
4. 에이전트 프로토타입은 발행 로직보다 **페어링·폴링·하트비트 골격을 먼저** 만든다(가장 많이 깨지는 곳이 발행이 아니라 연결이다).

---

## 9. 형(CEO) 결재 필요 항목 — 페이즈1 완료 판정용

| # | 항목 | 선택지 | 내 추천 |
|---|---|---|---|
| 1 | **화면·스키마·인터페이스 승인** | 2·4·5장 그대로 승인 / 수정 | 승인 (완료 판정 조건) |
| 2 | **요금 금액** | 원가 재계산 후 확정 필요. 기본플랜/추가블로그/AI글감대행 3개 값 | 별도 원가 산정 후 재보고 **(내가 추천: 금액은 페이즈2 초반에 확정, 설계는 금액 미정으로도 진행 가능)** |
| 3 | **구글시트 연결 방식** | ㉠ 서비스계정에 시트 공유 ㉡ 구글 OAuth 로그인 | **㉠ (내가 추천)** — OAuth는 민감범위 심사가 걸려 MVP를 늦춘다. ㉠은 사용자가 시트 공유 한 번만 하면 됨 |
| 4 | **에이전트 배포·코드서명** | 코드서명 인증서 구매(연 20~40만원대) 여부 | 구매 필요 **(내가 추천)** — 미서명은 SmartScreen 경고로 설치 단계 이탈이 크다. 단 베타까지는 미서명+안내로 버틸 수 있음 |
| 5 | **신규 레포/포트** | `nblog-saas` / 3002 | 승인 요청 |

---

## 10. 잔존 리스크 (인지하고 진행)

- **네이버 자동화 탐지**: 사용자 본인 세션·본인 PC라 서버 봇보다 훨씬 안전하지만 0은 아니다. 완화책 = 하루 2회·12시간·±10분 지터·사람 속도 입력. 실제 계정 실측은 페이즈3 베타에서만 가능 — 선행문서 10장 kill 기준 유지.
- **에디터 개편 리스크**: 네이버가 에디터를 바꾸면 전 고객 동시 장애. 그래서 `EDITOR_DOM_CHANGED`를 별도 코드로 분리하고 운영자 콘솔 1순위 지표로 뒀다.
- **설치 지원 부담**: PC 설치형의 최대 비용은 서버비가 아니라 고객지원이다. 온보딩 스텝2의 이탈률을 페이즈3의 핵심 측정치로 삼아야 한다.
- **[미검증]** 이 문서의 폴링 주기·트래픽 추정은 실측이 아닌 계산치다. 베타에서 재측정 필요.

---

## 관련
- 선행 결정: [[2026-08-08_naver_blog_saas_plan]]
- 원본 회의: `00_Raw/2026-08-08/run_20260808_105736_naver_blog_saas_네이버블로그자동화SaaS기획/`
