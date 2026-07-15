---
title: k-saju 결제 — Lemon Squeezy 사주 거부 → Gumroad 추천
date: 2026-06-22
status: 형(CEO) 결재 대기 (Gumroad 확정 여부)
project: k-saju (saju-studio)
supersedes_partially: 2026-06-17_k-saju_payment_paypal_to_MoR.md (LS 경로 무효화)
---

# 결정 보류 → 추천: Gumroad (MoR 2곳이 사주 거부)

## 사건 (2026-06-22)
Lemon Squeezy 서포트 회신: **"'Saju' (Korean Four Pillars astrology) is not supported through Lemonsqueezy."**
- 정산정보는 확보: 한국 로컬 은행계좌 payout 지원 ✅ / PayPal payout 지원 ✅ / Wise·Payoneer 미지원 ❌.
- 의미: 6/17에 우려한 "LS 사주 명시허용 아님 → 거부 가능성" 리스크가 현실화.

## 현재 상태 — MoR 2곳 모두 탈락
| 제공자 | 사주/점성술 | 결과 |
|---|---|---|
| Paddle | AUP에 fortune-telling 명문 금지 | ❌ 탈락(6/17) |
| Lemon Squeezy | "Saju not supported" 명시 회신 | ❌ 거부(6/22) |

## 조사한 대안 (근거)
- **Gumroad (추천 ★)** — Self-Improvement › Spirituality › Astrology/Tarot 전용 카테고리에 점성술·타로·운세 상품 수백~수천 개 공개 판매 중. **셀프서비스 등록(사람 심사 게이트 없음)** → 거부 리스크 최소. MoR(세금 자동). 멤버십(구독)+단발 지원 → k-saju $4.99 단발 + $7.99/월 구조 그대로. 한국 셀러 payout 지원(PayPal 또는 한국 은행직송, 최소 ₩40,000). **수수료 ~10% 정액**(LS 6.5%보다 비쌈)이 유일 단점.
- **Stripe 직접(MoR 아님)** — 수수료 2.9%+로 저렴, 확장성 최고. 단 점성술/운세가 회색지대(일부 관할 금지, 고위험 분류·사전승인 필요) + **한국 사업자등록 필수** + 셀러가 chargeback 리스크 부담. → 규모·법인화 후 Phase 2.
- **PayPal** — 글로벌(영어권) 고객만 받으면 한국 국내결제 금지 문제는 우회되나, 운세=PayPal 고위험 + 라이브 비즈니스 계정(nanumn) 밴 리스크. 단독 레일로 부적합.
- **리포지셔닝("Saju" 단어 제거)** — Gumroad가 그대로 허용해 불필요. 타 제공자 진입 시에만 사용할 카드.

## 추천 결론
**Gumroad로 결제 레일 확정.** 근거: ① 거부 리스크 최소(공개 허용+심사 없음) ② 구독·단발·한국정산·세금자동 다 충족 ③ 가장 빠른 합법 경로(가입 즉시 상품 등록, LS식 심사대기 없음). 비용: 수수료 ~10% → ARPU·마진 재계산 필요(data-finance).

## 형(CEO) 결재 필요
1. 결제 레일 = **Gumroad** 확정 여부.

## 다음 액션 (결재 시)
1. (cto 윤서진) Gumroad 계정 생성 + product/variant(단발 $4.99 / 구독 $7.99·7일 트라이얼) 등록.
2. (cto) k-saju.me 연동 — LS 계획 재활용: hosted checkout/overlay + Gumroad Ping(웹훅)으로 구독상태 수신 → Prisma 매핑 → 접근권한 부여. PayPal 코드는 Gumroad 라이브 검증 전까지 보존.
3. (data-finance 박지원) 수수료 10% 반영해 순이익 KPI·가격 재산출.
