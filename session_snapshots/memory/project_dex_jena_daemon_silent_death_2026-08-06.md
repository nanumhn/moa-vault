---
name: project_dex_jena_daemon_silent_death_2026-08-06
description: "덱스·제나 브리지 데몬이 회의 도중~이후 사이 조용히 죽어있던 걸 발견. 감시 없음, 다음에도 재발 가능"
metadata: 
  node_type: memory
  type: project
  originSessionId: d2a722cb-f20a-4853-9f06-cb9e30b71104
  modified: 2026-08-06T08:13:59.333Z
---

2026-08-06 저녁, cto-seojin 작업 후 재확인차 `Get-ScheduledTaskInfo`로 봤더니 `MoaDexBridge`/`MoaJenaBridge` 작업 스케줄러는 Ready 상태인데 실제 node 프로세스가 없었다(`data/daemon.pid`가 죽은 PID를 가리킴). 낮 회의(덱스·제나가 정상 응답하던 시점, 05:2x~05:33 UTC)와 저녁 확인(08:xx UTC) 사이 어느 시점에 죽었다.

로그 확인 결과 supervisor 자체가 반복적으로 재시작되고 있었다(10:57, 12:48, 17:12 KST — "starting supervisor" 반복). 내부 backoff 재시작 루프(워커 죽으면 10초 후 재시작)와는 별개로 **supervisor 프로세스 자체가 몇 시간 간격으로 끊기는 패턴**으로 보인다. 원인 미확정 — 세션 리셋 스크립트가 node 프로세스를 폭넓게 정리하는지, Task Scheduler 정책 문제인지 확인 안 함.

**조치**: 일단 `Start-ScheduledTask`로 수동 재기동만 함(정상 로그인 확인).

**남은 문제**: 덱스·제나 죽음을 감지하는 감시가 없다. [[reference_mcp_guard_watchdog]](MoaMcpGuard)는 MCP만 보고, [[project_discord_external_watchdog_2026-08-05]](MoaDiscordWatchdogExternal)는 형-클로 채널만 본다. 덱스·제나 채널은 사각지대.

**다음에 볼 것**: 재발하면 (1)세션 리셋 스크립트가 node를 넓게 죽이는지 확인 (2)MoaDexBridge/MoaJenaBridge용 별도 생존감시(MoaMcpGuard 패턴 재사용) 신설 검토.

관련: [[project_dex_jena_multiagent_2026-08-06]] [[reference_mcp_guard_watchdog]]
