---
name: project_session_dies_while_idle_respawn_loop_2026-09-09
description: "2026-09-09 00:09부터 클로 세션이 유휴 상태에서 조용히 죽어 30~40분마다 재생성되는 루프 — 원인 미확정, 다음 세션 최우선"
metadata: 
  node_type: memory
  type: project
  originSessionId: bceaa1f8-f1ff-49ca-9c8a-d9d9ee8985a5
  modified: 2026-09-08T16:58:21.057Z
---

**증상**: 2026-09-09 00:09 KST부터 claude.exe가 **일하는 중이 아니라 놀고 있는 동안** 사라진다.
MoaMcpGuard가 그때마다 되살려서 형 방에 `🚀 시동 ON` 알림만 쌓였다
(23:40·00:20·00:40·01:10·01:50 — 형 방 fetch_messages 직접 조회). 그 사이 실제 업무 진행 0.

**확인한 것(전부 직접 조회)**
| 항목 | 결과 |
|---|---|
| 가드 동작 | **정상**. `mcp_guard.log` 에 `NOSESSION DETECTED`(00:09:40·00:29:41·01:39:44) → 재생성 4회(00:19:41·00:39:43·01:09:43·01:49:45) |
| 사용 한도 | 아님. `oauth/usage` = five_hour 12% / seven_day 25% |
| 로그인 | 정상. `claude auth status --json` = loggedIn true, max |
| 크래시 | 없음. 이벤트로그 6시간치에 claude 오류 0건 → **조용한 정상 종료** |
| 스크립트가 죽였나 | 아님. `.moa\*.ps1` 전체에서 claude를 죽이는 곳은 `moa_session_respawn.ps1:48` 한 곳뿐이고 그건 재생성 때만 돈다 |
| 죽을 때 뭐 하고 있었나 | **놀고 있었다.** 직전 세션(`ebbb162f`) 트랜스크립트 마지막 실작업 01:15:07 → 24분 유휴 → 01:39:32 마지막 기록 → 01:39:44 가드가 부재 확인 |

**★못 찾은 것 — 왜 종료되는지.** 세션 수명 6~29분.

**가장 유력한 미검증 가설(추정)**: claude가 아니라 **claude를 담은 WindowsTerminal 창이 닫히는 것**.
근거로 삼은 관찰 — 재생성마다 새 WindowsTerminal이 뜨고(내 부모 pid는 내 기동시각과 초 단위로 일치),
죽은 세션의 창도 함께 사라져 있다(현재 살아있는 WindowsTerminal은 내 것과 `MoaCliWindowsBoot`가 23:41에 띄운 덱스·제나 창 둘뿐).
**반증 조건**: 창이 살아있는데 claude만 없는 순간이 한 번이라도 잡히면 이 가설은 틀림.

**다음 세션이 할 일**
1. `mcp_guard.log` 로 루프가 아직 도는지부터 확인(`NOSESSION` 줄 시각).
2. 창 가설 검증 — 죽기 전에 `Get-Process WindowsTerminal` 과 claude의 부모 pid를 주기적으로 찍어두고 대조.
   `MoaCliWindowsBoot`/`moa_cli_window.ps1` 이 창을 정리·재생성하는지 코드로 확인.
3. **형께 이미 보고했다**(09-09 01:58, 메시지 `1546927282621255851`). 중복 보고 말고 진전만 알릴 것.

관련: [[reference_window_title_is_not_an_identifier_2026-08-26]] · [[reference_monitor_filter_excludes_enbl00507_2026-09-09]]
