# 월 2,000만 매출 점화 플랜 — 설계 문서 (spec)

- **작성일:** 2026-06-25
- **작성:** 모아 (CEO) / 형 결재 승인 2026-06-25
- **방법론:** superpowers:brainstorming → (다음) writing-plans
- **설계 재료 스킬:** marketing-skills:analytics · launch · cro
- **상태:** 승인됨(형) → 실행계획서(writing-plans) 대기
- **근거 감사:** 2026-06-25 슈퍼파워스 통감사 (조직 95 / 설계 90 / 실측 0). 모아 메모리 `project_audit_2026-06-25_revenue_ignition` 참조.

---

## 0. 한 줄 요약

조직·코드·전략은 다 갖춰졌고 **'심장(매출)'과 '계기판(측정)'만 꺼져 있다.** 이 spec은 둘을 **한 사슬로 동시에 점화**하는 30일 플랜이다. 채택안 = **A. 단일 라인(k-saju 결제) 올인 + 계기판 동시 ON.**

---

## 1. 목표와 성공 기준 (북극성 vs 30일 분리)

### 북극성 (장기)
- **월 순수익 2,000만원** (≈ $15K MRR 규모, 활성 유료 ~1,700명 추정)
- ※ 기존 문서(CLAUDE.md·일부 메모리)는 "1,000만원"으로 stale. **2,000만원이 진실 원천**(형 확정 2026-06-25). 전 수익 보고·revenue-review는 2,000만 기준으로 통일.

### 30일 목표 (점화 단계 — 현실선)
30일에 2,000만을 찍는 게 아니라 **엔진 점화**가 성공 기준이다:
1. ⓐ 라이브 결제 작동 (Gumroad)
2. ⓑ 첫 유료결제 ≥ 1건
3. ⓒ 실측 계기판 ON (GA4 purchase 이벤트 실측)
4. ⓓ 주간 수익 리뷰 루프 첫 가동 (CSO, weekly/ 파일 생성)
5. ⓔ 2,000만 도달 경로 역산 문서 (채널별 유입·전환·구독자 수 숫자화)

> **왜 분리하나:** 30일 2,000만 약속은 거짓말이고, 그게 [[feedback_user_value_first]]·정직 원칙에 어긋난다. 점화는 "심장이 처음 뛰는 것"이 성공이다.

---

## 2. 채택 접근법 — A. 단일 라인 올인 + 계기판 동시 ON

| 후보 | 내용 | 판정 |
|---|---|---|
| **A (채택)** | k-saju 결제 하나에 화력 집중 + GA4·주간리뷰 동시 ON. 블로그·인스타는 k-saju 유입으로 종속 | ✅ 병목 한 곳, 2대 구멍(매출0·측정0) 동시 해결 |
| B | k-saju·블로그·인스타 3채널 병렬 점화 | ❌ 1인+AI 화력 분산 → 또 표류 |
| C | 측정 인프라 2주 먼저, 매출 나중 | ❌ 2주 매출 0 지속, C의 장점은 A에 흡수 |

---

## 3. 점화 사슬 (의존성 — 핵심 설계)

```
Gumroad 키 발급 ───────── 형 (D0, 유일한 수동 고리·병목 시작점)
        ↓
코드 커밋 + 키 연결 + db push ── CTO 윤서진 (D0~1)
        ↓
테스트결제 검증 → 라이브 ──── CTO + qa-lead 검수 (D1)
        ↓
첫 유입 드라이브 ─────────── growth 나래 + content 서아 (D1~)
        ↓
첫 결제 → GA4 자동 기록 ───── analytics (자동)
        ↓
주간 리뷰 루프 ON ────────── CSO 지영 (D7~, revenue-review)
```

- **단일 수동 고리 = 형의 Gumroad 키 발급.** 이거 하나가 풀리면 나머지는 에이전트가 자동으로 줄줄이 켠다.
- 키 대기 동안 CTO는 **커밋·계측 선행**(블로킹 최소화).

---

## 4. 섹션 설계

### 4.1 계기판 ON — analytics 스킬 적용

- **GA4 핵심 이벤트 (object_action 네이밍):**
  - `checkout_started` { plan, value }
  - `purchase_completed` { plan, value, provider } ← 핵심 전환
  - `subscription_cancelled` { reason }
  - `signup_completed` { method }
- **k-saju 퍼널 5단계 (단계별 이탈 측정):**
  `landing_view → saju_input → pay_gate_view → checkout_started → purchase_completed`
- **서버사이드:** Gumroad webhook route에 이미 있는 GA4 purchase 연동 활용(클라 차단 우회).
- **실측 기록처:** `10_Wiki/Finance/weekly/` (현재 텅 빔 → 첫 스냅샷 생성). data-finance가 매주 금/월 갱신.
- **측정≠결정 분리 유지:** 숫자는 data-finance만, 해석은 CSO.

### 4.2 첫 결제 점화 — launch 스킬 ORB 프레임

```
Owned (소유)  : k-saju 이메일(support@k-saju.me 라이브)·blog.k-saju.me   ← 1순위
Rented (임대) : Reddit·Product Hunt·(인스타 = Meta차단 풀린 뒤)
Borrowed (차용): 사주/타로 인플루언서, 영어권 점성술 커뮤니티
```
- k-saju는 launch 5단계 중 이미 **Phase 5(풀런치)** 자격 = 결제만 켜면 셀프서브 오픈.
- 모든 채널 트래픽 → owned(이메일/블로그)로 회수해 재방문 자산화.
- 30일은 '지금 가능한 채널'부터(인스타 차단 미해제 → 블로그 SEO + Reddit 우선).

### 4.3 체크아웃 전환 — cro 스킬 적용

- `/pay/gate` 페이지: ①가치제안 5초 명확화 ②단일 CTA ③신뢰신호(7일 무료트라이얼·환불 보장) ④가격 anxiety 해소(plan 비교·추천 표시).
- Gumroad 오버레이 vs 리다이렉트, 모바일 친화 점검.
- 30일은 전환율 '개선'이 아니라 **baseline 측정**이 목표(데이터 쌓인 뒤 W3부터 개선).

---

## 5. 30일 마일스톤 + owner

| 주차 | 작업 | owner | 주간 목표(검증가능) |
|---|---|---|---|
| **W1** (D1~7) | 결제 라이브(형 키→CTO 연결+db push) + GA4 5이벤트 계측 + 첫 트래픽 드라이브 | 형·CTO·growth | 첫 결제 1건 + 퍼널 baseline 수집 |
| **W2** | 채널 확대(블로그 자동포스팅·Reddit) + 주간 리뷰 루프 첫 가동 | content·growth·CSO | 실측 숫자로 갭 첫 진단(weekly 파일) |
| **W3** | 체크아웃 CRO 1차 개선 + 가격/패키지 점검(pricing 스킬) | sales·CTO | 전환율 baseline 대비 개선 측정 |
| **W4** | 갭 기반 다음 30일 계획 + 2,000만 도달 경로 역산 | CSO·data-finance | 채널별 유입·전환·구독자 목표 숫자화 |

---

## 6. 검수 기준 (qa-lead-jian completion-gate, 30일 종료 시)

- [ ] 라이브 결제 작동 증거 (테스트결제 1건 스크린샷/로그)
- [ ] GA4 `purchase_completed` 실측 이벤트 ≥ 1
- [ ] `Finance/weekly/` 실측 스냅샷 파일 ≥ 2
- [ ] 첫 유료결제 ≥ 1건
- [ ] 2,000만 도달 경로 역산 문서 존재

---

## 7. 리스크와 대응

| 리스크 | 영향 | 대응 |
|---|---|---|
| Gumroad 키 발급 지연 (형 의존) | 사슬 전체 블로킹 | 대기 중 CTO 커밋·계측 선행 / 형에게 단일 액션으로 명확 안내 |
| 사주 결제 Gumroad도 거부 | 라인 전체 위험 | go-live 후 즉시 모니터링 / Stripe Phase 2 백업 보존 |
| 인스타 Meta 차단 미해제 | rented 채널 1개 손실 | 블로그 SEO·Reddit으로 우회, 차단 풀리면 ±시각 랜덤화 재개 |
| "트래픽 0 = 결제 0" | 첫 결제 안 뜸 | 유입이 진짜 병목일 수 있음 → W2 주간 리뷰에서 재진단(점화 후 첫 데이터로) |
| 30일 2,000만 기대 오해 | 실망·신뢰 손상 | 북극성/30일 목표 명시 분리(§1) |

---

## 8. 다음 단계

이 spec 승인(형) → **superpowers:writing-plans**로 작업 분해(태스크별 owner·검증·순서) 실행계획서 작성 → 본부장 위임 → qa-lead 검수 → 형 결재.

## 관련
[[project_ksaju_live]] · [[project_3_saju_global]] · [[project_harness_revenue_layer]] · [[project_blog_ksaju]] · [[project_n8n_ig_meta_block]] · [[project_moa_open_threads]]
