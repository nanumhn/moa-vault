---
name: project_open_threads_2026-08-06_snapshot
description: 2026-08-06 04:25 KST 재부팅 전 세션저장 스냅샷 — 이 시점 열린 작업 목록
metadata: 
  node_type: memory
  type: project
  originSessionId: 3e9c8b5b-187d-45b5-825f-58fc27635897
  modified: 2026-08-05T19:25:26.970Z
---

2026-08-06 04:25 KST, `MoaSessionReset`(04:00 재부팅) 직전 저장 시점 스냅샷.

## 열린 작업 (형 결정/응답 대기)
- **`/usage` 화면 제공 요청 미응답** — 세션/주간 사용한도가 순수 토큰 개수 기준인지 캐시할인 반영 비용 기준인지 확인하려고 형에게 요청했으나 아직 안 옴. 다음 세션에서 형이 주면 [[reference_session_cost_structure]]에 환산 계수로 반영할 것.

## 오늘(2026-08-05 오후~08-06 새벽) 완료된 것
- 수신 워치독 세션 크론 완전 중단(형 지시) — 외부 스크립트 `MoaDiscordWatchdogExternal`(윈도우 작업 스케줄러, 5분 간격, 0토큰)로 대체. `session_bootstrap.md`에 재등록 금지 반영 완료. 자세한 내용은 [[project_discord_external_watchdog_2026-08-05]]
- 도구호출 쪼개기 비효율 지적받고 수정 원칙 확립 — [[feedback_batch_tool_calls_per_turn]]
- Discord 채널 mid-session de-allowlist 재발 — 이번엔 세션 재시작 없이 26분만에 자연복구(기존 "재시작만이 확정 복구법" 결론이 깨짐) — [[reference_discord_mid_session_deallowlist_2026-08-01]]
- reply 도구 미사용(텍스트로만 답변) 실수 2회 재발(누적 12번째) — [[feedback_acknowledge_first]]
- 오후·야간 업무일지 작성 완료, `70 Record/2026-08-05.md`·`09 업무 가이드/모아 자산 목록.md` 갱신 후 git push(owenlab-notes, 커밋 7a5083d)
- 아투 보류큐 확인 — held 폴더 비어있음(처리할 것 없음)

## 다음 세션이 확인할 것
- `MoaDiscordWatchdogExternal` 작업 스케줄러 살아있는지(`Get-ScheduledTaskInfo -TaskName MoaDiscordWatchdogExternal`), 로그(`C:\Users\user\.moa\discord_watchdog_external.log`)에 알림(ALERT) 뜬 적 있는지 — 있으면 실시간 게이트웨이가 진짜 놓친 사례라 세션 워치독 재설계 논의 필요
- `/usage` 재요청

관련: [[project_journal_gap_2026-08-05]] [[reference_session_cost_structure]]
