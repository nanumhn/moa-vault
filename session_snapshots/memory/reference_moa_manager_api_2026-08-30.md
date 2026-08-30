---
name: reference_moa_manager_api_2026-08-30
description: "MOA 관리자 통합 API(localhost:3888)가 덱스·제나 브리지 데몬을 관리 — 개별 스케줄러 작업 직접 실행 금지, /stop 실패 버그 있음"
metadata:
  type: reference
  originSessionId: 7234edbe-5f3b-4050-8a20-bf11e27ddba4
  modified: 2026-08-30T14:32:09.981Z
---

"MOA 관리자(MoaManager)" 통합 콘솔 API가 `http://127.0.0.1:3888`에서 돌며, `moa-dex-bridge`·`moa-jena-bridge`(디스코드↔CLI창 중계 데몬) 등 백그라운드 작업을 관리한다. 기존 개별 Windows 작업 스케줄러 항목(`MoaDexBridge` 등)은 의도적으로 Disabled 상태로 두고 MoaManager가 대신 관리한다(형 지시 2026-08-30) — **`schtasks /Run /TN MoaDexBridge`처럼 개별 스케줄러 작업을 직접 실행하지 말 것**, MoaManager API를 거쳐야 한다.

엔드포인트:
- `GET /api/manager/jobs` — 전체 작업 목록+런타임 상태(pid, status, lastStartedAt 등)
- `POST /api/manager/jobs/<id>/run`
- `POST /api/manager/jobs/<id>/stop`

**★알려진 버그(2026-08-30 실측)**: `moa-dex-bridge`에 `/stop` 호출 시 `{"error":"프로세스 종료 실패: 128"}`로 실패했고, 그 프로세스(`dex_jena_bridge_daemon.ps1`를 돌리는 powershell.exe)는 클로 세션에서 `Stop-Process -Force`로도 "액세스가 거부되었습니다"로 죽지 않았다(다른 권한/무결성 레벨로 뜬 것으로 추정). `/run`을 다시 불러도 새 프로세스가 안 뜨고 기존 pid·시작시각 그대로 "이미 실행 중"만 돌아온다 — 즉 지금 API로는 멈춘 브리지를 강제 재시작할 방법이 없다. 형이 MoaManager에 진짜 restart 기능을 추가하기로 함(미완료). 그때까지 브리지가 멈추면 형의 관리자 권한 개입이 필요하다.

[[project_unified_console_monitor_migration_2026-08-30]]
