---
name: project_harness_revenue_layer
description: "모아 하네스 수익화 레이어 구축 완료 — CSO 감독자 + growth/sales/data-finance + revenue-review/finance-dashboard. 월 순수익 1,000만원 주간 갭 루프"
metadata: 
  node_type: memory
  type: project
  originSessionId: 76599c44-9cbe-4ac7-8659-56c20bee138e
---

2026-06-13, 모아 하네스에 "월 1,000만원 1인 사업가" 수익화 레이어를 **구축 완료**. harness 플러그인 + Agent Teams 플래그 위에서 Phase 0 감사 후 기존 secretary/coo-dohyun/cto-seojin 재사용 + 신규 확장.

**구축된 구성:**
- 신규 에이전트 4: `cso-jiyoung`(전략·수익 감독자/supervisor), `growth-head-narae`(유입 상단퍼널), `sales-head-jio`(전환 하단퍼널), `data-finance-jiwon`(객관 측정자)
- 신규 스킬 2: `revenue-review`(강제 주간 갭 루프: 갭→원인→액션3(owner)→형 결재요약), `finance-dashboard`(P&L 원장·퍼널·채널 측정 — data-finance 운영, revenue-review가 소비)
- `moa-orchestrator` 갱신: 수익 라우팅, 감독자 서브플로우, 주간 리뷰 cron `0 10 * * 1`(월 10시 KST)

**핵심 설계 원칙:**
- 수익 안건 단일 진입점 = CSO. 감독자가 갭 병목(유입/전환/인프라/IP)을 진단해 owner에 동적 배분
- **측정(data-finance)과 결정(CSO) 분리** — CSO는 직접 숫자 안 만들고 항상 data-finance 먼저 호출 (낙관 왜곡 방지)
- 한 주 단일 병목 집중, 액션은 정확히 3개
- 산출물: `moa-vault/10_Wiki/Finance/` (pnl_ledger / weekly / funnel / channels)
- 수익 라인 우선순위: saju-studio(PayPal, 메인) > 영상/유튜브 > 가족드라마 IP > 외주

**Why:** 1인 사업가는 측정 안 하면 "바쁜데 돈 안 느는" 표류 상태에 빠짐. 매주 목표-현실 거리를 직시하고 3액션으로 좁혀야 갭이 닫힘.
**How to apply:** "수익/매출/KPI/주간리뷰/갭" 요청 또는 월요일 cron → moa-orchestrator → cso-jiyoung → revenue-review. 7 에이전트지만 CSO가 매 사이클 서브셋만 활성화.

관련: [[project_3_saju_global]] [[project_autonomous_org_vision]] [[feedback_autonomy_delegation]]
