---
name: reference_mcp_guard_watchdog
description: "MoaMcpGuard — claude는 살았는데 디스코드 MCP만 죽은 \"귀 닫힘\"을 밖에서 잡아 재시동하는 10분 파수꾼. ★반드시 관리자권한으로 실행"
metadata: 
  node_type: memory
  type: reference
  originSessionId: fdbadc66-c231-46ec-91be-2b3150f85ac4
  modified: 2026-07-26T01:12:57.868Z
---

`C:\Users\user\.moa\moa_mcp_guard.ps1` + 작업 스케줄러 `MoaMcpGuard` (10분, **RunLevel Highest**, 2026-07-22).

**막는 장애:** 세션은 떠 있는데 디스코드 MCP만 죽어 형 메시지를 못 받는 상태.
세션 **안**의 5분 워치독은 MCP가 살아야 fetch_messages를 쓰므로 이 상황엔 무력 → 밖에서 감시해야 한다.

**판정:** claude.exe 있음 + `bun server.ts` 없음 = 귀 닫힘.
(정상이면 wrapper `bun run --cwd .../discord/0.0.4 start` + 자식 `bun server.ts` 2개)

## ★ 미해결 사각지대 — "프로세스는 살았는데 세션이 못 붙은" 상태 (2026-07-26 10:10 실측)
세션 도중 **discord MCP 도구가 내 손에서 사라졌는데**(reply/fetch_messages 전부 소실, ToolSearch도 no match) 같은 시각 `mcp_health.json`은 `state=up`, `bun server.ts pid 23828` 살아있음으로 기록됐다.
→ 파수꾼은 프로세스 존재만 보므로 **"정상"으로 판정하고 아무 것도 하지 않는다. 자동 재시동은 물론 경보조차 안 간다.**
내가 형에게 예고한 트레이드오프("붙었다가 죽으면 알림만 간다")보다 **한 단계 더 나쁜 구멍** — 알림도 안 온다.
- 증상: 수신은 될 수도 있으나 **발신 불가**. 형은 "왜 답이 없나" 상태가 된다.
- 임시 발신: `moa_webhook_send.ps1 -Path <UTF8파일>` (2000자 자동 분할, 시크릿은 config에서 읽음)
- 복구: 세션 재시작이 유일(진행 중 서브에이전트는 함께 중단됨 — 형에게 손실 알리고 판단받을 것)
- **고칠 방향:** 프로세스 존재가 아니라 **세션이 실제로 MCP를 쓸 수 있는지**를 근거로 삼아야 한다(예: claude 로그의 MCP 연결/도구목록 상태, 또는 세션이 주기적으로 갱신하는 heartbeat 파일). 프로세스 유무만으로는 이 상태를 절대 못 잡는다.

## ★★ 반드시 관리자 권한으로 등록할 것 (안 그러면 무조건 오작동)

**비권한 프로세스는 다른 프로세스의 CommandLine을 못 읽는다 — 개수는 보이는데 전부 `$null`로 나온다.**
그래서 필터가 0개 매칭 → "MCP 죽었다" 오판. 2026-07-22 06:47 이걸로 **멀쩡한 세션을 재시동시켜 claude 2개가 동시에 뜨는 사고**를 냈다.
게다가 비권한이라 기존 세션을 kill도 못 해서 중복만 늘었다.

내 테스트가 이걸 놓친 이유: **내 셸은 elevated, 스케줄 작업은 non-elevated.** 수동 테스트만 하고
실제 실행 환경에서 안 돌려봤다. → 교훈: **자동화는 반드시 "실제로 돌아갈 그 환경"에서 검증**.

측정법(`diag_proc_visibility.ps1`): elevated면 CommandLine 3/3 읽힘, non-elevated면 0/3.

## 안전장치 5개 (전부 검증됨)

1. 정상이면 로그도 안 남기고 조용히 종료 (10분마다 로그 오염 방지)
2. **BLIND 가드** — bun 프로세스는 보이는데 CommandLine을 하나도 못 읽으면 **아무것도 안 함**.
   ★핵심 원칙: **"안 보인다"를 "없다"로 해석하지 마라.** 이게 사고의 진짜 원인이었다.
3. **디바운스** — 1회 감지는 arm만, **연속 2회**(10분 간격) 확인돼야 재시동
4. **중복 세션 차단** — claude가 2개 이상이면 재시동 거부 (형에게 중복 답장 가는 게 더 나쁨)
5. 디스코드 연결 안 되면 재시동 안 함 + 20분 쿨다운

**테스트 스위치:** `-SimulateDeaf` `-DryRun`. 살아있는 세션 안 죽이고 검증 가능.
단, **스위치 테스트만으로는 부족** — 스케줄 작업으로 실제 등록해서 돌려볼 것.

**로그:** `mcp_guard.log` / 상태: `mcp_guard.state.json`(쿨다운), `mcp_guard.pending`(디바운스)

관련: [[reference_discord_mcp_connect_fail]], [[reference_plugin_cache_vs_marketplace]], [[feedback_verified_facts_only]]
