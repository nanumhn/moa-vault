# 사주 앱 기술 아키텍처

## 스택 결정 (최종)

| 영역 | 선택 항목 | 대안 및 선택 근거 |
| :--- | :--- | :--- |
| **프레임워크/언어** | Next.js 16 + TypeScript | React 생태계의 안정성, 서버 컴포넌트 기반 빠른 성능 확보. 타입스크립트는 개발 규모 증가에 따른 유지보수성을 보장함. |
| **데이터베이스 (DB)** | PostgreSQL (Prisma ORM) | 복잡한 계층적 데이터(사주 명식)와 사용자 메타데이터를 함께 관리하기 용이하며, JSONB 타입을 통한 유연한 콘텐츠 저장이 가능함. |
| **인증 (Auth)** | NextAuth.js / Clerk | 소셜 로그인 및 이메일/패스워드 기반 인증을 간편하게 처리할 수 있는 솔루션 채택. 보안 취약점 대응 속도가 빠름. |
| **국제화 (i18n)** | `next-intl` 또는 React-i18next | 초기에는 영어(EN)에 집중하되, 구조적으로 다중 로케일 지원이 가능하도록 설계해야 함. 파일 기반 i18n을 권장함. |
| **호스팅** | Vercel | Next.js 최적화 배포 환경 제공 및 서버리스 함수 관리가 용이하여 초기 인프라 운영 비용 효율성이 높음. |
| **이미지/미디어 생성** | Cloudinary (CDN) + S3 | 감성 무드 카드 및 비주얼 티저의 대용량 트래픽을 안정적으로 처리하고, 다양한 크기 변환(Resizing)이 필요하므로 CDN 기반 스토리지 필수. |

## 사주 엔진
사주 해석 로직은 단순 데이터베이스 조회와 LLM 텍스트 생성을 결합한 **하이브리드 구조**를 채택해야 합니다. 순수 외부 라이브러리에 의존할 경우, 프로젝트의 핵심 비즈니스 규칙(Rule)을 커스터마이징하기 어렵습니다.

*   **핵심 로직 (Core Logic):** 사주 명식 분석 및 키워드 추출은 **자체 룰 엔진**으로 구현합니다. 이는 정확성과 예측 가능성이 가장 중요하며, 외부 API 호출 지연에 취약할 수 있는 LLM 의존도를 낮춥니다.
*   **감성 레이어 (Emotional Flair):** 사용자에게 전달되는 '공감적 문구', '오늘의 무드 설명' 등 텍스트 기반 해석은 **LLM 텍스트 생성 조합**을 활용합니다.
    *   **Gemma-4 활용 여부:** 초기 MVP 단계에서는 안정적인 API 호출과 비용 관리가 용이한 클라우드 LLM 제공자를 사용하는 것이 안전합니다. Gemma-4를 내부적으로 활용할 경우, 자체 호스팅 환경 구축 및 유지보수 리소스가 크게 증가하므로, **페이즈3 이상**으로 미루고 고도화 단계에서 고려하는 것을 권고합니다.

## 데이터 모델 (Prisma 스키마 의사코드)

```prisma
// User Model: 사용자 정보 및 로케일 관리
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  locale        String    @default("en") // EN/KO 등
  subscriptionId String?
  createdAt     DateTime  @default(now())

  subscriptions Subscription[]
}

// Subscription Model: 결제 상태 및 플랜 관리 (PayPal 연동 핵심)
model Subscription {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  planId        String // e.g., 'monthly_premium'
  status        String   // active, trial, canceled
  currentPeriodEnd DateTime?
  stripeCustomerId String? // PayPal/Stripe 통합 시 사용될 ID
  createdAt     DateTime  @default(now())

  @@unique([userId])
}

// Reading Model: 진단 리포트 및 콘텐츠 저장 (핵심 결과물)
model Reading {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  readingType   String    // e.g., 'daily_mood', 'initial_diagnosis'
  contentJson   Json      // 감성 무드 카드 데이터 (제목, 텍스트, 키워드 배열 등)
  isPaid        Boolean   @default(false) // 유료 콘텐츠 여부 플래그
  generatedAt   DateTime  @default(now())

  @@index([userId])
}

// WebhookEvent Model: 결제 트랜잭션 및 분쟁 기록 (재무/운영 필수)
model WebhookEvent {
  id            String    @id @default(cuid())
  transactionId String    @unique // PayPal Transaction ID
  eventType     String    // PaymentSuccessful, Refunded, SubscriptionCanceled 등
  amount        Float
  status        String
  relatedReadingId String? // 이 트랜잭션으로 생성된 Reading의 ID (선택적)
  createdAt     DateTime  @default(now())
}
```

## 배포 흐름
모든 환경은 코드 변경에 따른 자동화 테스트를 필수적으로 거쳐야 합니다.

1.  **개발 환경 (Development):** 로컬 환경 또는 전용 Feature 브랜치에서 작업 및 단위 테스트 수행. 사주 엔진의 룰셋 수정 시 가장 높은 수준의 검증이 필요함.
2.  **샌드박스/스테이징 (Sandbox / Staging):** 실제 운영 데이터와 분리된 가짜(Mock) 결제 환경을 연결하여 통합 테스트를 진행합니다. 특히 PayPal Webhook 수신, 환불 API 호출 시나리오 등 **결제 흐름 전체**에 대한 End-to-End 테스트가 필수입니다.
3.  **운영 환경 (Production):** 최종 QA 검증 통과 후 배포. 모니터링 시스템(Logging/Monitoring)을 즉각적으로 활성화하여 실시간 오류 추적 및 트래픽 급변 감지 준비.

## MVP 30일 launch 가능 범위
| 기능 영역 | 필수 여부 | 구현 난이도 | 비고 (기술 적용 지점) |
| :--- | :---: | :---: | :--- |
| **'오늘의 감성 무드 카드' 조회** | Yes | Medium | Reading 모델과 룰 엔진 결합. 핵심 콘텐츠 제공. |