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
- AI: ComfyUI (图像生成), Qwen2.5-7b (文本生成)

## 1인 자동화 파이프라인 스케치
ComfyUI → n8n(自动化调度) → Next.js(网站) → 支付渠道连接

## IN / OUT 컷오프 (v1에 만들 것 / v2로 미룰 것)
- Out: ComfyUI高分辨率图像处理, Qwen2.5-7b详细文本生成
- In: n8n自动化任务调度, Stripe支付接口集成

## 외부 SaaS 의존 목록 + 월 비용
- Google OAuth (免费)
- Stripe API ($0.1/1,000 imp)
- Vercel hosting (按需付费)

## CTO(윤서진) 시간 배分 + 기존 프로젝트 충돌 여부
- 90日内完成AI图像生成器和头像生成器的MVP，以及Notion模板商店的初步构建。