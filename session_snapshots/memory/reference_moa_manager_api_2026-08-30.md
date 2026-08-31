---
name: reference_moa_manager_api_2026-08-30
description: "MOA 관리자 통합 API(localhost:3888)가 덱스·제나 브리지 데몬을 관리 — 개별 스케줄러 작업 직접 실행 금지, /restart 엔드포인트 생김(2026-08-31)"
metadata:
  type: reference
  originSessionId: 7234edbe-5f3b-4050-8a20-bf11e27ddba4
  modified: 2026-08-31T08:26:59.474Z
---

"MOA 관리자(MoaManager)" 통합 콘솔 API가 `http://127.0.0.1:3888`에서 돌며, `moa-dex-bridge`·`moa-jena-bridge`(디스코드↔CLI창 중계 데몬) 등 백그라운드 작업을 관리한다. 기존 개별 Windows 작업 스케줄러 항목(`MoaDexBridge` 등)은 의도적으로 Disabled 상태로 두고 MoaManager가 대신 관리한다(형 지시 2026-08-30) — **`schtasks /Run /TN MoaDexBridge`처럼 개별 스케줄러 작업을 직접 실행하지 말 것**, MoaManager API를 거쳐야 한다.

엔드포인트:
- `GET /api/manager/jobs` — 전체 작업 목록+런타임 상태(pid, status, lastStartedAt 등)
- `POST /api/manager/jobs/<id>/run`
- `POST /api/manager/jobs/<id>/stop`
- `POST /api/manager/jobs/<id>/restart` — 형이 2026-08-31 안내(직접 실행해서 확인한 것으로 보이나 클로가 실측 재현은 안 함, [보고받음·형]). 예: `curl.exe -X POST http://127.0.0.1:3888/api/manager/jobs/moa-dex-bridge/restart`

**★2026-08-30 알려진 버그(구버전 기준)**: `moa-dex-bridge`에 `/stop` 호출 시 `{"error":"프로세스 종료 실패: 128"}`로 실패했고, `/run`도 기존 pid 그대로 "이미 실행 중"만 반환 — 강제 재시작 불가였다. **형이 이후 `/restart` 엔드포인트를 추가한 것으로 보인다(2026-08-31, 형 안내).** `/restart`가 아직 반영 안 됐다면 `/stop` → `/run` 순서로 시도하라고 형이 안내함. 클로는 아직 이 새 엔드포인트를 직접 호출해보지 않았다 — 다음에 실제 재시작 필요할 때 실측 확인할 것.

작업 id는 `moa-dex-bridge`/`moa-jena-bridge`(하이픈, 소문자) — Windows 작업 스케줄러 이름(`MoaDexBridge`)과 다르다.

[[project_unified_console_monitor_migration_2026-08-30]]
