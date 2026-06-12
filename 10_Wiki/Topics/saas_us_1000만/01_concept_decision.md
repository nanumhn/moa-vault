---
title: "미국 SaaS 월 ₩1000만 라인 — 컨셉 결정"
date: 2026-06-10
status: 결재 대기
applies_to: "[[../../Projects/]] · [[../사주_프로젝트3_사전분석]]"
tags: ["us-saas", "1000만", "saju", "라인업"]
---

# 결정 한 줄

**saju-studio를 미국 K-Pop/K-Drama 팬 세그먼트 전용으로 리포지셔닝해 90일 안에 MRR $7,500(≈₩10M) 달성에 올인.**
신규 SaaS 신설(T2)은 saju가 DAU 500+ 안정화될 때까지 백로그로 보류.

---

## 결정 근거 (시니어 판단)

1. **이미 만든 자산을 매출로 전환하는 게 90일 안에 1000만에 도달하는 유일한 합리적 경로.**
   - saju-studio: 페이즈3 코드 완료. PayPal Sandbox 키 대기 = 결제 라이브가 사실상 마지막 1마일.
   - 신규 SaaS는 90일 안에 PMF·획득·결제 셋업까지 = 시간 부족 + 자원 분산 리스크.
2. **세그먼트를 좁혀야 광고 CPA가 잡힌다.**
   - "글로벌 동양 사주" = 타깃 모호 → CPA $30+
   - "K-Pop/K-Drama 팬용 동양 사주" = 페르소나 타이트 → CPA $5~12 예상
   - K-Pop 팬덤 미국 규모: 10M+ active, ARPU 의향 높음 (Tarot 앱 ARPU $20+ 검증)
3. **차별화 = 카니발 없음.**
   - Co-Star/Pattern/Sanctuary 모두 서양 점성술. 동양 사주 + K-Culture 묶음은 미점령 niche.
   - K-Pop 아이돌 사주 궁합 / K-Drama 캐릭터 사주 같은 **콘텐츠 마케팅 hook** 무한 생산 가능.
4. **자원 분산 시 둘 다 실패.**
   - 본부장 2명(coo/cto) MVP 체제에서 라인 둘 동시 운영 = 둘 다 중간 품질.
   - 1선 집중 → 매출 검증 → 2선 신설이 정석.

---

## 포지셔닝

- **이름(영문):** *MoaSaju — Eastern Astrology for K-Culture Fans*
- **한 줄 카피:** *"Your bias's birth chart, in the cosmology your favorite K-Drama lives in."*
- **타깃:** 18~34세 미국·캐나다·UK·호주 K-Pop/K-Drama 팬 (특히 여성 비중 ↑)
- **카니발리제이션:** 기존 saju-studio 도메인은 글로벌 일반 / `kculture.moasaju.com` 또는 별도 LP로 세그먼트 진입.

---

## 가격 모델 (확정안)

| 플랜 | 가격 | 포함 | 비고 |
|---|---|---|---|
| Free | $0 | 매일 1줄 사주 카드 + bias 궁합 1회/주 | 획득 미끼 |
| **Cosmic** | **$14.99/mo** | 매일 상세 사주, bias 5명 등록, 월간 운세, K-Drama 캐릭터 궁합 | **주력 (90% 매출 견인)** |
| Constellation | $9.99 단건 | 1회 깊은 연간 운세 PDF | 비구독 결제 hook |
| Bias Pack | $4.99 추가 | bias 5명 추가 슬롯 | LTV 확장 |

**ARPU 가정:** $13 (구독 $14.99 × 90% + 단건 $9.99 × 10%)

---

## 90일 → $7,500 MRR 도달 시뮬

| Day | 누적 구독자 | MRR | 핵심 액티비티 |
|---|---|---|---|
| 30 | 80 | $1,040 | LP 라이브, PayPal Live, TikTok 콘텐츠 30개, K-Pop 팬 커뮤니티 시드 |
| 60 | 280 | $3,640 | 인스타 리일스 광고 시작 (예산 $50/일), bias 궁합 바이럴 hook |
| 90 | **580** | **$7,540** ✅ | YT Shorts 채널 확장, K-Drama 페이스북 그룹 시딩, 인플루언서 4명 |

**유입 가정:** 광고 CPA $10, 무료→유료 전환 6%, 월 churn 7%
**감도:** CPA $15까지 올라도 90일 $6,000 도달 가능 (광고 예산 $60/일로 보정)

---

## 즉시 착수 5개 (담당·시간·산출물)

| # | 작업 | 담당 | 소요 | 산출물 | 결재 필요 |
|---|---|---|---|---|---|
| A1 | PayPal Live 비즈니스 계정 + Subscription Plan 생성 | 형 + cto | 1일 | Live Client ID/Secret | **형 결재 (PayPal 비즈니스 등록)** |
| A2 | `kculture.moasaju.com` 서브도메인 + 영문 LP 한 페이지 | cto-seojin | 4h | 라이브 LP + Free 가입 hook | — |
| A3 | TikTok·IG 시드 콘텐츠 30개 (BTS·블랙핑크·NCT 등 bias별 사주 카드 1장) | content-head (가칭 서아) | 2일 | 카드 30장 + 캡션 영문 | — |
| A4 | K-Drama 캐릭터 궁합 generator 페이지 (무료 hook) | cto-seojin | 6h | `/compat-kdrama` 라우트 + 공유 카드 | — |
| A5 | Reddit r/kpop·r/kdrama 시딩 운영 룰 (자기홍보 금지 룰 준수) | secretary | 즉시 | 운영 가이드 + 답변 템플릿 | — |

> A3·A4는 cto-seojin이 작업 시작 가능. content-head 페르소나(서아)는 아직 에이전트로 미구축 — secretary가 카피 1차안 작성 후 형 검수 받는 임시 모드.

---

## 형 결재 필요 항목 (4개)

1. **본 컨셉 채택 여부** — K-Pop/K-Drama 팬 세그먼트 리포지셔닝 OK?
2. **PayPal Live 비즈니스 계정 등록** — 한국 사업자 정보 + KYC 필요. (시간 1~3일 걸리는 외부 절차)
3. **초기 광고 예산** — Day 30~90 총 예산 권장 $3,000~$4,500 (Day 30부터 시작, Day 60 본격, Day 90 풀 가동)
4. **서브도메인 vs 별도 도메인** — `kculture.moasaju.com` (추천, 0원) vs `moasaju.com` 신규 (~$12/yr)

---

## 리스크 3개 + 대응

| 리스크 | 영향 | 대응 |
|---|---|---|
| **K-Pop 팬덤은 무료 의향 강함** — 구독 전환 6% 가정 무너지면 MRR 50% 미달 | 매출 직격 | 결제 hook = bias 궁합 unlock + 한정판 PDF 카드 (콜렉터 심리) |
| **광고 정책** — 점술/예언 광고 META/TikTok 거절 가능 | 광고 못 돎 | 카피를 "entertainment astrology"로 표기, 광고 면접용 LP 변형 따로 준비 |
| **PayPal 분쟁률** — 점술 카테고리 chargeback 평균 1.5%+ | 계정 정지 위험 | T&C에 entertainment 명시 + 환불 정책 7일 무조건 환불 |

---

## 보류 (T2 — saju 안정화 후)

- 신규 미국향 B2B SaaS 후보: AI Daily Content Calendar / YouTube Shorts Niche Idea Engine / Voice Memo → KB
- 채택 시점: saju DAU 500 + MRR $5K 안정화 (현 계획 Day 60~75)
- 검토 책임: coo-dohyun 다음 분기 회의 안건

---

## 변경 이력

| 날짜 | 변경 | 사유 |
|---|---|---|
| 2026-06-10 | 초안 — secretary 직접 합성 (clo_studio 부재로 우회 모드) | 형 실전 첫 안건 응답, 빠른 결재 요약 우선 |
