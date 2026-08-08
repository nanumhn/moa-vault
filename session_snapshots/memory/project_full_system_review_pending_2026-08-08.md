---
name: project_full_system_review_pending_2026-08-08
description: 형이 요청한 예정 작업 — 모아 시스템 전체 설명 + 불필요한 것 정리(비용/구조 다이어트). 형이 먼저 물어보기 전에 클로가 주기적으로 상기시켜야 함
metadata: 
  node_type: memory
  type: project
  originSessionId: 4173423e-eed3-4bf4-9505-4067b13cb146
  modified: 2026-08-08T02:29:46.613Z
---

2026-08-08 형이 요청: "다음에 시간 되면 우리 시스템 전체적으로 설명 한번 해줘. 그리고 계산할 거 있으면 개선하고 불필요한 것들은 쳐내고 정리를 한번 하는 시간을 갖자... 한 번씩 얘기해줘, 이거 해야 된다고."

**Why**: 시스템(세션 리셋 자동화·아투 파이프라인·덱스·제나·회의엔진·각종 워치독 등)이 계속 늘어나면서 형이 전체 그림을 다시 한번 파악하고 싶어함. 동시에 비용/복잡도 다이어트(불필요한 cron·중복 감시·안 쓰는 기능 정리)도 원함.

**How to apply**: 이건 형이 먼저 요청 안 해도 클로가 능동적으로 "이거 아직 안 했는데 할까요?"를 주기적으로 꺼내야 하는 항목. 세션 한가한 타이밍(급한 이슈 없을 때)에 한 번씩 상기시킬 것. 완료되면 이 메모리 삭제.

**진행 시 커버할 후보 범위**: 세션 리셋/저장 cron 체계, 아투 파이프라인 전체(발행+쇼츠+감시), 덱스·제나 멀티에이전트, 회의엔진(clo_studio+LM Studio), 각종 외부 워치독(MoaMcpGuard·MoaDiscordWatchdogExternal·MoaAtzReportWatchdogExternal·MoaDexJenaGuard 등) — 중복되거나 안 쓰는 것 정리 대상 후보.

관련: [[reference_harness_change_ledger]]
