---
name: project_dex_jena_daemon_silent_death_2026-08-06
description: "덱스·제나 브리지 데몬이 회의 도중~이후 사이 조용히 죽어있던 걸 발견. 감시 없음, 다음에도 재발 가능"
metadata: 
  node_type: memory
  type: project
  originSessionId: d2a722cb-f20a-4853-9f06-cb9e30b71104
  modified: 2026-08-08T01:58:18.586Z
---

2026-08-06 저녁, cto-seojin 작업 후 재확인차 `Get-ScheduledTaskInfo`로 봤더니 `MoaDexBridge`/`MoaJenaBridge` 작업 스케줄러는 Ready 상태인데 실제 node 프로세스가 없었다(`data/daemon.pid`가 죽은 PID를 가리킴). 낮 회의(덱스·제나가 정상 응답하던 시점, 05:2x~05:33 UTC)와 저녁 확인(08:xx UTC) 사이 어느 시점에 죽었다.

로그 확인 결과 supervisor 자체가 반복적으로 재시작되고 있었다(10:57, 12:48, 17:12 KST — "starting supervisor" 반복). 내부 backoff 재시작 루프(워커 죽으면 10초 후 재시작)와는 별개로 **supervisor 프로세스 자체가 몇 시간 간격으로 끊기는 패턴**으로 보인다. 원인 미확정 — 세션 리셋 스크립트가 node 프로세스를 폭넓게 정리하는지, Task Scheduler 정책 문제인지 확인 안 함.

**조치**: 일단 `Start-ScheduledTask`로 수동 재기동만 함(정상 로그인 확인).

**남은 문제**: 덱스·제나 죽음을 감지하는 감시가 없다. [[reference_mcp_guard_watchdog]](MoaMcpGuard)는 MCP만 보고, [[project_discord_external_watchdog_2026-08-05]](MoaDiscordWatchdogExternal)는 형-클로 채널만 본다. 덱스·제나 채널은 사각지대.

**다음에 볼 것**: 재발하면 (1)세션 리셋 스크립트가 node를 넓게 죽이는지 확인 (2)MoaDexBridge/MoaJenaBridge용 별도 생존감시(MoaMcpGuard 패턴 재사용) 신설 검토.

## ★ 재발 2026-08-08 04시 재부팅 — 근본원인 확정
04:00 재부팅 직후 제나(MoaJenaBridge)가 죽은 채 하루 종일 방치돼있었다(형이 "제나는 없니?"로 발견). 로그 확인 결과 **stale pid 파일이 원인**: `data-jena/daemon.pid`에 예전 프로세스 PID(8820)가 남아있었는데, 재부팅 후 그 PID 번호를 완전히 무관한 프로세스(msedgewebview2)가 재사용하고 있어서, 데몬 시작 스크립트의 "이미 실행 중인지" 중복실행 방지 체크가 그걸 살아있는 제나로 오판 → 새 워커를 계속 못 띄우고 "worker died within 15s x5" 루프 끝에 giving up. **로그온 트리거는 1회성이라 이 FATAL 이후 다음 재부팅 전까지 아무도 안 살려준다** — 이게 "죽은 채 방치" 패턴의 실체.
**조치**: `data-jena/daemon.pid` 삭제 → `Start-ScheduledTask MoaJenaBridge` → 정상 기동 확인(새 PID 6156).
**구조적 결함 확정**: pid 파일 기반 중복실행 체크가 PID 재사용에 취약하다 — OS가 부팅 후 낮은 번호부터 PID를 재할당하므로 재부팅마다 같은 문제가 재발할 수 있다. 근본 수정은 pid 파일에 프로세스 이름/시작시각도 같이 저장해서 대조하거나, MoaMcpGuard 패턴의 별도 생존감시로 주기적 자동복구를 붙이는 것 — 아직 미착수(형에게 "지금 할까요" 문의, SaaS 기획 회의 우선 처리 중).

관련: [[project_dex_jena_multiagent_2026-08-06]] [[reference_mcp_guard_watchdog]]
