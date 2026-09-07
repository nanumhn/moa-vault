---
name: feedback_never_run_disabled_scheduler_tasks_2026-09-07
description: 윈도우 작업 스케줄러에서 Disabled 인 작업은 실행하지 않는다 — 형 지시 2026-09-07 20:48
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 89c95e96-ac0c-4966-80b1-36223cf0c86e
  modified: 2026-09-07T11:49:26.146Z
---

**형 직접 지시 (2026-09-07 20:48, 005-07 스레드에서 덱스에게):** *"윈도우 스케줄러에 disabled 로 된건 실행하면 안돼"*

**Why:** 2026-08-31 형 지시로 브리지·감시 프로세스 관리는 **MOA 관리자 콘솔(:3888)** 로 일원화됐다. 윈도우 예약작업 쪽은 그 잔재라 `Disabled` 로 잠가둔 것이다. 그걸 실행하면 **콘솔이 띄운 정본과 별개로 하나가 더 떠서 중복이 된다.**

2026-09-07 저녁에 실제로 그 사고가 났다 — 덱스가 구방식으로 `MoaDexBridge` 를 기동해 덱스 브리지가 2개가 됐고, **같은 봇 토큰으로 두 데몬이 게이트웨이에 붙어 형 메시지가 2번 전달되고 답장도 2번씩 나갔다.**

**How to apply:**
- 예약작업 목록에서 `Disabled` 인 것은 **상태를 바꾸지도, 실행하지도 않는다.** 특히 `MoaDexBridge`·`MoaJenaBridge`·워치독 5종.
- 브리지를 다시 띄워야 하면 **관리자 API만** 쓴다 (쉐어룰 LEVEL 5 B1):
  `curl.exe -X POST http://127.0.0.1:3888/api/manager/jobs/moa-dex-bridge/restart`
- ★**작업을 `Disabled` 로 되돌려도 이미 뜬 프로세스는 안 죽는다.** 실수로 실행했다면 프로세스까지 따로 확인해 정리해야 끝난다.
- 감시 5종이 스케줄러에서 `Disabled` 인 것은 **고장이 아니다** — 콘솔이 대신 돌린다. 재활성화하지 말 것 [[project_unified_console_monitor_migration_2026-08-30]].

관련: [[project_dex_bridge_duplicate_recheck_after_reboot_2026-09-07]] · [[reference_moa_manager_api_2026-08-30]]
