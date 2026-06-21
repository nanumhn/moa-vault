---
title: k-saju 결제수단 PayPal → Merchant-of-Record(Lemon Squeezy) 전환 결정
date: 2026-06-17
status: 결정됨 — Lemon Squeezy 추천, 계정 승인 대기
project: k-saju (saju-studio)
---

# 결정: PayPal 폐기 → Merchant-of-Record(Lemon Squeezy)

## 배경 — PayPal이 막힌 3가지 벽 (2026-06-17, 라이브 전환 시도 중 발견)
1. **한국 PayPal 국내결제 불가**: 한국 등록 PayPal 계정 간에는 송수금 금지(한국↔한국 차단). 한국 셀러는 "해외 결제만" 수취 가능 → 한국 고객이 k-saju를 PayPal로 결제 불가 + 형이 한국 카드/계정으로 테스트 불가.
2. **개인계정 영구밴 + 연쇄 위험**: ssky.park@gmail.com 영구밴(AUP "활동이 약관과 불일치", Ref PP-L-816133774848). 연결된 은행/카드는 새 계정에 재사용 불가. PayPal은 사람·은행·카드·기기로 계정을 연결 → 수금계정 nanumn.com@gmail.com(현재 라이브 작동 중)도 연쇄밴 위험.
3. **사주=PayPal 고위험 업종**: 점성술/운세는 PayPal이 꺼리는 카테고리.

→ 셋을 우회하느니 MoR로 전환이 정답.

## 조사 결과 (Lemon Squeezy vs Paddle, 2026-06-17 기준)
- **Paddle 탈락**: AUP에 "pseudo-science — clairvoyance, horoscopes, fortune-telling" 명문 금지. 사주 해당 → 가입심사 거부 가능성 큼. (한국 결제수단 카카오/네이버페이 지원은 좋으나 의미 없음)
- **Lemon Squeezy 추천**: 점성술 명시 금지 없음(실제 astrology 제품 결제 중), Stripe 인수 후에도 정상 운영·신규가입 가능, 구독+무료체험 지원, Next.js 공식 웹훅 가이드, 수수료 5%+$0.50(한국카드 해외처리 +1.5% → 실효 ~6.5%). 취소/결제수단변경은 LS 고객포털 위임.

## 형이 확인할 것 (코딩보다 선행 — 계정 승인이 병목)
1. LS 한국 셀러 가입(테스트모드) + 정산방법(한국 은행직송 vs Payoneer/Wise/PayPal 경유) 확인. ★ LS 공식 supported-countries 문서 403로 직접확인 실패 → 계정/서포트로 확정 필요.
2. LS support 사전 문의: "Korean Saju (entertainment astrology) digital content subscription 허용?" — "1:1 상담 서비스"가 아니라 "디지털 콘텐츠/리포트 구독"으로 포지셔닝(services 금지조항 회피).

## 마이그레이션 개요 (LS 기준, 실작업 2~4일)
1. 체크아웃: create-subscription route 제거 → LS hosted checkout URL(또는 overlay). 플랜/무료체험은 LS 대시보드 product/variant.
2. 웹훅: /api/webhooks/lemonsqueezy 신설. subscription_created/updated/cancelled/payment_success 수신, X-Signature(HMAC, LEMONSQUEEZY_WEBHOOK_SECRET) 검증 → 기존 PayPal offline 검증 대체.
3. Prisma: subscription 모델에 lsSubscriptionId/lsCustomerId/status/renewsAt/endsAt 매핑. PayPal 식별자 컬럼 nullable 유지.
4. 고객포털: LS Customer Portal 링크로 취소/결제수단변경 위임.
5. env: PAYPAL_* 제거, LEMONSQUEEZY_API_KEY/_STORE_ID/_WEBHOOK_SECRET 추가.
- ★승인 확정 전엔 PayPal 코드 제거 금지.

## 리스크
- LS 사주 명시적 허용 아님 → 라이브 전 store 거부/동결 가능성. 승인 확정까지 PayPal 코드 보존.
- MoR 5%+α 수수료 → 가격/마진 재계산 필요.

## 주요 출처
- Paddle AUP(점성술 금지): paddle.com/help/start/intro-to-paddle/what-am-i-not-allowed-to-sell-on-paddle
- LS 수수료: lemonsqueezy.com/pricing
- LS Next.js 웹훅/구독: docs.lemonsqueezy.com/guides/tutorials/webhooks-nextjs · /nextjs-saas-billing
- LS Stripe 인수 후 현황: lemonsqueezy.com/blog/2026-update
