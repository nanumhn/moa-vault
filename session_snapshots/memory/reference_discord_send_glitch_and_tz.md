---
name: reference_discord_send_glitch_and_tz
description: 디스코드 reply가 sent 응답에도 간헐 누락되는 현상 + 디스코드 타임스탬프는 UTC(KST=+9)
metadata: 
  node_type: memory
  type: reference
  originSessionId: 613b6a58-160d-4467-ac7f-3f4d6b5f9c34
---

2026-06-27 세션에서 관찰한 디스코드 운영 두 가지.

## 1. reply 간헐 발송 누락 (sent 응답 ≠ 실제 게시)
짧은 시간에 reply를 빠르게 연속 발송하면, `mcp__plugin_discord_discord__reply`가 `sent (id:...)`를 정상 반환해도 **실제 채널에는 안 올라가는 누락**이 간헐 발생(이 세션에 2건 확인). 형은 "회신 안 와 / 응답 없어"로 답답해함.
- **진단법**: `mcp__plugin_discord_discord__fetch_messages(channel, limit)`로 채널 실제 내용을 조회 → 내 메시지가 빠졌는지 교차 확인. sent id만 믿지 말 것.
- **완화법**: ①메시지를 잘게 쪼개지 말고 **핵심을 묶어 한 번에** 보내기(발송 횟수↓ = 누락↓) ②중요한 답은 보낸 뒤 fetch로 도달 확인, 누락 시 재전송 ③형이 "안 온다" 하면 즉시 fetch로 확인 후 메꿈.
- 원인 추정: 빠른 연속 발송에 따른 rate limit/타이밍 글리치(플러그인 소스 버그 아님). **재설치 불필요**(토큰·설정 다시 해야 해 과함), 리로드 효과 적음([[feedback_plugin_reload]]), 진짜 거슬리면 **세션 재시작**이 가장 확실(단 백그라운드 작업 끝난 뒤).

### ★2026-07-08 심화 케이스 (다발 누락 + 클라이언트측)
커뮤니티 셋업 실시간 안내 중 **sent 정상인데 형 앱에 연속 5+개 미수신**하는 심한 발현. 이번엔 rate limit보다 **형 디스코드 앱↔서버 실시간 동기화(gateway) 문제**로 보임(서버엔 게시됐는데 클라가 렌더 못 함). 대응 우선순위: ①형에게 **앱 새로고침(Ctrl+R)/재시작** 안내 — 밀렸던 메시지가 한꺼번에 로드됨(부분 효과) ②그래도 지속되면 **형이 앱 완전 재시작**이 최종해결(이번에 형이 이걸로 복구 시도). ③fetch_messages는 `channel_id undefined`(snowflake) 에러날 수 있음 — 파라미터명 확인. ④실시간 클릭 셋업처럼 왕복이 잦은 작업은 특히 취약 → 진행상태를 수시로 메모리 저장([[project_moa_community_setup]]처럼)해 중단·재개에 대비. 형이 "세션 저장해, 다시 시작" 요청 시 = 진행 스냅샷 메모리에 남기고 재개 키워드 안내.

## 2. 디스코드 타임스탬프는 UTC — KST는 +9
inbound `<channel ... ts="...Z">`의 시각은 **UTC**다. 한국시간(KST)으로 인지하려면 **+9시간**. 예: ts `02:30Z` = KST **오전 11:30**. 이 세션에서 02:30Z를 "새벽"으로 착각해 형이 정정함("지금 오전 11:30인데"). 형에게 시간 언급할 땐 항상 +9 적용해 KST로.

관련: [[feedback_discord_reply_tool]] [[feedback_acknowledge_first]] [[feedback_clo_orchestrates_agents_execute]]
