# 신규 사업 기술 스펙 + 1인 자동화

## 주력 아이템 90일 MVP 즉시 착수 작업
| # | 작업 | 인일 | 산출물 | 자동화여부 |
|---|---|---|---|---|
| 1 | ComfyUI 모델 학습 및 이미지 생성 파이프라인 구축 | 2 | MVP AI 이미지 배치 기능 | Yes, n8n |
| 2 | n8n 자동화 스케줄러 설정 | 1 | 정기적 배포 파이프라인 | Yes |
| 3 | Stripe 결제 시스템 통합 | 3 | 결제 API 인터페이스 | Partial, 웹사이트 코드 |
| 4 | SEO 최적화 및 Google Search Console 설정 | 2 | 검색 엔진 유입 향상 | No |
| 5 | 초기 런치 마케팅 캠페인 (SNS, Blog) | 3 | 초기 트래픽 유입 | Partial |

## 기술 스택 최종안
- Frontend: Next.js
- Backend: ComfyUI, n8n
- DB: No direct database interaction, rely on LLM for template generation
- Auth: External service integration (e.g., Google OAuth)
- Payment: Stripe API
- Hosting: Vercel or similar PaaS
- AI: ComfyUI (이미지 배치 생성), Qwen2.5-7b 로컬 LLM (텍스트·메타데이터 생성)

## 1인 자동화 파이프라인 스케치
ComfyUI(이미지 배치 생성) → n8n(자동 스케줄·발행) → Next.js(사이트) → 수익 채널(AdSense·Stripe·Gumroad) 연결
- RTX 3060 6GB 제약: 정적 이미지·짧은 클립 배치 OK / 고해상도 장편 영상은 v2로 제외.

## IN / OUT 컷오프 (v1에 만들 것 / v2로 미룰 것)
- IN: n8n 자동화 잡 스케줄링, Stripe 구독 결제, AdSense 연동, 이미지 배치 생성+카탈로그 페이지 자동 발행
- OUT(v2): ComfyUI 고해상도/대형 영상 처리, Qwen 장문 상세 생성, 다국어, 모바일 앱

## 외부 SaaS 의존 목록 + 월 비용
- Google OAuth (무료)
- Stripe (거래 수수료 2.9%+$0.3, 월정액 0)
- Vercel hosting (Hobby 무료 ~ Pro $20/mo)
- Gumroad / Lemon Squeezy (판매 수수료형, 월정액 0)

## CTO(윤서진) 시간 배분 + 기존 프로젝트 충돌 여부
- 90일 내 주력 1개(AI 이미지 배치 사이트) MVP에 CTO 시간 60%, 서브(AI 아바타 생성기)에 25%, 자동화 파이프라인 공통화에 15%.
- 기존 프로젝트(픽셀 오피스·가족드라마)와 코드 충돌 없음 — 신규 독립 레포로 분리. ComfyUI/n8n 인프라는 공유.

> (자동 게이트 정리: 1차 산출 후반부에 중국어 토큰이 섞여(언어 드리프트) COO가 한국어로 보정하고 6GB 제약·시간배분 항목을 보강함.)