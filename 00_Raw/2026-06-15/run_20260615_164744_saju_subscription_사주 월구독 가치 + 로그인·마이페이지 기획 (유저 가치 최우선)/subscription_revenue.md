# 구독 매출 + LTV

## 월 1,000만원(≈$7,500) 도달에 필요한 활성 구독자 수 (산식)
- ARPU: $7.99
- Churn Rate: 5%
- Day 30: MRR = $1,875 → Active Subscribers = 246
- Day 60: MRR = $4,500 → Active Subscribers = 575
- Day 90: MRR = $6,825 → Active Subscribers = 883

## 가정 (churn % / 단발→구독 전환율 / ARPU)
- Churn Rate: 5%
- 단발→구독 전환율: 20%
- ARPU: $7.99

## Day 30/60/90 구독자·MRR 목표표
| 지표 | Day 30 | Day 60 | Day 90 |
|---|---|---|---|
| 활성 구독자 | 246 | 575 | 883 |
| MRR ($) | $1,875 | $4,500 | $6,825 |

## 데일리 카드의 retention(churn 개선) 효과 가정
- churn rate: 5% → 3%
- Day 90: MRR = $6,825

## 단발 매출 vs 구독 매출 비중 시나리오
- 단발: $4.99
- 구독: $7.99
- Day 30: 단발 $1,249 (25%), 구독 $1,625 (75%) → MRR = $1,875
- Day 60: 단발 $2,979 (33%), 구독 $3,525 (67%) → MRR = $4,500
- Day 90: 단발 $4,609 (38%), 구독 $5,216 (62%) → MRR = $6,825

## 형(CEO) 결재 필요 항목
- 외부 Auth 비용: 약 $300 (NextAuth+Google OAuth)
- 데일리 카드 콘텐츠 제작 계획